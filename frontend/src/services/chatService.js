// Customer & Admin Live Chat Service with Real Database/Storage Persistence (Zero Dummy Data)

const STORAGE_KEY = 'berkah_pancing_chat_threads';

let listeners = [];

const getStoredThreads = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const saveThreads = (threads) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  listeners.forEach((cb) => cb(threads));
};

export const chatService = {
  getThreads: () => {
    return getStoredThreads();
  },

  getThreadById: (threadId) => {
    const threads = getStoredThreads();
    return threads.find((t) => t.id === threadId) || null;
  },

  getActiveUserThread: (currentUser) => {
    const email = currentUser?.email || 'pelanggan@berkahpancing.com';
    const name = currentUser?.name || 'Pelanggan';
    const avatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

    const threads = getStoredThreads();
    let found = threads.find((t) => t.customerEmail === email);

    if (!found) {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      found = {
        id: `thread-${currentUser?.id || Date.now()}`,
        customerName: name,
        customerEmail: email,
        customerAvatar: avatar,
        unreadCount: 0,
        lastUpdated: nowTime,
        messages: [
          {
            id: 1,
            sender: 'seller',
            text: '✨ Selamat Datang di Berkah Pancing Official! ✨\n\nPusat alat memancing terlengkap, 100% original, dan berkualitas premium untuk semua petualangan mancingmu 🎣✨\n\nAda pertanyaan seputar joran, reel, umpan, atau pengiriman? Tim CS Berkah Pancing siap membantu kamu dengan senang hati 😊\n\nSelamat berbelanja & Salam Strike! 🎣',
            time: nowTime
          }
        ]
      };
      const updated = [found, ...threads];
      saveThreads(updated);
    }
    return found;
  },

  sendMessage: (threadId, currentUser, { sender, text, image, product }) => {
    const threads = getStoredThreads();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetThreadId = threadId || `thread-${currentUser?.id || Date.now()}`;

    let threadExists = threads.some((t) => t.id === targetThreadId);

    if (!threadExists) {
      // Create new thread for real user
      const newMsg = {
        id: Date.now(),
        sender,
        text,
        image,
        product,
        time: nowTime
      };
      const newThread = {
        id: targetThreadId,
        customerName: currentUser?.name || 'Pelanggan',
        customerEmail: currentUser?.email || 'pelanggan@berkahpancing.com',
        customerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        unreadCount: sender === 'buyer' ? 1 : 0,
        lastUpdated: nowTime,
        messages: [
          {
            id: 1,
            sender: 'seller',
            text: '✨ Selamat Datang di Berkah Pancing Official! ✨\n\nPusat alat memancing terlengkap, 100% original, dan berkualitas premium untuk semua petualangan mancingmu 🎣✨\n\nAda pertanyaan seputar joran, reel, umpan, atau pengiriman? Tim CS Berkah Pancing siap membantu kamu dengan senang hati 😊\n\nSelamat berbelanja & Salam Strike! 🎣',
            time: nowTime
          },
          newMsg
        ]
      };
      const updated = [newThread, ...threads];
      saveThreads(updated);
      return updated;
    }

    const updated = threads.map((t) => {
      if (t.id === targetThreadId) {
        const newMsg = {
          id: Date.now(),
          sender, // 'buyer' or 'seller'
          text,
          image,
          product,
          time: nowTime
        };
        return {
          ...t,
          lastUpdated: nowTime,
          unreadCount: sender === 'buyer' ? (t.unreadCount || 0) + 1 : 0,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    saveThreads(updated);
    return updated;
  },

  markAsRead: (threadId) => {
    const threads = getStoredThreads();
    const updated = threads.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t));
    saveThreads(updated);
  },

  getUnreadCount: () => {
    const threads = getStoredThreads();
    return threads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);
  },

  subscribe: (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((l) => l !== callback);
    };
  }
};
