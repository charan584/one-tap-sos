import React, { createContext, useContext, useState, useEffect } from 'react';
import socket from '../services/socket';
import { useAuth } from './AuthContext';
import { useSound } from './SoundContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [latestEmergency, setLatestEmergency] = useState(null);
  const [activeNotification, setActiveNotification] = useState(null);
  const { user, role } = useAuth();
  const { playDispatchAlarm } = useSound();

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log('📡 [Client Socket] Connected to CampusSOS Server');

      // Auto-join appropriate room
      if (role === 'admin') {
        socket.emit('join:admin', { name: user?.name });
      } else if (user) {
        socket.emit('join:student', { studentId: user?.studentId || user?._id });
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('❌ [Client Socket] Disconnected');
    };

    const onNewEmergency = (emergency) => {
      console.log('🚨 [Socket] New Emergency Received:', emergency);
      setLatestEmergency(emergency);
      playDispatchAlarm();
    };

    const onNotificationNew = (notif) => {
      setActiveNotification(notif);
      playDispatchAlarm();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('emergency:new', onNewEmergency);
    socket.on('notification:new', onNotificationNew);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('emergency:new', onNewEmergency);
      socket.off('notification:new', onNotificationNew);
    };
  }, [user, role]);

  const joinAdminRoom = (customAdmin) => {
    let adminName = customAdmin?.name;
    if (!adminName) {
      try {
        const stored = localStorage.getItem('campussos_admin_user');
        if (stored) adminName = JSON.parse(stored).name;
      } catch {}
    }
    if (!adminName && (user?.role === 'Administrator' || user?.badgeNumber)) {
      adminName = user.name;
    }
    if (socket.connected) {
      socket.emit('join:admin', { name: adminName || 'Campus Dispatcher' });
    }
  };

  const joinStudentRoom = (studentId) => {
    if (socket.connected) {
      socket.emit('join:student', { studentId });
    }
  };

  const clearNotification = () => {
    setActiveNotification(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        latestEmergency,
        activeNotification,
        clearNotification,
        joinAdminRoom,
        joinStudentRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};
