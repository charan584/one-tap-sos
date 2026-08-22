const express = require('express');
const router = express.Router();
const { updateLiveLocation } = require('../controllers/locationController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/location/update (Student 5s GPS stream)
router.post('/update', verifyToken, updateLiveLocation);

module.exports = router;
