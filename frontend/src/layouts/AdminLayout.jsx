import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const location = useLocation();
  const isAdminChat = location.pathname === '/admin/chat';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto close mobile drawer on route change
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
          }}
        />
      )}

      <Sidebar
        collapsed={isMobile ? false : collapsed}
        toggleSidebar={toggleSidebar}
        className={isMobile && mobileOpen ? 'mobile-open' : ''}
        style={isMobile ? { transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 999 } : {}}
      />
      <div className={`admin-main ${!isMobile && collapsed ? 'collapsed' : ''}`}>
        <Navbar isAdminView={true} toggleSidebar={toggleSidebar} />
        <main className="admin-content" style={isAdminChat ? { padding: 0 } : {}}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
