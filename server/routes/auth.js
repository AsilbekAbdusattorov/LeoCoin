const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const { Telegraf } = require("telegraf");
const bot = new Telegraf("7206832800:AAGz49EzEKPYz8ae8HJOJ1Klui_fgmng-5w");

// Telefon raqamni tozalash funksiyasi
const cleanPhone = (phone) => phone.replace(/\D/g, "");

// Ro'yxatdan o'tish yoki kirish
router.post("/register", async (req, res) => {
  const { name, phone, email, referralCode } = req.body;

  try {
    const cleanedPhone = cleanPhone(phone);

    // Foydalanuvchi allaqachon mavjudligini tekshirish
    const existingUser = await User.findOne({
      $or: [{ email }, { phone: cleanedPhone }],
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Foydalanuvchi mavjud. Kirish bajarildi.",
        user: existingUser,
      });
    }

    // Yangi foydalanuvchi yaratish
    const newUser = new User({
      name,
      phone: cleanedPhone,
      email,
      clickCount: 0,
      level: 0,
      tokens: 1000,
      completedTasks: [],
      referralCode: Math.random().toString(36).substring(7), // Yangi foydalanuvchi uchun referal kod
    });

    // Agar referal kod kiritilgan bo'lsa
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referrer.referrals.push(newUser._id);
        referrer.level += 1;
        referrer.tokens += 50;
        await referrer.save();
      }
    }

    await newUser.save();

    // JWT token yaratish
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "Yangi foydalanuvchi ro'yxatdan o'tdi.",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Kirish
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Foydalanuvchi topilmadi.",
      });
    }

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Noto'g'ri parol.",
      });
    }

    // JWT token yaratish
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Kirish muvaffaqiyatli.",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Foydalanuvchi ma'lumotlarini olish
router.get("/user", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email }).populate("referrals");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Foydalanuvchi topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Vazifani bajarish
router.post("/complete-task", async (req, res) => {
  const { email, taskId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Foydalanuvchi topilmadi" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, error: "Vazifa topilmadi" });
    }

    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({
        success: false,
        error: "Bu vazifa allaqachon bajarilgan",
      });
    }

    // Foydalanuvchiga mukofotni qo'shish
    user.tokens += task.reward;
    user.level += 1;
    user.completedTasks.push(taskId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Vazifa muvaffaqiyatli bajarildi!",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Obuna holatini tekshirish (dinamik kanal ID uchun)
router.post("/check-subscription", async (req, res) => {
  const { userId, channelId } = req.body;

  try {
    const member = await bot.telegram.getChatMember(channelId, userId);
    const isSubscribed = ["member", "administrator", "creator"].includes(member.status);

    res.json({ isSubscribed });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ error: "Xatolik yuz berdi." });
  }
});

module.exports = router;