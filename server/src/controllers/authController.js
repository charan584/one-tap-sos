const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../services/store');
const { generateOtp, sendOtpEmail, SENDER_EMAIL } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'campussos_super_secret_jwt_key_2026_999888777';
const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE || 'sos@446898';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// 1. POST /api/auth/send-register-otp (Student Registration OTP)
const sendRegisterOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required to send OTP.' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    if (!trimmedEmail.endsWith('@srkrec.ac.in')) {
      return res.status(400).json({
        success: false,
        message: 'Campus email must end with @srkrec.ac.in (e.g. 25b91a05q3@srkrec.ac.in).',
      });
    }

    const existing = await store.findStudentByEmail(trimmedEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in instead.' });
    }

    const otp = generateOtp();
    await store.saveOtp(email, otp, 'REGISTER');

    const emailResult = await sendOtpEmail(email, otp, 'REGISTER', name || 'Student');

    return res.status(200).json({
      success: true,
      message: `6-digit verification OTP successfully sent to ${email} from ${SENDER_EMAIL}.`,
      sender: SENDER_EMAIL,
      liveSent: emailResult.liveSent,
    });
  } catch (error) {
    console.error('Send Register OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to dispatch verification email.', error: error.message });
  }
};

// 2. POST /api/auth/register (Verify OTP & Register Student in MongoDB)
const register = async (req, res) => {
  try {
    const {
      name,
      studentId,
      email,
      password,
      mobile,
      guardianName,
      guardianPhone,
      emergencyContactName,
      emergencyContactNumber,
      branch,
      department,
      year,
      section,
      hostelOrDayScholar,
      bloodGroup,
      medicalConditions,
      profilePhoto,
      otp,
    } = req.body;

    if (!name || !studentId || !email || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory registration fields (Name, Student ID, Email, Password, Mobile).',
      });
    }

    const trimmedEmail = email.toLowerCase().trim();
    if (!trimmedEmail.endsWith('@srkrec.ac.in')) {
      return res.status(400).json({
        success: false,
        message: 'Campus email must end with @srkrec.ac.in (e.g. 25b91a05q3@srkrec.ac.in).',
      });
    }

    if (!otp) {
      return res.status(400).json({ success: false, message: 'Verification OTP is required to complete registration.' });
    }

    const isOtpValid = await store.verifyOtp(trimmedEmail, otp, 'REGISTER');
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code. Please request a new one.' });
    }

    const existingStudent = await store.findStudentByEmail(trimmedEmail);
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'A student account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const finalGuardianName = guardianName || emergencyContactName || 'Guardian';
    const finalGuardianPhone = guardianPhone || emergencyContactNumber || mobile || '';
    const finalBranch = branch || department || 'Computer Science & Engineering (CSE)';
    const finalYear = year || '1st Year';
    const finalSection = section || 'Section A';

    const newStudent = await store.createStudent({
      name,
      studentId: studentId.toUpperCase(),
      email: trimmedEmail,
      password: hashedPassword,
      mobile,
      guardianName: finalGuardianName,
      guardianPhone: finalGuardianPhone,
      emergencyContactName: finalGuardianName,
      emergencyContactNumber: finalGuardianPhone,
      branch: finalBranch,
      department: finalBranch,
      year: finalYear,
      section: finalSection,
      hostelOrDayScholar: hostelOrDayScholar || 'Hostel Block A',
      bloodGroup: bloodGroup || 'O+',
      medicalConditions: medicalConditions || 'None reported / Healthy',
      profilePhoto: profilePhoto || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`,
      role: 'student',
    });

    const token = generateToken({ id: newStudent._id, role: 'student', studentId: newStudent.studentId });
    const { password: _, ...studentData } = newStudent;

    return res.status(201).json({
      success: true,
      message: '🎉 Registration complete! Emergency medical and kin dossier armed.',
      token,
      student: studentData,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

// 3. POST /api/auth/send-forgot-password-otp
const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email, studentId, identifier } = req.body;
    const inputIdentifier = (identifier || email || studentId || '').trim();

    if (!inputIdentifier) {
      return res.status(400).json({ success: false, message: 'Campus email or Student Roll Number is required.' });
    }

    let student = await store.findStudentByEmail(inputIdentifier);
    if (!student && !inputIdentifier.includes('@')) {
      student = await store.findStudentByEmail(`${inputIdentifier}@srkrec.ac.in`);
    }
    if (!student) {
      student = await store.findStudentByStudentId(inputIdentifier);
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'No registered student found with this email or roll number.' });
    }

    const studentEmail = student.email;
    const otp = generateOtp();
    await store.saveOtp(studentEmail, otp, 'FORGOT_PASSWORD');

    const emailResult = await sendOtpEmail(studentEmail, otp, 'FORGOT_PASSWORD', student.name);

    return res.status(200).json({
      success: true,
      message: `Password reset code sent to ${studentEmail} from ${SENDER_EMAIL}.`,
      email: studentEmail,
      sender: SENDER_EMAIL,
      liveSent: emailResult.liveSent,
    });
  } catch (error) {
    console.error('Forgot Password OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send password reset code.', error: error.message });
  }
};

// 4. POST /api/auth/verify-forgot-password-otp (Reset Password in MongoDB)
const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, studentId, identifier, otp, newPassword } = req.body;
    const inputIdentifier = (identifier || email || studentId || '').trim();

    if (!inputIdentifier || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email/Roll Number, OTP, and new password are required.' });
    }

    let student = await store.findStudentByEmail(inputIdentifier);
    if (!student && !inputIdentifier.includes('@')) {
      student = await store.findStudentByEmail(`${inputIdentifier}@srkrec.ac.in`);
    }
    if (!student) {
      student = await store.findStudentByStudentId(inputIdentifier);
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const isOtpValid = await store.verifyOtp(student.email, otp, 'FORGOT_PASSWORD');
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP reset code.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await store.updateStudentPassword(student.email, hashedPassword);

    return res.status(200).json({
      success: true,
      message: '✅ Password successfully reset in MongoDB. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting password.', error: error.message });
  }
};

// 5. POST /api/auth/login (Student Login)
const login = async (req, res) => {
  try {
    const { email, studentId, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || studentId || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'Campus email / Roll number and password are required.' });
    }

    let student = await store.findStudentByEmail(loginIdentifier);
    if (!student && !loginIdentifier.includes('@')) {
      student = await store.findStudentByEmail(`${loginIdentifier}@srkrec.ac.in`);
    }
    if (!student) {
      student = await store.findStudentByStudentId(loginIdentifier);
    }

    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid student credentials or student not registered.' });
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

// ================= ADMIN AUTHENTICATION WITH SECRET CODE & OTP =================

// 6. POST /api/auth/send-admin-login-otp (Validate Admin Credentials + Secret Code & Send OTP)
const sendAdminLoginOtp = async (req, res) => {
  try {
    const { email, password, secretCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (!secretCode) {
      return res.status(400).json({ success: false, message: 'Administrator Master Secret Code is required.' });
    }

    const expectedSecret = (process.env.ADMIN_SECRET_CODE || 'sos@446898').trim();
    if (secretCode.trim() !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: '⛔ Access Denied: Invalid Administrator Secret Authorization Code.',
      });
    }

    const admin = await store.findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const otp = generateOtp();
    await store.saveOtp(email, otp, 'ADMIN_LOGIN');

    const emailResult = await sendOtpEmail(email, otp, 'REGISTER', admin.name);

    return res.status(200).json({
      success: true,
      message: `6-digit 2FA login code sent to ${email} from ${SENDER_EMAIL}.`,
      sender: SENDER_EMAIL,
      liveSent: emailResult.liveSent,
    });
  } catch (error) {
    console.error('Send Admin Login OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send admin verification code.', error: error.message });
  }
};

// 7. POST /api/auth/verify-admin-login-otp (Verify OTP & Login Admin into Command Center)
const verifyAdminLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const isOtpValid = await store.verifyOtp(email, otp, 'ADMIN_LOGIN');
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired Administrator OTP code.' });
    }

    const admin = await store.findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Administrator account not found.' });
    }

    const token = generateToken({ id: admin._id, role: 'admin', badgeNumber: admin.badgeNumber });
    const { password: _, ...adminData } = admin;

    return res.status(200).json({
      success: true,
      message: '✅ Administrator 2FA verified. Opening Campus Command Center...',
      token,
      admin: adminData,
    });
  } catch (error) {
    console.error('Verify Admin Login OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin authentication.', error: error.message });
  }
};

// 8. POST /api/auth/send-admin-register-otp (Send OTP for Admin Sign Up)
const sendAdminRegisterOtp = async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (!secretCode) {
      return res.status(400).json({ success: false, message: 'Administrator Master Secret Code is required.' });
    }

    const expectedSecret = (process.env.ADMIN_SECRET_CODE || 'sos@446898').trim();
    if (secretCode.trim() !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: '⛔ Access Denied: Invalid Administrator Secret Authorization Code.',
      });
    }

    const existing = await store.findAdminByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An administrator account with this email already exists.' });
    }

    const otp = generateOtp();
    await store.saveOtp(email, otp, 'ADMIN_REGISTER');

    const emailResult = await sendOtpEmail(email, otp, 'REGISTER', name);

    return res.status(200).json({
      success: true,
      message: `6-digit administrator verification OTP sent to ${email} from ${SENDER_EMAIL}.`,
      sender: SENDER_EMAIL,
      liveSent: emailResult.liveSent,
    });
  } catch (error) {
    console.error('Send Admin Register OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send admin registration OTP.', error: error.message });
  }
};

// 9. POST /api/auth/verify-admin-register-otp (Verify OTP & Register Admin in MongoDB)
const verifyAdminRegisterOtp = async (req, res) => {
  try {
    const { name, email, password, department, phone, secretCode, otp } = req.body;

    if (!name || !email || !password || !otp || !secretCode) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory fields and OTP.' });
    }

    const expectedSecret = (process.env.ADMIN_SECRET_CODE || 'sos@446898').trim();
    if (secretCode.trim() !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: '⛔ Access Denied: Invalid Administrator Secret Authorization Code.',
      });
    }

    const isOtpValid = await store.verifyOtp(email, otp, 'ADMIN_REGISTER');
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    const existingAdmin = await store.findAdminByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'An administrator with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedBadge = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAdmin = await store.createAdmin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      badgeNumber: generatedBadge,
      department: department || 'Campus Safety & Emergency Operations Center',
      role: 'Administrator',
      phone: phone || '+1 (555) 911-0100',
    });

    const token = generateToken({ id: newAdmin._id, role: 'admin', badgeNumber: newAdmin.badgeNumber });
    const { password: _, ...adminData } = newAdmin;

    return res.status(201).json({
      success: true,
      message: '✅ Administrator registered & verified in MongoDB. Opening Command Center...',
      token,
      admin: adminData,
    });
  } catch (error) {
    console.error('Verify Admin Register OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin registration.', error: error.message });
  }
};

// 10. GET /api/student/profile
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

// 11. GET /api/auth/demo-login/:type
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
  sendRegisterOtp,
  register,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  login,
  sendAdminLoginOtp,
  verifyAdminLoginOtp,
  sendAdminRegisterOtp,
  verifyAdminRegisterOtp,
  getStudentProfile,
  demoQuickLogin,
};
