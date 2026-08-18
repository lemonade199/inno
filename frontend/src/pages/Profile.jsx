import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  Save, 
  ShieldCheck, 
  Edit3, 
  MessageSquare, 
  Star, 
  HelpCircle, 
  Package, 
  Heart,
  ChevronDown,
  CheckCircle,
  Camera,
  Plus,
  Send,
  Trash2,
  ShoppingCart,
  ThumbsUp,
  X,
  CreditCard,
  Building,
  Bell,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { reviewService } from '../services/reviewService';
import { productService } from '../services/productService';
import api from '../services/api';
import Avatar from '../components/Avatar';
import ImageCropperModal from '../components/ImageCropperModal';

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const sidebarMenuRef = useRef(null);

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);

  const tabFromUrl = searchParams.get('tab') || 'biodata';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setActiveTab(t);
  }, [searchParams]);

  // Close avatar popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarMenuRef.current && !sidebarMenuRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Collapsible sidebar accordion states
  const [isKotakMasukOpen, setIsKotakMasukOpen] = useState(true);
  const [isPembelianOpen, setIsPembelianOpen] = useState(true);

  // Editable forms
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Juli Anto',
    birthDate: '1998-07-15', // HTML date picker YYYY-MM-DD format
    gender: 'Laki-laki',
    email: user?.email || 'julianto@gmail.com',
    phone: user?.phone || '081234567890',
    address: user?.address || 'Jl. Merdeka No. 45, RT 02/RW 05, Jakarta Selatan',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setShowCropper(true);
      setShowAvatarMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedDataUrl) => {
    updateUserProfile({ avatar: croppedDataUrl });
    setShowCropper(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    try {
      await api.post('/user/profile', { avatar: croppedDataUrl });
    } catch (err) {
      // Handled
    }
  };

  const handleDeleteAvatar = async () => {
    updateUserProfile({ avatar: null });
    setShowAvatarMenu(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    try {
      await api.post('/user/profile', { avatar: null });
    } catch (err) {
      // Handled
    }
  };

  // Helper for displaying date in Indonesian format (e.g. 15 Juli 1998)
  const formatIndonesianDate = (dateString) => {
    if (!dateString) return '-';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString;
    return dateObj.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Reviews state
  const [userReviews, setUserReviews] = useState([]);
  useEffect(() => {
    setUserReviews(reviewService.getUserReviews(user?.email || 'julianto@gmail.com'));
  }, [user]);

  // Chat simulator state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'seller', text: 'Halo Mas Juli! Selamat datang di Berkah Pancing. Ada yang bisa kami bantu seputar alat pancing?', time: '10:00' },
    { sender: 'user', text: 'Siang min, joran Shimano Lesath ready stok ukuran berapa saja ya?', time: '10:02' },
    { sender: 'seller', text: 'Ready ukuran 2.1m, 2.4m dan 2.7m ya mas. Semuanya garansi resmi 1 tahun!', time: '10:03' }
  ]);
  const [inputChat, setInputChat] = useState('');

  // Address list & Google Maps state
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Juli Anto', phone: '081234567890', detail: 'Jl. Merdeka No. 45, RT 02/RW 05, Jakarta Selatan', isPrimary: true }
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [modalAddr, setModalAddr] = useState({ name: '', phone: '', detail: '', isPrimary: false });

  // Lock background body scroll when address modal is open
  useEffect(() => {
    if (showAddressModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddressModal]);


  // Wishlist state
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Joran Shimano Lesath BX 240', price: 2450000, category: 'Joran', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500' },
    { id: 2, name: 'Reel Daiwa Saltiga 4000H', price: 3850000, category: 'Reel', image: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=500' }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    });
    setIsEditingBio(false);
    setIsEditingContact(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    const msg = { sender: 'user', text: inputChat, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, msg]);
    setInputChat('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'seller',
        text: 'Terima kasih mas! Tim customer care Berkah Pancing akan segera memproses pesanan Anda.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  // Open modal for adding new address
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setModalAddr({ name: user?.name || 'Juli Anto', phone: user?.phone || '081234567890', detail: '', isPrimary: addresses.length === 0 });
    setShowAddressModal(true);
  };

  // Open modal for editing existing address (including primary address)
  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setModalAddr({ name: addr.name, phone: addr.phone, detail: addr.detail, isPrimary: addr.isPrimary });
    setShowAddressModal(true);
  };

  // Save address (create or update)
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!modalAddr.name || !modalAddr.detail) return;

    if (editingAddressId) {
      // Edit existing
      setAddresses(addresses.map(a => {
        if (a.id === editingAddressId) {
          return { ...a, name: modalAddr.name, phone: modalAddr.phone, detail: modalAddr.detail, isPrimary: modalAddr.isPrimary };
        }
        if (modalAddr.isPrimary) {
          return { ...a, isPrimary: false };
        }
        return a;
      }));
    } else {
      // Add new
      let updatedList = addresses;
      if (modalAddr.isPrimary) {
        updatedList = addresses.map(a => ({ ...a, isPrimary: false }));
      }
      setAddresses([...updatedList, {
        id: Date.now(),
        name: modalAddr.name,
        phone: modalAddr.phone || '081234567890',
        detail: modalAddr.detail,
        isPrimary: modalAddr.isPrimary || addresses.length === 0
      }]);
    }

    // Also update main user address if primary address changed
    if (modalAddr.isPrimary) {
      setFormData(prev => ({ ...prev, address: modalAddr.detail }));
      updateUserProfile({ address: modalAddr.detail });
    }

    setShowAddressModal(false);
  };

  // Set address as primary
  const handleSetPrimaryAddress = (id) => {
    const targetAddr = addresses.find(a => a.id === id);
    setAddresses(addresses.map(a => ({ ...a, isPrimary: a.id === id })));
    if (targetAddr) {
      setFormData(prev => ({ ...prev, address: targetAddr.detail }));
      updateUserProfile({ address: targetAddr.detail });
    }
  };

  // Delete address
  const handleDeleteAddress = (id) => {
    if (addresses.length <= 1) {
      alert('Anda harus memiliki setidaknya satu alamat pengiriman.');
      return;
    }
    const filtered = addresses.filter(a => a.id !== id);
    if (!filtered.some(a => a.isPrimary) && filtered.length > 0) {
      filtered[0].isPrimary = true;
    }
    setAddresses(filtered);
  };



  return (
    <div style={{ background: '#f5f5f5', margin: '-1.5rem -1rem', padding: '1.5rem 1rem', minHeight: '88vh' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* ================= LEFT SIDEBAR PANEL ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* User Mini Profile Card (Cleaned without Saldo/Koin) */}
          <div style={{ background: '#fff', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }} ref={sidebarMenuRef}>
              <Avatar 
                src={user?.avatar} 
                name={user?.name || 'User'} 
                size={52} 
                style={{ border: '2px solid #00AB99' }}
              />
              <button
                type="button"
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                title="Kelola Foto Profil"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#00AB99',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease',
                  zIndex: 2
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              >
                <Camera size={11} />
              </button>

              {/* Avatar Action Popover */}
              {showAvatarMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '56px',
                    left: '0',
                    background: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                    width: '170px',
                    zIndex: 50,
                    overflow: 'hidden',
                    padding: '4px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowAvatarMenu(false);
                      fileInputRef.current?.click();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '6px',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: '#1e293b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Camera size={14} color="#00AB99" /> Pilih Foto Baru
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '6px',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#fee2e2')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Trash2 size={14} color="#ef4444" /> Hapus Foto
                  </button>
                </div>
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Juli Anto'}
              </h3>
              <span style={{ fontSize: '0.72rem', background: '#e6f0fa', color: '#0f4c81', padding: '2px 6px', borderRadius: '10px', fontWeight: '700', display: 'inline-block', marginTop: '2px' }}>
                Member Platinum
              </span>
            </div>
          </div>

          {/* Navigation Accordion Menu with Functional Collapsible Chevrons */}
          <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Kotak Masuk Section */}
            <div>
              <div 
                onClick={() => setIsKotakMasukOpen(!isKotakMasukOpen)}
                style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <span>Kotak Masuk</span>
                <ChevronDown 
                  size={16} 
                  color="#64748b" 
                  style={{ transform: isKotakMasukOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s ease' }} 
                />
              </div>
              {isKotakMasukOpen && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                  <li 
                    onClick={() => navigate('/chat')}
                    style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'chat' ? '#f0f9ff' : 'transparent', color: '#0f4c81', fontWeight: '600' }}
                  >
                    <MessageSquare size={15} color="#0f4c81" /> Chat Penjual
                  </li>
                  <li 
                    onClick={() => setActiveTab('ulasan')}
                    style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'ulasan' ? '#fff7ed' : 'transparent', color: activeTab === 'ulasan' ? '#f77f00' : '#475569', fontWeight: activeTab === 'ulasan' ? '700' : '500' }}
                  >
                    <Star size={15} color="#f77f00" /> Ulasan Saya
                  </li>
                  <li 
                    onClick={() => setActiveTab('bantuan')}
                    style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'bantuan' ? '#f0fdf4' : 'transparent', color: activeTab === 'bantuan' ? '#00AB99' : '#475569', fontWeight: activeTab === 'bantuan' ? '700' : '500' }}
                  >
                    <HelpCircle size={15} color="#00AB99" /> Pesan Bantuan
                  </li>
                </ul>
              )}
            </div>

            {/* Pembelian Section */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <div 
                onClick={() => setIsPembelianOpen(!isPembelianOpen)}
                style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <span>Pembelian</span>
                <ChevronDown 
                  size={16} 
                  color="#64748b" 
                  style={{ transform: isPembelianOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s ease' }} 
                />
              </div>
              {isPembelianOpen && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                  <li 
                    onClick={() => navigate('/orders')}
                    style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#0f4c81' }}
                  >
                    <Package size={15} /> Daftar Transaksi
                  </li>
                  <li 
                    onClick={() => setActiveTab('wishlist')}
                    style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'wishlist' ? '#fef2f2' : 'transparent', color: activeTab === 'wishlist' ? '#ef4444' : '#475569', fontWeight: activeTab === 'wishlist' ? '700' : '500' }}
                  >
                    <Heart size={15} color="#ef4444" /> Wishlist Produk
                  </li>
                </ul>
              )}
            </div>

            {/* Logout Button */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                style={{ 
                  width: '100%', 
                  background: '#fee2e2', 
                  color: '#ef4444', 
                  border: 'none', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  fontSize: '0.82rem', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={16} /> Keluar Akun
              </button>
            </div>

          </div>

        </div>

        {/* ================= RIGHT MAIN TABBED PANEL ================= */}
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Header Title */}
          <div style={{ padding: '1.25rem 1.5rem 0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#0f4c81" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
              {user?.name || 'Juli Anto'}
            </h2>
          </div>

          {/* Shopee / Tokopedia Style Tab Header Navigation */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e2e8f0', 
            padding: '0 1.5rem', 
            gap: '1.5rem',
            overflowX: 'auto'
          }}>
            {[
              { id: 'biodata', label: 'Biodata Diri' },
              { id: 'alamat', label: 'Daftar Alamat' },
              { id: 'ulasan', label: 'Ulasan Saya' },
              { id: 'wishlist', label: 'Wishlist Saya' },
              { id: 'pembayaran', label: 'Pembayaran' },
              { id: 'rekening', label: 'Rekening Bank' },
              { id: 'notifikasi', label: 'Notifikasi' },
              { id: 'keamanan', label: 'Keamanan' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '1rem 0',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === tab.id ? '800' : '600',
                  color: activeTab === tab.id ? '#0f4c81' : '#64748b',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '3px solid #0f4c81' : '3px solid transparent',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: '700', borderBottom: '1px solid #bbf7d0' }}>
              ✓ Perubahan profil berhasil disimpan!
            </div>
          )}

          {/* Tab 1: BIODATA DIRI */}
          {activeTab === 'biodata' && (
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #00AB99', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size={150} />
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: '100%', background: '#00AB99', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,171,153,0.25)' }}
                  >
                    <Camera size={15} /> Pilih & Potong Foto
                  </button>

                  {user?.avatar && (
                    <button 
                      type="button"
                      onClick={handleDeleteAvatar}
                      style={{ width: '100%', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '7px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                    >
                      <Trash2 size={13} /> Hapus Foto
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>
                  Format gambar: .JPG .JPEG .PNG (Maks 8MB)
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    Ubah Biodata Diri
                  </h4>
                  {isEditingBio ? (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Nama Lengkap</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Tanggal Lahir (Format Date Picker)</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Jenis Kelamin</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                        <button type="submit" style={{ background: '#00AB99', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Simpan</button>
                        <button type="button" onClick={() => setIsEditingBio(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Batal</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Nama</span>
                        <span style={{ fontWeight: '700', color: '#1e293b', flex: 1 }}>{formData.name}</span>
                        <button onClick={() => setIsEditingBio(true)} style={{ background: 'none', border: 'none', color: '#00AB99', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Ubah</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Tanggal Lahir</span>
                        <span style={{ fontWeight: '600', color: '#1e293b', flex: 1 }}>{formatIndonesianDate(formData.birthDate)}</span>
                        <button onClick={() => setIsEditingBio(true)} style={{ background: 'none', border: 'none', color: '#00AB99', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Ubah</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Jenis Kelamin</span>
                        <span style={{ fontWeight: '600', color: '#1e293b', flex: 1 }}>{formData.gender}</span>
                        <button onClick={() => setIsEditingBio(true)} style={{ background: 'none', border: 'none', color: '#00AB99', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Ubah</button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    Ubah Kontak
                  </h4>
                  {isEditingContact ? (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Nomor HP</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                        <button type="submit" style={{ background: '#00AB99', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Simpan Kontak</button>
                        <button type="button" onClick={() => setIsEditingContact(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Batal</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Email</span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '600', color: '#1e293b' }}>{formData.email}</span>
                          <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Terverifikasi</span>
                        </div>
                        <button onClick={() => setIsEditingContact(true)} style={{ background: 'none', border: 'none', color: '#00AB99', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Ubah</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Nomor HP</span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '600', color: '#1e293b' }}>{formData.phone}</span>
                          <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Terverifikasi</span>
                        </div>
                        <button onClick={() => setIsEditingContact(true)} style={{ background: 'none', border: 'none', color: '#00AB99', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Ubah</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab: CHAT PENJUAL */}
          {activeTab === 'chat' && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e6f8f6', color: '#00a896', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                  Chat Penjual Berkah Pancing
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '6px', maxWidth: '400px', lineHeight: 1.5 }}>
                  Tanyakan seputar produk, ketersediaan stok, atau informasi pengiriman langsung kepada layanan pelanggan Berkah Pancing.
                </p>
              </div>
              <button 
                onClick={() => navigate('/chat')}
                style={{
                  background: 'linear-gradient(135deg, #0f4c81 0%, #00a896 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,168,150,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MessageSquare size={18} /> Buka Ruang Chat Penjual
              </button>
            </div>
          )}

          {/* Tab 2: DAFTAR ALAMAT */}
          {activeTab === 'alamat' && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Daftar Alamat Pengiriman</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>Kelola daftar alamat lengkap pengiriman pesanan Anda.</p>
                </div>
                <button onClick={handleOpenAddAddress} style={{ background: '#00AB99', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} /> Tambah Alamat Baru
                </button>
              </div>

              {addresses.map((addr) => (
                <div key={addr.id} style={{ border: addr.isPrimary ? '1.5px solid #00AB99' : '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', background: addr.isPrimary ? '#f0fdfa' : '#fafafa', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: addr.isPrimary ? '0 2px 8px rgba(0, 171, 153, 0.08)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>{addr.name}</strong>
                      {addr.isPrimary && <span style={{ fontSize: '0.68rem', background: '#ccfbf1', color: '#0f766e', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>UTAMA</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {/* Both Primary and Secondary addresses can be edited */}
                      <button onClick={() => handleOpenEditAddress(addr)} style={{ background: 'none', border: 'none', color: '#00AB99', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Edit3 size={13} /> Ubah Alamat
                      </button>
                      {!addr.isPrimary && (
                        <>
                          <button onClick={() => handleSetPrimaryAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#0f4c81', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Atur Utama
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>{addr.phone}</div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <MapPin size={16} color="#00AB99" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{addr.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: ULASAN SAYA */}
          {activeTab === 'ulasan' && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={20} color="#f77f00" /> ULASAN & RATING SAYA
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>Kelola ulasan dan riwayat penilaian produk yang pernah Anda beli</p>
                </div>
                <Link to="/orders" style={{ background: '#f77f00', color: '#fff', textDecoration: 'none', padding: '8px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700' }}>
                  + Ulas Produk Pesanan
                </Link>
              </div>

              {userReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#fafafa', borderRadius: '8px' }}>
                  <Star size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#334155' }}>Belum Ada Ulasan</h4>
                  <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Anda belum pernah menuliskan ulasan produk. Selesaikan pesanan untuk memberikan rating!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {userReviews.map((rev) => (
                    <div key={rev.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', background: '#fff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <img src={user?.avatar} alt={rev.userName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', display: 'block' }}>{rev.userName}</span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{rev.date} | Variasi: {rev.variant}</span>
                          </div>
                        </div>
                        <div style={{ color: '#f77f00', fontSize: '1rem', fontWeight: '700' }}>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                        "{rev.comment}"
                      </p>

                      {rev.images && rev.images.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          {rev.images.map((img, idx) => (
                            <img key={idx} src={img} alt="Foto ulasan" style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                          ))}
                        </div>
                      )}

                      {rev.sellerResponse && (
                        <div style={{ background: '#f8fafc', borderLeft: '3px solid #00AB99', padding: '8px 12px', borderRadius: '4px', fontSize: '0.8rem', color: '#475569' }}>
                          <strong style={{ color: '#00AB99' }}>Respon Penjual:</strong> {rev.sellerResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: WISHLIST PRODUK */}
          {activeTab === 'wishlist' && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={18} color="#ef4444" fill="#ef4444" /> Wishlist Produk Impian ({wishlist.length})
              </h4>

              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  Wishlist Anda masih kosong. Tekan ikon hati pada produk untuk menyimpannya di sini!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {wishlist.map((item) => (
                    <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ width: '100%', height: '140px', borderRadius: '6px', overflow: 'hidden' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', margin: 0, lineHeight: 1.3 }}>{item.name}</h5>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f4c81' }}>{productService.formatIDR(item.price)}</span>
                      <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                        <button 
                          onClick={() => addToCart(item, 1)} 
                          style={{ flex: 1, background: '#0f4c81', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <ShoppingCart size={13} /> + Keranjang
                        </button>
                        <button 
                          onClick={() => setWishlist(wishlist.filter(w => w.id !== item.id))} 
                          style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: CHAT PEMBELI */}
          {activeTab === 'chat' && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#0f4c81" /> Chat Penjual - Berkah Pancing CS
              </h4>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', height: '360px', padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fafafa' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                    <div style={{ background: msg.sender === 'user' ? '#0f4c81' : '#fff', color: msg.sender === 'user' ? '#fff' : '#334155', padding: '10px 14px', borderRadius: '12px', fontSize: '0.85rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '2px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={inputChat} 
                  onChange={(e) => setInputChat(e.target.value)} 
                  placeholder="Ketik pesan Anda ke layanan pelanggan..." 
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#0f4c81', color: '#fff', border: 'none', padding: '0 18px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={15} /> Kirim
                </button>
              </form>
            </div>
          )}

          {/* Tab 6: PESAN BANTUAN */}
          {activeTab === 'bantuan' && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="#00AB99" /> Pusat Bantuan & Pertanyaan Umum (FAQ)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { q: 'Bagaimana cara melakukan klaim garansi produk?', a: 'Setiap produk bergaransi dapat diklaim dengan menunjukkan struk/invoice pesanan di menu Pesanan Saya dan menghubungi CS kami.' },
                  { q: 'Berapa lama pengiriman alat pancing?', a: 'Pengiriman Jabodetabek 1-2 hari kerja. Luar Jabodetabek 2-4 hari kerja dengan packing kayu/pipa khusus.' },
                  { q: 'Apakah mendukung pembayaran Midtrans & COD?', a: 'Ya! Kami mendukung pembayaran QRIS, Transfer Bank, E-Wallet, dan COD melalui Midtrans Payment Gateway.' }
                ].map((faq, i) => (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', background: '#fff' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#0f4c81', display: 'block', marginBottom: '4px' }}>Q: {faq.q}</strong>
                    <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback Tab Content for Pembayaran, Rekening, Notifikasi, Keamanan */}
          {['pembayaran', 'rekening', 'notifikasi', 'keamanan'].includes(activeTab) && (
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
              <ShieldCheck size={44} color="#0f4c81" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>Pengaturan {activeTab.toUpperCase()}</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Fitur akun dan keamanan ini sudah dikonfigurasi dengan enkripsi tingkat tinggi.</p>
            </div>
          )}

        </div>

      </div>

      {/* Address Edit/Add Modal with Interactive Google Maps & GPS Pinpoint */}
      {showAddressModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '8px', maxWidth: '520px', width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>
                {editingAddressId ? 'Ubah Alamat Pengiriman' : 'Tambah Alamat Pengiriman Baru'}
              </h4>
              <button onClick={() => setShowAddressModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Nama Penerima</label>
                <input 
                  type="text" 
                  required 
                  value={modalAddr.name} 
                  onChange={(e) => setModalAddr({ ...modalAddr, name: e.target.value })} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Nomor HP Penerima</label>
                <input 
                  type="text" 
                  required 
                  value={modalAddr.phone} 
                  onChange={(e) => setModalAddr({ ...modalAddr, phone: e.target.value })} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Alamat Lengkap & Detail Patokan</label>
                <textarea 
                  required 
                  rows={3} 
                  value={modalAddr.detail} 
                  onChange={(e) => setModalAddr({ ...modalAddr, detail: e.target.value })} 
                  placeholder="Nama jalan, nomor rumah, RT/RW, Kecamatan, Kota, Kode pos..."
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px' }} 
                />
              </div>



              {/* Primary Address Switch */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#1e293b', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={modalAddr.isPrimary} 
                  onChange={(e) => setModalAddr({ ...modalAddr, isPrimary: e.target.checked })}
                  style={{ accentColor: '#00AB99', width: '16px', height: '16px' }} 
                />
                Jadikan sebagai Alamat Utama Pengiriman
              </label>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddressModal(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ background: '#00AB99', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Simpan Alamat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem 1.5rem',
            maxWidth: '380px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <AlertTriangle size={28} color="#ef4444" />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.4rem 0' }}>
              Konfirmasi Keluar Akun
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem 0', lineHeight: 1.45 }}>
              Apakah Anda yakin ingin keluar dari akun Berkah Pancing Anda?
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && rawImageSrc && (
        <ImageCropperModal
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}

    </div>
  );
};

export default Profile;
