import React from 'react';
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
  HeartPulse
} from 'lucide-react';
import { StatusBadge, PriorityBadge, BloodBadge } from '../common/EmergencyBadge';
import { getGoogleMapsUrl } from '../../utils/geoUtils';

export const LiveEmergencyTable = ({
  emergencies,
  onAccept,
  onUpdateStatus,
  onResolve,
  onSelectEmergency,
  selectedEmergencyId,
}) => {
  if (!emergencies || emergencies.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <ShieldAlert className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-bold text-white">No Emergencies Active</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          All campus zones are currently peaceful and secure. Any new SOS signal will appear here instantly in real time.
        </p>
      </div>
    );
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-4 py-3.5 font-bold">Student</th>
            <th className="px-4 py-3.5 font-bold">Student ID / Dept</th>
            <th className="px-4 py-3.5 font-bold">Time Triggered</th>
            <th className="px-4 py-3.5 font-bold">Location & Zone</th>
            <th className="px-4 py-3.5 font-bold">Status</th>
            <th className="px-4 py-3.5 font-bold">Priority</th>
            <th className="px-4 py-3.5 font-bold">Assigned Responders</th>
            <th className="px-4 py-3.5 font-bold text-right">Emergency Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {emergencies.map((emg) => {
            const isSelected = selectedEmergencyId === emg._id;
            const student = emg.studentSnapshot || {};
            const lat = emg.location?.latitude || 37.4275;
            const lng = emg.location?.longitude || -122.1697;
            const mapsUrl = emg.location?.googleMapsUrl || getGoogleMapsUrl(lat, lng);

            return (
              <tr
                key={emg._id}
                onClick={() => onSelectEmergency && onSelectEmergency(emg)}
                className={`group transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/30 border-l-4 border-red-500'
                    : emg.status === 'Pending'
                    ? 'bg-red-950/15 hover:bg-red-950/25'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                {/* 1. Student Identity */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={student.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700 border border-slate-600 shrink-0"
                    />
                    <div>
                      <div className="font-extrabold text-white text-sm group-hover:text-red-400 transition-colors">
                        {student.name || 'Unknown Student'}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <BloodBadge bloodGroup={student.bloodGroup} />
                        {student.medicalConditions && !student.medicalConditions.toLowerCase().includes('none') && (
                          <span className="text-[10px] text-red-300 font-semibold px-1.5 py-0.5 rounded bg-red-900/50 border border-red-700/50 truncate max-w-[120px]" title={student.medicalConditions}>
                            ⚠️ {student.medicalConditions}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Student ID & Department */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-mono font-bold text-slate-200">
                    {student.studentId || 'STU-UNKNOWN'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {student.department} • {student.year}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {student.hostelOrDayScholar}
                  </div>
                </td>

                {/* 3. Time */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-mono text-slate-200 font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatTime(emg.timestamps?.triggeredAt || emg.createdAt)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Live Telemetry
                  </div>
                </td>

                {/* 4. Location & Zone */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-100 font-bold">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
                    <span>{emg.location?.zone || 'Campus Quad'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-slate-400">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </span>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      Maps <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </td>

                {/* 5. Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={emg.status} />
                </td>

                {/* 6. Priority */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <PriorityBadge priority={emg.priority} />
                </td>

                {/* 7. Assigned Responders */}
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {(emg.assignedResponders && emg.assignedResponders.length > 0) ? (
                      emg.assignedResponders.slice(0, 2).map((r, i) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1 truncate max-w-[170px]">
                          <span className="text-[10px]">🛡️</span>
                          <span className="font-semibold text-white">{r.name.split(' ')[0]}</span>
                          <span className="text-slate-400 text-[10px]">({r.callSign})</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Auto-routing units...</span>
                    )}
                  </div>
                </td>

                {/* 8. Actions */}
                <td className="px-4 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    
                    {/* Accept Button */}
                    {emg.status === 'Pending' && (
                      <button
                        onClick={() => onAccept(emg._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </button>
                    )}

                    {/* Step to On Route */}
                    {emg.status === 'Accepted' && (
                      <button
                        onClick={() => onUpdateStatus(emg._id, 'On Route')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        On Route
                      </button>
                    )}

                    {/* Step to Arrived */}
                    {emg.status === 'On Route' && (
                      <button
                        onClick={() => onUpdateStatus(emg._id, 'Arrived')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all active:scale-95"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Mark Arrived
                      </button>
                    )}

                    {/* Quick Dial Student Phone */}
                    <a
                      href={`tel:${student.mobile}`}
                      title={`Call Student (${student.mobile})`}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    {/* View Details Drawer */}
                    <button
                      onClick={() => onSelectEmergency(emg)}
                      title="Inspect Case"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Resolve Button */}
                    {emg.status !== 'Resolved' && (
                      <button
                        onClick={() => onResolve(emg._id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/40 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LiveEmergencyTable;
