import React from 'react';
import { HeartPulse, Phone, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { BloodBadge } from '../common/EmergencyBadge';

export const MedicalSheetCard = ({ student }) => {
  if (!student) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header with Photo & Name */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={student.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={student.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-red-500/40 border border-slate-700 shadow-md"
          />
          <div>
            <h3 className="font-extrabold text-white text-base leading-tight flex items-center gap-2">
              {student.name}
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 font-mono font-medium">
              ID: {student.studentId} • {student.department}
            </p>
          </div>
        </div>

        <BloodBadge bloodGroup={student.bloodGroup} />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Year / Cohort</span>
          <span className="font-bold text-slate-200">{student.year || '3rd Year'}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Residence</span>
          <span className="font-bold text-slate-200">{student.hostelOrDayScholar || 'Hostel Block C'}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone</span>
          <span className="font-mono font-semibold text-slate-200">{student.mobile}</span>
        </div>
      </div>

      {/* Medical Alert Banner */}
      <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/30 flex items-start gap-2.5">
        <HeartPulse className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-red-400">Medical Vitals & Alerts: </span>
          <span className="text-slate-200">
            {student.medicalConditions || 'No existing severe conditions recorded.'}
          </span>
        </div>
      </div>

      {/* Emergency Kin Contact */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Emergency Kin Contact</span>
            <span className="font-bold text-white">{student.emergencyContactName}</span>
          </div>
        </div>
        <a
          href={`tel:${student.emergencyContactNumber}`}
          className="font-mono font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
        >
          {student.emergencyContactNumber}
        </a>
      </div>

      {/* Zero Form Latency Guarantee */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 italic">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Pre-authenticated: this profile auto-attaches instantly on SOS trigger with 0 forms.</span>
      </div>
    </div>
  );
};

export default MedicalSheetCard;
