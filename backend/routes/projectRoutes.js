const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember
} = require('../controllers/projectController');

const router = express.Router();
const { protect } = require('../middleware/auth');

// Re-route into bug router
const bugRouter = require('./bugRoutes');
router.use('/:projectId/bugs', bugRouter);

router.use(protect);

router
  .route('/')
  .get(getProjects)
  .post(createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router
  .route('/:id/team')
  .put(addTeamMember);

router
  .route('/:id/team/:userId')
  .delete(removeTeamMember);

// Get projects for a specific user
router.get('/user/:userId', getProjects);

module.exports = router;