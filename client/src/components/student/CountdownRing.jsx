import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

export const CountdownRing = ({ duration = 3, onConfirm, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const { playCountdownTick } = useSound();

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference;

  useEffect(() => {
    playCountdownTick(duration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onConfirm();
          return 0;
        }
        const nextTime = prev - 1;
        playCountdownTick(nextTime);
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b14]/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative max-w-sm w-full flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/90 border-2 border-red-500 shadow-2xl shadow-red-500/40">
        
        {/* Pulsating Glowing Ring Ambient */}
        <div className="absolute inset-0 rounded-3xl bg-red-500/10 blur-xl -z-10 animate-pulse" />

        {/* Warning Icon Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black uppercase tracking-widest mb-4 animate-bounce">
          <AlertTriangle className="w-3.5 h-3.5" />
          Emergency Alert Arming
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
          Broadcasting SOS In...
        </h2>
        <p className="text-xs text-slate-300 mb-6">
          Live GPS coordinates and your emergency medical profile will be dispatched to campus authorities automatically.
        </p>

        {/* Radial Countdown Circle */}
        <div className="relative flex items-center justify-center my-4">
          <svg className="w-48 h-48 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800 fill-transparent"
            />
            {/* Dynamic Animated Ring */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-red-500 fill-transparent transition-all duration-1000 ease-linear drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]"
            />
          </svg>

          {/* Center Countdown Number */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-white font-mono tracking-tighter animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
              {timeLeft}
            </span>
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
              SECONDS
            </span>
          </div>
        </div>

        {/* ONLY ONE BUTTON: CANCEL SOS */}
        <div className="w-full mt-6 space-y-3">
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm uppercase tracking-wider border border-slate-600 shadow-xl active:scale-95 transition-all hover:border-slate-400"
          >
            <X className="w-5 h-5 text-red-400" />
            Cancel SOS (False Alarm)
          </button>
          
          <div className="text-[11px] text-slate-400">
            Zero additional questions or forms required.
          </div>
        </div>

      </div>
    </div>
  );
};

export default CountdownRing;
