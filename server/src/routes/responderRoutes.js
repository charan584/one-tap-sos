const express = require('express');
const router = express.Router();
const { getResponders, simulateResponderMovement } = require('../controllers/responderController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getResponders);
router.post('/simulate-movement', verifyToken, simulateResponderMovement);

module.exports = router;
