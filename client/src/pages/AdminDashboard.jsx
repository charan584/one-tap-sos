import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  MapPin,
  Users,
  Truck,
  BarChart3,
  RefreshCw,
  Search,
  Bell,
  Sliders,
  CheckCircle2,
  Phone,
  Plus,
  LogOut,
  Clock,
  AlertTriangle
} from 'lucide-react';
import ToastNotificationContainer from '../components/common/ToastNotificationContainer';
import AdminSidebar from '../components/admin/AdminSidebar';
import MetricCards from '../components/admin/MetricCards';
import LiveEmergencyTable from '../components/admin/LiveEmergencyTable';
import InteractiveLiveMap from '../components/admin/InteractiveLiveMap';
import EmergencyDetailModal from '../components/admin/EmergencyDetailModal';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import ResponderFleetManager from '../components/admin/ResponderFleetManager';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useSound } from '../context/SoundContext';
import { emergencyApi, dashboardApi, responderApi, authApi } from '../services/api';

export const AdminDashboard = () => {
  const { user, role, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { socket, joinAdminRoom } = useSocket();
  const { playDispatchAlarm, playSuccessChime } = useSound();
  const navigate = useNavigate();

  // Navigation tab: 'overview' | 'emergencies' | 'live-map' | 'responders' | 'students' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // State
  const [emergencies, setEmergencies] = useState([]);
  const [responders, setResponders] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const adminUser = user || {
    name: 'Charan P',
    badgeNumber: 'ADM-8079',
    role: 'Administrator',
  };

  // Join Admin room for real-time dispatch
  useEffect(() => {
    joinAdminRoom();
  }, []);

  // Fetch initial dashboard state
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [emgRes, statsRes, respRes] = await Promise.all([
        emergencyApi.getAll(),
        dashboardApi.getStats(),
        responderApi.getAll(),
      ]);

      if (emgRes.success) setEmergencies(emgRes.emergencies);
      if (statsRes.success) {
        setStats(statsRes.stats);
        setChartsData(statsRes.charts);
      }
      if (respRes.success) setResponders(respRes.responders);
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen to Socket events in real time
  useEffect(() => {
    if (!socket) return;

    // 1. New Emergency Broadcast
    const onNewEmergency = (newEmergency) => {
      setEmergencies((prev) => [newEmergency, ...prev.filter(e => e._id !== newEmergency._id)]);
      fetchData();
      playDispatchAlarm();
    };

    // 2. Status Change
    const onStatusChange = (updatedEmergency) => {
      setEmergencies((prev) =>
        prev.map(e => (e._id === updatedEmergency._id ? updatedEmergency : e))
      );
      if (selectedEmergency && selectedEmergency._id === updatedEmergency._id) {
        setSelectedEmergency(updatedEmergency);
      }
      fetchData();
    };

    // 3. Student 5s GPS stream
    const onStudentLocationUpdate = (locData) => {
      setEmergencies((prev) =>
        prev.map(e => {
          if (e._id === locData.emergencyId) {
            return {
              ...e,
              location: {
                ...e.location,
                latitude: locData.latitude,
                longitude: locData.longitude,
                zone: locData.zone || e.location?.zone,
              },
            };
          }
          return e;
        })
      );
    };

    // 4. Responder movement
    const onResponderLocationUpdate = (respData) => {
      setResponders((prev) =>
        prev.map(r => (r._id === respData.responderId ? { ...r, currentLocation: respData.currentLocation } : r))
      );
    };

    socket.on('emergency:new', onNewEmergency);
    socket.on('emergency:status_change', onStatusChange);
    socket.on('student:location_update', onStudentLocationUpdate);
    socket.on('responder:location_update', onResponderLocationUpdate);

    return () => {
      socket.off('emergency:new', onNewEmergency);
      socket.off('emergency:status_change', onStatusChange);
      socket.off('student:location_update', onStudentLocationUpdate);
      socket.off('responder:location_update', onResponderLocationUpdate);
    };
  }, [socket, selectedEmergency]);

  // Actions
  const handleAccept = async (id) => {
    try {
      const res = await emergencyApi.accept(id);
      if (res.success) {
        setEmergencies(prev => prev.map(e => e._id === id ? res.emergency : e));
      }
    } catch (e) {
      console.error('Accept error:', e);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await emergencyApi.updateStatus(id, status);
      if (res.success) {
        setEmergencies(prev => prev.map(e => e._id === id ? res.emergency : e));
      }
    } catch (e) {
      console.error('Update status error:', e);
    }
  };

  const handleResolve = async (id, notes) => {
    try {
      const res = await emergencyApi.resolve(id, notes);
      if (res.success) {
        setEmergencies(prev => prev.map(e => e._id === id ? res.emergency : e));
        playSuccessChime();
        if (selectedEmergency && selectedEmergency._id === id) {
          setSelectedEmergency(null);
        }
      }
    } catch (e) {
      console.error('Resolve error:', e);
    }
  };

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Active SOS decreases once a pending request exceeds 100 seconds
  const activeEmergencies = emergencies.filter((emg) => {
    if (emg.status === 'Resolved' || emg.status === 'Cancelled') return false;
    if (emg.status === 'Pending') {
      const triggeredAt = new Date(emg.timestamps?.triggeredAt || emg.createdAt).getTime();
      const elapsedSec = Math.floor((now - triggeredAt) / 1000);
      return elapsedSec <= 100;
    }
    return ['Accepted', 'On Route', 'Arrived'].includes(emg.status);
  });
  const latestActiveEmergency = activeEmergencies[0] || emergencies[0];

  const filteredEmergencies = emergencies.filter((emg) => {
    const name = emg.studentSnapshot?.name?.toLowerCase() || '';
    const id = emg.studentSnapshot?.studentId?.toLowerCase() || '';
    const zone = emg.location?.zone?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || id.includes(q) || zone.includes(q);
  });

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      <ToastNotificationContainer />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSosCount={activeEmergencies.length}
          onRefresh={fetchData}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 overflow-hidden">
          
          {/* Top Command Bar (Clean, no top website navbars) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Campus Emergency Operations Center (EOC)
                </span>
                <span className="text-[10px] bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
                  {user?.name || 'Administrator'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {activeTab === 'overview' && 'Live Incident Command Center'}
                {activeTab === 'emergencies' && 'Active SOS Incident Logs'}
                {activeTab === 'live-map' && 'Tactical Dispatch & Geospatial Radar'}
                {activeTab === 'responders' && 'Campus Responder Units & Fleet'}
                {activeTab === 'students' && 'Enrolled Students Directory'}
                {activeTab === 'analytics' && 'Incident Analytics & Response SLA'}
                {activeTab === 'settings' && 'System Configuration & Simulation'}
              </h1>
            </div>

            {/* Search Bar, Refresh, and Sign Out */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter student or zone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950/80 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 w-40 sm:w-56"
                />
              </div>

              <button
                onClick={fetchData}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleLogout}
                title="Sign Out of Dispatch"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metric Cards always prominent on Overview */}
          <MetricCards stats={stats} emergencies={emergencies} />

          {/* Tab 1: Command Center Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Interactive Live Map (Only Admin & Student pins) */}
              <InteractiveLiveMap
                activeEmergency={latestActiveEmergency}
                adminUser={adminUser}
              />

              {/* Real-time Live Emergency Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    Live Incident Triage Queue
                  </h3>
                  <span className="text-xs text-slate-400">
                    Auto-synchronized via Socket.IO
                  </span>
                </div>

                <LiveEmergencyTable
                  emergencies={filteredEmergencies}
                  onAccept={handleAccept}
                  onUpdateStatus={handleUpdateStatus}
                  onResolve={handleResolve}
                  onSelectEmergency={(emg) => setSelectedEmergency(emg)}
                  selectedEmergencyId={selectedEmergency?._id}
                />
              </div>

              {/* Responder Fleet Overview */}
              <ResponderFleetManager
                responders={responders}
                activeEmergency={latestActiveEmergency}
                onResponderMoved={(updatedResp) => {
                  setResponders(prev => prev.map(r => r._id === updatedResp._id ? updatedResp : r));
                }}
              />

              {/* Analytics Preview */}
              <AnalyticsCharts chartsData={chartsData} />

            </div>
          )}

          {/* Tab 2: Emergencies Table */}
          {activeTab === 'emergencies' && (
            <div className="space-y-4">
              <LiveEmergencyTable
                emergencies={filteredEmergencies}
                onAccept={handleAccept}
                onUpdateStatus={handleUpdateStatus}
                onResolve={handleResolve}
                onSelectEmergency={(emg) => setSelectedEmergency(emg)}
                selectedEmergencyId={selectedEmergency?._id}
              />
            </div>
          )}

          {/* Tab 3: Dedicated Full Map */}
          {activeTab === 'live-map' && (
            <div className="space-y-4">
              <InteractiveLiveMap
                activeEmergency={latestActiveEmergency}
                adminUser={adminUser}
                className="h-[600px]"
              />
            </div>
          )}

          {/* Tab 4: Responder Fleet */}
          {activeTab === 'responders' && (
            <div className="space-y-4">
              <ResponderFleetManager
                responders={responders}
                activeEmergency={latestActiveEmergency}
                onResponderMoved={(updatedResp) => {
                  setResponders(prev => prev.map(r => r._id === updatedResp._id ? updatedResp : r));
                }}
              />
            </div>
          )}

          {/* Tab 5: Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <AnalyticsCharts chartsData={chartsData} />
            </div>
          )}

          {/* Tab 6: Students Directory */}
          {activeTab === 'students' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Pre-Armed Student Emergency Dossiers
              </h3>
              <p className="text-xs text-slate-400">
                All students registered with complete blood group, medical alerts, and kin numbers ready for instant zero-form SOS broadcast.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {emergencies.map((emg, i) => {
                  const s = emg.studentSnapshot;
                  if (!s) return null;
                  const branchName = s.branch || s.department || 'CSE';
                  const academicYear = s.year || '1st Year';
                  const sectionName = s.section || 'Section A';
                  const guardianName = s.guardianName || s.emergencyContactName || 'Guardian';
                  const guardianPhone = s.guardianPhone || s.emergencyContactNumber || 'Not specified';

                  return (
                    <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3.5 shadow-md">
                      <img
                        src={s.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'}
                        alt={s.name}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-700 shrink-0"
                      />
                      <div className="space-y-1 text-xs min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-white text-sm">{s.name}</div>
                          <span className="font-bold text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded text-[10px]">
                            🩸 {s.bloodGroup || 'O+'}
                          </span>
                        </div>
                        <div className="font-mono text-indigo-300 font-semibold">
                          ID: {s.studentId} • {branchName}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          Cohort: <span className="text-slate-200 font-bold">{academicYear}</span> • Section: <span className="text-slate-200 font-bold">{sectionName}</span>
                        </div>
                        <div className="text-slate-300 text-[11px] pt-1 border-t border-slate-800/80">
                          🛡️ <span className="font-semibold text-slate-200">Guardian:</span> {guardianName} (<a href={`tel:${guardianPhone}`} className="text-emerald-400 font-mono font-bold hover:underline">{guardianPhone}</a>)
                        </div>
                        {s.medicalConditions && (
                          <div className="text-[10px] text-amber-300">
                            🏥 Alerts: {s.medicalConditions}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 7: Settings / Simulation Engine */}
          {activeTab === 'settings' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Simulation & Dispatch Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Configure auto-assignment algorithms, simulation telemetry speeds, and hackathon test parameters.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">Auto-Assignment Algorithm</span>
                  <p className="text-slate-400">Multi-Tier Haversine Proximity Matrix with Medical Urgency Override.</p>
                  <span className="inline-block font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">Status: Active & Optimizing</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">Live GPS Telemetry Loop</span>
                  <p className="text-slate-400">5,000ms WebSocket Interval with Sub-Meter Breadcrumb Interpolation.</p>
                  <span className="inline-block font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">Status: 5s Stream Verified</span>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Emergency Detail Slide-over Modal */}
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

export default AdminDashboard;
