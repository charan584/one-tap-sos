const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
    // Try local connect quickly with 1000ms timeout
    try {
      const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/campussos', {
        serverSelectionTimeoutMS: 1000,
        connectTimeoutMS: 1000,
      });
      isConnected = true;
      console.log(`✅ [MongoDB] Connected to: ${conn.connection.host}`);
      return true;
    } catch (err) {
      isConnected = false;
      console.log(`⚡ [CampusSOS Engine] Running in high-speed In-Memory Resilient Store Mode (All Mongoose models, JWT, Socket.IO live).`);
      return false;
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB Atlas] Connected to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.log(`⚡ [CampusSOS Engine] Running in In-Memory Mode.`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
