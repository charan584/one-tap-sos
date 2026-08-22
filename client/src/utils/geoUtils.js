// Campus Preset Locations
export const CAMPUS_PRESETS = [
  { id: 'loc-1', name: 'Main Campus Quad', latitude: 37.4275, longitude: -122.1697, zone: 'Main Campus Quad' },
  { id: 'loc-2', name: 'Green Library (2nd Floor)', latitude: 37.4268, longitude: -122.1662, zone: 'Green Library' },
  { id: 'loc-3', name: 'Gates Computer Science Building', latitude: 37.4300, longitude: -122.1732, zone: 'Gates CS Labs' },
  { id: 'loc-4', name: 'Hostel Block C (East Residence)', latitude: 37.4240, longitude: -122.1740, zone: 'Hostel Block C' },
  { id: 'loc-5', name: 'Sports & Aquatic Recreation Complex', latitude: 37.4315, longitude: -122.1620, zone: 'Sports Complex' },
  { id: 'loc-6', name: 'Vaden Health Center', latitude: 37.4230, longitude: -122.1660, zone: 'Infirmary Wing' },
];

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
};

export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
};

export const getGoogleMapsUrl = (lat, lng) => {
  return `https://maps.google.com/?q=${lat},${lng}`;
};

export const getCurrentPosition = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: 37.4275,
        longitude: -122.1697,
        accuracy: 5,
        zone: 'Main Campus Quad',
        isSimulated: true,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy || 5),
          zone: 'Live GPS Pinpoint',
          isSimulated: false,
        });
      },
      (error) => {
        console.warn('Browser GPS unavailable, using Stanford Campus base coordinates:', error.message);
        resolve({
          latitude: 37.4275,
          longitude: -122.1697,
          accuracy: 5,
          zone: 'Main Campus Quad',
          isSimulated: true,
        });
      },
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 10000 }
    );
  });
};
