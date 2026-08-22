import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Navigation,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Crosshair,
  AlertTriangle,
  LocateFixed,
  RefreshCw,
  User,
  Shield,
  Ruler
} from 'lucide-react';
import {
  getGoogleMapsUrl,
  calculateDistance,
  formatDistance,
  formatAccuracy,
  getDeviceLocation
} from '../../utils/geoUtils';

// Distinct Custom Marker for Student Emergency (Red Glow with Student Photo/Badge)
const createStudentIcon = (name, photo) => {
  return L.divIcon({
    className: 'custom-student-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px;">
          <div style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.5); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: #dc2626; border: 3px solid white; box-shadow: 0 0 20px rgba(220, 38, 38, 1); overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img src="${photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop'}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>
        <div style="margin-top: 2px; padding: 2px 8px; background: rgba(185, 28, 28, 0.95); border-radius: 6px; color: white; font-size: 10px; font-weight: 800; border: 1px solid rgba(255, 255, 255, 0.4); white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          🚨 SOS: ${name}
        </div>
      </div>
    `,
    iconSize: [120, 70],
    iconAnchor: [60, 24],
  });
};

// Distinct Custom Marker for Admin Location (Blue/Indigo with Shield Badge)
const createAdminIcon = (adminName) => {
  return L.divIcon({
    className: 'custom-admin-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(99, 102, 241, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 12px; background: #4f46e5; border: 3px solid white; box-shadow: 0 0 15px rgba(99, 102, 241, 0.9); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">
            🛡️
          </div>
        </div>
        <div style="margin-top: 2px; padding: 2px 8px; background: rgba(15,23,42,0.95); border-radius: 6px; color: #a5b4fc; font-size: 10px; font-weight: 800; border: 1px solid rgba(99, 102, 241, 0.5); white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          👮 Admin: ${adminName || 'You'}
        </div>
      </div>
    `,
    iconSize: [130, 68],
    iconAnchor: [65, 22],
  });
};

