require('dotenv').config(); // Ensure dotenv is loaded
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
