import React from 'react';
import { ShieldCheck, CheckCircle2, MapPin, Clock, Radio, ArrowRight } from 'lucide-react';

export const SosSentModal = ({ emergencyData, onOk }) => {
  const lat = emergencyData?.location?.latitude;
  const lng = emergencyData?.location?.longitude;
  const accuracy = emergencyData?.location?.accuracy;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b14]/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative max-w-md w-full flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/30 space-y-5">
        
        {/* Pulsating Glowing Glow */}
        <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-xl -z-10 animate-pulse" />

        {/* Big Success Animated Icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
            <ShieldCheck className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Signal Broadcasted Live
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            SOS Request Has Been Sent!
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
            Your emergency request and live device coordinates have been transmitted to campus security, medical responders, and dispatch.
          </p>
        </div>

        {/* Telemetry Summary Card */}
        <div className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-left text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Time Dispatched:
            </span>
            <span className="font-mono font-bold text-white">{timeStr}</span>
          </div>

          {lat !== undefined && lng !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                Live GPS Pinpoint:
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">Dispatch Units:</span>
            <span className="text-cyan-300 font-semibold">Security & Medical Alerted</span>
          </div>
        </div>

        {/* OK Button */}
        <button
          onClick={onOk}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
        >
          <span>OK</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default SosSentModal;
