const store = require('../services/store');
const { autoAssignResponders, detectCampusZone } = require('../services/routingEngine');
const { getIO } = require('../socket/socketHandler');
const { sendAdminEmergencyAlertEmail } = require('../services/emailService');

// POST /api/emergency
const triggerEmergency = async (req, res) => {
  try {
    const student = req.student || req.user;
    if (!student) {
      return res.status(401).json({ success: false, message: 'Unauthorized student identity.' });
    }

    let { latitude, longitude, accuracy, zone } = req.body;

    // Fallback campus coordinates if browser GPS is blocked/mocked
    const lat = latitude !== undefined && latitude !== null ? Number(latitude) : 37.4275;
    const lng = longitude !== undefined && longitude !== null ? Number(longitude) : -122.1697;
    const acc = accuracy || 5;

    // Detect campus zone if not passed
    const detectedZone = zone || await detectCampusZone(lat, lng);
    const googleMapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

    // Student Snapshot (all pre-stored information, zero forms)
    const studentSnapshot = {
      name: student.name,
      studentId: student.studentId,
      email: student.email,
      mobile: student.mobile,
      branch: student.branch || student.department || 'Computer Science & Engineering (CSE)',
      department: student.department || student.branch || 'Computer Science & Engineering (CSE)',
      year: student.year || '1st Year',
      section: student.section || 'Section A',
      guardianName: student.guardianName || student.emergencyContactName || 'Guardian',
      guardianPhone: student.guardianPhone || student.emergencyContactNumber || student.mobile || 'Not specified',
      emergencyContactName: student.guardianName || student.emergencyContactName || 'Guardian',
      emergencyContactNumber: student.guardianPhone || student.emergencyContactNumber || student.mobile || 'Not specified',
      hostelOrDayScholar: student.hostelOrDayScholar || 'Hostel Block A',
      bloodGroup: student.bloodGroup || 'O+',
      medicalConditions: student.medicalConditions || 'None reported / Healthy',
      profilePhoto: student.profilePhoto,
    };

    const emergencyPayload = {
      student: student._id,
      studentSnapshot,
      location: {
        latitude: lat,
        longitude: lng,
        accuracy: acc,
        zone: detectedZone,
        address: `${detectedZone}, Stanford Campus Grounds`,
        googleMapsUrl,
      },
      status: 'Pending',
      priority: student.medicalConditions && !student.medicalConditions.toLowerCase().includes('none') ? 'Critical' : 'High',
      assignedResponders: [],
      assignedOfficer: {
        name: 'Pending Dispatch Assignment',
        badgeNumber: 'QUEUE-DISPATCH',
      },
      timestamps: {
        triggeredAt: new Date(),
      },
      locationHistory: [
        { latitude: lat, longitude: lng, accuracy: acc, timestamp: new Date() }
      ]
    };

    // Create Emergency in Store
    const createdEmergency = await store.createEmergency(emergencyPayload);

    // Auto-Assign Responders using Intelligent Routing Engine
    const assigned = await autoAssignResponders(createdEmergency);
    createdEmergency.assignedResponders = assigned;
    await store.updateEmergency(createdEmergency._id, { assignedResponders: assigned });

    // Create notification
    await store.createNotification({
      title: `🚨 EMERGENCY ALERT: ${student.name} (${student.studentId})`,
      message: `SOS Triggered at ${detectedZone}. Blood Group: ${student.bloodGroup}. Responders auto-routed.`,
      type: 'EMERGENCY_TRIGGERED',
      emergencyId: createdEmergency._id,
    });

    // Socket.IO Broadcast to all connected administrators and responders
    try {
      const io = getIO();
      if (io) {
        io.to('admin_room').emit('emergency:new', createdEmergency);
        io.emit('notification:new', {
          id: `notif-${Date.now()}`,
          title: `🚨 EMERGENCY ALERT: ${student.name}`,
          studentName: student.name,
          studentId: student.studentId,
          zone: detectedZone,
          time: new Date().toLocaleTimeString(),
          emergency: createdEmergency,
        });
      }
    } catch (socketErr) {
      console.warn('Socket broadcast error (non-fatal):', socketErr.message);
    }

    // Send Instant SOS Alert Email to Administrator (Non-blocking async)
    try {
      sendAdminEmergencyAlertEmail(createdEmergency).catch(mailErr => {
        console.warn('Admin SOS email alert dispatch note:', mailErr.message);
      });
    } catch (e) {
      console.warn('Admin email trigger exception:', e.message);
    }

    return res.status(201).json({
      success: true,
      message: '🆘 Emergency successfully broadcast to Campus Administration & Response Units.',
      emergency: createdEmergency,
    });
  } catch (error) {
    console.error('Trigger Emergency Error:', error);
    return res.status(500).json({ success: false, message: 'Server error triggering emergency.', error: error.message });
  }
};

