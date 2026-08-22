const mongoose = require('mongoose');

const emergencyLogSchema = new mongoose.Schema({
  emergencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency',
    required: true,
  },
  action: {
    type: String,
    required: true, // e.g. 'SOS_TRIGGERED', 'CASE_ACCEPTED', 'STATUS_UPDATED', 'LOCATION_STREAMED', 'CASE_RESOLVED'
  },
  performedBy: {
    type: String,
    default: 'System Automator',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('EmergencyLog', emergencyLogSchema);
