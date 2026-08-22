import React from 'react';
import { ShieldCheck, Shield } from 'lucide-react';

export const ResponderFleetManager = ({
  administrators = [],
  currentAdmin = null,
}) => {
  // Fallback administrators list from active data
  const displayAdmins = administrators && administrators.length > 0 ? administrators : [
    {
      _id: 'adm-1',
      name: currentAdmin?.name || 'Charan P',
      email: currentAdmin?.email || 'charanp326@gmail.com',
      badgeNumber: currentAdmin?.badgeNumber || 'ADM-8079',
      role: 'Chief Dispatch Administrator',
      department: 'Campus Safety & Emergency Operations',
      status: 'Available',
      isOnline: true,
    },
    {
      _id: 'adm-2',
      name: 'Chandhu',
      email: 'chandu242085@gmail.com',
      badgeNumber: 'ADM-1682',
      role: 'Duty Dispatch Officer',
      department: 'Emergency Response Command',
      status: 'Available',
      isOnline: true,
    },
    {
      _id: 'adm-3',
      name: 'Srikar',
      email: 'telagarapusrikarkumar8@gmail.com',
      badgeNumber: 'ADM-4866',
      role: 'Tactical Dispatch Officer',
      department: 'EOC Command Staff',
      status: 'Available',
      isOnline: true,
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            On-Duty Administrators & Dispatch Officers
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Administrators logged in and available for real-time emergency triage
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {displayAdmins.length} Admins Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayAdmins.map((admin, idx) => {
          const isCurrentUser =
            currentAdmin &&
            (currentAdmin.email === admin.email ||
              currentAdmin.name === admin.name ||
              currentAdmin.badgeNumber === admin.badgeNumber);

          return (
            <div
              key={admin._id || idx}
              className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
                isCurrentUser
                  ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base border border-indigo-500/30 shadow-inner">
                    🛡️
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-white text-xs leading-tight truncate max-w-[130px]">
                        {admin.name}
                      </h4>
                      {isCurrentUser && (
                        <span className="text-[9px] font-extrabold bg-indigo-600 text-white px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] font-bold text-indigo-300">
                      {admin.badgeNumber || 'ADM-DISPATCH'} • {admin.role || 'Administrator'}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Available
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-slate-400 text-[11px] truncate max-w-[170px]" title={admin.email}>
                  📧 {admin.email}
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  EOC Console Active
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponderFleetManager;
