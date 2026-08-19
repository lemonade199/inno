import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  ShieldCheck, 
  LogOut, 
  Anchor, 
  History, 
  TrendingUp, 
  X, 
  Trash2,
  Package,
  Star,
  Heart,
  Globe,
  AlertTriangle,
  Bell,
  CheckCircle2,
  CheckSquare,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { 
  getSearchHistory, 
  addSearchHistory, 
  removeSearchHistoryItem, 
  clearSearchHistory, 
  getPopularSearches 
} from '../utils/searchHistory';
import Avatar from './Avatar';

const Navbar = ({ isAdminView = false, toggleSidebar }) => {
  const { user, logout, isAdmin, requireAuth } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [popularList, setPopularList] = useState([]);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchContainerRef = useRef(null);
  const cartCount = getCartCount();
  const isCartPage = location.pathname === '/cart';

  const { notifications: adminNotifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  // Load history & popular terms on mount & update
  const refreshSearchData = () => {
    setHistoryList(getSearchHistory());
    setPopularList(getPopularSearches());
  };

  useEffect(() => {
    refreshSearchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    addSearchHistory(trimmed);
    refreshSearchData();
    setIsSearchFocused(false);
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleExecuteSearch(searchQuery);
  };

  const handleRemoveHistory = (e, item) => {
    e.stopPropagation();
    const updated = removeSearchHistoryItem(item);
    setHistoryList(updated);
  };

  const handleClearAllHistory = (e) => {
    e.stopPropagation();
    clearSearchHistory();
    setHistoryList([]);
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setShowDropdown(false);
    logout();
    navigate('/login', { replace: true });
  };

  const handleLogout = () => {
    setShowDropdown(false);
    setShowLogoutConfirm(true);
  };

  // Admin View Navbar
  if (isAdminView) {
    return (
      <header
        className="admin-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 90,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.8rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
            <Menu size={22} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Panel Admin</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Notification Button & Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              title="Notifikasi Aktivitas Toko"
              style={{
                position: 'relative',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                transition: 'all 0.2s',
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#fff',
                    border: '2px solid #ffffff',
                    fontSize: '0.55rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Menu */}
            {showNotifDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '48px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                  width: 'min(340px, calc(100vw - 32px))',
                  zIndex: 200,
                  overflow: 'hidden',
                  animation: 'scaleUp 0.2s ease-out',
                }}
              >
                <div
                  style={{
                    padding: '0.85rem 1.1rem',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} color="#0f4c81" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                      Notifikasi Toko
                    </span>
                  </div>
                  <button
                    onClick={() => markAllAsRead()}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: unreadCount > 0 ? '#00a896' : '#94a3b8',
                      cursor: unreadCount > 0 ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    disabled={unreadCount === 0}
                  >
                    <CheckSquare size={13} /> Tandai dibaca
                  </button>
                </div>

                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {adminNotifications.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      Tidak ada notifikasi saat ini.
                    </div>
                  ) : (
                    adminNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.is_read) markAsRead(notif.id);
                          if (notif.action_url) {
                            navigate(notif.action_url);
                            setShowNotifDropdown(false);
                          }
                        }}
                        style={{
                          padding: '0.85rem 1.1rem',
                          borderBottom: '1px solid #f8fafc',
                          background: notif.is_read ? '#ffffff' : '#f0fdfa',
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'flex-start',
                          cursor: notif.action_url ? 'pointer' : 'default',
                          transition: 'background 0.25s'
                        }}
                        onMouseOver={(e) => { if(notif.action_url) e.currentTarget.style.background = notif.is_read ? '#f8fafc' : '#ccfbf1'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = notif.is_read ? '#ffffff' : '#f0fdfa'; }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: notif.type === 'warning' ? '#f59e0b' : notif.type === 'order' ? '#0f4c81' : notif.type === 'error' ? '#ef4444' : '#10b981',
                            marginTop: '6px',
                            flexShrink: 0,
                            boxShadow: !notif.is_read ? `0 0 6px ${notif.type === 'warning' ? '#f59e0b' : notif.type === 'order' ? '#0f4c81' : notif.type === 'error' ? '#ef4444' : '#10b981'}` : 'none'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.83rem', fontWeight: '700', color: notif.is_read ? '#475569' : '#0f172a' }}>
                            {notif.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: notif.is_read ? '#94a3b8' : '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                            {notif.message}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                            {notif.created_at}
                          </div>
                        </div>
                        {!notif.is_read && (
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', alignSelf: 'center' }} />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div
                  style={{
                    padding: '0.65rem',
                    textAlign: 'center',
                    borderTop: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                >
                  <Link
                    to="/admin/notifications"
                    onClick={() => setShowNotifDropdown(false)}
                    style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f4c81', textDecoration: 'none' }}
                  >
                    Lihat Semua Notifikasi →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#0f4c81',
              textDecoration: 'none',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              transition: 'all 0.2s'
            }}
            title="Lihat Toko"
          >
            <Globe size={15} />
            <span className="hide-on-mobile">Lihat Toko</span>
          </Link>

          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)} 
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '50%', transition: 'transform 0.15s' }}
              title={user?.name || 'Admin'}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            >
              <Avatar src={user?.avatar} name={user?.name || 'Admin'} size={34} />
            </div>
            {showDropdown && (
              <div style={{ position: 'absolute', right: 0, top: '42px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '0.5rem', width: '180px', zIndex: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ padding: '4px 8px 8px 8px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || 'Admin'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email || 'admin@berkahpancing.com'}
                  </div>
                </div>
                <Link
                  to="/admin/profile"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#1e293b',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    borderRadius: '6px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <User size={16} color="#0f4c81" /> Profil Admin
                </Link>
                <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '6px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Admin Header Logout Confirmation Modal */}
        {showLogoutConfirm && createPortal(
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
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
          </div>,
          document.body
        )}
      </header>
    );
  }

  // User Customer View Navbar
  return (
    <header className="main-navbar-header" style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0b2545 0%, #0f4c81 100%)', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 999 }}>
      
      <div className="navbar-container" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0.9rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
        
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff', flexShrink: 0 }}>
          <img 
            src="/logo.png" 
            alt="Berkah Pancing Logo" 
            style={{ 
              width: '46px', 
              height: '46px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0, 168, 150, 0.45))'
            }} 
          />
          <div>
            <h1 className="navbar-brand-title" style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.1 }}>BERKAH PANCING</h1>
            <span className="navbar-brand-subtext" style={{ fontSize: '0.62rem', color: '#e2e8f0', letterSpacing: '0.5px', opacity: 0.9 }}>Angler E-Commerce</span>
          </div>
        </Link>

        {/* Search Engine Container with Dropdown */}
        <div ref={searchContainerRef} className="navbar-search-wrapper" style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', background: '#fff', borderRadius: '4px', padding: '3px', position: 'relative' }}>
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Cari pakan, pelet, joran, reel..."
              value={searchQuery}
              onFocus={() => { setIsSearchFocused(true); refreshSearchData(); }}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#334155', background: 'transparent' }}
            />
            <button 
              type="submit" 
              style={{ background: '#f77f00', border: 'none', color: '#fff', padding: '0 1rem', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Interactive Search Overlay Dropdown (History + Popular Searches) */}
          {isSearchFocused && (
            <div 
              style={{ 
                position: 'absolute', 
                top: '105%', 
                left: 0, 
                right: 0, 
                background: '#fff', 
                color: '#1e293b', 
                borderRadius: '8px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
                zIndex: 1000, 
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* 1. Riwayat Pencarian */}
              <div>

                {historyList.length === 0 ? (
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', padding: '4px 0' }}>
                    Belum ada riwayat pencarian.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {historyList.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => { setSearchQuery(item); handleExecuteSearch(item); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.84rem',
                          color: '#334155',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <History size={13} color="#94a3b8" />
                          <span>{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveHistory(e, item)}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Pencarian Populer */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                  <TrendingUp size={14} color="#00a896" /> Pencarian Populer
                </span>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {popularList.map((term, index) => (
                    <div
                      key={index}
                      onClick={() => { setSearchQuery(term); handleExecuteSearch(term); }}
                      style={{
                        background: '#e6f0fa',
                        color: '#0f4c81',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#d0e3f7'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#e6f0fa'}
                    >
                      {term}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Cart Icon & User Actions */}
        {!isCartPage && (
          <div className="navbar-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            {/* Live Chat Icon Button */}
            <button 
              onClick={() => {
                if (!user) {
                  requireAuth(() => navigate('/chat'), 'Silakan login terlebih dahulu untuk mengakses fitur live chat.');
                } else {
                  navigate('/chat');
                }
              }}
              style={{ position: 'relative', color: '#fff', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              title="Live Chat Penjual"
            >
              <MessageSquare size={22} />
            </button>

            {/* Notification Bell Button */}
            <div style={{ position: 'relative', flexShrink: 0 }} ref={notifRef}>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{ position: 'relative', color: '#fff', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                title="Notifikasi"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', fontSize: '0.62rem', fontWeight: '800', width: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0f4c81' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Menu for User */}
              {showNotifDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: '-40px',
                    top: '40px',
                    background: '#ffffff',
                    borderRadius: '14px',
                    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)',
                    width: 'min(350px, calc(100vw - 32px))',
                    zIndex: 2000,
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      padding: '0.85rem 1.1rem',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={16} color="#0f4c81" />
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                        Notifikasi ({unreadCount})
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: '#00a896',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckSquare size={13} /> Tandai dibaca
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {adminNotifications.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                        Tidak ada notifikasi saat ini.
                      </div>
                    ) : (
                      adminNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (!notif.is_read) markAsRead(notif.id);
                            if (notif.action_url) {
                              navigate(notif.action_url);
                              setShowNotifDropdown(false);
                            }
                          }}
                          style={{
                            padding: '0.85rem 1.1rem',
                            borderBottom: '1px solid #f8fafc',
                            background: notif.is_read ? '#ffffff' : '#f0fdfa',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'flex-start',
                            cursor: notif.action_url ? 'pointer' : 'default',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = notif.is_read ? '#f8fafc' : '#ccfbf1'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = notif.is_read ? '#ffffff' : '#f0fdfa'; }}
                        >
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: notif.type === 'promo' ? '#f59e0b' : notif.type === 'order' ? '#0f4c81' : '#10b981',
                              marginTop: '6px',
                              flexShrink: 0
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.83rem', fontWeight: '700', color: notif.is_read ? '#475569' : '#0f172a' }}>
                              {notif.title}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: notif.is_read ? '#94a3b8' : '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                              {notif.message}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                              {notif.created_at}
                            </div>
                          </div>
                          {!notif.is_read && (
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', alignSelf: 'center' }} />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                if (!user) {
                  requireAuth(() => navigate('/cart'), 'Silakan login terlebih dahulu untuk membuka keranjang belanja.');
                } else {
                  navigate('/cart');
                }
              }}
              style={{ position: 'relative', color: '#fff', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              title="Keranjang Belanja"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#f77f00', color: '#fff', fontSize: '0.65rem', fontWeight: '800', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0f4c81' }}>
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div style={{ position: 'relative', flexShrink: 0 }} ref={dropdownRef}>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '50%', transition: 'transform 0.15s' }}
                  title={user?.name || 'User'}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size={34} style={{ border: '2px solid rgba(255,255,255,0.85)' }} />
                </div>

                {showDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: '44px', background: '#fff', color: '#334155', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.18)', minWidth: '180px', padding: '6px', zIndex: 1000, border: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '6px 8px 8px 8px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isAdmin ? 'Akun Administrator' : user.email}
                      </div>
                    </div>

                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => { navigate('/admin/dashboard'); setShowDropdown(false); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: '#f0f9ff', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '700', color: '#0f4c81', cursor: 'pointer', textAlign: 'left', marginBottom: '2px' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#e0f2fe'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#f0f9ff'}
                        >
                          <ShieldCheck size={16} color="#0f4c81" /> Dashboard Admin
                        </button>
                        <button
                          onClick={() => { navigate('/admin/profile'); setShowDropdown(false); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <User size={16} color="#0f4c81" /> Profil Admin
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { navigate('/profile?tab=biodata'); setShowDropdown(false); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <User size={16} color="#0f4c81" /> Profil Saya
                        </button>
                        <button
                          onClick={() => { navigate('/orders'); setShowDropdown(false); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Package size={16} color="#0f4c81" /> Pesanan Saya
                        </button>
                        <button
                          onClick={() => { navigate('/profile?tab=ulasan'); setShowDropdown(false); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Star size={16} color="#f77f00" /> Ulasan Saya
                        </button>
                        <button
                          onClick={() => { navigate('/profile?tab=wishlist'); setShowDropdown(false); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Heart size={16} color="#ef4444" /> Wishlist Saya
                        </button>
                      </>
                    )}

                    <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
                    <button
                      onClick={handleLogout}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#ef4444', cursor: 'pointer', textAlign: 'left' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '700' }}>
                  Masuk
                </Link>
                <Link to="/register" style={{ background: '#fff', color: '#0f4c81', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '800', padding: '0.4rem 0.9rem', borderRadius: '4px' }}>
                  Daftar
                </Link>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
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
              Apakah Anda yakin ingin keluar dari sesi Anda saat ini?
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
        </div>,
        document.body
      )}

    </header>
  );
};

export default Navbar;
