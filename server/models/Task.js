const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: Number, required: true },
  link: { type: String, required: true }, // Telegram linki
});

module.exports = mongoose.model("Task", TaskSchema);