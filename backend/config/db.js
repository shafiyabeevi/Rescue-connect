/**
 * MongoDB connection (view live data using MongoDB Compass with the same MONGO_URI)
 * Compass connection string example: mongodb://127.0.0.1:27017/rescueConnectDB
 */
const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rescueConnectDB';
    await mongoose.connect(uri);
    console.log('[MongoDB] Connected -> ' + uri);
    console.log('[MongoDB] Open this same URI in MongoDB Compass to view collections: users, donations, reports, notifications, pets, foods, activities');
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectMongo;
