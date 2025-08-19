require('dotenv').config();

const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Import the logger utility

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
     
    });
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error", { error: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;
