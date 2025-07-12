// routes/sensor.js
const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData.js');


// GET /devices
router.get('/devices', async (req, res) => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  try {
    // Get the most recent entry for each sensor
    const latestEntries = await SensorData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$sensor_id",
          last_seen: { $first: "$timestamp" }
        }
      }
    ]);

    // Map status based on last seen time
    const locationMap = {
        'sensor-001': { lat: 28.6139, lng: 77.2090 }, // Delhi
        'sensor-002': { lat: 19.0760, lng: 72.8777 }, // Mumbai
    };

    const devices = latestEntries.map(device => ({
        sensor_id: device._id,
        last_seen: device.last_seen,
        status: new Date(device.last_seen) > twoHoursAgo ? 'active' : 'inactive',
        location: locationMap[device._id] || null
    }));


    res.json(devices);
  } catch (error) {
    console.error("Device status error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


router.get('/analytics', async (req, res) => {
  const type = req.query.type || 'daily';

  const groupFormat = type === 'hourly'
    ? { $dateToString: { format: "%Y-%m-%d %H:00", date: "$timestamp" } }
    : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } };

  try {
    const result = await SensorData.aggregate([
      {
        $group: {
          _id: {
            sensor_id: "$sensor_id",
            period: groupFormat
          },
          total_count: { $sum: "$count" }
        }
      },
      {
        $sort: { "_id.period": 1 }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


// GET /footfall/hourly
router.get('/footfall/hourly', async (req, res) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const data = await SensorData.aggregate([
      {
        $match: {
          timestamp: { $gte: oneHourAgo }
        }
      },
      {
        $group: {
          _id: {
            sensor_id: "$sensor_id",
            interval: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  $dateTrunc: {
                    date: "$timestamp",
                    unit: "minute",
                    binSize: 5 // group into 5-minute intervals
                  }
                }
              }
            }
          },
          total_count: { $sum: "$count" }
        }
      },
      {
        $sort: { "_id.interval": 1 }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error("Hourly footfall error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


// POST /sensor-data
router.post('/sensor-data', async (req, res) => {
  const { sensor_id, timestamp, count } = req.body;

  if (!sensor_id || !timestamp || count === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const data = new SensorData({ sensor_id, timestamp, count });
    await data.save();
    res.status(201).json({ message: 'Sensor data saved' });
  } catch (error) {
    console.error('Error saving sensor data:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
