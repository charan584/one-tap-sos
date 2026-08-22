import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Zap, Radio, ChevronRight, Layers, ArrowRight, Activity, Smartphone, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HeroSection = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLaunchStudent = async () => {
    await demoLogin('student');
    navigate('/student');
  };

  const handleLaunchSplit = () => {
    navigate('/split-demo');
  };

  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-red-600/20 via-indigo-600/20 to-cyan-500/15 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-xl shadow-black/40 text-xs font-semibold text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span>Intelligent Emergency Response Platform</span>
          <span className="text-slate-600">•</span>
          <span className="text-red-400 font-bold">Zero-Latency Architecture</span>
        </div>

        {/* Hero Titles */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Campus<span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">SOS</span>
          </h1>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            One Tap Can Save a Life.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
            CampusSOS enables university students to instantly trigger an emergency alert with a single tap. Identity, medical vitals, and live 5-second GPS telemetry are automatically broadcast to campus security and responders with zero forms or latency.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          
          {/* Main Launch Demo Button */}
          <button
            onClick={handleLaunchStudent}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm shadow-xl shadow-red-600/40 hover:shadow-red-600/60 hover:scale-105 active:scale-95 transition-all"
          >
            <Smartphone className="w-5 h-5" />
            Launch Demo (Student SOS)
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {/* Split Screen Hackathon Demo */}
          <button
            onClick={handleLaunchSplit}
            className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700 hover:border-emerald-500/60 shadow-xl hover:shadow-emerald-500/10 active:scale-95 transition-all"
          >
            <Layers className="w-5 h-5 text-emerald-400" />
            Live Split-Screen Demo
          </button>

          {/* Admin Dispatch Center */}
          <Link
            to="/admin"
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-800 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            Admin Command Center
          </Link>
        </div>

        {/* Live Metrics Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-mono font-black text-red-400">3.00s</span>
            <span className="text-xs text-slate-400 block mt-1 font-medium">Cancel Grace Window</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">0 Forms</span>
            <span className="text-xs text-slate-400 block mt-1 font-medium">Zero-Friction SOS</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">5 Sec</span>
            <span className="text-xs text-slate-400 block mt-1 font-medium">Live GPS Stream Loop</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-mono font-black text-indigo-400">3-Tier</span>
            <span className="text-xs text-slate-400 block mt-1 font-medium">Intelligent Auto-Routing</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
