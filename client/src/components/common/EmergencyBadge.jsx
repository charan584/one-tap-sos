import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse';
      case 'accepted':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'on route':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'arrived':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'resolved':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status || 'Unknown'}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const isCritical = priority === 'Critical';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
        isCritical
          ? 'bg-red-600/20 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20'
          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      }`}
    >
      {isCritical ? '⚡ CRITICAL' : '🚨 HIGH'}
    </span>
  );
};

export const BloodBadge = ({ bloodGroup }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-950/80 border border-red-700/50 text-red-200 text-xs font-bold font-mono">
      🩸 {bloodGroup || 'O+'}
    </span>
  );
};
