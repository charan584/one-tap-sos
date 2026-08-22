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
  emergencyContactName: {
    type: String,
    required: [true, 'Emergency contact name is required'],
    trim: true,
  },
  emergencyContactNumber: {
    type: String,
    required: [true, 'Emergency contact number is required'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  year: {
    type: String,
    required: [true, 'Year of study is required'],
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD'],
    default: '3rd Year',
  },
  hostelOrDayScholar: {
    type: String,
    required: [true, 'Hostel or Day Scholar status is required'],
    enum: ['Hostel Block A', 'Hostel Block B', 'Hostel Block C', 'Hostel Block D', 'Day Scholar'],
    default: 'Hostel Block A',
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
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

module.exports = mongoose.model('Student', studentSchema);
