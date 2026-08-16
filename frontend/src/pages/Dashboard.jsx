import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle2, Package, ArrowRight, Compass, ShieldCheck, Flame, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

        setLoading(true);
        const userOrders = await orderService.getUserOrders(user?.email);
        const allProducts = await productService.getProducts();
        setOrders(userOrders || []);
        setProducts(allProducts.slice(0, 4) || []);
        setLoading(false);

    };
    fetchData();
  }, [user]);

  const totalPesanan = orders.length;
  const pesananDiproses = orders.filter(o => o.status === 'Diproses' || o.status === 'Menunggu Pembayaran' || o.status === 'Dikirim').length;
  const pesananSelesai = orders.filter(o => o.status === 'Selesai').length;

  if (loading) return <Loading text="Memuat dashboard pembeli..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f4c81 0%, #00a896 100%)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          color: '#fff',
          boxShadow: '0 10px 30px rgba(15,76,129,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
            Selamat Datang Kembali 👋
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0.75rem 0 0.5rem', lineHeight: 1.2 }}>
            Halo, {user?.name || 'Sahabat Angler'}!
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Siap berburu monster laut? Lengkapi perlengkapan mancing impianmu dengan joran, reel, dan aksesoris original di Berkah Pancing!
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/products"
              style={{
                background: '#fff',
                color: '#0f4c81',
                padding: '0.75rem 1.5rem',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              Belanja Sekarang <ArrowRight size={18} />
            </Link>
            <Link
              to="/orders"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.75rem 1.5rem',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '0.9rem',
                textDecoration: 'none',
                backdropFilter: 'blur(5px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Cek Pesanan Saya
            </Link>
          </div>
        </div>
      </div>

      {/* User Order Summary Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        
        {/* Total Pesanan */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Total Pesanan</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0' }}>{totalPesanan}</h2>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Keseluruhan transaksi</span>
          </div>
        </div>

        {/* Pesanan Diproses */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Pesanan Diproses</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0' }}>{pesananDiproses}</h2>
            <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: '600' }}>Dalam pengiriman / bayar</span>
          </div>
        </div>

        {/* Pesanan Selesai */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Pesanan Selesai</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0' }}>{pesananSelesai}</h2>
            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>Barang telah diterima</span>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>Pesanan Terbaru Saya</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Pantau status pengiriman dan transaksi kamu</p>
          </div>
          <Link to="/orders" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#00a896', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '12px' }}>
            <ShoppingBag size={40} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Belum ada pesanan aktif</p>
            <Link to="/products" style={{ display: 'inline-block', marginTop: '0.75rem', color: '#0f4c81', fontWeight: '700', fontSize: '0.85rem' }}>
              Mulai Belanja Sekarang →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid #f1f5f9',
                  background: '#fafafa',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '45px', height: '45px', background: '#e0f2fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4c81', fontWeight: '700' }}>
                    <Package size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{order.id}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>• {order.date}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0' }}>
                      {order.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${
                      order.status === 'Selesai' ? 'badge-success' :
                      order.status === 'Dikirim' ? 'badge-info' :
                      order.status === 'Diproses' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {order.status}
                    </span>
                    <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f4c81', margin: '0.2rem 0 0' }}>
                      {productService.formatIDR(order.total)}
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Products Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444' }}>
              <Flame size={20} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Rekomendasi Produk Pilihan</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Peralatan mancing terlaris dengan kualitas terbaik</p>
          </div>
          <Link to="/products" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#00a896', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            Lihat Semua Produk <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
