const mongoose = require('mongoose');

const administratorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  badgeNumber: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['Chief Security Officer', 'Campus Dispatcher', 'Medical Response Officer', 'Administrator'],
    default: 'Campus Dispatcher',
  },
  department: {
    type: String,
    default: 'Campus Safety & Emergency Operations Center',
  },
  phone: {
    type: String,
    default: '+1 (555) 911-0000',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Administrator', administratorSchema);
