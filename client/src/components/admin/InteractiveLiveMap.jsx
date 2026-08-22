import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, MapPin, Truck, ExternalLink, Compass, ShieldAlert } from 'lucide-react';
import { getGoogleMapsUrl, formatDistance, calculateDistance } from '../../utils/geoUtils';

// Custom Map HTML Icons
const createStudentIcon = (name, photo) => {
  return L.divIcon({
    className: 'custom-student-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: #dc2626; border: 3px solid white; box-shadow: 0 0 15px rgba(220, 38, 38, 0.9); overflow: hidden; display: flex; align-items: center; justify-content: center;">
          <img src="${photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop'}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

const createResponderIcon = (role, callSign) => {
  const isMed = role.includes('Medical');
  const bg = isMed ? '#06b6d4' : '#6366f1';
  const emoji = isMed ? '🚑' : '🚔';

  return L.divIcon({
    className: 'custom-responder-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="width: 32px; height: 32px; border-radius: 10px; background: ${bg}; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          ${emoji}
        </div>
        <div style="margin-top: 2px; padding: 1px 4px; background: rgba(15,23,42,0.9); border-radius: 4px; color: white; font-size: 9px; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;">
          ${callSign}
        </div>
      </div>
    `,
    iconSize: [32, 48],
    iconAnchor: [16, 24],
  });
};

export const InteractiveLiveMap = ({
  activeEmergency,
  responders = [],
  className = 'h-96 sm:h-[450px]',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ student: null, responders: [], polyline: null });

  const studentLat = activeEmergency?.location?.latitude || 37.4275;
  const studentLng = activeEmergency?.location?.longitude || -122.1697;
  const studentName = activeEmergency?.studentSnapshot?.name || 'Active SOS';
  const studentPhoto = activeEmergency?.studentSnapshot?.profilePhoto;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [studentLat, studentLng],
        zoom: 16,
        zoomControl: true,
      });

      // CartoDB Dark Matter Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a> OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    if (markersRef.current.student) map.removeLayer(markersRef.current.student);
    markersRef.current.responders.forEach(m => map.removeLayer(m));
    markersRef.current.responders = [];
    if (markersRef.current.polyline) map.removeLayer(markersRef.current.polyline);

    // 1. Add Student Marker
    const studentMarker = L.marker([studentLat, studentLng], {
      icon: createStudentIcon(studentName, studentPhoto),
    }).addTo(map);

    studentMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <div style="color: #ef4444; font-weight: 800; font-size: 12px;">🚨 SOS BEACON ACTIVE</div>
        <div style="color: white; font-weight: bold; font-size: 14px;">${studentName}</div>
        <div style="color: #94a3b8; font-size: 11px;">${activeEmergency?.location?.zone || 'Campus Grounds'}</div>
        <div style="margin-top: 6px; font-family: monospace; font-size: 11px; color: #38bdf8;">
          ${studentLat.toFixed(5)}, ${studentLng.toFixed(5)}
        </div>
      </div>
    `);

    markersRef.current.student = studentMarker;

    // 2. Add Responder Markers & Route Polyline
    let closestResponder = null;
    let minDistance = Infinity;

    responders.forEach((resp) => {
      const rLat = resp.currentLocation?.latitude;
      const rLng = resp.currentLocation?.longitude;
      if (!rLat || !rLng) return;

      const marker = L.marker([rLat, rLng], {
        icon: createResponderIcon(resp.role, resp.callSign),
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <div style="color: #818cf8; font-weight: bold; font-size: 12px;">${resp.role}</div>
          <div style="color: white; font-weight: bold; font-size: 13px;">${resp.name}</div>
          <div style="color: #cbd5e1; font-size: 11px;">Status: <b>${resp.status}</b></div>
        </div>
      `);

      markersRef.current.responders.push(marker);

      const dist = calculateDistance(studentLat, studentLng, rLat, rLng);
      if (dist < minDistance) {
        minDistance = dist;
        closestResponder = resp;
      }
    });

    // 3. Draw Tactical Route Line from Closest Responder to Student
    if (closestResponder && closestResponder.currentLocation) {
      const rLat = closestResponder.currentLocation.latitude;
      const rLng = closestResponder.currentLocation.longitude;

      const polyline = L.polyline(
        [
          [rLat, rLng],
          [studentLat, studentLng],
        ],
        {
          color: '#ef4444',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.85,
        }
      ).addTo(map);

      markersRef.current.polyline = polyline;
    }

    // Pan map smoothly to student coordinates
    map.panTo([studentLat, studentLng], { animate: true, duration: 1 });

  }, [studentLat, studentLng, responders, activeEmergency]);

  const mapsUrl = getGoogleMapsUrl(studentLat, studentLng);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      
      {/* Top Map Header Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Status Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-lg text-xs">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="font-bold text-white">Live Incident Radar</span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({studentLat.toFixed(4)}, {studentLng.toFixed(4)})
          </span>
        </div>

        {/* Google Maps External Navigation Link */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all"
        >
          <Navigation className="w-3.5 h-3.5" />
          Google Maps Navigation
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className={`w-full ${className}`} />

      {/* Bottom Route Status Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-white">Student Target:</span>
          <span>{activeEmergency?.location?.zone || 'Campus Quad'}</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-indigo-400">
            🛡️ {responders.length} Active Patrol Units Stationed
          </span>
          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            5-Sec GPS Sync Live
          </span>
        </div>
      </div>

    </div>
  );
};

export default InteractiveLiveMap;
