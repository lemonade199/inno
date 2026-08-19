import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Building2, 
  QrCode, 
  Banknote,
  ChevronRight,
  MessageSquare,
  Ticket,
  Coins
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import api from '../services/api';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    notes: ''
  });

  const [editingAddress, setEditingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [shippingOption, setShippingOption] = useState('kargo'); // 'kargo', 'reguler', 'instant'
  const [isDropshipper, setIsDropshipper] = useState(false);

  const subtotal = getCartTotal();

  const getShippingFee = () => {
    if (cart.length === 0) return 0;
    if (paymentMethod === 'COD') return 0; // COD = Ambil di Tempat & Bebas Ongkir
    if (shippingOption === 'kargo') return 0; // Free / Promo Ongkir
    if (shippingOption === 'reguler') return 15000;
    if (shippingOption === 'instant') return 30000;
    return 0;
  };

  const shippingFee = getShippingFee();
  const serviceFee = paymentMethod === 'COD' ? 0 : 1000; // Tanpa biaya layanan / ongkir untuk COD ambil di tempat
  const grandTotal = subtotal + shippingFee + serviceFee;

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.25rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
          <ShieldCheck size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Harap Login Terlebih Dahulu</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.3rem' }}>
            Anda harus masuk ke akun Anda sebelum bisa melanjutkan ke proses pembayaran.
          </p>
        </div>
        <Link
          to="/login"
          state={{ from: { pathname: '/checkout' } }}
          style={{
            background: '#0f4c81',
            color: '#fff',
            padding: '0.75rem 1.75rem',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(15, 76, 129, 0.3)'
          }}
        >
          Masuk ke Akun
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.25rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e6f0fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4c81' }}>
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Keranjang Belanja Kosong</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.3rem' }}>
            Silakan tambahkan produk ke keranjang terlebih dahulu sebelum melakukan checkout.
          </p>
        </div>
        <Link
          to="/products"
          style={{
            background: '#f77f00',
            color: '#fff',
            padding: '0.75rem 1.75rem',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          Ke Katalog Produk
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
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
      total: grandTotal,
      paymentMethod: paymentMethod
    };

    try {
      const createResponse = await api.post('/payment/create', orderPayload);
      const createdOrder = createResponse.data;

      if (createdOrder.status === 'error') {
        throw new Error(createdOrder.message);
      }

      addNotification({
        title: 'Pesanan Baru Masuk',
        message: `Ada pesanan baru #${createdOrder.order_id_db} dari ${formData.name}.`,
        type: 'order',
        entity_type: 'order',
        action_url: `/admin/orders/${createdOrder.order_id_db}`
      });

      clearCart();
      setSubmitting(false);
      navigate(`/orders/${createdOrder.order_id_db}`);
    } catch (err) {
      setSubmitting(false);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memproses pesanan. Silakan coba lagi.';
      alert('Checkout Gagal: ' + errorMessage);
    }
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', margin: '-1.5rem -1rem', paddingBottom: '6rem' }}>
      
      {/* Shopee-style Header Bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button
          onClick={() => navigate('/cart')}
          style={{ background: 'none', border: 'none', color: '#ee4d2d', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
        >
          <ArrowLeft size={22} color="#ee4d2d" />
        </button>
        <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          Checkout
        </h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Section 1: Alamat Pengiriman / Lokasi Pengambilan */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {paymentMethod === 'COD' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: '#0f4c81' }}>
                  <Building2 size={18} color="#0f4c81" /> Lokasi Pengambilan (Ambil di Tempat)
                </span>
                <span style={{ background: '#e6fffa', color: '#00a896', border: '1px solid #b2f5ea', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                  Tanpa Ongkir
                </span>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e293b' }}>
                  Toko Berkah Pancing (Pusat)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                  Jl. Dermaga No. 12, Pelabuhan Ratu, Sukabumi, Jawa Barat (Buka Setiap Hari: 08.00 - 21.00 WIB)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', borderTop: '1px dashed #cbd5e1', paddingTop: '4px' }}>
                  <strong>Kontak Pemesan:</strong> {formData.name} ({formData.phone || 'Nomor HP belum diisi'})
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={20} color="#ee4d2d" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b' }}>
                    {formData.name} <span style={{ color: '#64748b', fontWeight: '400' }}>{formData.phone}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                    {formData.address}
                  </div>
                </div>
                <button 
                  onClick={() => setEditingAddress(!editingAddress)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {editingAddress && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama Lengkap Penerima"
                    style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nomor HP / WhatsApp"
                    style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Alamat Lengkap (Jalan, RT/RW, Kec, Kota, Kode Pos)"
                    style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <button 
                    onClick={() => setEditingAddress(false)}
                    style={{ background: '#00a896', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Simpan Alamat
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Section 2: Toko & Detail Produk */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Merchant Title Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span style={{ background: '#ee4d2d', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '2px 5px', borderRadius: '2px' }}>
              Mall ORI
            </span>
            <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#1e293b' }}>
              Berkah Pancing Official Shop
            </span>
          </div>

          {/* Product Items List */}
          {cart.map(({ product, qty }) => (
            <div key={product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f1f5f9', flexShrink: 0 }} 
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', margin: 0, lineHeight: 1.3 }}>
                  {product.name}
                </h4>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  Kategori: {product.category}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ee4d2d' }}>
                    {productService.formatIDR(product.price)}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                    x{qty}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Voucher Toko Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f8fafc', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#334155', fontWeight: '600' }}>Voucher Toko</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ee4d2d', fontWeight: '700' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500' }}>Tidak ada voucher</span>
              <ChevronRight size={16} color="#94a3b8" />
            </div>
          </div>

          {/* Pesan untuk Penjual */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f8fafc', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#334155', fontWeight: '600' }}>Pesan untuk Penjual</span>
            <input 
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tinggalkan pesan >"
              style={{ border: 'none', textAlign: 'right', fontSize: '0.85rem', color: '#64748b', outline: 'none', background: 'transparent' }}
            />
          </div>

          {/* Opsi Pengiriman */}
          <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: '#334155', fontWeight: '600' }}>Opsi Pengiriman</span>
              {paymentMethod !== 'COD' && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Lihat Semua &gt;</span>}
            </div>
            
            {paymentMethod === 'COD' ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 12px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🏬 Ambil Langsung di Tempat / Toko <span style={{ fontWeight: '400', color: '#475569' }}>| Self Pick-up</span>
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#166534' }}>
                    Rp 0 (Gratis Ongkir)
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#15803d' }}>
                  Pesanan disiapkan langsung di toko fisik Berkah Pancing. Bayar tunai saat mengambil barang.
                </span>
              </div>
            ) : (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 12px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🚚 20 - 22 Ags <span style={{ fontWeight: '400', color: '#475569' }}>| Hemat Kargo</span>
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#166534' }}>
                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.75rem', marginRight: '4px' }}>Rp 58.500</span> Rp 0
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Voucher s/d Rp 10.000 jika pesanan terlambat.</span>
              </div>
            )}
          </div>

          {/* Subtotal Item Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.88rem' }}>
            <span style={{ color: '#64748b' }}>Total {cart.reduce((sum, i) => sum + i.qty, 0)} Produk</span>
            <span style={{ fontWeight: '800', color: '#ee4d2d', fontSize: '1rem' }}>
              {productService.formatIDR(subtotal)}
            </span>
          </div>
        </div>

        {/* Section 3: Promos & Voucher Shopee */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontWeight: '600' }}>
              <Ticket size={18} color="#ee4d2d" /> Voucher
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#00a896', background: '#e6fffa', border: '1px solid #b2f5ea', padding: '2px 8px', borderRadius: '2px', fontSize: '0.75rem', fontWeight: '700' }}>
                Gratis Ongkir
              </span>
              <ChevronRight size={16} color="#94a3b8" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f8fafc', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontWeight: '600' }}>
              <Coins size={18} color="#eab308" /> Koin Berkah
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Koin tidak dapat ditukarkan</span>
          </div>
        </div>

        {/* Section 4: Metode Pembayaran */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
              Metode Pembayaran
            </h3>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Pilih Metode</span>
          </div>

          {/* QRIS Option */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', border: paymentMethod === 'QRIS' ? '1.5px solid #ee4d2d' : '1px solid #e2e8f0', background: paymentMethod === 'QRIS' ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <QrCode size={20} color="#ee4d2d" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>QRIS (Instant QR)</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>DANA, Gopay, BCA Mobile, ShopeePay, dll</div>
              </div>
            </div>
            <input 
              type="radio" 
              name="payment" 
              value="QRIS" 
              checked={paymentMethod === 'QRIS'} 
              onChange={() => setPaymentMethod('QRIS')} 
              style={{ accentColor: '#ee4d2d', transform: 'scale(1.2)' }} 
            />
          </label>

          {/* E-Wallet / Midtrans Option */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', border: paymentMethod === 'Midtrans' ? '1.5px solid #ee4d2d' : '1px solid #e2e8f0', background: paymentMethod === 'Midtrans' ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} color="#00a896" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Transfer Bank / VA</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>BCA, Mandiri, BNI, BRI</div>
              </div>
            </div>
            <input 
              type="radio" 
              name="payment" 
              value="Midtrans" 
              checked={paymentMethod === 'Midtrans'} 
              onChange={() => setPaymentMethod('Midtrans')} 
              style={{ accentColor: '#ee4d2d', transform: 'scale(1.2)' }} 
            />
          </label>

          {/* COD Option */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', border: paymentMethod === 'COD' ? '1.5px solid #ee4d2d' : '1px solid #e2e8f0', background: paymentMethod === 'COD' ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Banknote size={20} color="#f77f00" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>COD (Ambil di Tempat & Bayar Tunai)</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Ambil barang langsung di toko & bayar di tempat (Tanpa Ongkir / Rp 0)</div>
              </div>
            </div>
            <input 
              type="radio" 
              name="payment" 
              value="COD" 
              checked={paymentMethod === 'COD'} 
              onChange={() => setPaymentMethod('COD')} 
              style={{ accentColor: '#ee4d2d', transform: 'scale(1.2)' }} 
            />
          </label>
        </div>

        {/* Section 5: Rincian Pembayaran */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
            Rincian Pembayaran
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
            <span>Subtotal Pesanan</span>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>{productService.formatIDR(subtotal)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
            <span>Subtotal Pengiriman</span>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>
              {paymentMethod === 'COD' ? 'Rp 0 (Ambil di Toko)' : productService.formatIDR(shippingFee)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
            <span>Biaya Layanan</span>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>{productService.formatIDR(serviceFee)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>Total Pembayaran</span>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ee4d2d' }}>
              {productService.formatIDR(grandTotal)}
            </span>
          </div>
        </div>

        {/* Section 6: Dropshipper Toggle (Only for Delivery) */}
        {paymentMethod !== 'COD' && (
          <div style={{ background: '#fff', borderRadius: '6px', padding: '0.85rem 1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>Kirim sebagai Dropshipper</span>
            <input 
              type="checkbox" 
              checked={isDropshipper} 
              onChange={(e) => setIsDropshipper(e.target.checked)} 
              style={{ width: '18px', height: '18px', accentColor: '#ee4d2d', cursor: 'pointer' }} 
            />
          </div>
        )}

      </div>

      {/* Shopee-style Sticky Bottom Footer */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        boxShadow: '0 -3px 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        padding: '0'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0.65rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left: Total & Savings */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>
              Total <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ee4d2d' }}>{productService.formatIDR(grandTotal)}</span>
            </div>
          </div>

          {/* Right: Buat Pesanan Button (Pinned Flush Right) */}
          <button
            onClick={handleSubmitOrder}
            disabled={submitting}
            style={{
              background: 'linear-gradient(135deg, #ee4d2d 0%, #d03b1e 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: '800',
              cursor: submitting ? 'wait' : 'pointer',
              borderRadius: '4px',
              boxShadow: '0 4px 14px rgba(238,77,45,0.3)',
              marginLeft: 'auto',
              flexShrink: 0
            }}
          >
            {submitting ? 'Memproses...' : 'Buat Pesanan'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
