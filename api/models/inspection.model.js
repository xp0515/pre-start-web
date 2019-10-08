const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema({
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  status: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  odometer: { type: Number, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: String,
  signature: String,
  result: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    note: String,
    result: { type: String, required: true },
    img: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }
  }]
});

module.exports = mongoose.model('Inspection', inspectionSchema);