export const InteractiveLiveMap = ({
  activeEmergency,
  adminUser,
  className = 'h-96 sm:h-[500px]',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ adminMarker: null, studentMarker: null, polyline: null });

  // Admin device location state
  const [adminLocation, setAdminLocation] = useState(null); // { latitude, longitude, accuracy }
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Request actual current Admin device location using browser native Geolocation API
  const handleGetAdminLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const result = await getDeviceLocation();

      if (result.success && result.coords) {
        setAdminLocation(result.coords);
        setLocationError(null);

        if (mapInstanceRef.current && !hasEmergency) {
          try {
            mapInstanceRef.current.flyTo([result.coords.latitude, result.coords.longitude], 16, {
              duration: 1.5,
            });
          } catch (e) {
            console.warn('Map flyTo error:', e);
          }
        }
      } else {
        setLocationError(result.error || 'Unable to retrieve admin device location.');
      }
    } catch (err) {
      setLocationError('An error occurred while requesting device location.');
    } finally {
      setIsLocating(false);
    }
  };

  // Automatically request admin location on mount
  useEffect(() => {
    handleGetAdminLocation();
  }, []);

  // Check if Student Emergency is actively present
  const hasEmergency = !!(activeEmergency?.location?.latitude && activeEmergency?.location?.longitude);
  const studentLat = hasEmergency ? Number(activeEmergency.location.latitude) : null;
  const studentLng = hasEmergency ? Number(activeEmergency.location.longitude) : null;
  const studentName = activeEmergency?.studentSnapshot?.name || 'Student SOS';
  const studentPhoto = activeEmergency?.studentSnapshot?.profilePhoto;
  const studentId = activeEmergency?.studentSnapshot?.studentId || '25B91A05Q3';
  const studentMedical = activeEmergency?.studentSnapshot?.medicalConditions;

  const adminLat = adminLocation ? adminLocation.latitude : 16.5892;
  const adminLng = adminLocation ? adminLocation.longitude : 81.7556;
  const adminDisplayName = adminUser?.name || 'Charan P';

  // Calculate distance between Admin and Student if both exist
  const distanceMeters = (hasEmergency && studentLat && studentLng && adminLocation)
    ? calculateDistance(adminLocation.latitude, adminLocation.longitude, studentLat, studentLng)
    : null;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet instance safely
    if (!mapInstanceRef.current) {
      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      try {
        const initialCenter = hasEmergency ? [studentLat, studentLng] : [adminLat, adminLng];
        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: 15,
          zoomControl: true,
        });

        // CartoDB Dark Matter Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CartoDB</a> OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet init warning:', err);
      }
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      // 2. Clear previous markers and route lines
      if (markersRef.current.adminMarker && map.hasLayer(markersRef.current.adminMarker)) {
        map.removeLayer(markersRef.current.adminMarker);
      }
      if (markersRef.current.studentMarker && map.hasLayer(markersRef.current.studentMarker)) {
        map.removeLayer(markersRef.current.studentMarker);
      }
      if (markersRef.current.polyline && map.hasLayer(markersRef.current.polyline)) {
        map.removeLayer(markersRef.current.polyline);
      }

      // 3. Add Admin Location Pin (Blue/Indigo Shield)
      const adminMarker = L.marker([adminLat, adminLng], {
        icon: createAdminIcon(adminDisplayName),
      }).addTo(map);

      adminMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <div style="color: #818cf8; font-weight: 800; font-size: 12px;">🛡️ ADMIN COMMAND CENTER (YOU)</div>
          <div style="color: white; font-weight: bold; font-size: 14px;">${adminDisplayName}</div>
          <div style="color: #94a3b8; font-size: 11px;">Status: Active & Monitoring</div>
          <div style="margin-top: 6px; font-family: monospace; font-size: 11px; color: #38bdf8;">
            ${adminLat.toFixed(6)}, ${adminLng.toFixed(6)}
          </div>
        </div>
      `);

      markersRef.current.adminMarker = adminMarker;

      // 4. Add Student Emergency Pin (Red SOS Beacon) if emergency exists
      if (hasEmergency && studentLat && studentLng) {
        const studentMarker = L.marker([studentLat, studentLng], {
          icon: createStudentIcon(studentName, studentPhoto),
        }).addTo(map);

        studentMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="color: #ef4444; font-weight: 800; font-size: 12px;">🚨 SOS EMERGENCY BEACON</div>
            <div style="color: white; font-weight: bold; font-size: 14px;">${studentName}</div>
            <div style="color: #cbd5e1; font-size: 11px;">Student ID: <b>${studentId}</b></div>
            ${studentMedical ? `<div style="color: #f87171; font-size: 11px; margin-top: 2px;">⚠️ ${studentMedical}</div>` : ''}
            <div style="margin-top: 6px; font-family: monospace; font-size: 11px; color: #ef4444;">
              ${studentLat.toFixed(6)}, ${studentLng.toFixed(6)}
            </div>
          </div>
        `);

        markersRef.current.studentMarker = studentMarker;

        // 5. Draw Tactical Line Connecting Admin (Blue) to Student (Red)
        const polyline = L.polyline(
          [
            [adminLat, adminLng],
            [studentLat, studentLng],
          ],
          {
            color: '#ef4444',
            weight: 3.5,
            dashArray: '8, 8',
            opacity: 0.9,
          }
        ).addTo(map);

        markersRef.current.polyline = polyline;

        // 6. Auto-fit map bounds to show BOTH pins comfortably
        const bounds = L.latLngBounds([
          [adminLat, adminLng],
          [studentLat, studentLng],
        ]);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 });
      } else {
        // If only admin exists, pan to admin
        map.setView([adminLat, adminLng], 15, { animate: false });
      }
    } catch (err) {
      console.warn('Leaflet render warning:', err);
    }

  }, [adminLat, adminLng, adminDisplayName, hasEmergency, studentLat, studentLng, studentName, studentPhoto, studentId, studentMedical]);

  // Clean up Leaflet on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const studentMapsUrl = studentLat && studentLng ? getGoogleMapsUrl(studentLat, studentLng) : null;
  const adminMapsUrl = getGoogleMapsUrl(adminLat, adminLng);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      
      {/* Top Map Header Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Status Pills */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Admin Location Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-indigo-500/50 backdrop-blur-xl shadow-lg text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-bold text-white">Admin GPS</span>
            <span className="text-[10px] text-indigo-300 font-mono">
              ({adminLat.toFixed(4)}, {adminLng.toFixed(4)})
            </span>
          </div>

          {/* Student Status Badge */}
          {hasEmergency ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/95 border border-red-500/80 backdrop-blur-xl shadow-lg text-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              <span className="font-bold text-white">Student SOS: {studentName}</span>
              <span className="text-[10px] text-red-300 font-mono">
                ({studentLat.toFixed(4)}, {studentLng.toFixed(4)})
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Campus Secure • No Active SOS</span>
            </div>
          )}
        </div>

        {/* Action Controls: Refresh GPS & Google Maps */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleGetAdminLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            title="Detect Exact Admin Device GPS"
          >
            {isLocating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5" />
            )}
            <span>{isLocating ? 'Locating Admin...' : 'Locate Admin'}</span>
          </button>

          {(studentMapsUrl || adminMapsUrl) && (
            <a
              href={studentMapsUrl || adminMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{hasEmergency ? 'Navigate to Student' : 'Google Maps'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Permission Denied / Error Banner */}
      {locationError && (
        <div className="absolute top-16 left-3 right-3 z-[1000] p-3.5 rounded-xl bg-red-950/95 border border-red-500/80 backdrop-blur-xl text-xs text-red-200 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>⚠️ {locationError}</span>
          </div>
          <button
            onClick={handleGetAdminLocation}
            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shrink-0 cursor-pointer"
          >
            Retry GPS
          </button>
        </div>
      )}

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className={`w-full ${className}`} />

      {/* Bottom Live Pin Legend & Distance Telemetry Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] p-3 rounded-xl bg-slate-900/95 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        
        {/* Pins Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-indigo-600 border border-white flex items-center justify-center text-[8px] text-white">
              🛡️
            </span>
            <span className="font-bold text-indigo-300">Admin Location</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white flex items-center justify-center text-[8px] text-white animate-pulse">
              🚨
            </span>
            <span className="font-bold text-red-300">Student SOS Pin</span>
          </div>
        </div>

        {/* Distance Indicator if Emergency is Active */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          {hasEmergency && distanceMeters !== null && (
            <span className="text-amber-300 font-bold bg-amber-950/70 px-2.5 py-1 rounded border border-amber-500/30 flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5 text-amber-400" />
              <span>Straight-Line Distance: {formatDistance(distanceMeters)}</span>
            </span>
          )}

          <span className="text-emerald-400 font-bold bg-emerald-950/70 px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-emerald-400" />
            <span>{formatAccuracy(adminLocation?.accuracy)}</span>
          </span>
        </div>
      </div>

    </div>
  );
};

export default InteractiveLiveMap;
