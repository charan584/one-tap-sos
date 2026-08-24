import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Mail,
  Lock,
  LogIn,
  Shield,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  UserPlus,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const {
    user,
    role,
    isAuthenticated,
    isLoading: authLoading,
    loginStudent,
    registerStudent,
    sendRegisterOtp,
    sendForgotPasswordOtp,
    verifyForgotPasswordOtp,
    sendAdminLoginOtp,
    verifyAdminLoginOtp,
    sendAdminRegisterOtp,
    verifyAdminRegisterOtp
  } = useAuth();

  const navigate = useNavigate();

  // Automatically open dashboard if an active logged in session token exists in localStorage
  useEffect(() => {
    const hasStoredToken = !!localStorage.getItem('campussos_token');
    const storedRole = localStorage.getItem('campussos_role');
    if (!authLoading && hasStoredToken) {
      if (storedRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    }
  }, [authLoading, navigate]);

  // Mode: 'login' | 'register' | 'forgot-password' | 'admin' | 'admin-register'
  const [mode, setMode] = useState('login');

  // Step states
  const [regStep, setRegStep] = useState(1);       // Student Register: 1 (Form) | 2 (OTP)
  const [fpStep, setFpStep] = useState(1);         // Forgot Password: 1 (Email) | 2 (OTP & New Pass)
  const [adminLoginStep, setAdminLoginStep] = useState(1); // Admin Login: 1 (Form) | 2 (OTP)
  const [adminRegStep, setAdminRegStep] = useState(1);     // Admin Register: 1 (Form) | 2 (OTP)

  // Student Login Form State
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSecretCode, setAdminSecretCode] = useState('');
  const [adminLoginOtp, setAdminLoginOtp] = useState('');

  // Admin Registration Form State
  const [adminRegData, setAdminRegData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    secretCode: '',
  });
  const [adminRegOtp, setAdminRegOtp] = useState('');

  // Student Registration Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    mobile: '',
    branch: 'Computer Science & Engineering (CSE)',
    department: 'Computer Science & Engineering (CSE)',
    year: '1st Year',
    section: 'Section A',
    guardianName: '',
    guardianPhone: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    hostelOrDayScholar: 'Hostel Block A',
    bloodGroup: 'O+',
    medicalConditions: '',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });
  const [registerOtp, setRegisterOtp] = useState('');

  // Forgot Password State
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');

  // Status & Feedback
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer cooldown effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Reset state on mode switch
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMessage('');
    setRegStep(1);
    setFpStep(1);
    setAdminLoginStep(1);
    setAdminRegStep(1);
    setRegisterOtp('');
    setFpOtp('');
    setAdminLoginOtp('');
    setAdminRegOtp('');
    setFpNewPassword('');
    setFpConfirmPassword('');
  };

  // 1. Handle Student Login
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const inputIdentifier = (studentEmail || '').trim();
    if (!inputIdentifier) {
      setError('Please enter your Campus Email or Student Roll Number.');
      setIsLoading(false);
      return;
    }

    if (!studentPassword) {
      setError('Please enter your password.');
      setIsLoading(false);
      return;
    }

    const res = await loginStudent(inputIdentifier, studentPassword);
    if (res.success) {
      navigate('/student');
    } else {
      setError(res.message || 'Invalid student credentials. Please verify your roll number / email and password.');
    }
    setIsLoading(false);
  };

  // 2. Admin Login Step 1: Validate Credentials + Secret Code & Send OTP
  const handleSendAdminLoginOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!adminSecretCode) {
      setError('Please enter the Administrator Master Secret Code.');
      setIsLoading(false);
      return;
    }

    const res = await sendAdminLoginOtp(adminEmail, adminPassword, adminSecretCode);
    if (res.success) {
      setAdminLoginStep(2);
      setSuccessMessage(`2FA OTP sent to ${adminEmail}`);
      setResendCooldown(60);
    } else {
      setError(res.message || 'Invalid administrator credentials or secret code.');
    }
    setIsLoading(false);
  };

  // 3. Admin Login Step 2: Verify OTP & Open Admin Dashboard
  const handleVerifyAdminLoginOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!adminLoginOtp || adminLoginOtp.length < 6) {
      setError('Please enter the 6-digit OTP.');
      setIsLoading(false);
      return;
    }

    const res = await verifyAdminLoginOtp(adminEmail, adminLoginOtp);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Invalid administrator OTP code.');
    }
    setIsLoading(false);
  };

  // 4. Admin Sign Up Step 1: Send Registration OTP
  const handleSendAdminRegisterOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!adminRegData.name || !adminRegData.email || !adminRegData.password) {
      setError('Please fill in name, email, and password.');
      setIsLoading(false);
      return;
    }

    if (!adminRegData.secretCode) {
      setError('Administrator Master Secret Code is required.');
      setIsLoading(false);
      return;
    }

    const res = await sendAdminRegisterOtp(adminRegData);
    if (res.success) {
      setAdminRegStep(2);
      setSuccessMessage(`OTP sent to ${adminRegData.email}`);
      setResendCooldown(60);
    } else {
      setError(res.message || 'Admin registration failed.');
    }
    setIsLoading(false);
  };

  // 5. Admin Sign Up Step 2: Verify OTP & Open Admin Dashboard
  const handleVerifyAdminRegisterOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!adminRegOtp || adminRegOtp.length < 6) {
      setError('Please enter the 6-digit OTP.');
      setIsLoading(false);
      return;
    }

    const res = await verifyAdminRegisterOtp({ ...adminRegData, otp: adminRegOtp });
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Invalid OTP verification code.');
    }
    setIsLoading(false);
  };

  // 6. Student Register Step 1: Send OTP
  const handleSendRegisterOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!registerData.email || !registerData.name || !registerData.password) {
      setError('Please fill in all mandatory fields.');
      setIsLoading(false);
      return;
    }

    const trimmedEmail = (registerData.email || '').toLowerCase().trim();
    if (!trimmedEmail.endsWith('@srkrec.ac.in')) {
      setError('Campus email must end with @srkrec.ac.in (e.g. 25b91a05q3@srkrec.ac.in).');
      setIsLoading(false);
      return;
    }

    const res = await sendRegisterOtp(trimmedEmail, registerData.name);
    if (res.success) {
      setRegStep(2);
      setSuccessMessage(`OTP sent to ${trimmedEmail}`);
      setResendCooldown(60);
    } else {
      setError(res.message || 'Failed to send OTP.');
    }
    setIsLoading(false);
  };

  // 7. Student Register Step 2: Verify OTP & Create Account in MongoDB
  const handleVerifyRegisterAndCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!registerOtp || registerOtp.length < 6) {
      setError('Please enter the 6-digit verification OTP.');
      setIsLoading(false);
      return;
    }

    const trimmedEmail = (registerData.email || '').toLowerCase().trim();
    const res = await registerStudent({ ...registerData, email: trimmedEmail, otp: registerOtp });
    if (res.success) {
      navigate('/student');
    } else {
      setError(res.message || 'Invalid OTP code.');
    }
    setIsLoading(false);
  };

  // 8. Forgot Password Step 1: Send OTP
  const handleSendForgotPasswordOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const inputVal = (fpEmail || '').trim();
    if (!inputVal) {
      setError('Please enter your registered Campus Email or Student Roll Number.');
      setIsLoading(false);
      return;
    }

    const res = await sendForgotPasswordOtp(inputVal);
    if (res.success) {
      setFpStep(2);
      setSuccessMessage(`OTP sent to ${res.email || inputVal}`);
      setResendCooldown(60);
    } else {
      setError(res.message || 'No registered student found with this email or roll number.');
    }
    setIsLoading(false);
  };

  // 9. Forgot Password Step 2: Verify OTP & Reset Password in MongoDB
  const handleVerifyForgotPasswordAndReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!fpOtp || fpOtp.length < 6) {
      setError('Please enter the 6-digit OTP.');
      setIsLoading(false);
      return;
    }

    if (fpNewPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    if (fpNewPassword !== fpConfirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const res = await verifyForgotPasswordOtp(fpEmail, fpOtp, fpNewPassword);
    if (res.success) {
      setSuccessMessage('Password changed successfully. Please sign in.');
      setMode('login');
      setStudentEmail(fpEmail);
      setStudentPassword('');
      setFpStep(1);
    } else {
      setError(res.message || 'Invalid OTP code.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#070b14] text-slate-100 p-4 sm:p-6 selection:bg-red-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-red-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />

      {/* Main Centered Authentication Card */}
      <div className={`w-full transition-all duration-300 ${
        (mode === 'register' && regStep === 1) || (mode === 'admin-register' && adminRegStep === 1) ? 'max-w-2xl' : 'max-w-md'
      }`}>
        
        <GlassCard className="p-6 sm:p-8 space-y-6 shadow-2xl border-slate-800/90 backdrop-blur-2xl bg-slate-900/85">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30 mb-1">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Campus<span className="text-red-500">SOS</span>
            </h1>

            <p className="text-xs text-slate-400 font-medium">
              {mode === 'login' && 'One Tap Intelligent Emergency Response'}
              {mode === 'register' && (regStep === 1 ? 'Create Student Account' : 'Enter 6 digit OTP')}
              {mode === 'forgot-password' && (fpStep === 1 ? 'Reset Password' : 'Enter 6 digit OTP')}
              {mode === 'admin' && (adminLoginStep === 1 ? 'Administrator Dispatch Login' : 'Enter 6 digit OTP')}
              {mode === 'admin-register' && (adminRegStep === 1 ? 'Register Campus Administrator' : 'Enter 6 digit OTP')}
            </p>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 font-medium animate-fadeIn">
              ⚠️ {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-200 font-medium animate-fadeIn">
              ✅ {successMessage}
            </div>
          )}

          {/* ================= 1. STUDENT LOGIN ================= */}
          {mode === 'login' && (
            <div className="space-y-5 animate-fadeIn">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-300 font-semibold block">Campus Mail</label>
                    <span className="text-[10px] text-slate-400 font-mono">Institutional ID</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Enter college mail"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-300 font-semibold">Password</label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot-password')}
                      className="text-[11px] text-red-400 hover:text-red-300 hover:underline font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showStudentPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-10 py-3 border border-slate-800 focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              {/* Bottom Options: Create Account & Admin Login */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="text-center text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-red-400 font-bold hover:text-red-300 hover:underline cursor-pointer ml-1"
                  >
                    Create an Account →
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => switchMode('admin')}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 hover:from-indigo-950/60 hover:to-indigo-950/60 border border-indigo-500/30 hover:border-indigo-500/60 text-xs font-bold text-indigo-300 hover:text-white transition-all shadow-md cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>🛡️ Campus Administrator / Dispatch Login</span>
                    <ArrowRight className="w-3 h-3 text-indigo-400 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. STUDENT CREATE ACCOUNT (WITH OTP) ================= */}
          {mode === 'register' && (
            <div className="space-y-5 animate-fadeIn">
              {regStep === 1 && (
                <form onSubmit={handleSendRegisterOtp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Rivera"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Student ID / Roll No *</label>
                      <input
                        type="text"
                        required
                        placeholder="25B91A05Q3"
                        value={registerData.studentId}
                        onChange={(e) => setRegisterData({ ...registerData, studentId: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white uppercase"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Campus Email (@srkrec.ac.in) *</label>
                      <input
                        type="email"
                        required
                        placeholder="25b91a05q3@srkrec.ac.in"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className={`w-full bg-slate-950 rounded-xl p-2.5 border text-white ${
                          registerData.email && !registerData.email.toLowerCase().endsWith('@srkrec.ac.in')
                            ? 'border-red-500/80 focus:border-red-500'
                            : registerData.email && registerData.email.toLowerCase().endsWith('@srkrec.ac.in')
                            ? 'border-emerald-500/80 focus:border-emerald-500'
                            : 'border-slate-800 focus:border-red-500'
                        }`}
                      />
                      {registerData.email && !registerData.email.toLowerCase().endsWith('@srkrec.ac.in') && (
                        <p className="text-[10px] text-red-400 font-medium mt-1">
                          ⚠️ Must end with @srkrec.ac.in
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="9908446898"
                        value={registerData.mobile}
                        onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Branch / Department *</label>
                      <select
                        value={registerData.branch}
                        onChange={(e) => setRegisterData({ ...registerData, branch: e.target.value, department: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white font-bold"
                      >
                        <option value="Computer Science & Engineering (CSE)">Computer Science (CSE)</option>
                        <option value="Artificial Intelligence & Data Science (AI & DS)">AI & Data Science (AI & DS)</option>
                        <option value="Information Technology (IT)">Information Technology (IT)</option>
                        <option value="Electronics & Communication (ECE)">Electronics & Comm (ECE)</option>
                        <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                        <option value="Mechanical Engineering (MECH)">Mechanical (MECH)</option>
                        <option value="Civil Engineering (CIVIL)">Civil Engineering (CIVIL)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Academic Year *</label>
                      <select
                        value={registerData.year}
                        onChange={(e) => setRegisterData({ ...registerData, year: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white font-bold"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Section *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Section A, Section B"
                        value={registerData.section}
                        onChange={(e) => setRegisterData({ ...registerData, section: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Guardian Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vasu (Parent / Guardian)"
                        value={registerData.guardianName}
                        onChange={(e) => setRegisterData({ ...registerData, guardianName: e.target.value, emergencyContactName: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Guardian's Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9908446898"
                        value={registerData.guardianPhone}
                        onChange={(e) => setRegisterData({ ...registerData, guardianPhone: e.target.value, emergencyContactNumber: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Blood Group *</label>
                      <select
                        value={registerData.bloodGroup}
                        onChange={(e) => setRegisterData({ ...registerData, bloodGroup: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white font-bold"
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

                    <div className="sm:col-span-2">
                      <label className="text-slate-300 font-semibold block mb-1">Medical Conditions / Allergies (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Asthma, Penicillin allergy, Diabetes"
                        value={registerData.medicalConditions}
                        onChange={(e) => setRegisterData({ ...registerData, medicalConditions: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-red-500 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              )}

              {regStep === 2 && (
                <form onSubmit={handleVerifyRegisterAndCreate} className="space-y-4">
                  <div className="text-center space-y-1 pb-1">
                    <h2 className="text-sm font-bold text-white">Enter 6 digit OTP</h2>
                  </div>

                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="• • • • • •"
                      value={registerOtp}
                      onChange={(e) => setRegisterOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-950 text-center tracking-[12px] text-2xl font-mono font-black text-red-500 rounded-xl p-3 border border-slate-800 focus:border-red-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || registerOtp.length < 6}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isLoading ? 'Verifying...' : 'Verify OTP & Create Account'}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleSendRegisterOtp}
                      className="text-red-400 hover:text-red-300 disabled:text-slate-600 font-semibold cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              )}

              <div className="text-center pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Already have an account? Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= 3. FORGOT PASSWORD (WITH OTP) ================= */}
          {mode === 'forgot-password' && (
            <div className="space-y-5 animate-fadeIn">
              {fpStep === 1 && (
                <form onSubmit={handleSendForgotPasswordOtp} className="space-y-4">
                  <div className="text-center pb-1">
                    <h2 className="text-sm font-bold text-white">Reset Password</h2>
                    <p className="text-xs text-slate-400">Enter your registered email to receive an OTP.</p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Campus Email (@srkrec.ac.in)</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="25b91a05q3@srkrec.ac.in"
                        value={fpEmail}
                        onChange={(e) => setFpEmail(e.target.value)}
                        className={`w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border transition-colors focus:outline-none ${
                          fpEmail && !fpEmail.toLowerCase().endsWith('@srkrec.ac.in')
                            ? 'border-red-500/80 focus:border-red-500'
                            : fpEmail && fpEmail.toLowerCase().endsWith('@srkrec.ac.in')
                            ? 'border-emerald-500/80 focus:border-emerald-500'
                            : 'border-slate-800 focus:border-red-500'
                        }`}
                      />
                    </div>
                    {fpEmail && !fpEmail.toLowerCase().endsWith('@srkrec.ac.in') && (
                      <p className="text-[11px] text-red-400 font-medium mt-1 flex items-center gap-1">
                        <span>⚠️ Must end with</span>
                        <span className="font-mono font-bold text-red-300">@srkrec.ac.in</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              )}

              {fpStep === 2 && (
                <form onSubmit={handleVerifyForgotPasswordAndReset} className="space-y-4">
                  <div className="text-center space-y-1 pb-1">
                    <h2 className="text-sm font-bold text-white">Enter 6 digit OTP</h2>
                  </div>

                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="• • • • • •"
                      value={fpOtp}
                      onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-950 text-center tracking-[12px] text-2xl font-mono font-black text-red-500 rounded-xl p-3 border border-slate-800 focus:border-red-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={fpNewPassword}
                        onChange={(e) => setFpNewPassword(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={fpConfirmPassword}
                        onChange={(e) => setFpConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || fpOtp.length < 6}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isLoading ? 'Verifying...' : 'Verify OTP & Change Password'}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setFpStep(1)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleSendForgotPasswordOtp}
                      className="text-red-400 hover:text-red-300 disabled:text-slate-600 font-semibold cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              )}

              <div className="text-center pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= 4. ADMIN SIGN IN (WITH SECRET CODE & OTP) ================= */}
          {mode === 'admin' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* ADMIN LOGIN STEP 1 */}
              {adminLoginStep === 1 && (
                <form onSubmit={handleSendAdminLoginOtp} className="space-y-4">
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
                        className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Dispatcher Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-indigo-300 font-semibold flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Admin Secret Code *</span>
                      </label>
                    </div>
                    <div className="relative">
                      <Shield className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="Enter Master Secret Code"
                        value={adminSecretCode}
                        onChange={(e) => setAdminSecretCode(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-indigo-200 font-mono tracking-wider rounded-xl pl-9 pr-3 py-3 border border-indigo-500/40 focus:outline-none focus:border-indigo-400 text-white transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    {isLoading ? 'Verifying & Sending OTP...' : 'Send Admin 2FA OTP →'}
                  </button>
                </form>
              )}

              {/* ADMIN LOGIN STEP 2: ENTER OTP */}
              {adminLoginStep === 2 && (
                <form onSubmit={handleVerifyAdminLoginOtp} className="space-y-4">
                  <div className="text-center space-y-1 pb-1">
                    <h2 className="text-sm font-bold text-white">Enter 6 digit OTP</h2>
                  </div>

                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="• • • • • •"
                      value={adminLoginOtp}
                      onChange={(e) => setAdminLoginOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-950 text-center tracking-[12px] text-2xl font-mono font-black text-indigo-400 rounded-xl p-3 border border-slate-800 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || adminLoginOtp.length < 6}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isLoading ? 'Verifying...' : 'Verify OTP & Open Admin Dashboard'}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setAdminLoginStep(1)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleSendAdminLoginOtp}
                      className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 font-semibold cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              )}

              {/* Admin Sign Up Option & Back */}
              <div className="pt-2 border-t border-slate-800 space-y-2 text-center text-xs">
                <div className="text-slate-400">
                  New campus administrator?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('admin-register')}
                    className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline cursor-pointer ml-1"
                  >
                    Create Admin Account →
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Student Login</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= 5. ADMIN SIGN UP (WITH SECRET CODE & OTP) ================= */}
          {mode === 'admin-register' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* ADMIN REGISTER STEP 1: Form */}
              {adminRegStep === 1 && (
                <form onSubmit={handleSendAdminRegisterOtp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Sarah Jenkins"
                        value={adminRegData.name}
                        onChange={(e) => setAdminRegData({ ...adminRegData, name: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-indigo-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="admin@campussos.edu"
                        value={adminRegData.email}
                        onChange={(e) => setAdminRegData({ ...adminRegData, email: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-indigo-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={adminRegData.password}
                        onChange={(e) => setAdminRegData({ ...adminRegData, password: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-indigo-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 911-0100"
                        value={adminRegData.phone}
                        onChange={(e) => setAdminRegData({ ...adminRegData, phone: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-slate-800 focus:border-indigo-500 text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-indigo-300 font-semibold block mb-1 flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Admin Secret Code *</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Enter Master Secret Code"
                        value={adminRegData.secretCode}
                        onChange={(e) => setAdminRegData({ ...adminRegData, secretCode: e.target.value })}
                        className="w-full bg-slate-950 rounded-xl p-2.5 border border-indigo-500/40 focus:border-indigo-400 text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    {isLoading ? 'Sending OTP...' : 'Send Verification OTP →'}
                  </button>
                </form>
              )}

              {/* ADMIN REGISTER STEP 2: ENTER OTP */}
              {adminRegStep === 2 && (
                <form onSubmit={handleVerifyAdminRegisterOtp} className="space-y-4">
                  <div className="text-center space-y-1 pb-1">
                    <h2 className="text-sm font-bold text-white">Enter 6 digit OTP</h2>
                  </div>

                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="• • • • • •"
                      value={adminRegOtp}
                      onChange={(e) => setAdminRegOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-950 text-center tracking-[12px] text-2xl font-mono font-black text-indigo-400 rounded-xl p-3 border border-slate-800 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || adminRegOtp.length < 6}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isLoading ? 'Verifying...' : 'Verify OTP & Open Admin Dashboard'}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setAdminRegStep(1)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleSendAdminRegisterOtp}
                      className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 font-semibold cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              )}

              <div className="text-center pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => switchMode('admin')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Already an administrator? Admin Sign In</span>
                </button>
              </div>

            </div>
          )}

        </GlassCard>

      </div>

    </div>
  );
};

export default LoginPage;
