const mongoose = require('mongoose');

const responderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  callSign: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['Campus Security Patrol', 'Rapid Medical Response', 'Administration Dispatch', 'Hostel Warden Support', 'Fire Safety'],
    default: 'Campus Security Patrol',
  },
  phone: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    default: 'Patrol Buggy / Ambulance',
  },
  status: {
    type: String,
    enum: ['Available', 'Dispatched', 'On Scene', 'Busy', 'Offline'],
    default: 'Available',
  },
  currentLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    zone: { type: String, default: 'Security Base Alpha' },
  },
  activeIncidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency',
    default: null,
  }
});

module.exports = mongoose.model('Responder', responderSchema);
