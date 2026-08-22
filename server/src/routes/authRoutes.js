const express = require('express');
const router = express.Router();
const { register, login, loginAdmin, getStudentProfile, demoQuickLogin } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', loginAdmin);
router.get('/profile', verifyToken, getStudentProfile);
router.get('/demo-login/:type', demoQuickLogin);

module.exports = router;
