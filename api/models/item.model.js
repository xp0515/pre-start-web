const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  img: String
});

module.exports = mongoose.model('Item', itemSchema);
