import React from 'react';
import { ShieldAlert, Heart, Radio, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">
                Campus<span className="text-red-500">SOS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Production-ready, one-tap intelligent emergency response system engineered for university campuses. Real-time GPS stream, zero-form profile auto-attachment, and tri-tier responder dispatch.
            </p>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">System Portals</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/student" className="hover:text-red-400 transition-colors">Student SOS Mobile App</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-400 transition-colors">Admin Emergency Dispatch</Link></li>
              <li><Link to="/split-demo" className="hover:text-emerald-400 transition-colors">Live Split-Screen Demo</Link></li>
              <li><Link to="/future-enhancements" className="hover:text-purple-400 transition-colors">Future Enhancements</Link></li>
            </ul>
          </div>

          {/* Col 3: Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Emergency Protocol</h4>
            <p className="text-xs text-slate-400">
              Campus Security Dispatch: <b>+1 (555) 911-0000</b>
              <br />
              Emergency Response Time: <b>&lt; 3 Minutes</b>
              <br />
              SLA Compliance: <b>98.4%</b>
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 CampusSOS – One Tap Intelligent Emergency Response System. Built for Hackathons & University Safety.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Radio className="w-3 h-3 text-emerald-400" />
              WebSocket Sub-50ms Mesh Online
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
