import React from 'react';
import { ShieldAlert, Zap, Flame, Radio } from 'lucide-react';

export const OneTapSOSButton = ({ onTriggerSOS, disabled = false }) => {
  return (
    <div className="relative flex flex-col items-center justify-center py-6 sm:py-10">
      
      {/* Outer Multi-layered Pulsing Radar Waves */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-red-600/10 animate-ping opacity-75 pointer-events-none" />
      <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-red-600/15 animate-pulse pointer-events-none" />
      <div className="absolute w-52 h-52 sm:w-68 sm:h-68 rounded-full border border-red-500/30 animate-spin-slow pointer-events-none" />

      {/* Main SOS Trigger Circle Button */}
      <button
        onClick={onTriggerSOS}
        disabled={disabled}
        className="relative group flex flex-col items-center justify-center w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 text-white shadow-[0_0_60px_rgba(239,68,68,0.6)] hover:shadow-[0_0_90px_rgba(239,68,68,0.9)] active:scale-95 transition-all duration-300 border-4 border-red-400/80 cursor-pointer overflow-hidden z-10"
      >
        {/* Shiny Gloss Reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-full pointer-events-none" />
        
        {/* Animated Beacon Center */}
        <div className="flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
          <ShieldAlert className="w-14 h-14 sm:w-16 sm:h-16 text-white animate-pulse drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
        </div>

        {/* SOS Title */}
        <span className="text-3xl sm:text-4xl font-black tracking-tighter uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          🆘 SOS
        </span>

        {/* Subtitle */}
        <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-red-100 mt-1 bg-black/25 px-3 py-0.5 rounded-full">
          ONE TAP TRIGGER
        </span>

        {/* Bottom indicator */}
        <div className="flex items-center gap-1 mt-2 text-[10px] text-red-200 font-semibold opacity-90">
          <Zap className="w-3 h-3 fill-current" />
          <span>3-Sec Auto-Broadcast</span>
        </div>
      </button>

      {/* Reassuring Instruction */}
      <div className="mt-6 text-center max-w-xs space-y-1">
        <p className="text-xs font-bold text-slate-200">
          Press once to alert campus security & medical team.
        </p>
        <p className="text-[11px] text-slate-400">
          3-second cancel countdown will appear to prevent false alarms.
        </p>
      </div>

    </div>
  );
};

export default OneTapSOSButton;
