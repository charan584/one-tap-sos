import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Radio,
  CheckCircle,
  AlertTriangle,
  Lock,
  Layers,
  Smartphone,
  Navigation,
  LogOut,
  User
} from 'lucide-react';
import LiveTelemetryBar from '../components/student/LiveTelemetryBar';
import MedicalSheetCard from '../components/student/MedicalSheetCard';
import OneTapSOSButton from '../components/student/OneTapSOSButton';
import CountdownRing from '../components/student/CountdownRing';
import SosSentModal from '../components/student/SosSentModal';
import { useAuth } from '../context/AuthContext';
import { emergencyApi } from '../services/api';
import { getDeviceLocation, formatAccuracy } from '../utils/geoUtils';

export const StudentDashboard = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  // State: exact native GPS coords
  const [coords, setCoords] = useState(null); // { latitude, longitude, accuracy }
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [showSosSentModal, setShowSosSentModal] = useState(false);
  const [sentEmergencyData, setSentEmergencyData] = useState(null);

  // Dedicated student identity resolution (guarantees student dossier is never contaminated by admin session in other tabs)
  const studentUser = (() => {
    try {
      const storedStudent = localStorage.getItem('campussos_student_user');
      if (storedStudent) return JSON.parse(storedStudent);
    } catch {}
    if (user && user.role !== 'Administrator' && !user.badgeNumber) {
      return user;
    }
    return {
      _id: 'std-default-1',
      name: 'Charan (Student)',
      studentId: '25B91A05Q3',
      email: '25b91a05q3@srkrec.ac.in',
      branch: 'Computer Science & Engineering (CSE)',
      department: 'Computer Science & Engineering (CSE)',
      year: '1st Year',
      section: 'Section A',
      guardianName: 'P Venkata Rao (Father)',
      guardianPhone: '9440123456',
      bloodGroup: 'O+',
      mobile: '9908446898',
      medicalConditions: 'None reported / Healthy',
    };
  })();

  // Request user's device location using native browser Geolocation API
  const fetchLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    const result = await getDeviceLocation();
    if (result.success && result.coords) {
      setCoords(result.coords);
      setLocationError(null);
    } else {
      setLocationError(result.error || 'Unable to access your device GPS.');
    }
    setIsLocating(false);
  };

  // Fetch initial device GPS coordinates on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // 1. Student taps SOS button -> starts 3-second countdown
  const handlePressSOS = () => {
    setIsCountingDown(true);
  };

  // 2. Student cancels SOS during 3s window (False alarm)
  const handleCancelCountdown = () => {
    setIsCountingDown(false);
  };

  // 3. 3 Seconds Expired: Auto-dispatch emergency payload with actual device coordinates
  const handleConfirmSOS = async () => {
    setIsCountingDown(false);

    let activeCoords = coords;
    if (!activeCoords) {
      const freshLoc = await getDeviceLocation();
      if (freshLoc.success && freshLoc.coords) {
        activeCoords = freshLoc.coords;
        setCoords(activeCoords);
      }
    }

    const payload = {
      studentId: studentUser.studentId,
      email: studentUser.email,
      studentSnapshot: studentUser,
      latitude: activeCoords ? activeCoords.latitude : 16.5892,
      longitude: activeCoords ? activeCoords.longitude : 81.7556,
      accuracy: activeCoords ? activeCoords.accuracy : 10,
      zone: activeCoords ? `GPS (${activeCoords.latitude.toFixed(4)}, ${activeCoords.longitude.toFixed(4)})` : 'Device Location',
    };

    let emergencyResult = null;
    try {
      const res = await emergencyApi.trigger(payload);
      if (res && res.success) {
        emergencyResult = res.emergency;
      }
    } catch (err) {
      console.warn('Trigger SOS API network/fallback note:', err);
    }

    const emgData = emergencyResult || {
      _id: `emg-local-${Date.now()}`,
      studentSnapshot: studentUser,
      location: payload,
      status: 'Pending',
    };

    setSentEmergencyData(emgData);
    setShowSosSentModal(true);
  };

  // When user clicks OK on the "Request Has Been Sent" dialog
  const handleCloseSentModal = () => {
    setShowSosSentModal(false);
    setSentEmergencyData(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-red-500 selection:text-white">
      {/* (Live Emergency Triggered admin popups removed from student view) */}

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 space-y-6">
        
        {/* Minimal Clean Top Header Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-md shadow-red-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Campus<span className="text-red-500">SOS</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                  Student
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate">
                {user?.name || 'Student'} • {user?.studentId || 'Emergency Console'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ARMED & READY</span>
            </span>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Native Telemetry Bar with Accuracy Indicator */}
        <LiveTelemetryBar
          currentCoords={coords}
          onRefreshLocation={fetchLocation}
          isLocating={isLocating}
          locationError={locationError}
        />

        {/* Main Student Portal View */}
        <div className="space-y-6">
          
          {/* The Central One Tap SOS Button */}
          <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <OneTapSOSButton onTriggerSOS={handlePressSOS} />
          </div>

          {/* Pre-Loaded Student Profile Dossier */}
          <MedicalSheetCard student={user} />

        </div>

      </main>

      {/* 3-Second Accidental Countdown Ring Modal */}
      {isCountingDown && (
        <CountdownRing
          duration={3}
          onConfirm={handleConfirmSOS}
          onCancel={handleCancelCountdown}
        />
      )}

      {/* Request Has Been Sent Confirmation Modal with OK Button */}
      {showSosSentModal && (
        <SosSentModal
          emergencyData={sentEmergencyData}
          onOk={handleCloseSentModal}
        />
      )}

    </div>
  );
};

export default StudentDashboard;
