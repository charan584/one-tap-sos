import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  MapPin,
  Users,
  Truck,
  BarChart3,
  Settings,
  Sparkles,
  RefreshCw,
  Layers
} from 'lucide-react';
import { seedApi } from '../../services/api';

export const AdminSidebar = ({
  activeTab,
  onTabChange,
  activeSosCount = 0,
  onRefresh,
}) => {
  const navItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'emergencies', label: 'Active SOS Alerts', icon: ShieldAlert, badge: activeSosCount },
    { id: 'live-map', label: 'Live Incident Map', icon: MapPin },
    { id: 'responders', label: 'Responder Fleet', icon: Truck },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'analytics', label: 'Analytics & SLA', icon: BarChart3 },
    { id: 'settings', label: 'Simulation Engine', icon: Settings },
  ];

  const handleResetData = async () => {
    if (window.confirm('Reset and reseed demo dataset for fresh hackathon demonstration?')) {
      await seedApi.resetSeed();
      if (onRefresh) onRefresh();
    }
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-4 flex flex-col justify-between space-y-6 shadow-2xl">
      
      {/* Brand Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/40">
            🛡️
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-300">
              Campus Dispatch
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              EOC Operations Console
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Tools & Reseed Control */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <button
          onClick={handleResetData}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Demo Data
        </button>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400 text-center">
          <span className="font-bold text-slate-300">Intelligent Routing V2</span>
          <br />
          Multi-Agency Tri-Tier Active
        </div>
      </div>

    </aside>
  );
};

export default AdminSidebar;
