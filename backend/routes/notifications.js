const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getNotifications);

router
  .route('/:id/read')
  .put(protect, markAsRead);

router
  .route('/read-all')
  .put(protect, markAllAsRead);

module.exports = router;