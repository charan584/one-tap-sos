import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'admin'
  const [token, setToken] = useState(localStorage.getItem('campussos_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from token
  useEffect(() => {
    const initAuth = async () => {
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
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginStudent = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        setUser(res.student);
        setRole('student');
        setToken(res.token);
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

  const loginAdmin = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.adminLogin({ email, password });
      if (res.success) {
        setUser(res.admin);
        setRole('admin');
        setToken(res.token);
        localStorage.setItem('campussos_token', res.token);
        localStorage.setItem('campussos_role', 'admin');
        localStorage.setItem('campussos_user', JSON.stringify(res.admin));
        return { success: true, user: res.admin };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Admin authentication failed.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (type = 'student') => {
    setIsLoading(true);
    try {
      const res = await authApi.demoQuickLogin(type);
      if (res.success) {
        const loggedUser = type === 'admin' ? res.admin : res.student;
        setUser(loggedUser);
        setRole(type);
        setToken(res.token);
        localStorage.setItem('campussos_token', res.token);
        localStorage.setItem('campussos_role', type);
        localStorage.setItem('campussos_user', JSON.stringify(loggedUser));
        return { success: true, user: loggedUser, role: type };
      }
      return { success: false, message: 'Demo login failed' };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('campussos_token');
    localStorage.removeItem('campussos_role');
    localStorage.removeItem('campussos_user');
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('campussos_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        loginStudent,
        registerStudent,
        loginAdmin,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
