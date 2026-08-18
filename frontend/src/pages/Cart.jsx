import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Selected items state (by product id)
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    confirmText: '',
    confirmColor: '#ef4444',
    onConfirm: null
  });

  // Initialize selected IDs with all items when cart loads or changes
  useEffect(() => {
    if (cart.length > 0 && selectedIds.length === 0) {
      setSelectedIds(cart.map(item => item.product.id));
    }
  }, [cart]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map(item => item.product.id));
    }
  };

  const requestDeleteSingle = (product) => {
    setConfirmModal({
      show: true,
      title: 'Hapus Produk',
      message: `Apakah Anda yakin ingin menghapus "${product.name}" dari keranjang?`,
      confirmText: 'Ya, Hapus',
      confirmColor: '#ef4444',
      onConfirm: () => {
        removeFromCart(product.id);
        setSelectedIds(prev => prev.filter(id => id !== product.id));
        setConfirmModal({ show: false });
      }
    });
  };

  const requestDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal({
      show: true,
      title: 'Hapus Produk Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} produk terpilih dari keranjang?`,
      confirmText: 'Ya, Hapus',
      confirmColor: '#ef4444',
      onConfirm: () => {
        selectedIds.forEach(id => removeFromCart(id));
        setSelectedIds([]);
        setConfirmModal({ show: false });
      }
    });
  };

  const requestClearCart = () => {
    setConfirmModal({
      show: true,
      title: 'Kosongkan Keranjang',
      message: 'Apakah Anda yakin ingin mengosongkan seluruh isi keranjang belanja?',
      confirmText: 'Ya, Kosongkan',
      confirmColor: '#00a896',
      onConfirm: () => {
        clearCart();
        setSelectedIds([]);
        setConfirmModal({ show: false });
      }
    });
  };

  const getSelectedSubtotal = () => {
    return cart
      .filter(item => selectedIds.includes(item.product.id))
      .reduce((sum, item) => sum + item.product.price * item.qty, 0);
  };

  const selectedCount = selectedIds.length;
  const grandTotal = getSelectedSubtotal();

  const handleCheckoutClick = () => {
    if (selectedCount === 0) return;
    if (!user) {
      alert('Silakan login terlebih dahulu untuk melakukan checkout!');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '65vh', 
        padding: '3rem 1rem', 
        textAlign: 'center' 
      }}>
        <div style={{ 
          width: '84px', 
          height: '84px', 
          borderRadius: '50%', 
          background: '#e0f2fe', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#0f4c81',
          marginBottom: '1.25rem'
        }}>
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
          Keranjang Belanja Masih Kosong
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1.5rem 0', maxWidth: '380px', lineHeight: 1.5 }}>
          Yuk temukan berbagai produk pakan, umpan, joran, reel, dan aksesoris pancing pilihan di etalase kami!
        </p>
        <Link
          to="/products"
          style={{
            background: 'linear-gradient(135deg, #f77f00 0%, #d9480f 100%)',
            color: '#ffffff',
            padding: '0.8rem 1.8rem',
            borderRadius: '30px',
            fontWeight: '800',
            fontSize: '0.92rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 18px rgba(247, 127, 0, 0.35)',
          }}
        >
          Mulai Belanja <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const isAllSelected = selectedIds.length === cart.length && cart.length > 0;

  return (
    <div className="cart-page-container">
      
      {/* Page Header Title */}
      <div className="cart-header-title-box" style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.2rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={22} color="#0f4c81" /> Keranjang Belanja ({cart.length})
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Pilih produk yang ingin Anda beli dan lanjutkan ke pembayaran.
        </p>
      </div>

      {/* 1. Desktop Table Header Row */}
      <div className="cart-header-card">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input 
            type="checkbox" 
            checked={isAllSelected}
            onChange={toggleSelectAll}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f77f00' }}
            title="Pilih Semua Produk"
          />
        </div>
        <div>Produk</div>
        <div style={{ textAlign: 'center' }}>Harga Satuan</div>
        <div style={{ textAlign: 'center' }}>Kuantitas</div>
        <div style={{ textAlign: 'center' }}>Total Harga</div>
        <div style={{ textAlign: 'center' }}>Aksi</div>
      </div>

      {/* 2. Cart Items List (Unified Seamless Container) */}
      <div className="cart-list-wrapper">
        {cart.map(({ product, qty }) => {
          const isSelected = selectedIds.includes(product.id);
          const itemTotal = product.price * qty;

          return (
            <div key={product.id} className="cart-item-card">
              
              {/* DESKTOP VIEW ROW */}
              <div className="cart-item-grid-desktop">
                
                {/* Col 1: Checkbox */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(product.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f77f00' }}
                  />
                </div>

                {/* Col 2: Product Image & Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200'} 
                    alt={product.name} 
                    style={{ 
                      width: '70px', 
                      height: '70px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0', 
                      flexShrink: 0 
                    }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <h3 style={{ 
                      fontSize: '0.92rem', 
                      fontWeight: '700', 
                      color: '#0f172a', 
                      margin: '0 0 4px 0', 
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        color: '#0f4c81', 
                        background: '#f0f9ff', 
                        border: '1px solid #bae6fd',
                        padding: '1px 6px', 
                        borderRadius: '4px',
                        fontWeight: '600' 
                      }}>
                        {product.category || 'Alat Pancing'}
                      </span>
                      <span style={{ 
                        fontSize: '0.68rem', 
                        color: '#16a34a', 
                        background: '#dcfce7', 
                        padding: '1px 5px', 
                        borderRadius: '4px', 
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        <ShieldCheck size={11} /> Garansi Ori
                      </span>
                    </div>
                  </div>
                </div>

                {/* Col 3: Unit Price */}
                <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>
                  {productService.formatIDR(product.price)}
                </div>

                {/* Col 4: Quantity Controls */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="cart-qty-control">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, qty - 1)}
                      disabled={qty <= 1}
                      className="cart-qty-btn"
                      title="Kurangi"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="cart-qty-val">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, qty + 1)}
                      disabled={qty >= (product.stock || 999)}
                      className="cart-qty-btn"
                      title="Tambah"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Col 5: Total Item Price */}
                <div style={{ textAlign: 'center', fontSize: '0.95rem', fontWeight: '800', color: '#f77f00' }}>
                  {productService.formatIDR(itemTotal)}
                </div>

                {/* Col 6: Delete Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => requestDeleteSingle(product)}
                    style={{
                      background: '#fee2e2',
                      border: 'none',
                      color: '#ef4444',
                      padding: '7px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.15s, transform 0.15s',
                    }}
                    title="Hapus Produk"
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>

              {/* MOBILE VIEW (Clean Stacked Card < 768px) */}
              <div className="cart-item-mobile-view">
                
                {/* Row 1: Checkbox, Image, Info & Delete Icon */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  
                  {/* Checkbox */}
                  <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(product.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f77f00', marginTop: '3px', flexShrink: 0 }}
                  />

                  {/* Thumbnail */}
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200'} 
                    alt={product.name} 
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                  />

                  {/* Title & Category */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', margin: '0 0 3px 0', lineHeight: 1.3 }}>
                      {product.name}
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: '#0f4c81', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '1px 6px', borderRadius: '4px', display: 'inline-block' }}>
                      {product.category || 'Alat Pancing'}
                    </span>
                  </div>

                  {/* Delete Trash Button */}
                  <button
                    type="button"
                    onClick={() => requestDeleteSingle(product)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    title="Hapus Produk"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Row 2: Price on Left, Quantity Stepper on Right */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f8fafc', paddingLeft: '28px' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f77f00' }}>
                    {productService.formatIDR(itemTotal)}
                  </div>

                  <div className="cart-qty-control">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, qty - 1)}
                      disabled={qty <= 1}
                      className="cart-qty-btn"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="cart-qty-val">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, qty + 1)}
                      disabled={qty >= (product.stock || 999)}
                      className="cart-qty-btn"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* 3. Sticky Bottom Checkout Bar */}
      <div className="cart-sticky-bar">
        <div className="cart-sticky-inner">
          
          {/* Top/Left Selection & Action Links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', width: '100%', maxWidth: '400px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={toggleSelectAll}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f77f00' }}
              />
              <span>Pilih Semua ({cart.length})</span>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {selectedCount > 0 && (
                <button 
                  type="button"
                  onClick={requestDeleteSelected}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ef4444', 
                    fontWeight: '700', 
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Hapus ({selectedCount})
                </button>
              )}

              <button 
                type="button"
                onClick={requestClearCart}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#00a896', 
                  fontWeight: '700', 
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Kosongkan
              </button>
            </div>
          </div>

          {/* Bottom/Right Total & Checkout Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', width: '100%', maxWidth: '380px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Total Pembayaran:</span>
              <strong style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f77f00', display: 'block', lineHeight: 1.2 }}>
                {productService.formatIDR(grandTotal)}
              </strong>
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              disabled={selectedCount === 0}
              style={{
                flex: 1,
                maxWidth: '180px',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedCount > 0 ? 'linear-gradient(135deg, #f77f00 0%, #e85d04 100%)' : '#cbd5e1',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.9rem',
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                boxShadow: selectedCount > 0 ? '0 4px 12px rgba(247, 127, 0, 0.3)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Checkout ({selectedCount})
            </button>
          </div>

        </div>
      </div>

      {/* Confirmation Modal Dialog */}
      {confirmModal.show && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setConfirmModal({ ...confirmModal, show: false })}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '360px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              background: confirmModal.confirmColor === '#00a896' ? '#e6f8f6' : '#fee2e2', 
              color: confirmModal.confirmColor, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 0.85rem auto' 
            }}>
              <Trash2 size={24} />
            </div>
            
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.4rem 0' }}>
              {confirmModal.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              {confirmModal.message}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                style={{
                  background: '#f8fafc',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                style={{
                  background: confirmModal.confirmColor,
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: `0 4px 12px ${confirmModal.confirmColor}40`
                }}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;
