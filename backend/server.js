const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');
const logger = require('./utils/logger');
const { PORT, NODE_ENV } = require('./config/env');
require('colors');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bugRoutes = require('./routes/bugRoutes');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Passport middleware
app.use(passport.initialize());

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/bugs', bugRoutes);

// Error handler middleware
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
  `Server running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold
)
);


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});