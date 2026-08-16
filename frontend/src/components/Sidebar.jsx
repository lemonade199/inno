import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  User,
  LogOut,
  Fish,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { logout } = useAuth();

  const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Produk', path: '/admin/products', icon: Package, badge: '6' },
    { title: 'Kategori', path: '/admin/categories', icon: FolderTree },
    { title: 'Pesanan', path: '/admin/orders', icon: ShoppingBag, badge: '4', badgeColor: 'bg-amber-500' },
    { title: 'Profil Admin', path: '/admin/profile', icon: User },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header / Logo */}
      <div style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0' : '0 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00a896, #0f4c81)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 168, 150, 0.3)'
          }}>
            <Fish size={22} color="#fff" />
          </div>
          {!collapsed && (
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                BERKAH PANCING
              </h1>
              <span style={{ fontSize: '0.68rem', color: '#00a896', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Portal
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ padding: '1rem 0.75rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', padding: '0 0.75rem 0.5rem', display: collapsed ? 'none' : 'block' }}>
          Navigasi Utama
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: collapsed ? '0.75rem' : '0.75rem 1rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: '10px',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(90deg, #0f4c81, #0a3760)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                })}
              >
                <Icon size={20} />
                {!collapsed && (
                  <span style={{ flex: 1 }}>{item.title}</span>
                )}
                {!collapsed && item.badge && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: item.badgeColor ? '#f77f00' : '#0f4c81',
                    color: '#fff'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: collapsed ? '0.75rem' : '0.75rem 1rem',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: '10px',
            color: '#f87171',
            background: 'rgba(239, 68, 68, 0.08)',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={20} />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
