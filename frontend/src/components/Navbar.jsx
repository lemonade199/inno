import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, ShieldCheck, LogOut, Anchor, History, TrendingUp, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  getSearchHistory, 
  addSearchHistory, 
  removeSearchHistoryItem, 
  clearSearchHistory, 
  getPopularSearches 
} from '../utils/searchHistory';

const Navbar = ({ isAdminView = false, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [popularList, setPopularList] = useState([]);

  const searchContainerRef = useRef(null);
  const cartCount = getCartCount();
  const isCartPage = location.pathname === '/cart';

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
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Tags under search bar: Show user's search history first, or popular store products if empty
  const tagsUnderSearch = historyList.length > 0 ? historyList.slice(0, 6) : popularList.slice(0, 6);

  if (isAdminView) {
    return (
      <header className="admin-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={toggleSidebar} className="navbar-action-btn">
            <Menu size={20} />
          </button>

          <form onSubmit={handleSearchSubmit} className="user-search-form" style={{ maxWidth: '280px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari di admin..."
              className="user-search-input"
              style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '20px' }}
            />
          </form>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="user-profile-trigger"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt="Admin Profile"
                className="avatar-circle"
                style={{ borderColor: '#0f4c81' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.2 }}>
                  {user?.name || 'Admin'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#00a896', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <ShieldCheck size={12} /> Administrator
                </span>
              </div>
            </div>

            {showDropdown && (
              <div className="profile-dropdown-menu">
                <button
                  onClick={() => { navigate('/admin/profile'); setShowDropdown(false); }}
                  className="dropdown-item-btn"
                >
                  <User size={16} /> Profil Admin
                </button>
                <button
                  onClick={handleLogout}
                  className="dropdown-item-btn danger"
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // User Customer View Navbar
  return (
    <header style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0b2545 0%, #0f4c81 100%)', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 999 }}>
      
      <div className="navbar-container" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0.9rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
        
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff', flexShrink: 0 }}>
          <div className="navbar-brand-icon-box" style={{ background: '#f77f00', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(247,127,0,0.3)', flexShrink: 0 }}>
            <Anchor size={22} color="#fff" />
          </div>
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
              {/* 1. Riwayat Pencarian (Search History Items) */}
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

              {/* 2. Pencarian Populer / Sering Dicari (Popular Searches) */}
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
            <Link to="/cart" style={{ position: 'relative', color: '#fff', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#f77f00', color: '#fff', fontSize: '0.65rem', fontWeight: '800', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0f4c81' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>|</span>

            {user ? (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }}
                  />
                  <span className="navbar-user-name" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>

                {showDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: '120%', background: '#fff', color: '#334155', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', width: '180px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 100 }}>
                    <button
                      onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                      style={{ background: 'none', border: 'none', padding: '0.5rem', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#334155', fontWeight: '600', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <User size={16} /> Profil Saya
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { navigate('/admin/dashboard'); setShowDropdown(false); }}
                        style={{ background: 'none', border: 'none', padding: '0.5rem', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#00a896', fontWeight: '700', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <ShieldCheck size={16} /> Panel Admin
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{ background: 'none', border: 'none', padding: '0.5rem', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#ef4444', fontWeight: '600', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}
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

    </header>
  );
};

export default Navbar;
