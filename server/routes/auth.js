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

// Admin kirish (parolsiz)
router.post("/admin-login", async (req, res) => {
  const { email, phone } = req.body;

  try {
    const cleanedPhone = cleanPhone(phone);

    // Adminni email va telefon raqam orqali tekshirish
    if (
      email === process.env.ADMIN_EMAIL &&
      cleanedPhone === cleanPhone(process.env.ADMIN_PHONE)
    ) {
      const admin = await User.findOne({ email });

      if (!admin) {
        // Agar admin bazada yo'q bo'lsa, yangi admin yaratish
        const newAdmin = new User({
          name: "Admin",
          phone: cleanedPhone,
          email: process.env.ADMIN_EMAIL,
          clickCount: 0,
          level: 0,
          tokens: 1000,
          isAdmin: true,
          completedTasks: [],
        });

        await newAdmin.save();

        return res.status(200).json({
          success: true,
          message:
            "Admin mavjud emas edi. Yangi admin yaratildi va kirish muvaffaqiyatli.",
          admin: newAdmin,
        });
      }

      // Agar admin bazada bo'lsa, kirishni tasdiqlash
      res.status(200).json({
        success: true,
        message: "Admin kirish muvaffaqiyatli.",
        admin,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Noto'g'ri email yoki telefon raqam",
      });
    }
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
      invitedCount: user.referrals.length, // Taklif qilinganlar soni
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Foydalanuvchi ma'lumotlarini yangilash
router.post("/update", async (req, res) => {
  const { email, clickCount, level, tokens } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { clickCount, level, tokens },
      { new: true }
    );

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
    // Foydalanuvchini topish
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Foydalanuvchi topilmadi" });
    }

    // Vazifani topish
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, error: "Vazifa topilmadi" });
    }

    // Agar foydalanuvchi bu vazifani avval bajargan bo'lsa
    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({
        success: false,
        error: "Bu vazifa allaqachon bajarilgan",
      });
    }

    // Foydalanuvchiga mukofotni qo'shish
    user.tokens += task.reward;
    user.level += 1; // Darajani oshirish
    user.completedTasks.push(taskId); // Vazifani bajarilganlar ro'yxatiga qo'shish
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

// Mahsulot sotib olish
router.post("/buy-product", async (req, res) => {
  const { email, productId, price } = req.body;

  if (!email || !productId || !price) {
    return res.status(400).json({
      success: false,
      error: "Email, productId va price maydonlari to'ldirilishi shart",
    });
  }

  try {
    // Foydalanuvchini topish
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Foydalanuvchi topilmadi",
      });
    }

    // Mahsulot allaqachon sotib olinganligini tekshirish
    if (user.purchasedProducts && user.purchasedProducts.includes(productId)) {
      return res.status(400).json({
        success: false,
        error: "Bu mahsulot allaqachon sotib olingan",
      });
    }

    // Level hisobidan tanga yechib olish
    const requiredLevel = 1; // Misol uchun, 1-darajadan tanga yechib olish
    if (user.level < requiredLevel) {
      return res.status(400).json({
        success: false,
        error: `Sizning darajangiz yetarli emas (${requiredLevel}-daraja kerak)`,
      });
    }

    // Level hisobidan tanga yechib olish
    const deductedAmount = 50; // 50 ta tanga yechib olinadi
    if (user.level < deductedAmount) {
      return res.status(400).json({
        success: false,
        error: "Level hisobingizda yetarli tanga yo'q",
      });
    }

    // Level hisobidan tanga yechib olish
    user.level -= deductedAmount;

    // Mahsulotni sotib olish
    if (!user.purchasedProducts) {
      user.purchasedProducts = []; // Agar purchasedProducts massiv bo'lmasa, uni yaratish
    }
    user.purchasedProducts.push(productId);

    // QR kod generatsiya qilish
    const qrData = JSON.stringify({
      userId: user._id,
      productId: productId,
      timestamp: new Date().toISOString(),
    });

    const qrCodeUrl = await QRCode.toDataURL(qrData); // QR kodni generatsiya qilish

    // QR kodni foydalanuvchiga saqlash
    user.qrCodes = user.qrCodes || [];
    user.qrCodes.push({
      productId: productId,
      qrCodeUrl: qrCodeUrl,
      isUsed: false, // QR kod bir marta ishlatilganligini tekshirish
    });

    await user.save();

    res.status(200).json({
      success: true,
      user,
      qrCodeUrl, // QR kodni frontendga yuborish
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Referal orqali qo'shilgan foydalanuvchilarni olish
router.get("/referral-users", async (req, res) => {
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
      users: user.referrals,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// auth.js ga qo'shish
router.post("/handle-referral", async (req, res) => {
  const { referrerEmail, newUserId } = req.body;

  try {
    // Referal link egasini topish
    const referrer = await User.findOne({ email: referrerEmail });

    if (referrer) {
      // Referal egasiga 1 LEO tanga qo'shish
      referrer.tokens += 1;
      referrer.referrals.push(newUserId); // Yangi foydalanuvchini referal egasining ro'yxatiga qo'shish
      await referrer.save();

      res.status(200).json({
        success: true,
        message: "1 LEO tanga muvaffaqiyatli qo'shildi.",
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Referal link egasi topilmadi.",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/use-qr-code", async (req, res) => {
  const { qrCodeUrl } = req.body;

  try {
    const user = await User.findOne({ "qrCodes.qrCodeUrl": qrCodeUrl });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "QR kod topilmadi",
      });
    }

    const qrCode = user.qrCodes.find((qr) => qr.qrCodeUrl === qrCodeUrl);

    if (qrCode.isUsed) {
      return res.status(400).json({
        success: false,
        error: "Bu QR kod allaqachon ishlatilgan",
      });
    }

    // QR kodni ishlatilgan deb belgilash
    qrCode.isUsed = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "QR kod muvaffaqiyatli ishlatildi.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Tokenni avtomatik to'ldirish
router.post("/update-tokens", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Foydalanuvchi topilmadi",
      });
    }

    // Tokenni to'ldirish
    if (user.tokens < 1000) {
      user.tokens += 1;
      await user.save();
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Xatolik yuz berdi:", error); // Xatolikni konsolga chiqarish
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
module.exports = router;
