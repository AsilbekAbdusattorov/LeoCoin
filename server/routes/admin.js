// const express = require("express");
// const router = express.Router();
// const Task = require("../models/Task");

// // Vazifa qo'shish
// // Barcha vazifalarni olish
// router.get("/tasks", async (req, res) => {
//   try {
//     const tasks = await Task.find().sort({ _id: -1 }); // Yangi qo'shilganlar tepaga chiqadi

//     res.status(200).json({
//       success: true,
//       tasks,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// module.exports = router;