const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

// Telefon raqamni tozalash funksiyasi
const cleanPhone = (phone) => phone.replace(/\D/g, "");

// Ro'yxatdan o'tish yoki kirish
router.post("/register", async (req, res) => {
  const { name, phone, email, referralCode } = req.body;

  console.log("Qabul qilingan ma'lumotlar:", req.body);

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
      isAdmin:
        email === process.env.ADMIN_EMAIL &&
        cleanedPhone === cleanPhone(process.env.ADMIN_PHONE),
      completedTasks: [],
      referralCode: Math.random().toString(36).substring(7), // Yangi foydalanuvchi uchun referal kod
      lastActiveTime: Date.now(), // Foydalanuvchi ro'yxatdan o'tgan vaqt
    });

    // Agar referal kod kiritilgan bo'lsa
    if (referralCode) {
      const referrer = await User.findOne({ referralCode }); // Referal kod egasini topish
      if (referrer) {
        referrer.referrals.push(newUser._id); // Yangi foydalanuvchini referal egasining ro'yxatiga qo'shish
        referrer.level += 1; // Referal egasining levelini oshirish
        referrer.tokens += 50; // Misol uchun, 50 ta tanga qo'shish
        await referrer.save(); // O'zgarishlarni saqlash
      }
    }

    await newUser.save(); // Yangi foydalanuvchini saqlash

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
    // Foydalanuvchini topish
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

    // Foydalanuvchining oxirgi faollik vaqtini yangilash
    user.lastActiveTime = Date.now();
    await user.save();

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

// Foydalanuvchi ma'lumotlarini yangilash (tokenni avtomatik oshish bilan)
router.post("/update", async (req, res) => {
  const { email, clickCount, level, tokens } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Foydalanuvchi topilmadi",
      });
    }

    // Tokenni avtomatik oshirish
    const currentTime = Date.now();
    const timeDiff = currentTime - user.lastActiveTime; // Vaqt farqi (millisekundlarda)
    const tokensToAdd = Math.floor(timeDiff / 3600); // Har 3.6 sekundda 1 tokenni qo'shish

    const updatedTokens = Math.min(user.tokens + tokensToAdd, 1000); // Tokenni 1000 dan oshirmaslik

    // Foydalanuvchi ma'lumotlarini yangilash
    user.clickCount = clickCount || user.clickCount;
    user.level = level || user.level;
    user.tokens = tokens || updatedTokens;
    user.lastActiveTime = currentTime; // Oxirgi faollik vaqtini yangilash

    await user.save();

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

    // Tokenni avtomatik oshirish
    const currentTime = Date.now();
    const timeDiff = currentTime - user.lastActiveTime; // Vaqt farqi (millisekundlarda)
    const tokensToAdd = Math.floor(timeDiff / 3600); // Har 3.6 sekundda 1 tokenni qo'shish

    const updatedTokens = Math.min(user.tokens + tokensToAdd, 1000); // Tokenni 1000 dan oshirmaslik

    // Foydalanuvchi ma'lumotlarini yangilash
    user.tokens = updatedTokens;
    user.lastActiveTime = currentTime; // Oxirgi faollik vaqtini yangilash
    await user.save();

    res.status(200).json({
      success: true,
      user,
      invitedCount: user.referrals.length, // Taklif qilinganlar soni
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;