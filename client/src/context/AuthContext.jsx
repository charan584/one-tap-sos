import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_STUDENT = {
  _id: 'std-default-1',
  name: 'Charan (Student)',
  studentId: '25B91A05Q3',
  email: '25b91a05q3@srkrec.ac.in',
  branch: 'Computer Science & Engineering (CSE)',
  department: 'Computer Science & Engineering (CSE)',
  year: '1st Year',
  section: 'Section A',
  guardianName: 'Vasu (Parent)',
  guardianPhone: '9908446898',
  emergencyContactName: 'Vasu (Parent)',
  emergencyContactNumber: '9908446898',
  hostelOrDayScholar: 'Hostel Block A',
  bloodGroup: 'O+',
  medicalConditions: 'None reported / Healthy',
  mobile: '9908446898',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const DEFAULT_ADMIN = {
  _id: 'adm-default-1',
  name: 'Charan P',
  email: 'charanp326@gmail.com',
  badgeNumber: 'ADM-8079',
  role: 'Administrator',
  department: 'Campus Security & Emergency Dispatch',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('campussos_user');
      return stored ? JSON.parse(stored) : DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('campussos_role') || 'student';
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('campussos_token') || 'local_session_token';
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize session from token
  useEffect(() => {
    const storedToken = localStorage.getItem('campussos_token');
    const storedRole = localStorage.getItem('campussos_role');
    const storedUser = localStorage.getItem('campussos_user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setRole(storedRole || 'student');
        setToken(storedToken);
      } catch (e) {
        console.error('Session restore parse error:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const loginStudent = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        setUser(res.student);
        setRole('student');
        setToken(res.token);
        localStorage.setItem('campussos_student_token', res.token);
        localStorage.setItem('campussos_student_user', JSON.stringify(res.student));
        localStorage.setItem('campussos_token', res.token);
        localStorage.setItem('campussos_role', 'student');
        localStorage.setItem('campussos_user', JSON.stringify(res.student));
        return { success: true, user: res.student };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const registerStudent = async (formData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(formData);
      if (res.success) {
        setUser(res.student);
        setRole('student');
        setToken(res.token);
        localStorage.setItem('campussos_student_token', res.token);
        localStorage.setItem('campussos_student_user', JSON.stringify(res.student));
        localStorage.setItem('campussos_token', res.token);
        localStorage.setItem('campussos_role', 'student');
        localStorage.setItem('campussos_user', JSON.stringify(res.student));
        return { success: true, user: res.student };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please check all fields.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendRegisterOtp = async (formData) => {
    setIsLoading(true);
    try {
      const res = await authApi.sendRegisterOtp(formData);
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to send OTP to email.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendForgotPasswordOtp = async (email) => {
    setIsLoading(true);
    try {
      const res = await authApi.sendForgotPasswordOtp(email);
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to send password reset OTP.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyForgotPasswordOtp = async (email, otp, newPassword) => {
    setIsLoading(true);
    try {
      const res = await authApi.verifyForgotPasswordOtp({ email, otp, newPassword });
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Password reset failed. Invalid OTP.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendAdminLoginOtp = async (email, password, secretCode) => {
    setIsLoading(true);
    try {
      const res = await authApi.sendAdminLoginOtp({ email, password, secretCode });
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Admin authentication failed.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdminLoginOtp = async (email, otp) => {
    setIsLoading(true);
    try {
      const res = await authApi.verifyAdminLoginOtp({ email, otp });
      if (res.success) {
        setUser(res.admin);
        setRole('admin');
        setToken(res.token);
        localStorage.setItem('campussos_admin_token', res.token);
        localStorage.setItem('campussos_admin_user', JSON.stringify(res.admin));
        localStorage.setItem('campussos_token', res.token);
        localStorage.setItem('campussos_role', 'admin');
        localStorage.setItem('campussos_user', JSON.stringify(res.admin));
        return { success: true, user: res.admin };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Admin verification failed. Invalid OTP.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendAdminRegisterOtp = async (formData) => {
    setIsLoading(true);
    try {
      const res = await authApi.sendAdminRegisterOtp(formData);
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to send admin verification OTP.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdminRegisterOtp = async (formData) => {
    setIsLoading(true);
    try {
      const res = await authApi.verifyAdminRegisterOtp(formData);
      if (res.success) {
        setUser(res.admin);
        setRole('admin');
        setToken(res.token);
        localStorage.setItem('campussos_admin_token', res.token);
        localStorage.setItem('campussos_admin_user', JSON.stringify(res.admin));
        localStorage.setItem('campussos_token', res.token);
        localStorage.setItem('campussos_role', 'admin');
        localStorage.setItem('campussos_user', JSON.stringify(res.admin));
        return { success: true, user: res.admin };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Admin registration failed. Invalid OTP.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('campussos_token');
    localStorage.removeItem('campussos_role');
    localStorage.removeItem('campussos_user');
    setUser(null);
    setRole(null);
    setToken(null);
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('campussos_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isLoading,
        isAuthenticated: true,
        loginStudent,
        registerStudent,
        sendRegisterOtp,
        sendForgotPasswordOtp,
        verifyForgotPasswordOtp,
        sendAdminLoginOtp,
        verifyAdminLoginOtp,
        sendAdminRegisterOtp,
        verifyAdminRegisterOtp,
        logout,
        updateProfile,
        DEFAULT_STUDENT,
        DEFAULT_ADMIN,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
