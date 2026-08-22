const jwt = require('jsonwebtoken');
const store = require('../services/store');

const JWT_SECRET = process.env.JWT_SECRET || 'campussos_super_secret_jwt_key_2026_999888777';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role === 'admin' || decoded.badgeNumber) {
      const admin = await store.findAdminById(decoded.id);
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid admin token or admin not found.' });
      }
      req.user = admin;
      req.admin = admin;
      req.role = 'admin';
    } else {
      const student = await store.findStudentById(decoded.id);
      if (!student) {
        return res.status(401).json({ success: false, message: 'Invalid student token or student not found.' });
      }
      req.user = student;
      req.student = student;
      req.role = 'student';
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.role !== 'admin' && !req.admin) {
    return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };
