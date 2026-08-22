import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import WorkflowDiagram from '../components/landing/WorkflowDiagram';
import FeaturesSection from '../components/landing/FeaturesSection';
import SystemArchitecture from '../components/landing/SystemArchitecture';
import FutureRoadmapSection from '../components/landing/FutureRoadmapSection';
import Footer from '../components/landing/Footer';
import ToastNotificationContainer from '../components/common/ToastNotificationContainer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-red-500 selection:text-white">
      <Navbar />
      <ToastNotificationContainer />
      <main className="flex-1 space-y-12">
        <HeroSection />
        <WorkflowDiagram />
        <FeaturesSection />
        <SystemArchitecture />
        <FutureRoadmapSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
