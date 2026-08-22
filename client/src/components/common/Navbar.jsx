import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Radio,
  Sliders,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  LogOut,
  User,
  LayoutDashboard,
  Smartphone,
  Cpu,
  Sparkles,
  ChevronDown,
  Activity,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useSound } from '../../context/SoundContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout, demoLogin } = useAuth();
  const { isConnected } = useSocket();
  const { isMuted, toggleMute } = useSound();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDemoSwitch = async (type) => {
    setShowDemoMenu(false);
    await demoLogin(type);
    if (type === 'student') navigate('/student');
    if (type === 'admin') navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30 group-hover:scale-105 transition-all">
            <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Campus<span className="text-red-500 font-black">SOS</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                v2.4 Live
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
              One Tap Intelligent Response
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          <Link
            to="/student"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive('/student')
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Student SOS
          </Link>

          <Link
            to="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive('/admin')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Admin Dispatch
          </Link>

          <Link
            to="/split-demo"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive('/split-demo')
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5 animate-bounce" />
            Split Demo Mode
          </Link>

          <Link
            to="/future-enhancements"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive('/future-enhancements')
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Future Scope
          </Link>
        </nav>

        {/* Action Controls & User Capsule */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Socket Connection Health Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
            <span className={isConnected ? 'text-emerald-400' : 'text-amber-400'}>
              {isConnected ? 'Socket Active' : 'Connecting...'}
            </span>
          </div>

          {/* Audio Siren / Mute Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Emergency Siren' : 'Mute Emergency Audio'}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500 transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Demo Login</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Instant Test Personas
                </div>
                <button
                  onClick={() => handleDemoSwitch('student')}
                  className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-500/10 text-slate-200 hover:text-red-400 transition-colors text-xs font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[10px] font-bold">
                    🎓
                  </div>
                  <div>
                    <div className="font-semibold text-white">Alex Rivera (Student)</div>
                    <div className="text-[10px] text-slate-400">CS 3rd Year • Blood O+</div>
                  </div>
                </button>

                <button
                  onClick={() => handleDemoSwitch('admin')}
                  className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-indigo-500/10 text-slate-200 hover:text-indigo-400 transition-colors text-xs font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[10px] font-bold">
                    🛡️
                  </div>
                  <div>
                    <div className="font-semibold text-white">Chief Sarah Jenkins</div>
                    <div className="text-[10px] text-slate-400">Campus Safety Commander</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Profile Pill or Login Button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700 ring-2 ring-red-500/30"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-100 leading-tight truncate max-w-[110px]">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {role === 'admin' ? 'Dispatcher' : user.studentId}
                </span>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800/80 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
