import React from 'react';
import {
  Sparkles,
  BrainCircuit,
  Smartphone,
  Vibrate,
  Mic,
  EyeOff,
  Watch,
  Activity,
  Compass,
  MessageSquareShare
} from 'lucide-react';
import GlassCard from '../common/GlassCard';

export const FutureRoadmapSection = () => {
  const enhancements = [
    {
      icon: BrainCircuit,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: 'AI Emergency Classification',
      status: 'Research & Triage Model',
      desc: 'Machine learning NLP models to process ambient acoustic noise and automatically categorize emergency severity (medical vs security vs fire) with zero student cognitive load.',
    },
    {
      icon: Smartphone,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      title: 'Android & iOS APK via Capacitor',
      status: 'Cross-Platform Mobile Core',
      desc: 'Packaging CampusSOS into native Android and iOS applications with background wake locks, persistent status bar emergency widgets, and home-screen SOS lock.',
    },
    {
      icon: Vibrate,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Shake Detection Trigger',
      status: 'Accelerometer Integration',
      desc: 'Hardware accelerometer heuristics triggering the 3-second SOS countdown when a user vigorously shakes their mobile phone 3 times in rapid succession.',
    },
    {
      icon: Mic,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Voice-Activated Hotword Trigger',
      status: 'On-Device Audio Processing',
      desc: 'Low-power on-device hotword listener (e.g. "Campus SOS Help") designed for situations where hands are restrained or physically unreachable.',
    },
    {
      icon: EyeOff,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      title: 'Stealth / Silent SOS Mode',
      status: 'Hostage & Threat Protocol',
      desc: 'Triggering SOS by tapping power button 5 times with screen completely blacked out, zero siren sounds, and discrete GPS beaconing.',
    },
    {
      icon: Watch,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: 'Wearable Device Integration',
      status: 'Apple Watch & WearOS SDK',
      desc: 'Companion smartwatch complications enabling one-tap emergency triggers and real-time heart rate / SpO2 telemetry streaming to paramedics.',
    },
    {
      icon: Activity,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: 'Automatic Fall & Crash Detection',
      status: 'Sensor Fusion Algorithm',
      desc: 'Gyroscope and barometer sensor fusion detecting hard impacts followed by 30 seconds of immobility to autonomously trigger medical dispatch.',
    },
    {
      icon: Compass,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      title: 'Indoor Sub-Meter Navigation',
      status: 'BLE Beacons & Wi-Fi RTT',
      desc: 'Integrating campus Bluetooth Low Energy (BLE) beacons and Wi-Fi Round-Trip-Time (RTT) for floor-level and room-level pinpoint accuracy.',
    },
    {
      icon: MessageSquareShare,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      title: 'Cellular SMS & USSD Backup',
      status: 'Zero-Internet Redundancy',
      desc: 'Automatic fallback to GSM SMS payload encryption and USSD gateway dispatch when campus Wi-Fi or cellular mobile data is disconnected.',
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Future Enhancements & Roadmap
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Next-Generation Emergency Ecosystem
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Strategic research and hardware extensions designed to extend campus safety to wearables, edge AI, and offline cellular meshes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <GlassCard key={idx} hover className="space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 text-[10px] font-mono text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Roadmap Item #{idx + 1}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
};

export default FutureRoadmapSection;
