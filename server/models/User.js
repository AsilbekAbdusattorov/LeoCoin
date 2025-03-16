const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clickCount: { type: Number, default: 1000 }, // Boshlang'ich qiymati 1000
  level: { type: Number, default: 0 },
  tokens: { type: Number, default: 1000 },
  isAdmin: { type: Boolean, default: false },
  completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  purchasedProducts: [{ type: String }],
  referralCode: { type: String, unique: true }, // Referal kodi
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Taklif qilinganlar
});

module.exports = mongoose.model("User", UserSchema);