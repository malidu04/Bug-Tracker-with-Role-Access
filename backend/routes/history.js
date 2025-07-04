const express = require('express');
const {
  getBugHistory,
  getAllHistory,
} = require('../controllers/history');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const History = require('../models/History');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getBugHistory);

router
  .route('/all')
  .get(
    protect,
    authorize('admin'),
    advancedResults(History, 'changedBy'),
    getAllHistory
  );

module.exports = router;