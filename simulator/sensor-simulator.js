const fetch = require('node-fetch');

const sensors = ['sensor-001', 'sensor-002'];

function sendSensorData(sensor_id) {
  const payload = {
    sensor_id,
    timestamp: new Date().toISOString(),
    count: Math.floor(Math.random() * 25) + 5
  };

  fetch('http://backend:5050/sensor-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(json => console.log(`Sent from ${sensor_id}:`, json))
    .catch(err => console.error(`Error for ${sensor_id}:`, err));
}

// Send data every 1 minute instead of 1 hour for testing
setInterval(() => {
  sensors.forEach(sendSensorData);
}, 60 * 60 * 1000);
