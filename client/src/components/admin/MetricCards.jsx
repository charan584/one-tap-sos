import React from 'react';
import { ShieldAlert, Users, Clock, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

export const MetricCards = ({ stats }) => {
  const {
    activeSosCount = 0,
    totalStudents = 3,
    pendingCases = 0,
    resolvedCases = 1,
    averageResponseTime = '2m 14s',
    activeResponders = 5,
  } = stats || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      
      {/* 1. Active SOS */}
      <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border backdrop-blur-xl transition-all ${
        activeSosCount > 0
          ? 'bg-gradient-to-br from-red-950/80 to-slate-900 border-red-500/80 shadow-lg shadow-red-500/20'
          : 'bg-slate-900/70 border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-400">
            Active SOS
          </span>
          <div className={`p-2 rounded-xl ${activeSosCount > 0 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl sm:text-4xl font-black font-mono ${activeSosCount > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {activeSosCount}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {activeSosCount > 0 ? 'Urgent Alert' : 'Campus Secure'}
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

      {/* 3. Pending Cases */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Pending Triage
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black font-mono text-amber-400">
            {pendingCases}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Awaiting Accept
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
            Target &lt; 3m
          </span>
        </div>
      </div>

    </div>
  );
};

export default MetricCards;
