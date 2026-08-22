const store = require('../services/store');
const { getIO } = require('../socket/socketHandler');

// GET /api/responders
const getResponders = async (req, res) => {
  try {
    const responders = await store.getAllResponders();
    return res.status(200).json({ success: true, responders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving responders.' });
  }
};

// POST /api/responders/simulate-movement
// Moves a responder slightly closer to the destination for smooth real-time tracking demonstrations
const simulateResponderMovement = async (req, res) => {
  try {
    const { responderId, targetLat, targetLng } = req.body;
    const responders = await store.getAllResponders();
    const resp = responders.find(r => r._id === responderId);

    if (!resp) {
      return res.status(404).json({ success: false, message: 'Responder not found.' });
    }

    if (targetLat && targetLng) {
      // Step 20% closer towards target
      const currentLat = resp.currentLocation.latitude;
      const currentLng = resp.currentLocation.longitude;

      const newLat = currentLat + (Number(targetLat) - currentLat) * 0.25;
      const newLng = currentLng + (Number(targetLng) - currentLng) * 0.25;

      resp.currentLocation = {
        ...resp.currentLocation,
        latitude: Number(newLat.toFixed(6)),
        longitude: Number(newLng.toFixed(6)),
      };

      try {
        const io = getIO();
        if (io) {
          io.emit('responder:location_update', {
            responderId: resp._id,
            callSign: resp.callSign,
            name: resp.name,
            role: resp.role,
            currentLocation: resp.currentLocation,
          });
        }
      } catch (e) {}
    }

    return res.status(200).json({ success: true, responder: resp });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Simulation error.' });
  }
};

module.exports = {
  getResponders,
  simulateResponderMovement,
};
