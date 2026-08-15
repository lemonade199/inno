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
          <button
            onClick={toggleSidebar}
            style={{
              background: '#f1f5f9',
              border: 'none',
              color: '#475569',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Menu size={20} />
          </button>

          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '280px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari di admin..."
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.4rem',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </form>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/user/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#0f4c81',
              background: '#e0f2fe',
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              textDecoration: 'none'
            }}
          >
            <Compass size={15} /> Mode Pembeli
          </Link>

          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt="Admin Profile"
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0f4c81' }}
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
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '52px',
                  width: '180px',
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 0',
                  zIndex: 100
                }}
              >
                <button
                  onClick={() => { navigate('/admin/profile'); setShowDropdown(false); }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.85rem',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <User size={16} /> Profil Admin
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.85rem',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
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
    <header className="user-navbar" style={{
      background: 'linear-gradient(135deg, #0b2545 0%, #0f4c81 100%)',
      color: '#fff',
      padding: '0.85rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand */}
        <Link to="/user/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: '#fff' }}>
          <div style={{ background: '#00a896', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,168,150,0.4)' }}>
            <Anchor size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', tracking: '0.5px', background: 'linear-gradient(90deg, #ffffff, #64dfdf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              BERKAH PANCING
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '1px' }}>Toko Alat Pancing Terpercaya</span>
          </div>
        </Link>

        {/* Global Product Search */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: '1', maxWidth: '380px' }}>
          <input
            type="text"
            placeholder="Cari Joran, Reel, Umpan, Senar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              borderRadius: '25px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
              backdropFilter: 'blur(5px)'
            }}
          />
          <Search size={16} color="#cbd5e1" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </form>

        {/* Nav Links & Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/user/dashboard"
            style={{
              color: location.pathname === '/user/dashboard' ? '#64dfdf' : '#e2e8f0',
              textDecoration: 'none',
              fontWeight: location.pathname === '/user/dashboard' ? '700' : '500',
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/user/products"
            style={{
              color: location.pathname.includes('/user/products') ? '#64dfdf' : '#e2e8f0',
              textDecoration: 'none',
              fontWeight: location.pathname.includes('/user/products') ? '700' : '500',
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
          >
            Produk
          </Link>
          <Link
            to="/user/orders"
            style={{
              color: location.pathname.includes('/user/orders') ? '#64dfdf' : '#e2e8f0',
              textDecoration: 'none',
              fontWeight: location.pathname.includes('/user/orders') ? '700' : '500',
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
          >
            Pesanan
          </Link>

          {/* Cart Icon */}
          <Link
            to="/user/cart"
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.1)',
              padding: '0.5rem',
              borderRadius: '50%',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(239,68,68,0.5)'
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown or Auth */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #64dfdf' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>

              {showDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '190px',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem 0',
                    zIndex: 100
                  }}
                >
                  <button
                    onClick={() => { navigate('/user/profile'); setShowDropdown(false); }}
                    style={{
                      width: '100%',
                      padding: '0.6rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.85rem',
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <User size={16} color="#0f4c81" /> Profil Saya
                  </button>
                  <button
                    onClick={() => { navigate('/user/orders'); setShowDropdown(false); }}
                    style={{
                      width: '100%',
                      padding: '0.6rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.85rem',
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <Package size={16} color="#0f4c81" /> Pesanan Saya
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { navigate('/admin/dashboard'); setShowDropdown(false); }}
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#f0f9ff',
                        border: 'none',
                        fontSize: '0.85rem',
                        color: '#0f4c81',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <ShieldCheck size={16} color="#0f4c81" /> Panel Admin
                    </button>
                  )}
                  <div style={{ height: '1px', background: '#f1f5f9', margin: '0.3rem 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.6rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.85rem',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid #64dfdf', color: '#64dfdf', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600' }}>
                Masuk
              </Link>
              <Link to="/register" style={{ padding: '0.4rem 1rem', borderRadius: '20px', background: '#00a896', color: '#fff', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600' }}>
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
