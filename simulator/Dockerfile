# simulator/Dockerfile
FROM node:20

WORKDIR /app

COPY sensor-simulator.js ./
COPY package.json ./

RUN npm install

CMD ["node", "sensor-simulator.js"]
