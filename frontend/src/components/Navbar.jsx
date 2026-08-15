import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, ShieldCheck, LogOut, Anchor, Package, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ isAdminView = false, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = getCartCount();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produk?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
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
          <Link to="/user/dashboard" className="mode-switcher-link">
            <Compass size={15} /> Mode Pembeli
          </Link>

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

  // User View Navbar
  return (
    <header className="user-navbar">
      <div className="user-navbar-container">
        
        {/* Brand */}
        <Link to="/user/dashboard" className="user-brand">
          <div className="brand-icon-box">
            <Anchor size={22} color="#fff" />
          </div>
          <div>
            <span className="brand-title">BERKAH PANCING</span>
            <span className="brand-tagline">Toko Alat Pancing Terpercaya</span>
          </div>
        </Link>

        {/* Global Product Search */}
        <form onSubmit={handleSearchSubmit} className="user-search-form">
          <input
            type="text"
            placeholder="Cari Joran, Reel, Umpan, Senar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-search-input"
          />
          <Search size={16} color="#cbd5e1" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </form>

        {/* Nav Links & Actions */}
        <nav className="user-nav-links">
          <Link
            to="/user/dashboard"
            className={`nav-link-item ${location.pathname === '/user/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/user/products"
            className={`nav-link-item ${location.pathname.includes('/user/products') ? 'active' : ''}`}
          >
            Produk
          </Link>
          <Link
            to="/user/orders"
            className={`nav-link-item ${location.pathname.includes('/user/orders') ? 'active' : ''}`}
          >
            Pesanan
          </Link>

          {/* Cart Icon */}
          <Link to="/user/cart" className="cart-icon-btn">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown or Auth */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="user-profile-trigger"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="avatar-circle"
                />
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>

              {showDropdown && (
                <div className="profile-dropdown-menu">
                  <button
                    onClick={() => { navigate('/user/profile'); setShowDropdown(false); }}
                    className="dropdown-item-btn"
                  >
                    <User size={16} color="#0f4c81" /> Profil Saya
                  </button>
                  <button
                    onClick={() => { navigate('/user/orders'); setShowDropdown(false); }}
                    className="dropdown-item-btn"
                  >
                    <Package size={16} color="#0f4c81" /> Pesanan Saya
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { navigate('/admin/dashboard'); setShowDropdown(false); }}
                      className="dropdown-item-btn"
                      style={{ background: '#f0f9ff', color: '#0f4c81', fontWeight: '700' }}
                    >
                      <ShieldCheck size={16} color="#0f4c81" /> Panel Admin
                    </button>
                  )}
                  <div style={{ height: '1px', background: '#f1f5f9', margin: '0.3rem 0' }} />
                  <button
                    onClick={handleLogout}
                    className="dropdown-item-btn danger"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ borderRadius: '20px', padding: '0.4rem 1rem' }}>
                Masuk
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ borderRadius: '20px', padding: '0.4rem 1rem' }}>
                Daftar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
