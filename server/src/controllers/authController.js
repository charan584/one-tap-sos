const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../services/store');

const JWT_SECRET = process.env.JWT_SECRET || 'campussos_super_secret_jwt_key_2026_999888777';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register (Student Registration)
const register = async (req, res) => {
  try {
    const {
      name,
      studentId,
      email,
      password,
      mobile,
      emergencyContactName,
      emergencyContactNumber,
      department,
      year,
      hostelOrDayScholar,
      bloodGroup,
      medicalConditions,
      profilePhoto,
    } = req.body;

    // Validation
    if (!name || !studentId || !email || !password || !mobile || !emergencyContactName || !emergencyContactNumber || !department || !year || !bloodGroup) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory registration fields (Name, Student ID, Email, Password, Mobile, Emergency Contact & Number, Department, Year, Blood Group).',
      });
    }

    const existingStudent = await store.findStudentByEmail(email);
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'A student account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await store.createStudent({
      name,
      studentId: studentId.toUpperCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      emergencyContactName,
      emergencyContactNumber,
      department,
      year,
      hostelOrDayScholar: hostelOrDayScholar || 'Hostel Block A',
      bloodGroup,
      medicalConditions: medicalConditions || 'None reported / Healthy',
      profilePhoto: profilePhoto || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`,
      role: 'student',
    });

    const token = generateToken({ id: newStudent._id, role: 'student', studentId: newStudent.studentId });

    const { password: _, ...studentData } = newStudent;

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully. Emergency profile armed.',
      token,
      student: studentData,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

// POST /api/auth/login (Student Login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const student = await store.findStudentByEmail(email);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid student credentials.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid student credentials.' });
    }

    const token = generateToken({ id: student._id, role: 'student', studentId: student.studentId });
    const { password: _, ...studentData } = student;

    return res.status(200).json({
      success: true,
      message: 'Login successful. Full student emergency profile loaded.',
      token,
      student: studentData,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

// POST /api/auth/admin-login (Admin Login)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await store.findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const token = generateToken({ id: admin._id, role: 'admin', badgeNumber: admin.badgeNumber });
    const { password: _, ...adminData } = admin;

    return res.status(200).json({
      success: true,
      message: 'Administrator authenticated to Campus Emergency Dispatch System.',
      token,
      admin: adminData,
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin login.', error: error.message });
  }
};

// GET /api/student/profile
const getStudentProfile = async (req, res) => {
  try {
    const student = req.student || req.user;
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const { password: _, ...studentData } = student;
    return res.status(200).json({
      success: true,
      student: studentData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

// GET /api/auth/demo-login/:type ('student' or 'admin')
const demoQuickLogin = async (req, res) => {
  try {
    const { type } = req.params;

    if (type === 'admin') {
      const admin = (await store.admins)[0] || (await store.findAdminByEmail('admin@campussos.edu'));
      const token = generateToken({ id: admin._id, role: 'admin', badgeNumber: admin.badgeNumber });
      const { password: _, ...adminData } = admin;
      return res.json({ success: true, token, admin: adminData, role: 'admin' });
    } else {
      const student = (await store.students)[0] || (await store.findStudentByEmail('alex.rivera@campus.edu'));
      const token = generateToken({ id: student._id, role: 'student', studentId: student.studentId });
      const { password: _, ...studentData } = student;
      return res.json({ success: true, token, student: studentData, role: 'student' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Demo quick login error.' });
  }
};

module.exports = {
  register,
  login,
  loginAdmin,
  getStudentProfile,
  demoQuickLogin,
};
