const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const { connectDB } = require('./config/db');
const store = require('./services/store');
const { initSocket } = require('./socket/socketHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const locationRoutes = require('./routes/locationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const responderRoutes = require('./routes/responderRoutes');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Initialize Socket.IO Handler
initSocket(io);

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/responders', responderRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CampusSOS – One Tap Intelligent Emergency Response System API',
    timestamp: new Date().toISOString(),
    storeInitialized: store.initialized,
  });
});

// Reset & Reseed Demo Data
app.post('/api/seed', async (req, res) => {
  store.initialized = false;
  await store.init();
  res.json({ success: true, message: 'CampusSOS demo data successfully reset and reseeded.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start Server
const start = async () => {
  try {
    await connectDB();
    await store.init();

    server.listen(PORT, () => {
      console.log(`========================================================`);
      console.log(`🚨 CampusSOS Emergency Engine API running on Port ${PORT}`);
      console.log(`📡 Real-time Socket.IO dispatch ready on ws://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`========================================================`);
    });
  } catch (err) {
    console.error('Fatal Server Boot Error:', err);
  }
};

start();
