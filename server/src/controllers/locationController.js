const store = require('../services/store');
const { getIO } = require('../socket/socketHandler');

// POST /api/location/update
const updateLiveLocation = async (req, res) => {
  try {
    const { emergencyId, latitude, longitude, accuracy, zone } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and Longitude are required.' });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    let updatedEmergency = null;
    if (emergencyId) {
      const emergency = await store.getEmergencyById(emergencyId);
      if (emergency) {
        const locationHistory = emergency.locationHistory || [];
        locationHistory.push({
          latitude: lat,
          longitude: lng,
          accuracy: accuracy || 5,
          timestamp: new Date(),
        });

        updatedEmergency = await store.updateEmergency(emergencyId, {
          location: {
            ...emergency.location,
            latitude: lat,
            longitude: lng,
            accuracy: accuracy || 5,
            zone: zone || emergency.location.zone,
            googleMapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
          },
          locationHistory,
        });
      }
    }

    // Broadcast live telemetry update over Socket.IO to Admin dispatch maps
    try {
      const io = getIO();
      if (io) {
        io.emit('student:location_update', {
          emergencyId,
          latitude: lat,
          longitude: lng,
          accuracy: accuracy || 5,
          zone: zone || (updatedEmergency ? updatedEmergency.location.zone : 'Campus Area'),
          timestamp: new Date(),
        });
      }
    } catch (e) {
      console.warn('Location broadcast socket warning:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Live GPS telemetry received and synchronized.',
      coordinates: { latitude: lat, longitude: lng },
      emergency: updatedEmergency,
    });
  } catch (error) {
    console.error('Location Update Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating location.' });
  }
};

module.exports = {
  updateLiveLocation,
};
