const express = require('express');
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug
} = require('../controllers/bugController');

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getBugs)
  .post(createBug);

router
  .route('/:id')
  .get(getBug)
  .put(updateBug)
  .delete(deleteBug);

module.exports = router;