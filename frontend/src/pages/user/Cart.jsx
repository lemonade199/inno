import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const estimatedShipping = cart.length > 0 ? 20000 : 0;
  const grandTotal = subtotal + estimatedShipping;

  if (cart.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.25rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4c81' }}>
          <ShoppingBag size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Keranjang Belanja Masih Kosong</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.3rem' }}>
            Yuk, cari peralatan mancing impianmu di katalog produk kami!
          </p>
        </div>
        <Link
          to="/user/products"
          style={{
            background: '#0f4c81',
            color: '#fff',
            padding: '0.75rem 1.75rem',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '0.9rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(15,76,129,0.3)'
          }}
        >
          Belanja Sekarang <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Keranjang Belanja</h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Ada <strong style={{ color: '#0f172a' }}>{cart.length} jenis barang</strong> di keranjang kamu
          </p>
        </div>

        <button
          onClick={clearCart}
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Trash2 size={16} /> Kosongkan Keranjang
        </button>
      </div>

      {/* Cart Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Column: Item List (Daftar Barang & Jumlah Barang) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map(({ product, qty }) => (
            <div
              key={product.id}
              className="card"
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              {/* Image */}
              <div style={{ width: '85px', height: '85px', borderRadius: '10px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Title & Category */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#00a896', textTransform: 'uppercase' }}>
                  {product.category}
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.3, margin: '0.2rem 0' }}>
                  {product.name}
                </h4>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f4c81' }}>
                  {productService.formatIDR(product.price)}
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => updateQuantity(product.id, qty - 1)}
                    style={{ width: '32px', height: '32px', background: '#f8fafc', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, qty + 1)}
                    disabled={qty >= product.stock}
                    style={{ width: '32px', height: '32px', background: '#f8fafc', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: qty >= product.stock ? 'not-allowed' : 'pointer', color: '#475569' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Subtotal</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                    {productService.formatIDR(product.price * qty)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px' }}
                  title="Hapus Barang"
                >
                  <Trash2 size={18} color="#ef4444" />
                </button>

              </div>
            </div>
          ))}

          <Link
            to="/user/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#0f4c81',
              fontWeight: '700',
              fontSize: '0.85rem',
              textDecoration: 'none',
              marginTop: '0.5rem'
            }}
          >
            <ArrowLeft size={16} /> Tambah Produk Lainnya
          </Link>
        </div>

        {/* Right Column: Order Summary (Total Harga & Checkout CTA) */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '14px', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Ringkasan Belanja
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Harga Produk</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{productService.formatIDR(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimasi Ongkos Kirim</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{productService.formatIDR(estimatedShipping)}</span>
            </div>

            <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Total Tagihan</span>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f4c81' }}>
                {productService.formatIDR(grandTotal)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/user/checkout')}
            style={{
              width: '100%',
              padding: '0.85rem',
              marginTop: '1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #0f4c81 0%, #00a896 100%)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0,168,150,0.3)'
            }}
          >
            Lanjut ke Checkout <ArrowRight size={18} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default Cart;
