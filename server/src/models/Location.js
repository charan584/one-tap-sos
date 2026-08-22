const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Academic', 'Hostel', 'Library', 'Sports', 'Medical', 'Security', 'Dining', 'Administrative'],
    default: 'Academic',
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  radiusMeters: {
    type: Number,
    default: 80,
  },
  securityPostContact: {
    type: String,
    default: '+1 (555) 019-2834',
  }
});

module.exports = mongoose.model('Location', locationSchema);
