const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
require('dotenv').config();
const propertyRoutes = require('./routes/propertyRoutes');
const contactusRoutes = require('./routes/contactusRoutes');
const authRoutes = require('./routes/authRoutes');
const s3Routes = require('./routes/s3Routes');
const app = express();
const heroSlideshowRoutes = require('./routes/heroSlideshowRoutes');
// CORS setup for all origins
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins (restrict in production)
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options('*', cors()); // Handle preflight for all routes
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

app.use('/api', propertyRoutes);
app.use('/api', contactusRoutes);
app.use('/api', authRoutes);
app.use('/api/', s3Routes); 
app.use('/api', heroSlideshowRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});