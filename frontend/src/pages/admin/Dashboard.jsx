import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  Plus,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  ArrowUpRight,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return <span className="badge badge-success"><CheckCircle2 size={13} /> Selesai</span>;
      case 'Diproses':
        return <span className="badge badge-info"><Clock size={13} /> Diproses</span>;
      case 'Dikirim':
        return <span className="badge badge-warning"><Truck size={13} /> Dikirim</span>;
      case 'Menunggu Pembayaran':
        return <span className="badge badge-secondary"><Clock size={13} /> Menunggu Bayar</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Dashboard Overview
          </h1>
          <p className="page-subtitle">
            Selamat datang kembali, Admin! Berikut ringkasan penjualan toko Berkah Pancing hari ini.
          </p>
        </div>
        <button onClick={() => navigate('/admin/products/create')} className="btn btn-primary">
          <Plus size={18} /> Tambah Produk Baru
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total Pendapatan</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f4c81', margin: '0.25rem 0' }}>Rp14.850.000</h3>
            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={14} /> +12.5% bulan ini
            </span>
          </div>
          <div className="stat-card" style={{ background: '#e0f2fe', width: '50px', height: '50px', padding: 0, alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} color="#0284c7" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total Pesanan</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', margin: '0.25rem 0' }}>28 Pesanan</h3>
            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={14} /> +5 hari ini
            </span>
          </div>
          <div className="stat-card" style={{ background: '#fef3c7', width: '50px', height: '50px', padding: 0, alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} color="#d97706" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total Produk</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', margin: '0.25rem 0' }}>42 Barang</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>6 Kategori</span>
          </div>
          <div className="stat-card" style={{ background: '#dcfce7', width: '50px', height: '50px', padding: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} color="#16a34a" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Pengguna Terdaftar</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', margin: '0.25rem 0' }}>156 User</h3>
            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>+8 user baru</span>
          </div>
          <div className="stat-card" style={{ background: '#f1f5f9', width: '50px', height: '50px', padding: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="#475569" />
          </div>
        </div>
      </div>

      {/* Main Grid: Orders & Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>
              Pesanan Terbaru
            </h3>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f4c81' }}>
              Lihat Semua →
            </Link>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '700', color: '#0f4c81' }}>{order.id}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.customerEmail}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{order.date}</td>
                    <td style={{ fontWeight: '700' }}>{productService.formatIDR(order.total)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="btn btn-secondary btn-icon"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Summary / Status distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
              Ringkasan Status Pesanan
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Menunggu Pembayaran</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#d97706' }}>5</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Sedang Diproses</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0284c7' }}>8</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Dalam Pengiriman</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#00a896' }}>6</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Pesanan Selesai</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#16a34a' }}>9</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #0f4c81, #0b192c)', color: '#fff' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Berkah Pancing Tips</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              Pastikan memeriksa stok produk Umpan dan Joran secara berkala untuk menghindari kehabisan stok saat akhir pekan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
