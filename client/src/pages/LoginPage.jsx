import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, LogIn, ArrowRight, UserCheck, Smartphone } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { loginStudent, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await loginStudent(email, password);
    if (res.success) {
      navigate('/student');
    } else {
      setError(res.message || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  const handleQuickDemo = async (type = 'student') => {
    await demoLogin(type);
    navigate(type === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Student SOS Login</h1>
            <p className="text-xs text-slate-400">
              Sign in to automatically retrieve your medical profile & arm one-tap SOS.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Campus Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex.rivera@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? 'Retrieving Profile...' : 'Sign In to Student SOS'}
            </button>
          </form>

          {/* Quick Demo 1-Click Persona Login */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Instant 1-Click Demo Login
            </div>

            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🎓</span>
                <span className="font-semibold text-white">Alex Rivera (Student O+)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🛡️</span>
                <span className="font-semibold text-white">Chief Sarah Jenkins (Admin)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-400 font-semibold hover:underline">
              Register your emergency profile
            </Link>
          </div>

        </GlassCard>
      </main>
    </div>
  );
};

export default LoginPage;
