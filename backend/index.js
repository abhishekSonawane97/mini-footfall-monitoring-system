const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const sensorRoutes = require('./routes/sensor.js');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', sensorRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
