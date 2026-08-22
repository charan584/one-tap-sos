const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.Mixed,
  },
  studentSnapshot: {
    name: { type: String, default: 'Student' },
    studentId: { type: String, default: 'STU-UNKNOWN' },
    email: { type: String, default: '' },
    mobile: { type: String, default: 'Not specified' },
    branch: { type: String, default: 'Computer Science & Engineering (CSE)' },
    department: { type: String, default: 'Computer Science & Engineering (CSE)' },
    year: { type: String, default: '1st Year' },
    section: { type: String, default: 'Section A' },
    guardianName: { type: String, default: 'Guardian' },
    guardianPhone: { type: String, default: '' },
    emergencyContactName: { type: String, default: 'Emergency Contact' },
    emergencyContactNumber: { type: String, default: 'Not specified' },
    hostelOrDayScholar: { type: String, default: 'Hostel' },
    bloodGroup: { type: String, default: 'O+' },
    medicalConditions: { type: String, default: 'None reported' },
    profilePhoto: { type: String, default: '' },
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, default: 5 },
    zone: { type: String, default: 'Campus Area' },
    address: { type: String, default: 'University Grounds' },
    googleMapsUrl: { type: String, default: '' },
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
