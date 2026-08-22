const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Student Auth & OTP Routes
router.post('/send-register-otp', sendRegisterOtp);
router.post('/register', register);
router.post('/send-forgot-password-otp', sendForgotPasswordOtp);
router.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
router.post('/login', login);

// Admin Auth & OTP Routes (Secured by Secret Code & 2FA OTP)
router.post('/send-admin-login-otp', sendAdminLoginOtp);
router.post('/verify-admin-login-otp', verifyAdminLoginOtp);
router.post('/send-admin-register-otp', sendAdminRegisterOtp);
router.post('/verify-admin-register-otp', verifyAdminRegisterOtp);

// Profile & Demo Routes
router.get('/profile', verifyToken, getStudentProfile);
router.get('/demo-login/:type', demoQuickLogin);

module.exports = router;
