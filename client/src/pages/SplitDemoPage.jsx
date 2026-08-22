import React, { useState, useEffect } from 'react';
import {
  Layers,
  Smartphone,
  ShieldAlert,
  Radio,
  Sparkles,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ToastNotificationContainer from '../components/common/ToastNotificationContainer';
import OneTapSOSButton from '../components/student/OneTapSOSButton';
import CountdownRing from '../components/student/CountdownRing';
import LiveTelemetryBar from '../components/student/LiveTelemetryBar';
import MedicalSheetCard from '../components/student/MedicalSheetCard';
import ActiveEmergencyRadar from '../components/student/ActiveEmergencyRadar';
import LiveEmergencyTable from '../components/admin/LiveEmergencyTable';
import InteractiveLiveMap from '../components/admin/InteractiveLiveMap';
import MetricCards from '../components/admin/MetricCards';
import EmergencyDetailModal from '../components/admin/EmergencyDetailModal';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useSound } from '../context/SoundContext';
import { emergencyApi, dashboardApi, responderApi } from '../services/api';
import { getCurrentPosition } from '../utils/geoUtils';
import confetti from 'canvas-confetti';

export const SplitDemoPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { playDispatchAlarm, playSuccessChime, stopEmergencySiren } = useSound();

  // Student State
  const [studentUser, setStudentUser] = useState({
    name: 'Alex Rivera',
    studentId: 'STU-2024-8841',
    department: 'Computer Science & AI',
    year: '3rd Year',
    hostelOrDayScholar: 'Hostel Block C',
    bloodGroup: 'O+',
    medicalConditions: 'Severe Penicillin Allergy • Asthma (Carries Inhaler)',
    mobile: '+1 (555) 438-9921',
    emergencyContactName: 'Elena Rivera (Mother)',
    emergencyContactNumber: '+1 (555) 993-4412',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [coords, setCoords] = useState({
    latitude: 37.4275,
    longitude: -122.1697,
    accuracy: 4,
    zone: 'Main Campus Quad',
  });
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [lastGpsUpdate, setLastGpsUpdate] = useState(null);

  // Admin State
  const [emergencies, setEmergencies] = useState([]);
  const [responders, setResponders] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const fetchAdminData = async () => {
    try {
      const [emgRes, statsRes, respRes] = await Promise.all([
        emergencyApi.getAll(),
        dashboardApi.getStats(),
        responderApi.getAll(),
      ]);

      if (emgRes.success) setEmergencies(emgRes.emergencies);
      if (statsRes.success) setStats(statsRes.stats);
      if (respRes.success) setResponders(respRes.responders);
    } catch (e) {
      console.warn('Split demo fetch error:', e);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Socket sync
  useEffect(() => {
    if (!socket) return;

    const onNewEmergency = (newEmergency) => {
      setEmergencies((prev) => [newEmergency, ...prev.filter(e => e._id !== newEmergency._id)]);
      fetchAdminData();
      playDispatchAlarm();
    };

    const onStatusChange = (updatedEmergency) => {
      setEmergencies((prev) =>
        prev.map(e => (e._id === updatedEmergency._id ? updatedEmergency : e))
      );
      if (activeEmergency && activeEmergency._id === updatedEmergency._id) {
        setActiveEmergency(updatedEmergency);
      }
      fetchAdminData();
    };

    const onStudentLoc = (locData) => {
      setEmergencies((prev) =>
        prev.map(e => (e._id === locData.emergencyId ? { ...e, location: { ...e.location, latitude: locData.latitude, longitude: locData.longitude } } : e))
      );
    };

    socket.on('emergency:new', onNewEmergency);
    socket.on('emergency:status_change', onStatusChange);
    socket.on('student:location_update', onStudentLoc);

    return () => {
      socket.off('emergency:new', onNewEmergency);
      socket.off('emergency:status_change', onStatusChange);
      socket.off('student:location_update', onStudentLoc);
    };
  }, [socket, activeEmergency]);

  // Handle SOS Confirmation
  const handleConfirmSOS = async () => {
    setIsCountingDown(false);

    try {
      const res = await emergencyApi.trigger({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        zone: coords.zone,
      });

      if (res.success) {
        setActiveEmergency(res.emergency);
      }
    } catch (err) {
      console.warn('API error:', err);
    }
  };

  const handleResolve = async (id, notes) => {
    try {
      await emergencyApi.resolve(id, notes || 'Resolved via Split Screen Demo Console');
      stopEmergencySiren();
      playSuccessChime();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      setActiveEmergency(null);
      fetchAdminData();
    } catch (e) {
      console.warn('Resolve error:', e);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await emergencyApi.accept(id);
      if (res.success) {
        fetchAdminData();
      }
    } catch (e) {
      console.error('Accept error:', e);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await emergencyApi.updateStatus(id, status);
      if (res.success) {
        fetchAdminData();
      }
    } catch (e) {
      console.error('Update status error:', e);
    }
  };

  const activeEmgList = emergencies.filter(e => ['Pending', 'Accepted', 'On Route', 'Arrived'].includes(e.status));
  const latestEmg = activeEmergency || activeEmgList[0] || emergencies[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <ToastNotificationContainer />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-emerald-500/20 py-2.5 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-300">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span><b>Live Split-Screen Hackathon Demo Mode:</b> Tap SOS on the Left Mobile Screen to see it broadcast in real-time to the Right Admin Dispatcher!</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Mobile Device (5 Cols) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <Smartphone className="w-4 h-4" />
              <span>STUDENT MOBILE VIEW</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Alex Rivera (STU-2024-8841)</span>
          </div>

          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
            <LiveTelemetryBar
              currentCoords={coords}
              onLocationChange={(newCoords) => setCoords(newCoords)}
            />

            {activeEmergency ? (
              <ActiveEmergencyRadar
                emergency={activeEmergency}
                onResolve={() => handleResolve(activeEmergency._id)}
                currentCoords={coords}
                lastGpsUpdate={lastGpsUpdate}
              />
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-950 border border-slate-800/80 p-4">
                  <OneTapSOSButton onTriggerSOS={() => setIsCountingDown(true)} />
                </div>
                <MedicalSheetCard student={studentUser} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Admin Command Center (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-xs">
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <ShieldAlert className="w-4 h-4" />
              <span>CAMPUS DISPATCH COMMAND CENTER</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">● Socket Broadcast Synced</span>
          </div>

          <div className="space-y-4">
            <MetricCards stats={stats} />

            <InteractiveLiveMap
              activeEmergency={latestEmg}
              responders={responders}
              className="h-80 sm:h-96"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Real-Time Incident Triage Queue</span>
                <span className="text-slate-500 font-normal">{emergencies.length} Total Cases</span>
              </div>

              <LiveEmergencyTable
                emergencies={emergencies}
                onAccept={handleAccept}
                onUpdateStatus={handleUpdateStatus}
                onResolve={(id) => handleResolve(id)}
                onSelectEmergency={(emg) => setSelectedEmergency(emg)}
                selectedEmergencyId={selectedEmergency?._id}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Countdown Ring */}
      {isCountingDown && (
        <CountdownRing
          duration={3}
          onConfirm={handleConfirmSOS}
          onCancel={() => setIsCountingDown(false)}
        />
      )}

      {/* Emergency Detail Modal */}
      {selectedEmergency && (
        <EmergencyDetailModal
          emergency={selectedEmergency}
          onClose={() => setSelectedEmergency(null)}
          onAccept={handleAccept}
          onUpdateStatus={handleUpdateStatus}
          onResolve={handleResolve}
        />
      )}

    </div>
  );
};

export default SplitDemoPage;
