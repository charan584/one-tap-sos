import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  User,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Phone,
  HeartPulse,
  Building2,
  Sparkles,
  Layers,
  Globe
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { loginStudent, registerStudent, loginAdmin, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Active tab: 'student-login' | 'register' | 'admin-login'
  const [activeTab, setActiveTab] = useState('student-login');

  // Student Login Form State
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Student Registration Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    mobile: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    department: 'Computer Science & AI',
    year: '3rd Year',
    hostelOrDayScholar: 'Hostel Block A',
    bloodGroup: 'O+',
    medicalConditions: '',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await loginStudent(studentEmail, studentPassword);
    if (res.success) {
      navigate('/student');
    } else {
      setError(res.message || 'Invalid student credentials');
    }
    setIsLoading(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await loginAdmin(adminEmail, adminPassword);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Invalid administrator credentials');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await registerStudent(registerData);
    if (res.success) {
      navigate('/student');
    } else {
      setError(res.message || 'Registration failed. Please check all fields.');
    }
    setIsLoading(false);
  };

  const handleQuickDemo = async (type = 'student') => {
    setIsLoading(true);
    await demoLogin(type);
    navigate(type === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-4">
        
        {/* Top Floating Badge & Branding */}
        <div className="text-center space-y-3 mb-6 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-lg text-xs font-semibold text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span>Campus Emergency Response Authentication</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome to Campus<span className="text-red-500">SOS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            One tap emergency alerting system. Please sign in, create your emergency profile, or access dispatch.
          </p>
        </div>

        {/* Unified 3-Option Auth Card */}
        <GlassCard className={`w-full transition-all duration-300 ${activeTab === 'register' ? 'max-w-2xl' : 'max-w-md'} p-6 sm:p-8 space-y-6 shadow-2xl border-slate-700/80`}>
          
          {/* Segmented 3-Way Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('student-login'); setError(''); }}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center truncate ${
                activeTab === 'student-login'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center truncate ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">New Account</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('admin-login'); setError(''); }}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center truncate ${
                activeTab === 'admin-login'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Admin Login</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 font-medium animate-fadeIn">
              ⚠️ {error}
            </div>
          )}

          {/* ================= OPTION 1: STUDENT LOGIN ================= */}
          {activeTab === 'student-login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4 animate-fadeIn">
              <div className="text-center pb-2">
                <h2 className="text-base font-extrabold text-white">Student Emergency Portal</h2>
                <p className="text-xs text-slate-400">Sign in to arm one-tap SOS and live GPS beacon.</p>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Campus Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="alex.rivera@campus.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? 'Retrieving Emergency Profile...' : 'Sign In as Student'}
              </button>
            </form>
          )}

          {/* ================= OPTION 2: CREATE NEW ACCOUNT ================= */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5 animate-fadeIn">
              <div className="text-center pb-2">
                <h2 className="text-base font-extrabold text-white">Create Student Emergency Profile</h2>
                <p className="text-xs text-slate-400">Your profile will automatically attach to any SOS trigger.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Student ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="STU-2024-8841"
                    value={registerData.studentId}
                    onChange={(e) => setRegisterData({ ...registerData, studentId: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 uppercase"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Campus Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@campus.edu"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 438-9921"
                    value={registerData.mobile}
                    onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Blood Group *</label>
                  <select
                    value={registerData.bloodGroup}
                    onChange={(e) => setRegisterData({ ...registerData, bloodGroup: e.target.value })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 font-bold"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Emergency Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Rivera (Mother)"
                    value={registerData.emergencyContactName}
                    onChange={(e) => setRegisterData({ ...registerData, emergencyContactName: e.target.value })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 993-4412"
                    value={registerData.emergencyContactNumber}
                    onChange={(e) => setRegisterData({ ...registerData, emergencyContactNumber: e.target.value })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-semibold block mb-1">Medical Conditions / Severe Allergies</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin allergy, Asthma, Diabetes (Optional)"
                    value={registerData.medicalConditions}
                    onChange={(e) => setRegisterData({ ...registerData, medicalConditions: e.target.value })}
                    className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isLoading ? 'Creating Emergency Dossier...' : 'Complete Registration & Arm SOS'}
              </button>
            </form>
          )}

          {/* ================= OPTION 3: ADMIN / DISPATCH LOGIN ================= */}
          {activeTab === 'admin-login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 animate-fadeIn">
              <div className="text-center pb-2">
                <h2 className="text-base font-extrabold text-white">Campus Dispatch Console</h2>
                <p className="text-xs text-slate-400">Authorized Safety Officers & Emergency Dispatchers.</p>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Dispatcher Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@campussos.edu"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                {isLoading ? 'Verifying Dispatch...' : 'Access Command Center'}
              </button>
            </form>
          )}

          {/* Quick Demo 1-Click Persona Login */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              ⚡ Instant 1-Click Test Personas
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-red-500/40 text-xs text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2 text-left truncate">
                  <span className="text-sm">🎓</span>
                  <div className="truncate">
                    <div className="font-bold text-white text-[11px] truncate">Alex Rivera</div>
                    <div className="text-[9px] text-slate-400 font-mono">Student • O+</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2 text-left truncate">
                  <span className="text-sm">🛡️</span>
                  <div className="truncate">
                    <div className="font-bold text-white text-[11px] truncate">Chief Jenkins</div>
                    <div className="text-[9px] text-slate-400 font-mono">Dispatcher</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Bottom Links: Split Screen Demo & Landing Page */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <Link
              to="/landing"
              className="flex items-center gap-1 text-slate-300 hover:text-white hover:underline font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Explore Platform Overview
            </Link>

            <Link
              to="/split-demo"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline font-bold"
            >
              <Layers className="w-3.5 h-3.5" />
              Live Split Demo
            </Link>
          </div>

        </GlassCard>

      </main>
    </div>
  );
};

export default LoginPage;
