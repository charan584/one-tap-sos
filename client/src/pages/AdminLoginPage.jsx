import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, LogIn, Shield, KeyRound } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';

export const AdminLoginPage = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!secretCode) {
      setError('Please enter the Administrator Master Secret Code.');
      setIsLoading(false);
      return;
    }

    const res = await loginAdmin(email, password, secretCode);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Invalid administrator credentials or secret code.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Dispatch Login</h1>
            <p className="text-xs text-slate-400">
              Authorized Campus Safety Officers and Dispatchers only.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Official Dispatch Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@campussos.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-indigo-300 font-semibold block mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin Master Secret Passcode *</span>
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter Admin Secret Code"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-indigo-200 font-mono tracking-wider rounded-xl pl-9 pr-3 py-3 border border-indigo-500/40 focus:outline-none focus:border-indigo-400 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Verifying Dispatch...' : 'Access Command Center'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Student looking for emergency button?{' '}
            <Link to="/student" className="text-red-400 font-semibold hover:underline">
              Go to Student SOS
            </Link>
          </div>

        </GlassCard>
      </main>
    </div>
  );
};

export default AdminLoginPage;
