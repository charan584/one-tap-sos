import React from 'react';
import Navbar from '../components/common/Navbar';
import FutureRoadmapSection from '../components/landing/FutureRoadmapSection';
import Footer from '../components/landing/Footer';
import ToastNotificationContainer from '../components/common/ToastNotificationContainer';
import { Sparkles, BrainCircuit, Smartphone, Compass } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const FutureEnhancementsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-purple-500 selection:text-white">
      <Navbar />
      <ToastNotificationContainer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Roadmap & Architecture Horizons
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Future Enhancements & Research
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            The next generation of CampusSOS combines edge AI acoustic detection, cross-platform mobile binaries with Capacitor, sub-meter indoor beacons, and discrete silent SOS triggers.
          </p>
        </div>

        {/* Deep Dive Roadmap Grid */}
        <FutureRoadmapSection />

        {/* Strategic Specifications Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <GlassCard className="space-y-3 border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <BrainCircuit className="w-5 h-5" />
              On-Device Acoustic Edge Intelligence
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              By deploying lightweight quantized TensorFlow Lite / ONNX neural networks directly onto the student client, the app can detect screams, gunshots, or distress vocal cues even before the physical SOS button is pressed.
            </p>
          </GlassCard>

          <GlassCard className="space-y-3 border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Compass className="w-5 h-5" />
              Sub-Meter Multi-Floor Beacon Localization
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard GPS degrades inside multi-story campus libraries and dormitories. We integrate Bluetooth Low Energy (BLE) Eddystone beacons to calculate exact 3D coordinates (Floor 3, Lab Room 302) for arriving paramedics.
            </p>
          </GlassCard>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default FutureEnhancementsPage;
