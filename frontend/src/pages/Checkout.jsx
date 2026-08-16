import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, MapPin, CheckCircle2, ArrowLeft, Building2, QrCode, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '081234567890',
    address: user?.address || 'Jl. Merdeka No. 45, Jakarta Selatan',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('E-Wallet');

  const subtotal = getCartTotal();
  const shippingFee = cart.length > 0 ? 20000 : 0;
  const total = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0', borderRadius: '14px' }}>
        <h2>Keranjang Belanja Kosong</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>Silakan tambahkan produk ke keranjang terlebih dahulu sebelum checkout.</p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
          Ke Katalog Produk
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderPayload = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        qty: item.qty,
        price: item.product.price,
        image: item.product.image
      })),
      subtotal: subtotal,
      shippingFee: shippingFee,
      total: total,
      paymentMethod: paymentMethod === 'Cash' ? 'Cash' : 'Midtrans'
    };

    try {
      // 1. Simpan pesanan ke Backend Database
      const createResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const createdOrder = await createResponse.json();

      if (createdOrder.status === 'error') {
        throw new Error(createdOrder.message);
      }
      
      clearCart();
      setSubmitting(false);
      navigate(`/orders/${createdOrder.order_id_db}`);

    } catch (err) {
      setSubmitting(false);
      alert('Gagal memproses pesanan. Silakan coba lagi.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/cart')}
          style={{ background: 'none', border: 'none', color: '#0f4c81', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Pengiriman & Pembayaran</h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Lengkapi data penerima dan pilih metode pembayaran</p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Column: Alamat & Payment Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Alamat Pengiriman */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: '#0f4c81' }}>
              <MapPin size={22} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Alamat Pengiriman</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                  Nama Lengkap Penerima
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Juli Anto"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                  Alamat Lengkap (Jalan, RT/RW, Kecamatan, Kota/Kab, Kode Pos)
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Tuliskan alamat pengiriman secara lengkap..."
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Metode Pembayaran */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: '#0f4c81' }}>
              <Banknote size={22} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Metode Pembayaran</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: `1px solid ${paymentMethod === 'E-Wallet' ? '#0f4c81' : '#cbd5e1'}`, borderRadius: '10px', background: paymentMethod === 'E-Wallet' ? '#f0f9ff' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                <input type="radio" name="payment" value="E-Wallet" checked={paymentMethod === 'E-Wallet'} onChange={() => setPaymentMethod('E-Wallet')} style={{ transform: 'scale(1.2)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>E-Wallet / Transfer Bank</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Otomatis via Midtrans (Gopay, QRIS, dll)</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: `1px solid ${paymentMethod === 'Cash' ? '#0f4c81' : '#cbd5e1'}`, borderRadius: '10px', background: paymentMethod === 'Cash' ? '#f0f9ff' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                <input type="radio" name="payment" value="Cash" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} style={{ transform: 'scale(1.2)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>Tunai / Cash (Di Toko)</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Langsung diproses dan dibayar tunai</span>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Confirmation CTA */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '14px', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Rincian Barang Belanja
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.3rem', marginBottom: '1.25rem' }}>
            {cart.map(({ product, qty }) => (
              <div key={product.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>{product.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{qty} x {productService.formatIDR(product.price)}</div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f4c81' }}>
                  {productService.formatIDR(product.price * qty)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Subtotal Produk</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{productService.formatIDR(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Ongkos Kirim</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{productService.formatIDR(shippingFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Total Tagihan</span>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f4c81' }}>
                {productService.formatIDR(total)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '0.9rem',
              marginTop: '1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #00a896 0%, #0284c7 100%)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: submitting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0,168,150,0.4)'
            }}
          >
            <CheckCircle2 size={18} /> {submitting ? 'Memproses Pesanan...' : 'Konfirmasi & Buat Pesanan'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default Checkout;
