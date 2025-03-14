const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clickCount: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  tokens: { type: Number, default: 1000 },
  isAdmin: { type: Boolean, default: false },
  purchasedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Sotib olingan mahsulotlar
});

module.exports = mongoose.model("User", UserSchema);