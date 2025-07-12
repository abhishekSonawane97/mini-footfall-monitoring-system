import { useEffect, useState } from 'react';
import HourlyChart from './components/HourlyChart';
import SensorMap from './components/SensorMap';


function App() {
  const [devices, setDevices] = useState([]);
  const [totals, setTotals] = useState([]);

  useEffect(() => {
    // Fetch device status
    fetch('http://localhost:5050/devices')
      .then((res) => res.json())
      .then((data) => {
        console.log('Devices:', data);
        setDevices(data);
      })
      .catch((err) => console.error('Error fetching devices:', err));

    // Fetch analytics for today
    fetch('http://localhost:5050/analytics')
      .then((res) => res.json())
      .then((data) => {
        console.log("Analytics:", data);
        const today = new Date().toISOString().slice(0, 10);
        const grouped = {};

        data.forEach(item => {
          if (item._id.period === today) {
            const id = item._id.sensor_id;
            grouped[id] = (grouped[id] || 0) + item.total_count;
          }
        });

        const result = Object.entries(grouped).map(([sensor_id, count]) => ({
          sensor_id,
          count
        }));

        setTotals(result);
      })
      .catch((err) => console.error('Error fetching totals:', err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Device Status</h1>
      <ul>
        {devices.map((device) => (
          <li key={device.sensor_id}>
            <strong>{device.sensor_id}</strong> – Last Seen: {new Date(device.last_seen).toLocaleString()} – Status:{' '}
            <span style={{ color: device.status === 'active' ? 'green' : 'red' }}>{device.status}</span>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '2rem' }}>👣 Today’s Total Footfall</h2>
      <ul>
        {totals.map((sensor) => (
          <li key={sensor.sensor_id}>
            <strong>{sensor.sensor_id}</strong> – {sensor.count} people
          </li>
        ))}
      </ul>

      <HourlyChart />
      <SensorMap />
    </div>
  );
}

export default App;
