import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Filter, CheckCircle2, Trash2, Box, Package, ShieldCheck } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';

const AdminNotifications = () => {
  const navigate = useNavigate();
  const { showConfirm, showToast } = useToast();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotification();
  
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filters = [
    'Semua', 'Belum dibaca', 'Pesanan', 'Pembayaran', 'Stok', 'Produk', 'Aktivitas Admin', 'Sistem'
  ];

  const getFilteredItems = () => {
    let result = notifications;

    if (filter === 'Belum dibaca') {
      result = result.filter(n => !n.is_read);
    } else if (filter === 'Pesanan') {
      result = result.filter(n => n.type === 'order' || n.entity_type === 'order');
    } else if (filter === 'Pembayaran') {
      result = result.filter(n => n.type === 'payment' || n.entity_type === 'payment');
    } else if (filter === 'Stok' || filter === 'Produk') {
      result = result.filter(n => n.entity_type === 'product' || n.type === 'warning');
    } else if (filter === 'Aktivitas Admin') {
      result = result.filter(n => n.type === 'info' || n.type === 'error' || n.type === 'success');
    } else if (filter === 'Sistem') {
      result = result.filter(n => n.entity_type === 'system');
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q));
    }

    return result;
  };

  const filteredItems = getFilteredItems();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearAll = () => {
    showConfirm({
      title: 'Hapus Semua Notifikasi',
      message: 'Apakah Anda yakin ingin menghapus seluruh riwayat notifikasi secara permanen?',
      isDanger: true,
      confirmText: 'Ya, Bersihkan',
      onConfirm: () => {
        clearAll();
        showToast('Semua notifikasi berhasil dihapus', 'success');
      }
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Bell size={26} color="#0f4c81" /> Pusat Notifikasi (Notification Center)
          </h1>
          <p className="page-subtitle">Pantau seluruh aktivitas penting dan pembaruan sistem toko.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={markAllAsRead} className="btn btn-secondary">
            <CheckCircle2 size={18} /> Tandai Semua Dibaca
          </button>
          <button onClick={handleClearAll} className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
            <Trash2 size={18} /> Bersihkan
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', flex: 1 }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: filter === f ? '#0f4c81' : '#e2e8f0',
                  background: filter === f ? '#0f4c81' : '#fff',
                  color: filter === f ? '#fff' : '#64748b',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
             <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
             <input
               type="text"
               className="form-input"
               style={{ paddingLeft: '2.5rem', height: '2.4rem', fontSize: '0.82rem' }}
               placeholder="Cari notifikasi..."
               value={search}
               onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
             />
          </div>
        </div>
      </div>

      <div className="card">
        {currentItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
            <Bell size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Belum ada notifikasi</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Tidak ada notifikasi yang sesuai dengan filter saat ini.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {currentItems.map(notif => (
               <div
                 key={notif.id}
                 onClick={() => {
                   if (!notif.is_read) markAsRead(notif.id);
                   if (notif.action_url) navigate(notif.action_url);
                 }}
                 style={{
                   padding: '1.25rem 1.5rem',
                   borderBottom: '1px solid #f8fafc',
                   display: 'flex',
                   gap: '1rem',
                   cursor: notif.action_url ? 'pointer' : 'default',
                   background: notif.is_read ? '#fff' : '#f0fdfa',
                   transition: 'background 0.2s',
                   alignItems: 'flex-start'
                 }}
                 onMouseOver={(e) => { if(notif.action_url) e.currentTarget.style.background = notif.is_read ? '#f8fafc' : '#ccfbf1'; }}
                 onMouseOut={(e) => { e.currentTarget.style.background = notif.is_read ? '#ffffff' : '#f0fdfa'; }}
               >
                 <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: notif.type === 'warning' ? '#fef3c7' : notif.type === 'error' ? '#fee2e2' : notif.type === 'success' ? '#dcfce3' : '#e0f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                 >
                   {notif.entity_type === 'product' ? (
                     <Box size={22} color={notif.type === 'warning' ? '#d97706' : notif.type === 'error' ? '#ef4444' : '#0284c7'} />
                   ) : notif.entity_type === 'order' ? (
                     <Package size={22} color="#0284c7" />
                   ) : (
                     <ShieldCheck size={22} color="#059669" />
                   )}
                 </div>

                 <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                     <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: notif.is_read ? '600' : '800', color: notif.is_read ? '#475569' : '#0f172a' }}>
                       {notif.title}
                     </h4>
                     <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                       {notif.created_at}
                     </span>
                   </div>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: notif.is_read ? '#64748b' : '#334155', lineHeight: 1.5 }}>
                     {notif.message}
                   </p>
                 </div>
                 
                 <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                   {!notif.is_read && (
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00a896' }} />
                   )}
                   <button 
                     onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                     style={{ background: 'none', border: 'none', padding: '0.25rem', cursor: 'pointer', color: '#cbd5e1' }}
                     title="Hapus notifikasi"
                   >
                     <Trash2 size={16} />
                   </button>
                 </div>
               </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem' }}
            >
              Sebeluma
            </button>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
              Hal {currentPage} dari {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem' }}
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