// GET /api/emergencies
const getAllEmergencies = async (req, res) => {
  try {
    const emergencies = await store.getAllEmergencies();
    return res.status(200).json({
      success: true,
      count: emergencies.length,
      emergencies,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving emergencies.' });
  }
};

// GET /api/emergencies/:id
const getEmergencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const emergency = await store.getEmergencyById(id);
    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found.' });
    }

    const logs = await store.getEmergencyLogs(id);

    return res.status(200).json({
      success: true,
      emergency,
      logs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving emergency details.' });
  }
};

// PUT /api/emergency/:id/accept
const acceptEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.admin || req.user || { name: 'Campus Safety Officer', badgeNumber: 'OFFICER-01' };

    const emergency = await store.getEmergencyById(id);
    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency record not found.' });
    }

    const updated = await store.updateEmergency(id, {
      status: 'Accepted',
      assignedOfficer: {
        id: admin._id || 'adm-1',
        name: admin.name,
        badgeNumber: admin.badgeNumber || 'DUTY-CHIEF',
        role: admin.role || 'Campus Dispatcher',
      },
      timestamps: {
        ...emergency.timestamps,
        acceptedAt: new Date(),
      },
    });

    await store.addEmergencyLog(id, 'CASE_ACCEPTED', admin.name, {
      officer: admin.name,
      badge: admin.badgeNumber,
    });

    // Real-time Socket Broadcast
    try {
      const io = getIO();
      if (io) {
        io.to('admin_room').emit('emergency:status_change', updated);
        io.to(`student_${emergency.studentSnapshot.studentId}`).emit('emergency:status_change', updated);
        io.emit('emergency:status_change', updated);
      }
    } catch (e) {
      console.warn('Socket status emit warning:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: `Emergency accepted by ${admin.name}.`,
      emergency: updated,
    });
  } catch (error) {
    console.error('Accept Emergency Error:', error);
    return res.status(500).json({ success: false, message: 'Server error accepting emergency.' });
  }
};

// PUT /api/emergency/:id/status (e.g. 'On Route', 'Arrived')
const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const admin = req.admin || req.user || { name: 'Field Responder' };

    if (!['Pending', 'Accepted', 'On Route', 'Arrived', 'Resolved', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid emergency status.' });
    }

    const emergency = await store.getEmergencyById(id);
    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found.' });
    }

    const timestampKey = status === 'On Route' ? 'onRouteAt' : status === 'Arrived' ? 'arrivedAt' : null;

    const timestamps = { ...emergency.timestamps };
    if (timestampKey) {
      timestamps[timestampKey] = new Date();
    }

    const updated = await store.updateEmergency(id, {
      status,
      timestamps,
    });

    await store.addEmergencyLog(id, `STATUS_${status.toUpperCase().replace(' ', '_')}`, admin.name);

    try {
      const io = getIO();
      if (io) {
        io.emit('emergency:status_change', updated);
      }
    } catch (e) {
      console.warn('Socket error:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: `Emergency status updated to ${status}.`,
      emergency: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating emergency status.' });
  }
};

// PUT /api/emergency/:id/resolve
const resolveEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;
    const user = req.user || { name: 'Campus Safety Lead' };

    const emergency = await store.getEmergencyById(id);
    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency record not found.' });
    }

    const updated = await store.updateEmergency(id, {
      status: 'Resolved',
      resolutionNotes: resolutionNotes || 'Incident handled on-scene. Student safety verified and secure.',
      resolvedBy: user.name,
      timestamps: {
        ...emergency.timestamps,
        resolvedAt: new Date(),
      },
    });

    // Free up responders
    if (emergency.assignedResponders) {
      for (const resp of emergency.assignedResponders) {
        await store.updateResponderStatus(resp.responderId, 'Available', null);
      }
    }

    await store.addEmergencyLog(id, 'CASE_RESOLVED', user.name, {
      notes: resolutionNotes,
    });

    try {
      const io = getIO();
      if (io) {
        io.emit('emergency:status_change', updated);
      }
    } catch (e) {
      console.warn('Socket status emit error:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Emergency marked as Resolved and responders released.',
      emergency: updated,
    });
  } catch (error) {
    console.error('Resolve Emergency Error:', error);
    return res.status(500).json({ success: false, message: 'Server error resolving emergency.' });
  }
};

module.exports = {
  triggerEmergency,
  getAllEmergencies,
  getEmergencyById,
  acceptEmergency,
  updateEmergencyStatus,
  resolveEmergency,
};
