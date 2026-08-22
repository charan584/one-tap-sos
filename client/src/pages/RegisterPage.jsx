import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Mail, Lock, Phone, HeartPulse, Building2, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const res = await registerStudent(formData);
    if (res.success) {
      navigate('/student');
    } else {
      setError(res.message || 'Registration failed. Please check your information.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <GlassCard className="p-6 sm:p-10 space-y-6">
          
          <div className="text-center space-y-2 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Student Safety Registration
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Create your permanent emergency profile once. In any future crisis, one tap broadcasts all details with zero forms.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Basic Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                1. Identity & Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Student University ID *</label>
                  <input
                    type="text"
                    name="studentId"
                    required
                    placeholder="e.g. STU-2024-8841"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500 uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">University Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. alex.rivera@campus.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Create secure password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Emergency Kin */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                2. Contact & Emergency Kin
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="+1 (555) 438-9921"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Emergency Kin Name *</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    required
                    placeholder="e.g. Elena Rivera (Mother)"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Emergency Kin Number *</label>
                  <input
                    type="tel"
                    name="emergencyContactNumber"
                    required
                    placeholder="+1 (555) 993-4412"
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Academic & Residence */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                3. Academic & Campus Residence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Department *</label>
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="e.g. Computer Science & AI"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Year of Study *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Residence Status *</label>
                  <select
                    name="hostelOrDayScholar"
                    value={formData.hostelOrDayScholar}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  >
                    <option value="Hostel Block A">Hostel Block A</option>
                    <option value="Hostel Block B">Hostel Block B</option>
                    <option value="Hostel Block C">Hostel Block C</option>
                    <option value="Hostel Block D">Hostel Block D</option>
                    <option value="Day Scholar">Day Scholar (Off Campus)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Medical Vitals & Alerts */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <HeartPulse className="w-4 h-4" />
                4. Medical Vitals & Life-Saving Alerts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Blood Group *</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500 font-bold"
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
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Known Medical Conditions / Severe Allergies (Optional)
                  </label>
                  <input
                    type="text"
                    name="medicalConditions"
                    placeholder="e.g. Penicillin allergy, Asthma, Diabetes, Epipen required"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? 'Arming Emergency Profile...' : 'Complete Registration & Arm SOS'}
              </button>

              <div className="text-center text-xs text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-red-400 font-semibold hover:underline">
                  Sign in to your emergency portal
                </Link>
              </div>
            </div>

          </form>

        </GlassCard>
      </main>
    </div>
  );
};

export default RegisterPage;
