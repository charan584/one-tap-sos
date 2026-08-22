import React from 'react';
import {
  ShieldAlert,
  Zap,
  MapPin,
  HeartPulse,
  Radio,
  Clock,
  Layers,
  Lock,
  Compass
} from 'lucide-react';
import GlassCard from '../common/GlassCard';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      title: 'One Tap SOS Trigger',
      desc: 'Zero confirmation modals, zero drop-down forms. One tap triggers a 3-second accidental countdown, then broadcasts instantly.',
    },
    {
      icon: HeartPulse,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: 'Automated Medical Vitals',
      desc: 'Blood group, chronic conditions, and emergency kin contacts are transmitted automatically from the pre-authenticated student profile.',
    },
    {
      icon: Radio,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      title: '5-Second Live GPS Stream',
      desc: 'Dynamic real-time telemetry updates student coordinates every 5 seconds, providing breadcrumb tracks if the student moves.',
    },
    {
      icon: Layers,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: 'Tri-Tier Intelligent Routing',
      desc: 'Auto-assigns Campus Security Patrol, Medical Response Team, and Campus Dispatcher with computed Haversine distance and ETAs.',
    },
    {
      icon: MapPin,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Tactical Interactive Map',
      desc: 'Real-time Leaflet campus map showing student beacon, patrol vehicles, route polylines, and direct Google Maps navigation.',
    },
    {
      icon: Lock,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: 'JWT Authenticated & Secure',
      desc: 'Bcrypt encrypted credentials and stateless JSON Web Tokens ensure strict role-based separation between students and campus officers.',
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest">
          Platform Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Engineered for Extreme Urgency
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Every second counts during a campus emergency. Our architecture eliminates friction at every layer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <GlassCard key={i} hover className="space-y-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${f.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
