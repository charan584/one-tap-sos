import React from 'react';
import { Server, Database, Smartphone, ShieldCheck, Radio, ArrowRight, Layers, Cpu } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export const SystemArchitecture = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
          System Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Full-Stack Real-Time Pipeline
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          High-performance distributed system linking mobile clients, WebSocket dispatchers, and persistence layers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Layer 1: Client Frontend */}
        <GlassCard className="space-y-4 border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            Layer 1: Frontend Clients
          </div>
          <h3 className="text-base font-extrabold text-white">React + Vite + Tailwind</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Mobile-First Student SOS UI
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Admin Command Dispatcher
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Leaflet & CartoDB Maps
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Web Audio Synthesizer Alarms
            </li>
          </ul>
        </GlassCard>

        {/* Layer 2: Real-time Dispatch */}
        <GlassCard className="space-y-4 border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            Layer 2: Real-Time Bus
          </div>
          <h3 className="text-base font-extrabold text-white">Socket.IO Engine</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Sub-50ms WebSocket Broadcast
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              5-Second Continuous GPS Loop
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Emergency Rooms (`admin_room`)
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Toast & Audio Alerts Trigger
            </li>
          </ul>
        </GlassCard>

        {/* Layer 3: Backend API */}
        <GlassCard className="space-y-4 border-indigo-500/30">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Server className="w-4 h-4" />
            Layer 3: Core API Services
          </div>
          <h3 className="text-base font-extrabold text-white">Node.js + Express.js</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              JWT Auth Middleware & RBAC
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Intelligent Auto-Routing Engine
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Haversine ETA Calculation
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Campus Geofence Tagging
            </li>
          </ul>
        </GlassCard>

        {/* Layer 4: Persistence */}
        <GlassCard className="space-y-4 border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            Layer 4: Data Layer
          </div>
          <h3 className="text-base font-extrabold text-white">MongoDB + Mongoose</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Students & Medical Schema
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Emergencies & Location Logs
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Responders Fleet Telemetry
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Resilient In-Memory Fallback
            </li>
          </ul>
        </GlassCard>

      </div>
    </section>
  );
};

export default SystemArchitecture;
