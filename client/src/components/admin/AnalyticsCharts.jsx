import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Map, Award } from 'lucide-react';

export const AnalyticsCharts = ({ chartsData }) => {
  const weeklyData = chartsData?.weeklyData || [
    { day: 'Mon', medical: 1, security: 2, total: 3 },
    { day: 'Tue', medical: 2, security: 1, total: 3 },
    { day: 'Wed', medical: 3, security: 4, total: 7 },
    { day: 'Thu', medical: 1, security: 2, total: 3 },
    { day: 'Fri', medical: 2, security: 5, total: 7 },
    { day: 'Sat', medical: 4, security: 2, total: 6 },
    { day: 'Sun', medical: 1, security: 1, total: 2 },
  ];

  const zoneData = chartsData?.zoneDistribution || [
    { zone: 'Green Library', count: 12 },
    { zone: 'Hostels (A-D)', count: 9 },
    { zone: 'Main Quad', count: 7 },
    { zone: 'Sports Center', count: 4 },
    { zone: 'CS Labs', count: 2 },
  ];

  const tierTimes = chartsData?.tierResponseTimes || [
    { tier: 'Campus Security', avgTime: '1m 20s', compliance: '98%' },
    { tier: 'Medical Team', avgTime: '2m 10s', compliance: '95%' },
    { tier: 'Admin Dispatch', avgTime: '0m 35s', compliance: '99%' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 2-Column Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Weekly Emergencies Trend */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              Weekly Incident Volume & Breakdown
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSecurity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMedical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" textAnchor="middle" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="security" name="Security Incidents" stroke="#6366f1" fillOpacity={1} fill="url(#colorSecurity)" />
                <Area type="monotone" dataKey="medical" name="Medical Alerts" stroke="#ef4444" fillOpacity={1} fill="url(#colorMedical)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Zone Hotspots */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Map className="w-4 h-4 text-cyan-400" />
              Incidents by Campus Geofence
            </h3>
            <span className="text-[11px] text-cyan-400 font-semibold">Hotspot Analysis</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="zone" stroke="#64748b" fontSize={10} interval={0} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" name="Total Alerts" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tier Response SLA Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Response Unit SLA & Speed Benchmarks
          </h3>
          <span className="text-[11px] text-emerald-400 font-mono font-bold">Target: &lt; 3 Minutes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tierTimes.map((t, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block">{t.tier}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">{t.avgTime}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">SLA Compliance</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{t.compliance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;
