import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, ShieldCheck, LogOut, Anchor, Package, Compass, Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ isAdminView = false, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const cartCount = getCartCount();
  const isCartPage = location.pathname === '/cart';

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

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
          <div style={{ position: 'relative' }} ref={dropdownRef}>
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

  // User View Navbar
  return (
    <header style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0b2545 0%, #0f4c81 100%)', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 999 }}>
      {/* Main Header Bar */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0.9rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
        {/* Brand/Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
          <div style={{ background: '#00AB99', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,171,153,0.4)', flexShrink: 0 }}>
            <Anchor size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.1 }}>BERKAH PANCING</h1>
            <span style={{ fontSize: '0.62rem', color: '#e2e8f0', letterSpacing: '0.5px', opacity: 0.9 }}>Angler E-Commerce</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', background: '#fff', borderRadius: '4px', padding: '3px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Cari perlengkapan pancing, joran, reel, umpan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#334155', background: 'transparent' }}
            />
            <button 
              type="submit" 
              style={{ background: '#f77f00', border: 'none', color: '#fff', padding: '0 1.25rem', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Search size={18} />
            </button>
          </form>
          {/* Quick Keywords underneath Search Bar */}
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', color: '#e2e8f0', flexWrap: 'wrap' }}>
            {['Joran Shimano', 'Reel Daiwa', 'Umpan Jitu', 'Mata Kail', 'Senar PE 4', 'Aksesoris'].map((keyword, i) => (
              <span 
                key={i} 
                onClick={() => { setSearchQuery(keyword); navigate(`/products?search=${encodeURIComponent(keyword)}`); }}
                style={{ cursor: 'pointer' }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Cart Icon & Profile Actions */}
        {!isCartPage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/cart" style={{ position: 'relative', color: '#fff', display: 'flex', alignItems: 'center' }}>
              <ShoppingBag size={26} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#f77f00', color: '#fff', fontSize: '0.65rem', fontWeight: '800', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0f4c81' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

            {/* User Session Info */}
            {user ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', objectFit: 'cover' }}
                  />
                  <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.88rem' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>

                {showDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: '42px', background: '#fff', color: '#334155', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.18)', minWidth: '180px', padding: '6px', zIndex: 1000, border: '1px solid #e2e8f0' }}>
                    <button
                      onClick={() => { navigate('/profile?tab=biodata'); setShowDropdown(false); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={16} color="#0f4c81" /> Profil Saya
                    </button>
                    <button
                      onClick={() => { navigate('/orders'); setShowDropdown(false); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Package size={16} color="#0f4c81" /> Pesanan Saya
                    </button>
                    <button
                      onClick={() => { navigate('/profile?tab=ulasan'); setShowDropdown(false); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Star size={16} color="#f77f00" /> Ulasan Saya
                    </button>
                    <button
                      onClick={() => { navigate('/profile?tab=wishlist'); setShowDropdown(false); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Heart size={16} color="#ef4444" /> Wishlist Saya
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { navigate('/admin/dashboard'); setShowDropdown(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f0f9ff', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '700', color: '#0f4c81', cursor: 'pointer', textAlign: 'left', marginTop: '4px' }}
                      >
                        <ShieldCheck size={16} color="#0f4c81" /> Panel Admin
                      </button>
                    )}
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />
                    <button
                      onClick={handleLogout}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600', color: '#ef4444', cursor: 'pointer', textAlign: 'left' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link to="/login" style={{ color: '#fff', fontWeight: '700', textDecoration: 'none', fontSize: '0.88rem' }}>Masuk</Link>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
                <Link to="/register" style={{ color: '#fff', fontWeight: '700', textDecoration: 'none', fontSize: '0.88rem' }}>Daftar</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;


