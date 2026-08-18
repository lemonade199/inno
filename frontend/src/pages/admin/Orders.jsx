import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Eye, CheckCircle2, Clock, Truck, AlertCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { showToast, showPrompt } = useToast();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    orderService.getOrders().then(setOrders);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const processUpdate = async (trackingNumber = null) => {
      const newPaymentStatus = newStatus === 'Menunggu Pembayaran' ? 'Belum Bayar' : 'Lunas';
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, paymentStatus: newPaymentStatus, trackingNumber: trackingNumber ?? o.trackingNumber } : o));
      await orderService.updateOrderStatus(orderId, newStatus, newPaymentStatus, trackingNumber);
      showToast(`Status pesanan #${orderId} diperbarui menjadi "${newStatus}"`, 'success');
    };

    if (newStatus === 'Dikirim') {
      const defaultResi = 'JNE-BP' + Date.now().toString().slice(-6);
      showPrompt({
        title: 'Input Nomor Resi Kurir',
        message: `Masukkan nomor resi ekspedisi untuk pesanan #${orderId}:`,
        defaultValue: defaultResi,
        placeholder: 'Contoh: JNE-BP123456',
        confirmText: 'Simpan & Kirim',
        onConfirm: (val) => {
          const trackingNumber = val && val.trim() ? val.trim() : defaultResi;
          processUpdate(trackingNumber);
        }
      });
    } else {
      processUpdate(null);
    }
  };

  const tabs = ['Semua', 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'];

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'Semua' ? true : order.status === activeTab;
    const matchesSearch =
      String(order.id).toLowerCase().includes(search.toLowerCase()) ||
      String(order.customerName).toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Selesai': return 'badge-success';
      case 'Diproses': return 'badge-info';
      case 'Dikirim': return 'badge-warning';
      case 'Menunggu Pembayaran': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShoppingBag size={26} color="#0f4c81" /> Kelola Pesanan Pelanggan
          </h1>
          <p className="page-subtitle">Daftar transaksi pesanan masuk di Berkah Pancing.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: activeTab === tab ? '#0f4c81' : '#e2e8f0',
              background: activeTab === tab ? '#0f4c81' : '#fff',
              color: activeTab === tab ? '#fff' : '#64748b',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.85rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Cari ID Pesanan / Pelanggan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Pelanggan</th>
              <th>Tanggal</th>
              <th>Metode Pembayaran</th>
              <th>Total Pembayaran</th>
              <th>Status Pesanan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Tidak ada pesanan pada kategori ini.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: '800', color: '#0f4c81' }}>{order.id}</td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.customerPhone}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{order.date}</td>
                  <td>
                    <span className="badge badge-info">{order.paymentMethod}</span>
                  </td>
                  <td style={{ fontWeight: '800', color: '#1e293b' }}>
                    {productService.formatIDR(order.total)}
                  </td>
                  <td>
                    <select
                      className={`form-select ${getBadgeClass(order.status)}`}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', fontWeight: '700', borderRadius: '12px', width: 'auto' }}
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Dikirim">Dikirim</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="btn btn-primary btn-icon"
                      title="Lihat Detail Pesanan"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
