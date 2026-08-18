import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isAdminChat = location.pathname === '/admin/chat';

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="admin-layout">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div className={`admin-main ${collapsed ? 'collapsed' : ''}`}>
        <Navbar isAdminView={true} toggleSidebar={toggleSidebar} />
        <main className="admin-content" style={{ padding: isAdminChat ? 0 : '1.75rem 2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
