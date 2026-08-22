const express = require('express');
const router = express.Router();
const { getDashboardStats, getCampusLocations } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, getDashboardStats);
router.get('/locations', getCampusLocations);

module.exports = router;
