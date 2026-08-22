const express = require('express');
const router = express.Router();
const {
  triggerEmergency,
  getAllEmergencies,
  getEmergencyById,
  acceptEmergency,
  updateEmergencyStatus,
  resolveEmergency,
} = require('../controllers/emergencyController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Trigger SOS (Student)
router.post('/', verifyToken, triggerEmergency);

// List all emergencies (Admin & Student view)
router.get('/', verifyToken, getAllEmergencies);

// Get single emergency
router.get('/:id', verifyToken, getEmergencyById);

// Accept Emergency
router.put('/:id/accept', verifyToken, acceptEmergency);

// Update status (On Route, Arrived)
router.put('/:id/status', verifyToken, updateEmergencyStatus);

// Resolve Emergency
router.put('/:id/resolve', verifyToken, resolveEmergency);

module.exports = router;
