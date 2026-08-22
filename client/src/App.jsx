import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { SoundProvider } from './context/SoundContext';
import { ThemeProvider } from './context/ThemeContext';

import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SplitDemoPage from './pages/SplitDemoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import FutureEnhancementsPage from './pages/FutureEnhancementsPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SoundProvider>
          <SocketProvider>
            <BrowserRouter>
              <Routes>
                {/* Default 1st Appearance: Unified Auth & Login Portal */}
                <Route path="/" element={<LoginPage />} />

                {/* Landing Showcase Homepage */}
                <Route path="/landing" element={<LandingPage />} />

                {/* Student Mobile SOS Emergency Portal */}
                <Route path="/student" element={<StudentDashboard />} />

                {/* Campus Administration Dispatch Command Center */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Hackathon Synchronized Split Screen Live Demo */}
                <Route path="/split-demo" element={<SplitDemoPage />} />

                {/* Authentication Portals */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Future Roadmap & Specifications */}
                <Route path="/future-enhancements" element={<FutureEnhancementsPage />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </SoundProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
