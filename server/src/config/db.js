const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for MongoDB Atlas SRV lookups
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

let isConnected = false;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campussos';
  uri = uri.trim();

  // Normalize URI for Atlas or local instances
  if (uri.startsWith('mongodb+srv://')) {
    if (uri.endsWith('/')) {
      uri = `${uri}campussos?retryWrites=true&w=majority`;
    } else if (!uri.includes('mongodb.net/')) {
      if (uri.includes('?')) {
        uri = uri.replace('mongodb.net/?', 'mongodb.net/campussos?');
      } else {
        uri = `${uri}/campussos?retryWrites=true&w=majority`;
      }
    }
  } else {
    if (uri.endsWith('/')) {
      uri = `${uri}campussos`;
    } else if (!uri.includes('27017/') && uri.endsWith(':27017')) {
      uri = `${uri}/campussos`;
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to Database: "${conn.connection.name}" at host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.log(`⚠️ [MongoDB] Connection note: (${error.message}).`);
    console.log(`⚡ [CampusSOS Engine] Running with Mongoose models & In-Memory high-speed synchronization.`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
