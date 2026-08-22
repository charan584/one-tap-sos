import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Clock, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

export const MetricCards = ({ stats, emergencies = [] }) => {
  const [now, setNow] = useState(Date.now());

  // Second-by-second live timer to dynamically transfer pending requests > 100 seconds
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const {
    totalStudents = 3,
    resolvedCases = 1,
    averageResponseTime = '1m 20s',
  } = stats || {};

  // 1. Pending Request count: Unaccepted emergencies taking > 100 seconds to accept
  const pendingRequestsOver100s = emergencies.filter((emg) => {
    if (emg.status !== 'Pending') return false;
    const triggeredAt = new Date(emg.timestamps?.triggeredAt || emg.createdAt).getTime();
    const elapsedSec = Math.floor((now - triggeredAt) / 1000);
    return elapsedSec > 100;
  }).length;

  // 2. Active SOS count: Decreased once an unaccepted pending SOS crosses 100s
  const liveActiveSosCount = emergencies.filter((emg) => {
    if (emg.status === 'Resolved' || emg.status === 'Cancelled') return false;
    if (emg.status === 'Pending') {
      const triggeredAt = new Date(emg.timestamps?.triggeredAt || emg.createdAt).getTime();
      const elapsedSec = Math.floor((now - triggeredAt) / 1000);
      return elapsedSec <= 100; // Decreased from Active SOS once > 100s
    }
    // Accepted, On Route, Arrived are ongoing active operations
    return ['Accepted', 'On Route', 'Arrived'].includes(emg.status);
  }).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      
      {/* 1. Active SOS (Decreased when a pending request crosses 100s into Pending Requests) */}
      <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border backdrop-blur-xl transition-all ${
        liveActiveSosCount > 0
          ? 'bg-gradient-to-br from-red-950/80 to-slate-900 border-red-500/80 shadow-lg shadow-red-500/20'
          : 'bg-slate-900/70 border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-400">
            Active SOS
          </span>
          <div className={`p-2 rounded-xl ${liveActiveSosCount > 0 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl sm:text-4xl font-black font-mono ${liveActiveSosCount > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {liveActiveSosCount}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {liveActiveSosCount > 0 ? 'Active Dispatch' : 'Campus Secure'}
          </span>
        </div>
      </div>

      {/* 2. Total Students */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Registered Students
          </span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black font-mono text-white">
            {totalStudents}
          </span>
          <span className="text-[11px] font-semibold text-cyan-400">
            Profiles Armed
          </span>
        </div>
      </div>

      {/* 3. Pending Request (Increases when active SOS time taken is > 100 seconds to accept) */}
      <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border backdrop-blur-xl transition-all ${
        pendingRequestsOver100s > 0
          ? 'bg-gradient-to-br from-amber-950/90 via-red-950/60 to-slate-900 border-amber-500 shadow-lg shadow-amber-500/20 animate-pulse'
          : 'bg-slate-900/70 border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-extrabold uppercase tracking-wider ${pendingRequestsOver100s > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            Pending Request
          </span>
          <div className={`p-2 rounded-xl ${pendingRequestsOver100s > 0 ? 'bg-amber-500/20 text-amber-400 animate-bounce' : 'bg-amber-500/10 text-amber-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl sm:text-4xl font-black font-mono ${pendingRequestsOver100s > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
            {pendingRequestsOver100s}
          </span>
          <span className={`text-[11px] font-semibold ${pendingRequestsOver100s > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
            {pendingRequestsOver100s > 0 ? '>100s Unaccepted' : 'Within 100s SLA'}
          </span>
        </div>
      </div>

      {/* 4. Resolved Cases */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Resolved Cases
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
            {resolvedCases}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Securely Closed
          </span>
        </div>
      </div>

      {/* 5. Average Response Time */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 backdrop-blur-xl col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Avg Response Time
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-300">
            {averageResponseTime}
          </span>
          <span className="text-[11px] font-semibold text-indigo-400">
            Target &lt; 100s
          </span>
        </div>
      </div>

    </div>
  );
};

export default MetricCards;
