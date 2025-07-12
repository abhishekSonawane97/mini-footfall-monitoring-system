# 🧍‍♂️ Mini Footfall Monitoring System

A simplified, cloud-ready, full-stack web application to monitor foot traffic using simulated IoT sensors. Built with the MERN stack, the system processes real-time data, shows analytics, monitors device health, and is fully Dockerized for deployment.

## 🚀 Features

- ⏱️ Real-time footfall chart (last 60 mins)  
- 📊 Summary of today’s total footfall per sensor  
- 🔌 Device status cards (active/inactive with last seen)  
- 🗺️ Sensor location map using Leaflet  
- ⚙️ RESTful API backend with MongoDB  
- 🧪 Sensor simulator sending data every simulated hour (1 min interval)  
- 🐳 Dockerized deployment with Docker Compose  

## 📁 Folder Structure

```
.
├── backend        # Node.js + Express.js API
├── frontend       # React + Vite Dashboard
├── simulator      # Node.js Sensor Data Generator
├── docker-compose.yml
└── README.md
```

## 🧪 How to Run Locally (Dockerized)

### Prerequisites

- Docker + Docker Compose installed

### Steps

```bash
git clone git@github.com:abhishekSonawane97/mini-footfall-monitoring-system.git
cd footfall-monitoring-system
sudo docker-compose up --build
```

### Access

- Frontend: http://localhost:5173  
- Backend API: http://localhost:5050  

## 📦 REST API Endpoints

### POST /sensor-data

Stores footfall data from a sensor.

```json
{
  "sensor_id": "sensor-001",
  "timestamp": "2025-07-12T12:00:00Z",
  "count": 15
}
```

### GET /analytics

Returns aggregated hourly and daily footfall.

### GET /devices

Returns all devices with `lastSeen` and `status` (`active` if seen within 2 minutes).

## ⚙️ Design Assumptions

- Simulator mimics 2 sensors sending data every 1 simulated hour (1-minute interval).
- A device is marked **inactive** if no data is received for 2+ minutes.
- Timestamps are handled in **UTC**; frontend assumes local timezone.
- Sensor locations are **static and hardcoded**.

## 🧠 Design Decisions

- MongoDB chosen for flexible time-series data modeling.
- Leaflet used for map to avoid commercial API keys.
- Data ingestion and frontend are decoupled via REST APIs.
- Docker Compose simplifies orchestration for local or remote deployment.

## 📈 Scalability Plan

### 🔹 Architecture

- Deploy backend & frontend using cloud services (e.g. **Render**, **Vercel**, or **Kubernetes**).
- Host MongoDB on **MongoDB Atlas** with sharding on `{sensor_id, timestamp}`.

### 🔹 Improvements

- Use **Kafka** or **RabbitMQ** for ingesting high-throughput sensor data.
- Cache frequently accessed analytics using **Redis**.
- Add **WebSockets** for real-time updates on frontend.

## 👨‍💻 Author

**Abhishek** — Built as part of an **XCode assignment** to demonstrate real-time full-stack system design and deployment.

## 📜 License

MIT License
