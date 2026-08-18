import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize notifications from logical storage or API
  useEffect(() => {
    const saved = localStorage.getItem('berkah_admin_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.is_read).length);
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    } else {
      // Default initial mock notifications
      const defaults = [
        {
          id: Date.now() - 100000,
          title: 'Sistem Terhubung',
          message: 'Notification Center berhasil diinisialisasi.',
          type: 'system',
          entity_type: 'system',
          entity_id: 0,
          action_url: '/admin/dashboard',
          is_read: false,
          created_at: 'Baru saja'
        }
      ];
      setNotifications(defaults);
      setUnreadCount(1);
      localStorage.setItem('berkah_admin_notifications', JSON.stringify(defaults));
    }
  }, []);

  // Update local storage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('berkah_admin_notifications', JSON.stringify(notifications));
      setUnreadCount(notifications.filter(n => !n.is_read).length);
    }
  }, [notifications]);

  // Polling simulation (Check for external updates via localStorage changes from other tabs or mock backend)
  useEffect(() => {
    const tick = setInterval(() => {
      const saved = localStorage.getItem('berkah_admin_notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.length !== notifications.length || parsed.filter(n=>!n.is_read).length !== unreadCount) {
             setNotifications(parsed);
          }
        } catch(e) {}
      }
    }, 5000); // Poll every 5 seconds
    return () => clearInterval(tick);
  }, [notifications, unreadCount]);

  /**
   * Add a new notification
   * @param {Object} notif 
   */
  const addNotification = useCallback(({ title, message, type = 'info', entity_type = 'system', entity_id = 0, action_url = '/admin/dashboard' }) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      entity_type,
      entity_id,
      action_url,
      is_read: false,
      created_at: 'Baru saja' // In a real app, use timestamp and format it relatively
    };
    
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('berkah_admin_notifications');
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      markAsRead, 
      markAllAsRead,
      deleteNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
