const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Add this
const { Server } = require('socket.io'); // Add this
require('dotenv').config();
const propertyRoutes = require('./routes/propertyRoutes');
const contactusRoutes = require('./routes/contactusRoutes');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { // Initialize Socket.io
  cors: {
    origin: "http://localhost:3000", // Adjust to your frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

app.use('/api', propertyRoutes);
app.use('/api', contactusRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Listen with HTTP server
  console.log(`Server running on port ${PORT}`);
});