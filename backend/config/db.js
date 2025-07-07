const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected...'.cyan.bold);
  } catch (err) {
    console.error('Database connection error:'.red, err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
