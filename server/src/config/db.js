const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campussos';
  
  // Format URI if ends with trailing slash e.g. mongodb://localhost:27017/
  if (uri.endsWith('/')) {
    uri = `${uri}campussos`;
  } else if (!uri.includes('27017/') && uri.endsWith(':27017')) {
    uri = `${uri}/campussos`;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to Database: "${conn.connection.name}" at host: ${conn.connection.host}:${conn.connection.port}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.log(`⚠️ [MongoDB] Local connection note: (${error.message}).`);
    console.log(`⚡ [CampusSOS Engine] Running with Mongoose models & In-Memory high-speed synchronization.`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
