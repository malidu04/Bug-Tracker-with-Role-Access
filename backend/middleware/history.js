const History = require('../models/History');
const ErrorResponse = require('../utils/ErrorResponse');

exports.trackChanges = async (req, res, next) => {
  try {
    const originalBug = await req.model.findById(req.params.id);

    req.onUpdate = async (updatedBug) => {
      const changes = [];

      // Check each field for changes
      ['title', 'description', 'status', 'priority', 'assignedTo'].forEach(
        (field) => {
          if (
            JSON.stringify(originalBug[field]) !== 
            JSON.stringify(updatedBug[field])
          ) {
            changes.push({
              bug: req.params.id,
              field,
              oldValue: originalBug[field]?.toString() || '',
              newValue: updatedBug[field]?.toString() || '',
              changedBy: req.user.id,
            });
          }
        }
      );

      if (changes.length > 0) {
        await History.insertMany(changes);
      }
    };

    next();
  } catch (err) {
    return next(new ErrorResponse('Error tracking changes', 500));
  }
};