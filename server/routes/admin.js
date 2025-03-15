const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
// const Product = require("../models/Product");

router.post("/add-task", async (req, res) => {
  const { title, description, reward, link } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      reward,
      link,
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      message: "Vazifa muvaffaqiyatli qo'shildi.",
      task: newTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 }); // Yangi qo'shilganlar tepaga chiqadi

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});


// router.post("/add-product", async (req, res) => {
//     const { title, description, price } = req.body;
  
//     try {
//       const newProduct = new Product({
//         title,
//         description,
//         price,
//       });
  
//       await newProduct.save();
  
//       res.status(201).json({
//         success: true,
//         message: "Продукт успешно добавлен.",
//         product: newProduct,
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   });
  
//   // Barcha mahsulotlarni olish
//   router.get("/products", async (req, res) => {
//     try {
//       const products = await Product.find().sort({ _id: -1 });
  
//       res.status(200).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   });

module.exports = router;