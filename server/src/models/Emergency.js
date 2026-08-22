const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  studentSnapshot: {
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    email: String,
    mobile: { type: String, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    hostelOrDayScholar: String,
    bloodGroup: { type: String, required: true },
    medicalConditions: { type: String, default: 'None reported' },
    profilePhoto: String,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, default: 5 },
    zone: { type: String, default: 'Main Campus Quad' },
    address: { type: String, default: 'University Central Ground' },
    googleMapsUrl: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'On Route', 'Arrived', 'Resolved', 'Cancelled'],
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: ['High', 'Critical'],
    default: 'High',
  },
  assignedResponders: [
    {
      responderId: String,
      name: String,
      role: String,
      callSign: String,
      phone: String,
      status: { type: String, default: 'Assigned' },
      assignedAt: { type: Date, default: Date.now },
      etaMinutes: { type: Number, default: 2 },
    }
  ],
  assignedOfficer: {
    id: String,
    name: { type: String, default: 'Pending Officer Assignment' },
    badgeNumber: String,
    role: String,
  },
  timestamps: {
    triggeredAt: { type: Date, default: Date.now },
    acceptedAt: Date,
    onRouteAt: Date,
    arrivedAt: Date,
    resolvedAt: Date,
  },
  resolutionNotes: {
    type: String,
    default: '',
  },
  resolvedBy: {
    type: String,
    default: '',
  },
  locationHistory: [
    {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      timestamp: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Emergency', emergencySchema);
