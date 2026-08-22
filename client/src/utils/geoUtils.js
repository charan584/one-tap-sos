// Pure Browser Native Geolocation API Utilities
// Single source of truth using navigator.geolocation

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
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
  if (!meters || isNaN(meters)) return '0m';
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
};

export const getGoogleMapsUrl = (lat, lng) => {
  return `https://maps.google.com/?q=${lat},${lng}`;
};

export const formatAccuracy = (accuracyMeters) => {
  if (accuracyMeters === null || accuracyMeters === undefined || isNaN(accuracyMeters)) {
    return 'Accuracy: Unknown';
  }
  return `Your location accuracy: ${Math.round(accuracyMeters)} meters`;
};

/**
 * Obtain user's actual current device location using browser Geolocation API
 * Single Source of Truth
 * @returns {Promise<{ success: boolean, coords?: { latitude: number, longitude: number, accuracy: number, heading?: number, speed?: number }, error?: string, errorCode?: number }>}
 */
export const getDeviceLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: 'Geolocation is not supported by your browser or device.',
        errorCode: 0,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, speed } = position.coords;

        // Requirement 7: Debugging console logs
        console.log('Device latitude:', latitude);
        console.log('Device longitude:', longitude);
        console.log('Location accuracy:', accuracy, 'meters');

        resolve({
          success: true,
          coords: {
            latitude,
            longitude,
            accuracy,
            heading,
            speed,
          },
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let errorMessage = 'An unknown error occurred while retrieving location.';
        switch (error.code) {
          case error.PERMISSION_DENIED: // Code 1
            errorMessage = 'Location permission was denied. Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE: // Code 2
            errorMessage = 'Location information is unavailable from your device GPS.';
            break;
          case error.TIMEOUT: // Code 3
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }

        console.error('Geolocation Error:', error.code, errorMessage);

        resolve({
          success: false,
          error: errorMessage,
          errorCode: error.code,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Standard promise-based helper returning coordinates or throwing exact error
 */
export const getCurrentPosition = async () => {
  const result = await getDeviceLocation();
  if (result.success && result.coords) {
    return {
      latitude: result.coords.latitude,
      longitude: result.coords.longitude,
      accuracy: result.coords.accuracy,
      zone: `GPS (${result.coords.latitude.toFixed(4)}, ${result.coords.longitude.toFixed(4)})`,
      isLiveGps: true,
    };
  }
  throw new Error(result.error || 'Failed to obtain device location.');
};

export default {
  calculateDistance,
  formatDistance,
  getGoogleMapsUrl,
  formatAccuracy,
  getDeviceLocation,
  getCurrentPosition,
};
