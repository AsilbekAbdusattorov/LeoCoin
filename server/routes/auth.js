const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const Product = require("../models/Product");

// Telefon raqamni tozalash funksiyasi
const cleanPhone = (phone) => phone.replace(/\D/g, "");

// Ro'yxatdan o'tish yoki kirish
router.post("/register", async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    const cleanedPhone = cleanPhone(phone);

    // Foydalanuvchini email yoki telefon raqam orqali topish
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
        cleanedPhone === cleanPhone(process.env.ADMIN_PHONE), // Adminni tekshirish
      completedTasks: [], // Yangi maydon
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Yangi foydalanuvchi ro'yxatdan o'tdi.",
      user: newUser,
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
          completedTasks: [], // Yangi maydon
        });

        await newAdmin.save();

        return res.status(200).json({
          success: true,
          message: "Admin mavjud emas edi. Yangi admin yaratildi va kirish muvaffaqiyatli.",
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

router.post("/buy-product", async (req, res) => {
  const { email, productId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "Пользователь не найден" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: "Продукт не найден" });
    }

    if (user.tokens < product.price) {
      return res.status(400).json({
        success: false,
        error: "Недостаточно средств",
      });
    }

    user.tokens -= product.price;
    user.purchasedProducts.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Продукт успешно куплен!",
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
    const user = await User.findOne({ email });

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
      return res.status(404).json({ success: false, error: "Foydalanuvchi topilmadi" });
    }

    // Vazifani topish
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: "Vazifa topilmadi" });
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

module.exports = router;