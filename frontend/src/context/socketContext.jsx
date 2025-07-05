import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authContext';
import { socket } from '../socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token || !user) return;

    socket.auth = { token };
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join', user.id);
    });

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off('connect');
      socket.off('notification');
      socket.disconnect();
    };
  }, [token, user]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <SocketContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);