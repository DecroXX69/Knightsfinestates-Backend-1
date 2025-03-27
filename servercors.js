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
const app = express();

// CORS setup: Allow only https://knightsfinestates.com and Postman (no origin)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === "https://knightsfinestates.com") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

// Routes
app.use('/api', propertyRoutes);
app.use('/api', contactusRoutes);
app.use('/api', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
