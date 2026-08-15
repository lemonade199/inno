import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('berkah_user');
    if (saved) return JSON.parse(saved);
    // Default logged in user (User role by default, can switch to Admin)
    return {
      id: 2,
      name: 'Juli Anto',
      email: 'julianto@gmail.com',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('berkah_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('berkah_user');
    }
  }, [user]);

  const login = (email, password, role = 'user') => {
    if (email.includes('admin') || role === 'admin') {
      const adminUser = {
        id: 1,
        name: 'Administrator Utama',
        email: email || 'admin@berkahpancing.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      setUser(adminUser);
      return adminUser;
    } else {
      const normalUser = {
        id: 2,
        name: email.split('@')[0] || 'Pelanggan Setia',
        email: email,
        phone: '081234567890',
        address: 'Jl. Merdeka No. 45, Jakarta Selatan',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      };
      setUser(normalUser);
      return normalUser;
    }
  };

  const register = (data) => {
    const newUser = {
      id: Date.now(),
      name: data.name || 'User Baru',
      email: data.email,
      phone: data.phone || '081234567890',
      address: data.address || 'Jl. Utama No. 12, Jakarta',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    return newUser;
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
