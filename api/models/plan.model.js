const mongoose = require("mongoose");

const frequencySchema = new mongoose.Schema({
  type: { type: String, required: true },
  note: { type: String }
})

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  frequency: frequencySchema,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  lastModified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);
