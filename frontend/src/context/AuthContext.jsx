import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import AuthModal from '../components/AuthModal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: 'Silakan login terlebih dahulu untuk menggunakan fitur ini.',
    returnLocation: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('berkah_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('berkah_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user: userData, access_token } = response.data;
      
      localStorage.setItem('berkah_token', access_token);
      
      setUser(userData);
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal login. Silakan periksa kembali email & password Anda.';
      throw new Error(message);
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post('/register', data);
      const { user: userData, access_token } = response.data;
      
      localStorage.setItem('berkah_token', access_token);
      
      setUser(userData);
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Pendaftaran gagal. Email mungkin sudah digunakan.';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('berkah_token');
      setUser(null);
    }
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const openAuthModal = (message = 'Silakan login terlebih dahulu untuk menggunakan fitur ini.', returnLocation = null) => {
    setModalState({
      isOpen: true,
      message,
      returnLocation,
    });
  };

  const closeAuthModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const requireAuth = (actionCallback, message = 'Silakan login terlebih dahulu untuk menggunakan fitur ini.', returnLocation = null) => {
    if (user) {
      if (typeof actionCallback === 'function') actionCallback();
      return true;
    }
    openAuthModal(message, returnLocation);
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin: user?.role === 'admin',
        openAuthModal,
        closeAuthModal,
        requireAuth,
      }}
    >
      {!loading && children}
      <AuthModal
        isOpen={modalState.isOpen}
        onClose={closeAuthModal}
        message={modalState.message}
        returnLocation={modalState.returnLocation}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
