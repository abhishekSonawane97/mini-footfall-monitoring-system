import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const SensorMap = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5050/devices')
      .then(res => res.json())
      .then(data => {
        const withLocation = data.filter(d => d.location);
        setSensors(withLocation);
      });
  }, []);

  const icon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <div style={{ height: '400px', marginTop: '2rem' }}>
      <h2>🗺️ Sensor Map</h2>
      <MapContainer
        center={[22.9734, 78.6569]} // Center of India
        zoom={4.5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sensors.map(sensor => (
          <Marker
            key={sensor.sensor_id}
            position={[sensor.location.lat, sensor.location.lng]}
            icon={icon}
          >
            <Popup>
              <strong>{sensor.sensor_id}</strong><br />
              Status: <span style={{ color: sensor.status === 'active' ? 'green' : 'red' }}>{sensor.status}</span><br />
              Last seen:<br />
              {new Date(sensor.last_seen).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SensorMap;
