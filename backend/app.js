const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./utils/ErrorResponse');
const connectDB = require('./config/db');

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const bugs = require('./routes/bugs');
const comments = require('./routes/comments');
const history = require('./routes/history');
const notifications = require('./routes/notifications');

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
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/bugs', bugs);
app.use('/api/v1/comments', comments);
app.use('/api/v1/history', history);
app.use('/api/v1/notifications', notifications);

// Error handler middleware
app.use(errorHandler);

module.exports = app;