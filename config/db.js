const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD +'@cluster0.jehzz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const connectDB = async () => {
  try {
      await mongoose.connect(MONGODB_URI); 
      console.log('MongoDB Connected...');
  } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1);
  }
};

module.exports = connectDB;