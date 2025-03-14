const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Rasm uchun maydon
  category: { type: String, enum: ["shop", "inventory"], required: true }, // Mahsulot turi
});

module.exports = mongoose.model("Product", ProductSchema);