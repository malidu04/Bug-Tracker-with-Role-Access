const History = require('../models/History');

// Create history entry for bug changes
exports.createHistory = async (bugId, userId, action, field, oldValue, newValue) => {
  try {
    await History.create({
      bug: bugId,
      user: userId,
      action,
      field,
      oldValue,
      newValue
    });
  } catch (err) {
    console.error('Error creating history entry:', err);
  }
};