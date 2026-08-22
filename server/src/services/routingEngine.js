const store = require('./store');

// Haversine distance calculator in meters
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Calculate dynamic ETA in minutes (avg speed 25 km/h on campus = ~7 m/s + 45s dispatch lag)
function calculateEtaMinutes(distanceMeters) {
  const travelSeconds = distanceMeters / 7;
  const totalMinutes = Math.max(1, Math.round((travelSeconds + 45) / 60));
  return totalMinutes;
}

// Match closest campus landmark zone if not provided
async function detectCampusZone(lat, lng) {
  const locations = await store.getAllLocations();
  let closestLocation = locations[0];
  let minDistance = Infinity;

  for (const loc of locations) {
    const dist = calculateDistanceMeters(lat, lng, loc.latitude, loc.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closestLocation = loc;
    }
  }

  if (minDistance <= closestLocation.radiusMeters + 100) {
    return closestLocation.name;
  }
  return 'University Campus Grounds';
}

/**
 * Tri-Tier Intelligent Emergency Auto-Routing Engine
 * Automatically assigns:
 * 1. Campus Security Patrol (closest available unit)
 * 2. Campus Administration Dispatch Officer
 * 3. Rapid Medical Response Unit (with medical alert triage)
 */
async function autoAssignResponders(emergency) {
  const responders = await store.getAllResponders();
  const studentLat = emergency.location.latitude;
  const studentLng = emergency.location.longitude;

  const assigned = [];

  // 1. Security Patrol selection
  const securityUnits = responders
    .filter(r => r.role === 'Campus Security Patrol')
    .map(r => ({
      ...r,
      distance: calculateDistanceMeters(studentLat, studentLng, r.currentLocation.latitude, r.currentLocation.longitude)
    }))
    .sort((a, b) => a.distance - b.distance);

  const primarySecurity = securityUnits[0] || responders[0];
  if (primarySecurity) {
    const eta = calculateEtaMinutes(primarySecurity.distance || 350);
    assigned.push({
      responderId: primarySecurity._id,
      name: primarySecurity.name,
      role: primarySecurity.role,
      callSign: primarySecurity.callSign,
      phone: primarySecurity.phone,
      status: 'Assigned',
      assignedAt: new Date(),
      etaMinutes: eta,
    });
    await store.updateResponderStatus(primarySecurity._id, 'Dispatched', emergency._id);
  }

  // 2. Medical Response Team
  const medicalUnits = responders
    .filter(r => r.role === 'Rapid Medical Response')
    .map(r => ({
      ...r,
      distance: calculateDistanceMeters(studentLat, studentLng, r.currentLocation.latitude, r.currentLocation.longitude)
    }))
    .sort((a, b) => a.distance - b.distance);

  const primaryMedical = medicalUnits[0];
  if (primaryMedical) {
    const eta = calculateEtaMinutes(primaryMedical.distance || 500);
    assigned.push({
      responderId: primaryMedical._id,
      name: primaryMedical.name,
      role: primaryMedical.role,
      callSign: primaryMedical.callSign,
      phone: primaryMedical.phone,
      status: 'Assigned',
      assignedAt: new Date(),
      etaMinutes: eta + 1,
    });
    await store.updateResponderStatus(primaryMedical._id, 'Dispatched', emergency._id);
  }

  // 3. Admin Dispatcher
  const dispatchLead = responders.find(r => r.role === 'Administration Dispatch');
  if (dispatchLead) {
    assigned.push({
      responderId: dispatchLead._id,
      name: dispatchLead.name,
      role: dispatchLead.role,
      callSign: dispatchLead.callSign,
      phone: dispatchLead.phone,
      status: 'Monitoring',
      assignedAt: new Date(),
      etaMinutes: 1,
    });
  }

  return assigned;
}

module.exports = {
  calculateDistanceMeters,
  calculateEtaMinutes,
  detectCampusZone,
  autoAssignResponders,
};
