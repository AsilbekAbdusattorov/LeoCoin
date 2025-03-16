// // routes/tasks.js
const express = require("express");
const router = express.Router();
const tasksData = require("../tasksdata"); // tasksdata.js faylidan ma'lumotlarni olish

// Barcha vazifalarni olish
router.get("/", (req, res) => {
  res.json(tasksData);
});

// ID bo'yicha bitta vazifani olish
router.get("/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasksData.find((t) => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Vazifa topilmadi" });
  }
});

module.exports = router;