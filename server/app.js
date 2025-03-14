require("dotenv").config(); // .env fayldan o'zgaruvchilarni yuklash
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

// ==================================================
// 1. Ma'lumotlar bazasiga ulanish
// ==================================================
connectDB();

// ==================================================
// 2. CORS Sozlamalari
// ==================================================
const corsOptions = {
  origin: ["http://localhost:5173", "https://leo-coin-omega.vercel.app"], // Frontend manzili
  credentials: true, // Cookie va autentifikatsiya ma'lumotlarini qabul qilish
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Ruxsat berilgan metodlar
  allowedHeaders: "Content-Type,Authorization", // Ruxsat berilgan headerlar
};

app.use(cors(corsOptions)); // CORS middleware ni qo'llash

// ==================================================
// 3. Middleware lar
// ==================================================
app.use(cookieParser()); // Cookie parser middleware
app.use(express.json()); // JSON ma'lumotlarni qabul qilish uchun middleware

// ==================================================
// 4. Routerlarni qo'llash
// ==================================================
app.use("/api/auth", authRoutes); // Auth routerlarini qo'llash
app.use("/api/admin", adminRoutes); // Admin routerlarini qo'llash

// ==================================================
// 5. Asosiy sahifa uchun test endpoint
// ==================================================
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ==================================================
// 6. OPTIONS so'rovlarini boshqarish
// ==================================================
app.options("*", cors(corsOptions)); // Barcha OPTIONS so'rovlariga CORS javobi

// ==================================================
// 7. Xatolikni boshqarish (Agar kerak bo'lsa)
// ==================================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Server xatosi" });
});

// ==================================================
// 8. Serverni ishga tushurish
// ==================================================
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});