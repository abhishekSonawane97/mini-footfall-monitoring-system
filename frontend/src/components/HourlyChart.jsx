import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function HourlyChart() {
  const [data, setData] = useState([]);
  const [sensorIds, setSensorIds] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState('');

  // Fetch and organize data
  useEffect(() => {
    fetch('http://localhost:5050/analytics?type=hourly')
      .then(res => res.json())
      .then(result => {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const filtered = result.filter(item => item._id.period.startsWith(today));

        const grouped = {};
        filtered.forEach(item => {
          const sensor = item._id.sensor_id;
          const hour = item._id.period.slice(11); // "HH:00"
          if (!grouped[sensor]) grouped[sensor] = [];
          grouped[sensor].push({ hour, count: item.total_count });
        });

        const sensors = Object.keys(grouped);
        setSensorIds(sensors);

        if (sensors.length > 0) {
          const defaultSensor = sensors[0];
          setSelectedSensor(defaultSensor);
          const sortedData = grouped[defaultSensor].sort((a, b) => a.hour.localeCompare(b.hour));
          setData(sortedData);
        }
      })
      .catch(err => console.error("Error fetching hourly analytics:", err));
  }, []);

  // Change sensor handler
  const handleSensorChange = (e) => {
    const sensor = e.target.value;
    setSelectedSensor(sensor);

    fetch('http://localhost:5050/analytics?type=hourly')
      .then(res => res.json())
      .then(result => {
        const today = new Date().toISOString().slice(0, 10);
        const filtered = result.filter(item =>
          item._id.period.startsWith(today) &&
          item._id.sensor_id === sensor
        );

        const hourly = filtered.map(item => ({
          hour: item._id.period.slice(11),
          count: item.total_count,
        }));

        hourly.sort((a, b) => a.hour.localeCompare(b.hour));
        setData(hourly);
      })
      .catch(err => console.error("Error updating sensor data:", err));
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2>📊 Hourly Footfall</h2>

      {sensorIds.length > 1 && (
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Select Sensor:&nbsp;
            <select value={selectedSensor} onChange={handleSensorChange}>
              {sensorIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} people`, 'Footfall']} />
            <Bar dataKey="count" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No hourly data available for today.</p>
      )}
    </div>
  );
}

export default HourlyChart;
