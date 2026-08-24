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
  Ruler,
  Layers,
  Globe
} from 'lucide-react';
import {
  getGoogleMapsUrl,
  calculateDistance,
  formatDistance,
  formatAccuracy,
  getDeviceLocation
} from '../../utils/geoUtils';

// Distinct Custom Marker for Student Emergency (Red Glow with Student Photo/Badge & Exact Coordinates)
const createStudentIcon = (name, photo, lat, lng) => {
  return L.divIcon({
    className: 'custom-student-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px;">
          <div style="position: absolute; width: 50px; height: 50px; border-radius: 50%; background: rgba(239, 68, 68, 0.5); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: #dc2626; border: 3px solid white; box-shadow: 0 0 20px rgba(220, 38, 38, 1); overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img src="${photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop'}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>
        <div style="margin-top: 2px; padding: 3px 8px; background: rgba(185, 28, 28, 0.95); border-radius: 6px; color: white; font-size: 10px; font-weight: 800; border: 1px solid rgba(255, 255, 255, 0.5); white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.6); text-align: center;">
          <div>🚨 SOS: ${name}</div>
          <div style="font-size: 8.5px; opacity: 0.9; font-family: monospace;">${lat ? lat.toFixed(5) : ''}, ${lng ? lng.toFixed(5) : ''}</div>
        </div>
      </div>
    `,
    iconSize: [140, 78],
    iconAnchor: [70, 25],
  });
};

// Distinct Custom Marker for Admin Location (Blue/Indigo with Shield Badge & Exact Coordinates)
const createAdminIcon = (adminName, lat, lng) => {
  return L.divIcon({
    className: 'custom-admin-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 46px; height: 46px;">
          <div style="position: absolute; width: 46px; height: 46px; border-radius: 50%; background: rgba(99, 102, 241, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 12px; background: #4f46e5; border: 3px solid white; box-shadow: 0 0 18px rgba(99, 102, 241, 1); display: flex; align-items: center; justify-content: center; color: white; font-size: 17px;">
            🛡️
          </div>
        </div>
        <div style="margin-top: 2px; padding: 3px 8px; background: rgba(15,23,42,0.95); border-radius: 6px; color: #a5b4fc; font-size: 10px; font-weight: 800; border: 1px solid rgba(99, 102, 241, 0.6); white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.6); text-align: center;">
          <div>👮 Admin: ${adminName || 'You'}</div>
          <div style="font-size: 8.5px; opacity: 0.9; color: #38bdf8; font-family: monospace;">${lat ? lat.toFixed(5) : ''}, ${lng ? lng.toFixed(5) : ''}</div>
        </div>
      </div>
    `,
    iconSize: [140, 76],
    iconAnchor: [70, 23],
  });
};

const MAP_LAYERS = {
  googleStreets: {
    id: 'googleStreets',
    label: 'Google Streets',
    icon: '🗺️',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  googleHybrid: {
    id: 'googleHybrid',
    label: 'Google Satellite',
    icon: '🛰️',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Satellite Imagery',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  googleTerrain: {
    id: 'googleTerrain',
    label: 'Google Terrain',
    icon: '⛰️',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  darkTactical: {
    id: 'darkTactical',
    label: 'Tactical Dark',
    icon: '🌙',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB OpenStreetMap',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
};

export const InteractiveLiveMap = ({
  activeEmergency,
  adminUser,
  className = 'h-96 sm:h-[520px]',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({ adminMarker: null, studentMarker: null, polyline: null });

  // Map Style Mode: 'googleStreets' | 'googleHybrid' | 'googleTerrain' | 'darkTactical'
  const [activeLayer, setActiveLayer] = useState('googleStreets');

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
  const studentZone = activeEmergency?.location?.zone || 'Campus Perimeter';
  const studentName = activeEmergency?.studentSnapshot?.name || 'Student SOS';
  const studentPhoto = activeEmergency?.studentSnapshot?.profilePhoto;
  const studentId = activeEmergency?.studentSnapshot?.studentId || '25B91A05Q3';
  const studentMedical = activeEmergency?.studentSnapshot?.medicalConditions;

  const adminLat = adminLocation ? adminLocation.latitude : 16.5449;
  const adminLng = adminLocation ? adminLocation.longitude : 81.5212;
  const adminDisplayName = adminUser?.name || 'Charan P';

  // Calculate distance between Admin and Student if both exist
  const distanceMeters = (hasEmergency && studentLat && studentLng && adminLocation)
    ? calculateDistance(adminLocation.latitude, adminLocation.longitude, studentLat, studentLng)
    : null;

  // 1. Initialize and manage Leaflet Map with Google Maps tile layer
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      try {
        const initialCenter = hasEmergency ? [studentLat, studentLng] : [adminLat, adminLng];
        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: 16,
          zoomControl: false, // Custom placed zoom control
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Add selected tile layer (Default: Google Maps Streets)
        const currentLayerConfig = MAP_LAYERS[activeLayer] || MAP_LAYERS.googleStreets;
        const tileLayer = L.tileLayer(currentLayerConfig.url, {
          attribution: currentLayerConfig.attribution,
          maxZoom: currentLayerConfig.maxZoom,
          subdomains: currentLayerConfig.subdomains,
        }).addTo(map);

        tileLayerRef.current = tileLayer;
        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet init warning:', err);
      }
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Update tile layer if activeLayer changes
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const layerConfig = MAP_LAYERS[activeLayer] || MAP_LAYERS.googleStreets;
    const newTileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom,
      subdomains: layerConfig.subdomains,
    }).addTo(map);
    tileLayerRef.current = newTileLayer;

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

      // 3. Add Admin Location Pin (Blue/Indigo Shield with GPS Coordinates)
      const adminMarker = L.marker([adminLat, adminLng], {
        icon: createAdminIcon(adminDisplayName, adminLat, adminLng),
      }).addTo(map);

      adminMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 6px; min-width: 190px;">
          <div style="color: #4f46e5; font-weight: 900; font-size: 11px; text-transform: uppercase;">🛡️ Admin Command Center</div>
          <div style="color: #0f172a; font-weight: 800; font-size: 14px; margin-top: 2px;">${adminDisplayName}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">Status: Active EOC Dispatcher</div>
          <div style="margin-top: 8px; padding: 4px 6px; background: #e0e7ff; border-radius: 6px; font-family: monospace; font-size: 11px; color: #3730a3; font-weight: bold;">
            📍 Lat: ${adminLat.toFixed(6)}°<br>📍 Lng: ${adminLng.toFixed(6)}°
          </div>
        </div>
      `);

      markersRef.current.adminMarker = adminMarker;

      // 4. Add Student Emergency Pin (Red SOS Beacon with GPS Coordinates) if emergency exists
      if (hasEmergency && studentLat && studentLng) {
        const studentMarker = L.marker([studentLat, studentLng], {
          icon: createStudentIcon(studentName, studentPhoto, studentLat, studentLng),
        }).addTo(map);

        studentMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 6px; min-width: 210px;">
            <div style="color: #dc2626; font-weight: 900; font-size: 11px; text-transform: uppercase;">🚨 ACTIVE SOS BEACON</div>
            <div style="color: #0f172a; font-weight: 800; font-size: 15px; margin-top: 2px;">${studentName}</div>
            <div style="color: #475569; font-size: 11px;">Roll No: <b>${studentId}</b> • Zone: <b>${studentZone}</b></div>
            ${studentMedical ? `<div style="color: #b91c1c; font-size: 11px; font-weight: bold; margin-top: 4px; background: #fee2e2; padding: 2px 6px; border-radius: 4px;">⚠️ ${studentMedical}</div>` : ''}
            <div style="margin-top: 8px; padding: 4px 6px; background: #fee2e2; border-radius: 6px; font-family: monospace; font-size: 11px; color: #991b1b; font-weight: bold;">
              📍 Lat: ${studentLat.toFixed(6)}°<br>📍 Lng: ${studentLng.toFixed(6)}°
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
            color: '#dc2626',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.95,
          }
        ).addTo(map);

        markersRef.current.polyline = polyline;

        // 6. Auto-fit map bounds based on exact Longitudes and Latitudes
        const bounds = L.latLngBounds([
          [adminLat, adminLng],
          [studentLat, studentLng],
        ]);
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 17 });
      } else {
        // If only admin exists, center precisely on admin's latitude/longitude
        map.setView([adminLat, adminLng], 16, { animate: false });
      }
    } catch (err) {
      console.warn('Leaflet render warning:', err);
    }

  }, [activeLayer, adminLat, adminLng, adminDisplayName, hasEmergency, studentLat, studentLng, studentName, studentPhoto, studentId, studentMedical, studentZone]);

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
        
        {/* Status Pills & Exact Longitude/Latitude Telemetry */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {/* Admin Location Badge with Exact Lat/Lng */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-indigo-500/50 backdrop-blur-xl shadow-lg text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-bold text-white">Admin GPS</span>
            <span className="text-[10px] text-indigo-300 font-mono font-bold bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">
              {adminLat.toFixed(5)}° N, {adminLng.toFixed(5)}° E
            </span>
          </div>

          {/* Student Status Badge with Exact Lat/Lng */}
          {hasEmergency ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/95 border border-red-500/80 backdrop-blur-xl shadow-lg text-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              <span className="font-bold text-white">SOS: {studentName}</span>
              <span className="text-[10px] text-red-200 font-mono font-bold bg-red-900/80 px-1.5 py-0.5 rounded border border-red-500/40">
                {studentLat.toFixed(5)}° N, {studentLng.toFixed(5)}° E
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Campus Secure • Ready for Dispatch</span>
            </div>
          )}
        </div>

        {/* Action Controls: Google Maps View Layer Switcher, GPS Refresh, Navigation */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          
          {/* Google Maps Layer Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl shadow-lg text-xs gap-1">
            {Object.values(MAP_LAYERS).map((layer) => {
              const isSelected = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                  title={`Switch to ${layer.label}`}
                >
                  <span>{layer.icon}</span>
                  <span className="hidden md:inline">{layer.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleGetAdminLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            title="Detect Exact Admin Device GPS Coordinates"
          >
            {isLocating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5" />
            )}
            <span>{isLocating ? 'Locating...' : 'Locate Admin'}</span>
          </button>

          {(studentMapsUrl || adminMapsUrl) && (
            <a
              href={studentMapsUrl || adminMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
              title="Open Exact Coordinates in Google Maps App"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{hasEmergency ? 'Open Google Maps' : 'Google Maps'}</span>
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

      {/* Bottom Live Pin Legend & Longitude/Latitude Telemetry Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] p-3 rounded-xl bg-slate-900/95 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        
        {/* Pins Legend with Precise Lat/Lng coordinates */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-indigo-600 border border-white flex items-center justify-center text-[8px] text-white">
              🛡️
            </span>
            <span className="font-bold text-indigo-300">Admin Location</span>
            <span className="font-mono text-[10px] text-slate-400">({adminLat.toFixed(5)}, {adminLng.toFixed(5)})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white flex items-center justify-center text-[8px] text-white animate-pulse">
              🚨
            </span>
            <span className="font-bold text-red-300">Student SOS Beacon</span>
            {hasEmergency && (
              <span className="font-mono text-[10px] text-red-400 font-semibold">({studentLat.toFixed(5)}, {studentLng.toFixed(5)})</span>
            )}
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
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>GPS Accuracy: {formatAccuracy(adminLocation?.accuracy)}</span>
          </span>
        </div>
      </div>

    </div>
  );
};

export default InteractiveLiveMap;
