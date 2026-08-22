import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Truck,
  HeartPulse,
  User,
  ExternalLink,
  History,
  FileText,
  Mail,
  GraduationCap,
  Calendar,
  Layers
} from 'lucide-react';
import { StatusBadge, PriorityBadge, BloodBadge } from '../common/EmergencyBadge';
import { getGoogleMapsUrl } from '../../utils/geoUtils';

export const EmergencyDetailModal = ({
  emergency,
  onClose,
  onAccept,
  onUpdateStatus,
  onResolve,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveInput, setShowResolveInput] = useState(false);

  if (!emergency) return null;

  const student = emergency.studentSnapshot || {};
  const lat = emergency.location?.latitude || 37.4275;
  const lng = emergency.location?.longitude || -122.1697;
  const mapsUrl = emergency.location?.googleMapsUrl || getGoogleMapsUrl(lat, lng);

  const guardianName = student.guardianName || student.emergencyContactName || 'Parent / Guardian';
  const guardianPhone = student.guardianPhone || student.emergencyContactNumber || 'Not specified';
  const branchName = student.branch || student.department || 'Computer Science & Engineering (CSE)';
  const academicYear = student.year || '1st Year';
  const sectionName = student.section || 'Section A';

  const handleResolveSubmit = () => {
    onResolve(emergency._id, resolutionNotes);
    setShowResolveInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b14]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 text-white shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={student.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-red-500 border border-slate-700 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{student.name}</h2>
                <StatusBadge status={emergency.status} />
                <PriorityBadge priority={emergency.priority} />
              </div>
              <p className="text-xs text-indigo-300 font-mono mt-0.5 font-semibold">
                ID: <span className="text-white">{student.studentId}</span> • {branchName} ({academicYear} - {sectionName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Complete Student Profile Dossier */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Student & Guardian Profile Dossier
            </h3>

            {/* Academic Info Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Branch</span>
                <span className="font-bold text-slate-200 truncate block">{branchName}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Year / Section</span>
                <span className="font-bold text-slate-200">{academicYear} • {sectionName}</span>
              </div>
            </div>

            {/* Student Contact Info */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                <span className="text-slate-400">Student Phone:</span>
                <a href={`tel:${student.mobile}`} className="font-mono font-bold text-emerald-400 hover:underline">
                  {student.mobile || 'Not set'}
                </a>
              </div>

              {student.email && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <span className="text-slate-400">Campus Email:</span>
                  <span className="font-mono text-slate-200 text-[11px] truncate">{student.email}</span>
                </div>
              )}
            </div>

            {/* Guardian Contact Info */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-indigo-300 font-bold uppercase text-[10px]">🛡️ Guardian Name:</span>
                <span className="font-bold text-white">{guardianName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-300 font-bold uppercase text-[10px]">Guardian Phone:</span>
                <a href={`tel:${guardianPhone}`} className="font-mono font-bold text-emerald-400 hover:underline">
                  {guardianPhone}
                </a>
              </div>
            </div>

            {/* Medical Alert */}
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-300 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                  Blood Group:
                </span>
                <BloodBadge bloodGroup={student.bloodGroup || 'O+'} />
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Medical Conditions / Allergies:</span>
                <p className="text-slate-100 font-medium">{student.medicalConditions || 'None reported / Healthy'}</p>
              </div>
            </div>
          </div>

          {/* Location & GPS Breadcrumbs */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Live GPS & Telemetry Pinpoint
              </h3>

              <div className="space-y-1 text-xs">
                <div className="text-slate-400">Campus Zone:</div>
                <div className="font-bold text-white text-sm bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  {emergency.location?.zone || 'Campus Grounds'}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-300 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span>Exact GPS Coordinates:</span>
                <span className="text-cyan-400 font-bold">{lat.toFixed(6)}, {lng.toFixed(6)}</span>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-xs border border-cyan-500/40 transition-all shadow-sm cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Open Live Google Maps Navigation
              </a>
            </div>

            {/* Auto Dispatched Units */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">Dispatched Emergency Units:</div>
              {(emergency.assignedResponders || []).length > 0 ? (
                emergency.assignedResponders.map((r, idx) => {
                  const name = typeof r === 'string' ? r : (r?.name || 'Patrol Unit');
                  const eta = typeof r === 'object' ? (r?.etaMinutes || 2) : 2;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-300 font-medium">🛡️ {name}</span>
                      <span className="font-mono text-amber-400">ETA ~{eta}m</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-400 italic">Dispatched to central command triage.</div>
              )}
            </div>
          </div>

        </div>

        {/* Resolve Case Form Accordion */}
        {showResolveInput ? (
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resolution Report & Case Closing
            </h4>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Enter incident resolution summary (e.g. Student safe, medical team administered treatment, escorted to residence)..."
              rows={3}
              className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResolveInput(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveSubmit}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                Confirm Case Resolved
              </button>
            </div>
          </div>
        ) : null}

        {/* Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {emergency.status === 'Pending' && (
              <button
                onClick={() => onAccept(emergency._id)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Accept Case
              </button>
            )}

            {emergency.status === 'Accepted' && (
              <button
                onClick={() => onUpdateStatus(emergency._id, 'On Route')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Dispatch On Route
              </button>
            )}

            {emergency.status === 'On Route' && (
              <button
                onClick={() => onUpdateStatus(emergency._id, 'Arrived')}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                Mark Arrived On Scene
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {emergency.status !== 'Resolved' && (
              <button
                onClick={() => setShowResolveInput(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/40 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Resolve Case
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmergencyDetailModal;
