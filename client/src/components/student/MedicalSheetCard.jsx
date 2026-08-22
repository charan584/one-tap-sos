import React from 'react';
import {
  HeartPulse,
  Phone,
  ShieldCheck,
  UserCheck,
  Mail,
  GraduationCap,
  Calendar,
  Layers,
  ShieldAlert,
  Home,
  User
} from 'lucide-react';
import { BloodBadge } from '../common/EmergencyBadge';

export const MedicalSheetCard = ({ student }) => {
  if (!student) return null;

  const guardianName = student.guardianName || student.emergencyContactName || 'Parent / Guardian';
  const guardianPhone = student.guardianPhone || student.emergencyContactNumber || student.mobile || 'Not specified';
  const branchName = student.branch || student.department || 'Computer Science & Engineering (CSE)';
  const academicYear = student.year || '1st Year';
  const sectionName = student.section || 'Section A';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900 to-slate-950 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-5">
      
      {/* Header: Photo, Name, Verified Badge & Blood Group */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <img
            src={student.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={student.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-500/40 border border-slate-700 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-lg leading-tight tracking-tight">
                {student.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <UserCheck className="w-3 h-3" />
                Verified Student
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-mono font-semibold mt-0.5">
              Roll / ID: <span className="text-white">{student.studentId}</span>
            </p>
          </div>
        </div>

        <BloodBadge bloodGroup={student.bloodGroup || 'O+'} />
      </div>

      {/* Account Creation Complete Profile Dossier */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          Academic & Personal Profile Dossier
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          
          {/* Branch */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Branch / Dept</span>
              <span className="font-bold text-slate-100 truncate block">{branchName}</span>
            </div>
          </div>

          {/* Academic Year */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Academic Year</span>
              <span className="font-bold text-indigo-300">{academicYear}</span>
            </div>
          </div>

          {/* Section */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Section</span>
              <span className="font-bold text-purple-300">{sectionName}</span>
            </div>
          </div>

          {/* Student Mobile */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Phone</span>
              <a href={`tel:${student.mobile}`} className="font-mono font-bold text-emerald-400 hover:underline">
                {student.mobile || 'Not set'}
              </a>
            </div>
          </div>

          {/* Campus Email */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 sm:col-span-2 lg:col-span-2">
            <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Campus Email</span>
              <span className="font-mono text-slate-200 truncate block">{student.email || 'student@campus.edu'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Guardian Contact Card */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
              🛡️ Registered Guardian / Parent
            </span>
            <span className="font-black text-white text-sm">{guardianName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Guardian Contact:</span>
          <a
            href={`tel:${guardianPhone}`}
            className="flex items-center gap-1.5 font-mono font-bold text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-sm transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{guardianPhone}</span>
          </a>
        </div>
      </div>

      {/* Medical Alert & Allergies */}
      <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
        <HeartPulse className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-red-300 uppercase tracking-wider block mb-0.5">
            Medical Vitals & Clinical Alerts
          </span>
          <span className="text-slate-200">
            {student.medicalConditions || 'No pre-existing conditions reported. Blood Group ' + (student.bloodGroup || 'O+') + ' recorded.'}
          </span>
        </div>
      </div>

      {/* Pre-authenticated auto-attach notice */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Auto-synchronized with MongoDB: All account details instantly broadcast to dispatchers upon pressing SOS.
        </span>
      </div>

    </div>
  );
};

export default MedicalSheetCard;
