const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clickCount: { type: Number, default: 1000 },
  level: { type: Number, default: 0 },
  tokens: { type: Number, default: 1000 },
  completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  referralCode: { type: String, unique: true },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", UserSchema);