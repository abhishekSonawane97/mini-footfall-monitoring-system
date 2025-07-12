// models/SensorData.js
const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  sensor_id: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    // default: Date.now,
  },
  count: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('SensorData', SensorDataSchema);
