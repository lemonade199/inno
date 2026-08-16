import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import Loading from '../components/Loading';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail(false);
    const interval = setInterval(() => {
      fetchOrderDetail(true);
    }, 5000); // Poll every 5s silently for real-time tracking
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrderDetail = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const data = await orderService.getOrderById(id);
    setOrder(data);
    if (!isSilent) setLoading(false);
  };

  const handleUpdateStatus = async (newStatus, paymentStatus) => {
    await orderService.updateOrderStatus(id, newStatus, paymentStatus);
    fetchOrderDetail();
  };

  if (loading) return <Loading text="Memuat rincian pesanan..." />;

  if (!order) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0', borderRadius: '14px' }}>
        <h2>Pesanan Tidak Ditemukan</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>Pesanan dengan ID {id} tidak ditemukan.</p>
        <Link to="/orders" className="btn btn-primary">Kembali ke Pesanan Saya</Link>
      </div>
    );
  }

  // Workflow steps
  const steps = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'];
  const currentStepIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Back CTA */}
      <button
        onClick={() => navigate('/orders')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: '#0f4c81',
          fontWeight: '700',
          fontSize: '0.9rem',
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        <ArrowLeft size={18} /> Kembali ke Daftar Pesanan
      </button>

      {/* Header Info Banner */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID Transaksi:</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0.1rem 0' }}>{order.id}</h2>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Waktu Pemesanan: {order.date}</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${
              order.status === 'Selesai' ? 'badge-success' :
              order.status === 'Dikirim' ? 'badge-info' :
              order.status === 'Diproses' ? 'badge-warning' : 'badge-danger'
            }`} style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem' }}>
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Order Status Progress Timeline Tracker */}
        <div style={{ marginTop: '1.5rem', padding: '1rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            
            {/* Background Line */}
            <div style={{ position: 'absolute', top: '18px', left: '5%', right: '5%', height: '4px', background: '#e2e8f0', zIndex: 1 }} />
            
            {/* Progress Fill Line */}
            <div
              style={{
                position: 'absolute',
                top: '18px',
                left: '5%',
                width: `${(currentStepIndex / (steps.length - 1)) * 90}%`,
                height: '4px',
                background: '#00a896',
                zIndex: 1,
                transition: 'width 0.4s ease'
              }}
            />

            {steps.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              return (
                <div key={step} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isPassed ? '#00a896' : '#fff',
                      border: isPassed ? '2px solid #00a896' : '2px solid #cbd5e1',
                      color: isPassed ? '#fff' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}
                  >
                    {isPassed ? <CheckCircle2 size={20} /> : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: isPassed ? '700' : '500', color: isPassed ? '#0f172a' : '#94a3b8', textAlign: 'center', maxWidth: '90px' }}>
                    {step}
                  </span>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Main Grid Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Column: Detail Items */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Rincian Produk
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  style={{ width: '65px', height: '65px', borderRadius: '10px', objectFit: 'cover', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.3 }}>{item.name}</h4>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.qty} x {productService.formatIDR(item.price)}</span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f4c81' }}>
                  {productService.formatIDR(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Subtotal Produk</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{productService.formatIDR(order.subtotal || order.total - 20000)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Ongkos Kirim</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{productService.formatIDR(order.shippingFee || 20000)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Total Pembayaran</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f4c81' }}>
                {productService.formatIDR(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Address & Payment Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Shipping Address & Tracking Info */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0f4c81' }}>
              <MapPin size={20} />
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Alamat Pengiriman</h3>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>{order.customerName}</div>
              <div style={{ color: '#64748b' }}>{order.customerPhone}</div>
              <div style={{ marginTop: '0.4rem', color: '#475569' }}>{order.address}</div>
            </div>
            
            {order.trackingNumber && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', marginBottom: '0.5rem' }}>
                  <Truck size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>INFO PENGIRIMAN</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#166534' }}>Nomor Resi / Pelacakan Kurir:</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: '#15803d', letterSpacing: '0.5px' }}>{order.trackingNumber}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(order.trackingNumber);
                        alert('Nomor Resi berhasil disalin!');
                      }}
                      style={{ background: '#fff', border: '1px solid #22c55e', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Salin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method & Actions */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0f4c81' }}>
              <CreditCard size={20} />
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Informasi Pembayaran</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#475569', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Metode:</span>
                <strong style={{ color: '#0f172a' }}>{order.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Status Bayar:</span>
                <span className={`badge ${order.paymentStatus === 'Lunas' ? 'badge-success' : 'badge-danger'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            {order.status === 'Menunggu Pembayaran' && order.snap_token && (
              <button
                onClick={() => {
                  window.snap.pay(order.snap_token, {
                    onSuccess: async function(result){
                      await fetch(`/api/payment/sync/${order.id}`);
                      fetchOrderDetail();
                    },
                    onPending: async function(result){
                      await fetch(`/api/payment/sync/${order.id}`);
                      fetchOrderDetail();
                    },
                    onError: async function(result){
                      await fetch(`/api/payment/sync/${order.id}`);
                      fetchOrderDetail();
                      alert('Pembayaran gagal/ditolak oleh bank.');
                    },
                    onClose: async function(){
                      await fetch(`/api/payment/sync/${order.id}`);
                      fetchOrderDetail();
                    }
                  })
                }}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#00a896',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Bayar Sekarang
              </button>
            )}

            {order.status === 'Dikirim' && (
              <button
                onClick={() => handleUpdateStatus('Selesai', 'Lunas')}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#16a34a',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Konfirmasi Pesanan Diterima
              </button>
            )}

            {order.status === 'Selesai' && (
              <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={16} /> Pesanan ini telah selesai
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetail;
