import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  Radio,
  CheckCircle,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles,
  Smartphone,
  Navigation
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ToastNotificationContainer from '../components/common/ToastNotificationContainer';
import LiveTelemetryBar from '../components/student/LiveTelemetryBar';
import MedicalSheetCard from '../components/student/MedicalSheetCard';
import OneTapSOSButton from '../components/student/OneTapSOSButton';
import CountdownRing from '../components/student/CountdownRing';
import ActiveEmergencyRadar from '../components/student/ActiveEmergencyRadar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useSound } from '../context/SoundContext';
import { emergencyApi } from '../services/api';
import { getCurrentPosition } from '../utils/geoUtils';

export const StudentDashboard = () => {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const { socket, isConnected } = useSocket();
  const { playSuccessChime, stopEmergencySiren } = useSound();
  const navigate = useNavigate();

  // State
  const [coords, setCoords] = useState({
    latitude: 37.4275,
    longitude: -122.1697,
    accuracy: 4,
    zone: 'Main Campus Quad',
  });
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [lastGpsUpdate, setLastGpsUpdate] = useState(null);
  const [isResolving, setIsResolving] = useState(false);

  const locationIntervalRef = useRef(null);

  // Auto-login Alex Rivera if accessing page directly without session
  useEffect(() => {
    if (!isAuthenticated) {
      demoLogin('student');
    }
  }, [isAuthenticated]);

  // Fetch initial GPS coordinates
  useEffect(() => {
    const fetchGps = async () => {
      const pos = await getCurrentPosition();
      setCoords(pos);
    };
    fetchGps();
  }, []);

  // Listen to Socket for emergency status changes (e.g. Admin accepted, On Route, Resolved)
  useEffect(() => {
    if (!socket) return;

    const onStatusChange = (updatedEmergency) => {
      if (activeEmergency && updatedEmergency._id === activeEmergency._id) {
        setActiveEmergency(updatedEmergency);

        if (updatedEmergency.status === 'Resolved') {
          stopEmergencySiren();
          playSuccessChime();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
    };

    socket.on('emergency:status_change', onStatusChange);

    return () => {
      socket.off('emergency:status_change', onStatusChange);
    };
  }, [socket, activeEmergency]);

  // Live 5-second GPS Tracking Loop when SOS is active
  useEffect(() => {
    if (activeEmergency && activeEmergency.status !== 'Resolved') {
      locationIntervalRef.current = setInterval(async () => {
        // Jitter coordinate slightly for realistic GPS breadcrumbs simulation
        const deltaLat = (Math.random() - 0.5) * 0.00008;
        const deltaLng = (Math.random() - 0.5) * 0.00008;

        const newLat = Number((coords.latitude + deltaLat).toFixed(6));
        const newLng = Number((coords.longitude + deltaLng).toFixed(6));

        const updatedCoords = {
          ...coords,
          latitude: newLat,
          longitude: newLng,
        };
        setCoords(updatedCoords);

        try {
          // Send 5-second location ping to backend
          await emergencyApi.streamLocation({
            emergencyId: activeEmergency._id,
            latitude: newLat,
            longitude: newLng,
            accuracy: 3,
            zone: coords.zone,
          });

          // Socket Ping
          socket.emit('student:location_ping', {
            emergencyId: activeEmergency._id,
            studentId: user?.studentId,
            latitude: newLat,
            longitude: newLng,
            zone: coords.zone,
          });

          setLastGpsUpdate(new Date().toLocaleTimeString());
        } catch (err) {
          console.warn('GPS stream ping error:', err.message);
        }
      }, 5000);
    } else {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    }

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [activeEmergency, coords, user]);

  // 1. Student taps SOS button -> starts 3-second countdown
  const handlePressSOS = () => {
    setIsCountingDown(true);
  };

  // 2. Student cancels SOS during 3s window (False alarm)
  const handleCancelCountdown = () => {
    setIsCountingDown(false);
  };

  // 3. 3 Seconds Expired: Auto-dispatch emergency payload
  const handleConfirmSOS = async () => {
    setIsCountingDown(false);

    try {
      // Capture live GPS & send pre-stored student profile snapshot automatically
      const res = await emergencyApi.trigger({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy || 4,
        zone: coords.zone,
      });

      if (res.success) {
        setActiveEmergency(res.emergency);
      }
    } catch (err) {
      console.error('Trigger SOS API failed:', err);
      // Fallback emergency object for zero-interruption offline demo
      setActiveEmergency({
        _id: `emg-local-${Date.now()}`,
        studentSnapshot: user,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          zone: coords.zone,
          googleMapsUrl: `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`,
        },
        status: 'Pending',
        priority: 'High',
        assignedResponders: [
          { name: 'Officer Marcus Vance', role: 'Campus Security Patrol', callSign: 'PATROL-ALPHA', etaMinutes: 2 },
          { name: 'Paramedic Dr. Jason Lee', role: 'Rapid Medical Response', callSign: 'MEDIC-ONE', etaMinutes: 3 },
        ],
        timestamps: { triggeredAt: new Date() },
      });
    }
  };

  // Student Marks Safe / Resolves Emergency
  const handleResolveSOS = async () => {
    if (!activeEmergency) return;
    setIsResolving(true);

    try {
      await emergencyApi.resolve(activeEmergency._id, 'Student confirmed safe and secure via mobile app.');
    } catch (e) {
      console.warn('Resolve API error:', e);
    }

    stopEmergencySiren();
    playSuccessChime();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    setActiveEmergency(null);
    setIsResolving(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-red-500 selection:text-white">
      <Navbar />
      <ToastNotificationContainer />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                Student Emergency Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              One Tap Campus Response
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              activeEmergency ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {activeEmergency ? '🚨 SOS ACTIVE & STREAMING' : '🛡️ ARMED & STANDBY'}
            </span>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <LiveTelemetryBar
          currentCoords={coords}
          onLocationChange={(newCoords) => setCoords(newCoords)}
        />

        {/* Dynamic View: If SOS is Active vs Standby Ready View */}
        {activeEmergency ? (
          <ActiveEmergencyRadar
            emergency={activeEmergency}
            onResolve={handleResolveSOS}
            currentCoords={coords}
            lastGpsUpdate={lastGpsUpdate}
          />
        ) : (
          <div className="space-y-6">
            
            {/* The Central One Tap SOS Button */}
            <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              <OneTapSOSButton onTriggerSOS={handlePressSOS} />
            </div>

            {/* Pre-Loaded Student Profile Dossier */}
            <MedicalSheetCard student={user} />

          </div>
        )}

      </main>

      {/* 3-Second Accidental Countdown Ring Modal */}
      {isCountingDown && (
        <CountdownRing
          duration={3}
          onConfirm={handleConfirmSOS}
          onCancel={handleCancelCountdown}
        />
      )}

    </div>
  );
};

export default StudentDashboard;
