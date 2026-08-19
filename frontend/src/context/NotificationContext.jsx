import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize notifications from logical storage or defaults
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
      // Default initial notifications
      const defaults = [
        {
          id: Date.now() - 3600000,
          title: 'Selamat Datang di Berkah Pancing! 🎣',
          message: 'Pusat belanja alat pancing terlengkap & original. Nikmati promo & gratis ongkir untuk setiap pesanan.',
          type: 'promo',
          entity_type: 'promo',
          entity_id: 0,
          action_url: '/products',
          is_read: false,
          created_at: 'Hari ini'
        },
        {
          id: Date.now() - 7200000,
          title: 'Sistem Terhubung',
          message: 'Notification Center & Layanan Berkah Pancing siap melayani pesanan Anda.',
          type: 'system',
          entity_type: 'system',
          entity_id: 0,
          action_url: '/orders',
          is_read: true,
          created_at: 'Kemarin'
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

  // Polling simulation (Check for external updates via localStorage changes)
  useEffect(() => {
    const tick = setInterval(() => {
      const saved = localStorage.getItem('berkah_admin_notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.length !== notifications.length || parsed.filter(n => !n.is_read).length !== unreadCount) {
             setNotifications(parsed);
          }
        } catch(e) {}
      }
    }, 3000);
    return () => clearInterval(tick);
  }, [notifications, unreadCount]);

  /**
   * Add a new notification
   * @param {Object} notif 
   */
  const addNotification = useCallback(({ title, message, type = 'order', entity_type = 'order', entity_id = 0, action_url = '/orders' }) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      entity_type,
      entity_id,
      action_url,
      is_read: false,
      created_at: 'Baru saja'
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
