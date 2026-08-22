import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Users,
  Volume2,
  VolumeX,
  PhoneCall,
  ExternalLink,
  Navigation,
  Activity,
  HeartPulse
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/EmergencyBadge';
import { useSound } from '../../context/SoundContext';

export const ActiveEmergencyRadar = ({
  emergency,
  onResolve,
  currentCoords,
  lastGpsUpdate,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { isMuted, toggleMute, playEmergencySiren, stopEmergencySiren } = useSound();
  const [isSirenActive, setIsSirenActive] = useState(false);

  // Track elapsed emergency time
  useEffect(() => {
    const startTime = emergency?.timestamps?.triggeredAt
      ? new Date(emergency.timestamps.triggeredAt).getTime()
      : Date.now();

    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(Math.max(0, diff));
    }, 1000);

    return () => clearInterval(timer);
  }, [emergency]);

  const toggleSiren = () => {
    if (isSirenActive) {
      stopEmergencySiren();
      setIsSirenActive(false);
    } else {
      playEmergencySiren();
      setIsSirenActive(true);
    }
  };

  useEffect(() => {
    return () => {
      stopEmergencySiren();
    };
  }, []);

  const formatElapsed = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const steps = ['Pending', 'Accepted', 'On Route', 'Arrived', 'Resolved'];
  const currentStepIdx = steps.indexOf(emergency?.status || 'Pending');

  return (
    <div className="w-full space-y-6">
      
      {/* Top Urgent Alert Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-950 p-6 sm:p-8 text-white shadow-2xl shadow-red-600/40 border-2 border-red-400">
        
        {/* Animated Background Radar */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-red-100 bg-red-900/60 px-3 py-1 rounded-full border border-red-400/40">
                🚨 SOS ACTIVE & BROADCASTING
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Emergency Dispatched
            </h1>
            <p className="text-sm text-red-100 max-w-lg">
              Campus Security, Medical Team, and Emergency Dispatch have received your exact GPS coordinates and vital health data.
            </p>
          </div>

          {/* Live Timer Card */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md shrink-0">
            <span className="text-[10px] uppercase font-extrabold text-red-200 tracking-wider">
              Elapsed Active Time
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
              {formatElapsed(elapsedSeconds)}
            </span>
            <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live 5s GPS Loop
            </span>
          </div>
        </div>

        {/* Live GPS Broadcast Ticker */}
        <div className="mt-6 pt-4 border-t border-red-500/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-100">
            <MapPin className="w-4 h-4 text-white shrink-0 animate-bounce" />
            <span>Target Zone:</span>
            <span className="font-bold text-white bg-black/30 px-2.5 py-1 rounded-lg">
              {emergency?.location?.zone || currentCoords?.zone || 'Campus Grounds'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-red-200">
            <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>GPS: {currentCoords.latitude.toFixed(5)}, {currentCoords.longitude.toFixed(5)}</span>
            <span className="text-red-300">({lastGpsUpdate || 'Streaming'})</span>
          </div>
        </div>
      </div>

      {/* Real-time Status Progress Ticker */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Real-Time Response Pipeline
        </h3>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-red-600 text-white ring-4 ring-red-500/30 animate-pulse scale-110'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    isCurrent ? 'text-red-400 font-extrabold' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatched Response Units & Assigned Responders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Auto-Assigned Units Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-400" />
              Auto-Assigned Responders
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Intelligent Tri-Tier
            </span>
          </div>

          <div className="space-y-2">
            {(emergency?.assignedResponders || []).map((resp, idx) => {
              const role = typeof resp === 'object' ? (resp?.role || 'Security') : 'Security';
              const name = typeof resp === 'object' ? (resp?.name || 'Patrol Unit') : String(resp || 'Patrol Unit');
              const callSign = typeof resp === 'object' ? (resp?.callSign || 'UNIT') : 'UNIT';
              const isMedical = role.includes('Medical');
              const eta = typeof resp === 'object' ? (resp?.etaMinutes || 2) : 2;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                      {isMedical ? '🏥' : '🛡️'}
                    </div>
                    <div>
                      <div className="font-bold text-white">{name}</div>
                      <div className="text-[11px] text-slate-400">{callSign} • {role}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      ETA: ~{eta}m
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tactical Controls: Sound Siren & Hotline */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Direct Emergency Hotlines
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:911"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-500/30 font-bold transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-red-400" />
                Call 911 / Police
              </a>

              <a
                href="tel:5559110000"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-bold transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-indigo-400" />
                Campus Security
              </a>
            </div>
          </div>

          {/* Audible Campus Beacon Siren Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSiren}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all ${
                isSirenActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse shadow-lg shadow-amber-600/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              {isSirenActive ? 'Stop Emergency Horn' : 'Sound Local Siren Horn'}
            </button>
          </div>

          {/* Resolve SOS Button */}
          <button
            onClick={onResolve}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            I Am Safe / Resolve Emergency
          </button>
        </div>

      </div>

    </div>
  );
};

export default ActiveEmergencyRadar;
