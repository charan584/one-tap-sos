import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
  Phone,
  Eye,
  Check,
  ChevronRight,
  HeartPulse,
  AlertTriangle,
  Flame,
  Filter
} from 'lucide-react';
import { StatusBadge, PriorityBadge, BloodBadge } from '../common/EmergencyBadge';
import { getGoogleMapsUrl } from '../../utils/geoUtils';

const SLA_SECONDS = 100; // 100 seconds acceptance threshold

export const LiveEmergencyTable = ({
  emergencies = [],
  onAccept,
  onUpdateStatus,
  onResolve,
  onSelectEmergency,
  selectedEmergencyId,
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'active' | 'resolved'
  const [now, setNow] = useState(Date.now());

  // Second-by-second live clock for SLA countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return 'Just now';
    }
  };

  // Compute pending, overdue (>100s), active, and resolved counts
  const emergenciesWithSla = emergencies.map((emg) => {
    const triggeredAt = new Date(emg.timestamps?.triggeredAt || emg.createdAt).getTime();
    const elapsedSec = Math.max(0, Math.floor((now - triggeredAt) / 1000));
    const isPending = emg.status === 'Pending';
    const isOverdue = isPending && elapsedSec > SLA_SECONDS;
    const remainingSec = isPending ? Math.max(0, SLA_SECONDS - elapsedSec) : 0;

    const mins = Math.floor(remainingSec / 60);
    const secs = remainingSec % 60;
    const remainingFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    return {
      ...emg,
      elapsedSec,
      isOverdue,
      remainingSec,
      remainingFormatted,
    };
  });

  const pendingEmergencies = emergenciesWithSla.filter(e => e.status === 'Pending');
  const overduePendingCount = emergenciesWithSla.filter(e => e.isOverdue).length;
  const activeEmergencies = emergenciesWithSla.filter(e => ['Accepted', 'On Route', 'Arrived'].includes(e.status));
  const resolvedEmergencies = emergenciesWithSla.filter(e => e.status === 'Resolved');

  const filteredEmergencies = emergenciesWithSla.filter((emg) => {
    if (filter === 'pending') return emg.status === 'Pending';
    if (filter === 'active') return ['Accepted', 'On Route', 'Arrived'].includes(emg.status);
    if (filter === 'resolved') return emg.status === 'Resolved';
    return true;
  });

  return (
    <div className="space-y-4">

      {/* ⚠️ Critical 100-Second Overdue Escalation Alert Banner */}
      {overduePendingCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-2 border-red-500/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs text-red-100 shadow-2xl shadow-red-950/80 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="font-black text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <span>🚨 SLA Escalation: {overduePendingCount} Pending Request(s) Overdue</span>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">&gt; 100 Seconds</span>
              </div>
              <p className="text-xs text-red-200 mt-0.5">
                SOS emergency requests taking greater than 100 seconds to accept are escalated into the Pending Request queue.
              </p>
            </div>
          </div>

          <button
            onClick={() => setFilter('pending')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 transition-all active:scale-95 cursor-pointer"
          >
            View Pending Requests ({pendingEmergencies.length})
          </button>
        </div>
      )}

      {/* Filter Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab: All */}
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <span>All Incidents</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px]">
              {emergencies.length}
            </span>
          </button>

          {/* Tab: Pending Request Queue (with 100s SLA counter) */}
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'pending'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : overduePendingCount > 0
                ? 'bg-amber-950/90 border border-amber-500/80 text-amber-200 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Requests</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 font-mono text-[10px] border border-amber-500/40 font-bold">
              {pendingEmergencies.length}
              {overduePendingCount > 0 && ` (${overduePendingCount} >100s)`}
            </span>
          </button>

          {/* Tab: In Progress / On Route */}
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'active'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Dispatched / Active</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px]">
              {activeEmergencies.length}
            </span>
          </button>

          {/* Tab: Resolved */}
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'resolved'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Resolved</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px]">
              {resolvedEmergencies.length}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Acceptance SLA: 100 Seconds</span>
        </div>
      </div>

      {/* Main Table */}
      {filteredEmergencies.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <ShieldAlert className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white">No Incidents in {filter.toUpperCase()} Queue</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {filter === 'pending'
              ? 'All emergency requests have been promptly accepted by administrators.'
              : 'No active incident reports match this filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5 font-bold">Student</th>
                <th className="px-4 py-3.5 font-bold">Student ID / Dept</th>
                <th className="px-4 py-3.5 font-bold">Time & 3m SLA</th>
                <th className="px-4 py-3.5 font-bold">Location & Zone</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold">Priority</th>
                <th className="px-4 py-3.5 font-bold">Assigned Responders</th>
                <th className="px-4 py-3.5 font-bold text-right">Emergency Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEmergencies.map((emg) => {
                const isSelected = selectedEmergencyId === emg._id;
                const student = emg.studentSnapshot || {};
                const lat = Number(emg.location?.latitude || 0);
                const lng = Number(emg.location?.longitude || 0);
                const mapsUrl = emg.location?.googleMapsUrl || (lat && lng ? getGoogleMapsUrl(lat, lng) : '#');
                const isPending = emg.status === 'Pending';
                const isOverdue = emg.isOverdue;

                return (
                  <tr
                    key={emg._id}
                    onClick={() => onSelectEmergency && onSelectEmergency(emg)}
                    className={`group transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/40 border-l-4 border-red-500'
                        : isOverdue
                        ? 'bg-red-950/30 hover:bg-red-950/40 border-l-4 border-red-600 animate-pulse'
                        : isPending
                        ? 'bg-amber-950/15 hover:bg-amber-950/25 border-l-4 border-amber-500/50'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* 1. Student Identity */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={student.name || 'Student'}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-700 border border-slate-600 shrink-0 shadow-md"
                        />
                        <div>
                          <div className="font-extrabold text-white text-sm group-hover:text-red-400 transition-colors">
                            {student.name || 'Unknown Student'}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <BloodBadge bloodGroup={student.bloodGroup} />
                            {student.medicalConditions && !String(student.medicalConditions).toLowerCase().includes('none') && (
                              <span className="text-[10px] text-red-300 font-semibold px-1.5 py-0.5 rounded bg-red-900/50 border border-red-700/50 truncate max-w-[120px]" title={student.medicalConditions}>
                                ⚠️ {student.medicalConditions}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Student ID, Branch, Year, Section & Guardian */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-200 text-xs">
                        {student.studentId || 'STU-UNKNOWN'}
                      </div>
                      <div className="text-[11px] text-indigo-300 font-semibold mt-0.5">
                        {student.branch || student.department || 'CSE'} ({student.year || '1st Year'} • {student.section || 'Sec A'})
                      </div>
                      {(student.guardianName || student.emergencyContactName) && (
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate max-w-[200px]">
                          🛡️ {student.guardianName || student.emergencyContactName}: <span className="font-mono text-emerald-400 font-bold">{student.guardianPhone || student.emergencyContactNumber}</span>
                        </div>
                      )}
                    </td>

                    {/* 3. Time Triggered & 100-Second SLA Countdown */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-slate-200 font-bold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatTime(emg.timestamps?.triggeredAt || emg.createdAt)}
                      </div>

                      {/* 100-Second SLA Countdown / Overdue Pending Status */}
                      {isPending && (
                        <div className="mt-1">
                          {isOverdue ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950 border border-red-500 text-red-300 font-black text-[10px] tracking-wide animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              <span>PENDING (&gt;100s)</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono font-bold text-[10px]">
                              <span>⏳ SLA: {emg.remainingFormatted}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {!isPending && (
                        <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                          ✓ Accepted (&lt;100s)
                        </div>
                      )}
                    </td>

                    {/* 4. Location & Zone */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-100 font-bold">
                        <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{emg.location?.zone || 'Campus Area'}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-slate-400">
                          {lat ? lat.toFixed(4) : '0.0000'}, {lng ? lng.toFixed(4) : '0.0000'}
                        </span>
                        {mapsUrl !== '#' && (
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                          >
                            Maps <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* 5. Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={emg.status} />
                    </td>

                    {/* 6. Priority */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <PriorityBadge priority={isOverdue ? 'Critical' : emg.priority} />
                    </td>

                    {/* 7. Assigned Officer & Responders */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {emg.assignedOfficer && emg.assignedOfficer.name && emg.assignedOfficer.name !== 'Pending Dispatch Assignment' ? (
                          <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                            <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300">ADMIN</span>
                            <span className="text-white truncate max-w-[120px]">{emg.assignedOfficer.name}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-semibold italic">Unassigned (Open for all admins)</span>
                        )}

                        {(emg.assignedResponders && Array.isArray(emg.assignedResponders) && emg.assignedResponders.length > 0) ? (
                          emg.assignedResponders.slice(0, 2).map((r, i) => {
                            const rawName = typeof r === 'string' ? r : (r?.name || 'Unit');
                            const firstName = String(rawName).split(' ')[0] || 'Unit';
                            const callSign = (typeof r === 'object' ? r?.callSign : null) || 'UNIT';
                            return (
                              <div key={i} className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[170px]">
                                <span>🛡️</span>
                                <span className="font-medium text-slate-300">{firstName}</span>
                                <span className="text-slate-500">({callSign})</span>
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-[10px] text-slate-500 italic block">Auto-routing units...</span>
                        )}
                      </div>
                    </td>

                    {/* 8. Actions */}
                    <td className="px-4 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Accept Button */}
                        {emg.status === 'Pending' && (
                          <button
                            onClick={() => onAccept && onAccept(emg._id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept
                          </button>
                        )}

                        {/* Step to On Route */}
                        {emg.status === 'Accepted' && (
                          <button
                            onClick={() => onUpdateStatus && onUpdateStatus(emg._id, 'On Route')}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            On Route
                          </button>
                        )}

                        {/* Step to Arrived */}
                        {emg.status === 'On Route' && (
                          <button
                            onClick={() => onUpdateStatus && onUpdateStatus(emg._id, 'Arrived')}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition-all active:scale-95 cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Arrived
                          </button>
                        )}

                        {/* Resolve Button */}
                        {emg.status === 'Arrived' && (
                          <button
                            onClick={() => onResolve && onResolve(emg._id, 'Dispatched units secured scene.')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Resolve
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => onSelectEmergency && onSelectEmergency(emg)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default LiveEmergencyTable;
