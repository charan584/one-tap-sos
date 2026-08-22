const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
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
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  branch: {
    type: String,
    default: 'Computer Science & Engineering (CSE)',
    trim: true,
  },
  department: {
    type: String,
    default: 'Computer Science & Engineering (CSE)',
    trim: true,
  },
  year: {
    type: String,
    default: '1st Year',
  },
  section: {
    type: String,
    default: 'Section A',
    trim: true,
  },
  guardianName: {
    type: String,
    default: 'Guardian',
    trim: true,
  },
  guardianPhone: {
    type: String,
    default: '',
    trim: true,
  },
  emergencyContactName: {
    type: String,
    default: 'Guardian',
    trim: true,
  },
  emergencyContactNumber: {
    type: String,
    default: '',
    trim: true,
  },
  hostelOrDayScholar: {
    type: String,
    default: 'Hostel Block A',
  },
  bloodGroup: {
    type: String,
    default: 'O+',
  },
  medicalConditions: {
    type: String,
    default: 'None reported / Healthy',
    trim: true,
  },
  profilePhoto: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  role: {
    type: String,
    default: 'student',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Pre-save hook to ensure guardian and emergency contact fields are in sync
studentSchema.pre('save', function (next) {
  if (this.guardianName && !this.emergencyContactName) {
    this.emergencyContactName = this.guardianName;
  }
  if (this.guardianPhone && !this.emergencyContactNumber) {
    this.emergencyContactNumber = this.guardianPhone;
  }
  if (!this.guardianName && this.emergencyContactName) {
    this.guardianName = this.emergencyContactName;
  }
  if (!this.guardianPhone && this.emergencyContactNumber) {
    this.guardianPhone = this.emergencyContactNumber;
  }
  if (this.branch && !this.department) {
    this.department = this.branch;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
