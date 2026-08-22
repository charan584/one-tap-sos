import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, MapPin, Clock, CheckCircle, X, ChevronRight, Phone } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { emergencyApi } from '../../services/api';

export const ToastNotificationContainer = () => {
  const { activeNotification, clearNotification } = useSocket();
  const navigate = useNavigate();

  if (!activeNotification) return null;

  const { emergency, studentName, studentId, zone, time } = activeNotification;

  const handleAccept = async () => {
    if (emergency?._id) {
      try {
        await emergencyApi.accept(emergency._id);
      } catch (e) {
        console.error('Accept error:', e);
      }
    }
    clearNotification();
    navigate('/admin');
  };

  const handleView = () => {
    clearNotification();
    navigate('/admin');
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-bounce-short shadow-2xl">
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/90 border-2 border-red-500/80 p-4 sm:p-5 text-white shadow-2xl backdrop-blur-2xl ring-4 ring-red-500/20">
        
        {/* Glowing Red Corner Pulse */}
        <div className="absolute -top-1.5 -left-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-red-500/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 shadow-md shadow-red-600/40">
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-red-400">
                🚨 Live Emergency Triggered
              </div>
              <div className="text-base font-bold text-white leading-tight">
                {studentName || 'Student SOS'}
              </div>
            </div>
          </div>
          <button
            onClick={clearNotification}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-3 space-y-2 text-xs text-slate-200">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-slate-400">Student ID:</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              {studentId || 'STU-LIVE'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold text-slate-100">{zone || 'University Campus'}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Triggered at {time || new Date().toLocaleTimeString()}</span>
          </div>

          {emergency?.studentSnapshot?.medicalConditions && (
            <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-[11px] text-red-200">
              <span className="font-bold text-red-400">Medical Alert: </span>
              {emergency.studentSnapshot.medicalConditions}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/40 transition-all active:scale-95"
          >
            <CheckCircle className="w-4 h-4" />
            Accept Case Now
          </button>
          
          <button
            onClick={handleView}
            className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Open Dispatch
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotificationContainer;
