import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import api from '../services/api';
import AuthModal from '../components/AuthModal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);

  // Navigation bridge — injected by AuthModalBridge (a child inside Router)
  const navigateRef = useRef(null);
  const locationRef = useRef(null);

  // Load addresses from local storage when user changes
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`addresses_${user.email}`);
      if (stored) {
        setAddresses(JSON.parse(stored));
      } else {
        const defaultArr = [{
          id: 1,
          name: user.name,
          phone: user.phone || '081234567890',
          region: 'JAWA BARAT, KAB. BANDUNG, CILEUNYI, 40624',
          street: user.address || 'Jln,cibiru hilir rt02 rw03 desa cibiru hilir kecamatan cileunyi kabupaten bandung',
          detail: 'Rumah Utama',
          tag: 'Rumah',
          isPrimary: true
        }];
        setAddresses(defaultArr);
        localStorage.setItem(`addresses_${user.email}`, JSON.stringify(defaultArr));
      }
    } else {
      setAddresses([]);
    }
  }, [user]);

  const saveAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    if (user) {
      localStorage.setItem(`addresses_${user.email}`, JSON.stringify(newAddresses));
    }
  };

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
    setModalState({ isOpen: true, message, returnLocation });
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

  // Called by AuthModalBridge (rendered inside Router) to wire up router hooks
  const _registerNavigate = (navigateFn, location) => {
    navigateRef.current = navigateFn;
    locationRef.current = location;
  };

  const handleModalLogin = () => {
    const returnTo = modalState.returnLocation || locationRef.current;
    closeAuthModal();
    if (navigateRef.current) {
      navigateRef.current('/login', { state: { from: returnTo } });
    }
  };

  const handleModalRegister = () => {
    const returnTo = modalState.returnLocation || locationRef.current;
    closeAuthModal();
    if (navigateRef.current) {
      navigateRef.current('/register', { state: { from: returnTo } });
    }
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
        addresses,
        saveAddresses,
        isAdmin: user?.role === 'admin',
        openAuthModal,
        closeAuthModal,
        requireAuth,
        _registerNavigate,
      }}
    >
      {!loading && children}
      <AuthModal
        isOpen={modalState.isOpen}
        onClose={closeAuthModal}
        message={modalState.message}
        onLogin={handleModalLogin}
        onRegister={handleModalRegister}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
