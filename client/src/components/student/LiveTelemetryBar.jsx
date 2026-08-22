import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Wifi, BatteryCharging, Compass, Navigation } from 'lucide-react';
import { CAMPUS_PRESETS } from '../../utils/geoUtils';

export const LiveTelemetryBar = ({ currentCoords, onLocationChange }) => {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(94);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full space-y-3">
      {/* Top Telemetry Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
        
        {/* Live Date & Time */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Local Time</span>
            <span className="font-mono font-bold text-white tracking-wider">
              {time.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Live Coordinates */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex flex-col truncate">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Live GPS</span>
            <span className="font-mono font-bold text-slate-200 truncate">
              {currentCoords.latitude.toFixed(4)}, {currentCoords.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Network Status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Wifi className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Network</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              5G Campus Ultra
            </span>
          </div>
        </div>

        {/* Battery & Hardware */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <BatteryCharging className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Telemetry</span>
            <span className="font-semibold text-amber-300">
              {batteryLevel}% • ±{currentCoords.accuracy || 4}m Acc.
            </span>
          </div>
        </div>
      </div>

      {/* Campus Geofence Landmark Selector (Allows instant zone simulation during demo) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <MapPin className="w-4 h-4 text-red-500 animate-bounce" />
          <span>Current Zone:</span>
          <span className="font-bold text-white px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
            {currentCoords.zone || 'Main Campus Quad'}
          </span>
        </div>

        {/* Quick Simulation Landmark Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Simulate Location:</span>
          <select
            value={currentCoords.zone}
            onChange={(e) => {
              const preset = CAMPUS_PRESETS.find(p => p.zone === e.target.value);
              if (preset && onLocationChange) {
                onLocationChange({
                  latitude: preset.latitude,
                  longitude: preset.longitude,
                  accuracy: 3,
                  zone: preset.zone,
                });
              }
            }}
            className="bg-slate-900 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            {CAMPUS_PRESETS.map((p) => (
              <option key={p.id} value={p.zone}>
                📍 {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LiveTelemetryBar;
