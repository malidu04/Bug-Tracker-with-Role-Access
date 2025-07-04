require('dotenv').config(); // ✅ Load environment variables

const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const http = require('http');
const ErrorResponse = require('./utils/ErrorResponse');

// Connect to database
connectDB();


const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});