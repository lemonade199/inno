import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowRight, Eye, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import Loading from '../components/Loading';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    fetchOrders(false);
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 5000); // Poll every 5 seconds for "real-time" updates
    return () => clearInterval(interval);
  }, [user]);

  const fetchOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const data = await orderService.getUserOrders(user?.email);
    setOrders(data || []);
    if (!isSilent) setLoading(false);
  };

  const handleConfirmReceived = async (orderId) => {
    try {
      await orderService.confirmOrderReceived(orderId);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Gagal mengonfirmasi pesanan.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'Semua') return true;
    return o.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={13} /> Selesai</span>;
      case 'Dikirim':
        return <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Truck size={13} /> Dikirim</span>;
      case 'Diproses':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> Diproses</span>;
      default:
        return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={13} /> Menunggu Pembayaran</span>;
    }
  };

  if (loading) return <Loading text="Memuat daftar pesanan Anda..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Riwayat Pesanan Saya</h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Pantau pesanan alat pancing dan riwayat transaksi Anda</p>
      </div>

      {/* Tabs Filter (Menunggu Pembayaran, Diproses, Dikirim, Selesai) */}
      <div className="card" style={{ padding: '0.5rem', borderRadius: '12px', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['Semua', 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'].map((tab) => {
          const count = orders.filter(o => tab === 'Semua' ? true : o.status.toLowerCase() === tab.toLowerCase()).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0f4c81' : 'transparent',
                color: isActive ? '#fff' : '#64748b',
                fontWeight: isActive ? '700' : '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1rem', textAlign: 'center', borderRadius: '14px' }}>
          <Package size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#334155' }}>Tidak Ada Pesanan</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Tidak ada transaksi dalam kategori "{activeTab}" saat ini.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.25rem', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{
                padding: '1.5rem',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              {/* Order Card Top: ID, Date, Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{order.id}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>• {order.date}</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Card Items Recap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      style={{ width: '55px', height: '55px', borderRadius: '10px', objectFit: 'cover', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.3 }}>{item.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.qty} barang x {productService.formatIDR(item.price)}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f4c81' }}>
                      {productService.formatIDR(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Card Bottom: Total Payment & Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                    Total Pembayaran ({order.paymentMethod === 'Midtrans' ? 'Pembayaran Online' : (order.paymentMethod || 'Pembayaran Online')})
                  </span>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f4c81' }}>
                    {productService.formatIDR(order.total)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {order.status === 'Menunggu Pembayaran' && (
                    <Link
                      to={`/orders/${order.id}`}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#00a896', color: '#fff', fontSize: '0.8rem', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                    >
                      Bayar Sekarang
                    </Link>
                  )}

                  {order.status === 'Dikirim' && (
                    <button
                      onClick={() => handleConfirmReceived(order.id)}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Konfirmasi Selesai
                    </button>
                  )}

                  {order.status === 'Selesai' && (
                    <Link
                      to={`/products/${order.items?.[0]?.id || 1}?writeReview=true`}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#f77f00', color: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Star size={14} /> Beri Ulasan
                    </Link>
                  )}

                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Eye size={15} /> Lihat Detail
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Orders;
