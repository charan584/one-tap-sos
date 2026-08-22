import React, { useState, useEffect } from 'react';
import { Smartphone, ShieldAlert, Server, Radio, Users, CheckCircle2, ChevronRight, ArrowDown } from 'lucide-react';

export const WorkflowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Student Trigger',
      subtitle: 'One Tap on SOS Button',
      icon: Smartphone,
      color: 'from-red-500 to-rose-600',
      badge: 'Step 01',
      description: '3-second cancel countdown initiates with audible tick. No forms or questions asked.',
    },
    {
      id: 2,
      title: 'SOS Button Arms',
      subtitle: 'Zero-Friction Countdown',
      icon: ShieldAlert,
      color: 'from-amber-500 to-orange-600',
      badge: 'Step 02',
      description: 'If uncancelled after 3.0s, device captures live GPS and locks student medical profile.',
    },
    {
      id: 3,
      title: 'Intelligent Backend',
      subtitle: 'Node + Express + Routing Engine',
      icon: Server,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Step 03',
      description: 'Auto-assigns nearest Security Patrol, Medical EMTs, and Dispatch Commander instantly.',
    },
    {
      id: 4,
      title: 'Campus Administration',
      subtitle: 'Socket.IO Real-Time Dispatch',
      icon: Radio,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Step 04',
      description: 'Live alarm sound triggers on admin screens. Dynamic interactive map routes units to GPS pin.',
    },
    {
      id: 5,
      title: 'Help Arrives & Resolves',
      subtitle: 'On-Scene Intervention',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Step 05',
      description: 'Responders arrive with medical sheet in hand. Incident logged and marked safely resolved.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          Animated Workflow Pipeline
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          How CampusSOS Responds in Seconds
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Every millisecond is optimized: pre-registered student data eliminating emergency response latency.
        </p>
      </div>

      {/* Horizontal Desktop Flow / Vertical Mobile Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = activeStep === idx;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`relative rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? 'bg-slate-900 border-red-500/80 shadow-xl shadow-red-500/20 scale-105 ring-2 ring-red-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Step Badge & Icon */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    isCurrent ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.badge}
                  </span>

                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white mb-1">
                  {step.title}
                </h3>
                <h4 className="text-xs font-semibold text-slate-400 mb-2">
                  {step.subtitle}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${isCurrent ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                  {isCurrent ? '● Active Step' : 'Click to inspect'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600 hidden md:block" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorkflowDiagram;
