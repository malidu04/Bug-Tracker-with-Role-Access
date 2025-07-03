const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'project-manager', 'developer', 'qa'],
    default: 'qa'
  },
  avatar: {
    type: String,
    default: 'default.jpg'
  },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true }
  },
  socketId: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastActiveAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Cascade delete bugs when user is deleted
UserSchema.pre('remove', async function(next) {
  await this.model('Bug').deleteMany({ reporter: this._id });
  next();
});

// Reverse populate with virtuals
UserSchema.virtual('reportedBugs', {
  ref: 'Bug',
  localField: '_id',
  foreignField: 'reporter',
  justOne: false
});

UserSchema.virtual('assignedBugs', {
  ref: 'Bug',
  localField: '_id',
  foreignField: 'assignee',
  justOne: false
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email confirm token
UserSchema.methods.getEmailConfirmToken = function() {
  const confirmToken = crypto.randomBytes(20).toString('hex');

  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');

  this.emailConfirmExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return confirmToken;
};

module.exports = mongoose.model('User', UserSchema);

