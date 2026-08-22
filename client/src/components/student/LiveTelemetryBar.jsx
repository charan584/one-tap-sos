import React, { useState, useEffect } from 'react';
import { Clock, Wifi, BatteryCharging, Navigation, Crosshair, RefreshCw, AlertCircle } from 'lucide-react';
import { formatAccuracy } from '../../utils/geoUtils';

export const LiveTelemetryBar = ({ currentCoords, onRefreshLocation, isLocating = false, locationError = null }) => {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(94);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hasValidCoords = currentCoords && currentCoords.latitude !== undefined && currentCoords.longitude !== undefined;

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

        {/* Live GPS Coordinates */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex flex-col truncate">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Live GPS</span>
            <span className="font-mono font-bold text-slate-200 truncate">
              {hasValidCoords
                ? `${currentCoords.latitude.toFixed(6)}, ${currentCoords.longitude.toFixed(6)}`
                : 'Acquiring GPS...'}
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
              {batteryLevel}% • High-Precision
            </span>
          </div>
        </div>
      </div>

      {/* Accuracy Indicator & Real-Time GPS Pinpoint Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">GPS Accuracy:</span>
          <span className="font-bold text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
            {formatAccuracy(currentCoords?.accuracy)}
          </span>
        </div>

        {onRefreshLocation && (
          <button
            onClick={onRefreshLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : 'Refresh Device GPS'}</span>
          </button>
        )}
      </div>

      {/* Geolocation Error Banner if Permission Denied or Failed */}
      {locationError && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-xs text-red-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>⚠️ {locationError}</span>
          </div>
          {onRefreshLocation && (
            <button
              onClick={onRefreshLocation}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shrink-0 cursor-pointer"
            >
              Grant Permission
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveTelemetryBar;
