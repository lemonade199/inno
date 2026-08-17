import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Coins, 
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Shopee-style item selection state
  const [selectedIds, setSelectedIds] = useState([]);
  


  // Initialize selected IDs with all items when cart loads
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

  const deleteSelected = () => {
    selectedIds.forEach(id => removeFromCart(id));
    setSelectedIds([]);
  };

  const getSelectedTotal = () => {
    return cart
      .filter(item => selectedIds.includes(item.product.id))
      .reduce((sum, item) => sum + item.product.price * item.qty, 0);
  };

  const selectedProductsCount = cart
    .filter(item => selectedIds.includes(item.product.id))
    .reduce((sum, item) => sum + item.qty, 0);

  const subtotal = getSelectedTotal();
  const shippingFee = selectedProductsCount > 0 ? 20000 : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee);

  if (cart.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.25rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e6f0fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4c81' }}>
          <ShoppingBag size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Keranjang Belanja Masih Kosong</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.3rem' }}>
            Yuk, cari peralatan mancing impianmu di katalog produk kami!
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
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(247,127,0,0.3)'
          }}
        >
          Belanja Sekarang <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '5rem', background: '#f5f5f5', margin: '-1.5rem -1rem', padding: '1.5rem 1rem' }}>
      
      {/* Table Headers */}
      <div className="cart-header-row">
        <div>
          <input 
            type="checkbox" 
            checked={selectedIds.length === cart.length && cart.length > 0}
            onChange={toggleSelectAll}
            style={{ cursor: 'pointer', transform: 'scale(1.2)', accentColor: '#f77f00' }}
          />
        </div>
        <div>Produk</div>
        <div style={{ textAlign: 'center' }}>Harga Satuan</div>
        <div style={{ textAlign: 'center' }}>Kuantitas</div>
        <div style={{ textAlign: 'center' }}>Total Harga</div>
        <div style={{ textAlign: 'center' }}>Aksi</div>
      </div>

      {/* Shop Group Wrapper */}
      <div style={{ background: '#fff', borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Shop Name Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '1rem 1rem 0.5rem 1rem',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <input 
            type="checkbox" 
            checked={selectedIds.length === cart.length && cart.length > 0}
            onChange={toggleSelectAll}
            style={{ cursor: 'pointer', transform: 'scale(1.2)', accentColor: '#f77f00' }}
          />
          <span style={{ 
            background: '#f77f00', 
            color: '#fff', 
            fontSize: '0.7rem', 
            fontWeight: '800', 
            padding: '2px 6px', 
            borderRadius: '2px' 
          }}>
            Star+
          </span>
          <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#1e293b' }}>
            Berkah Pancing Official Shop
          </span>
          <button style={{ background: 'none', border: 'none', color: '#00a896', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <MessageSquare size={16} />
          </button>
        </div>

        {/* Product List */}
        {cart.map(({ product, qty }) => (
          <div 
            key={product.id} 
            className="cart-item-row"
          >
            {/* Selection Checkbox & Product Meta */}
            <div className="cart-item-top">
              <input 
                type="checkbox"
                checked={selectedIds.includes(product.id)}
                onChange={() => toggleSelect(product.id)}
                style={{ cursor: 'pointer', transform: 'scale(1.2)', accentColor: '#f77f00', marginTop: '4px' }}
              />
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0', flexShrink: 0 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.3, margin: 0 }}>
                  {product.name}
                </h4>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '2px' }}>
                    Kategori: {product.category}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#f77f00', border: '1px solid #f77f00', padding: '1px 4px', borderRadius: '2px', fontWeight: '800' }}>
                    Garansi Ori
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#f77f00', fontWeight: '700', marginTop: '2px' }}>
                  {productService.formatIDR(product.price)}
                </div>
              </div>
            </div>

            {/* Quantity Selector, Subtotal & Actions */}
            <div className="cart-item-bottom">
              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '2px' }}>
                <button
                  onClick={() => updateQuantity(product.id, qty - 1)}
                  style={{ width: '28px', height: '28px', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                >
                  <Minus size={12} />
                </button>
                <span style={{ width: '32px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
                  {qty}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, qty + 1)}
                  disabled={qty >= product.stock}
                  style={{ width: '28px', height: '28px', background: '#fff', border: 'none', cursor: qty >= product.stock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Action Delete */}
              <button
                onClick={() => removeFromCart(product.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Hapus
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Shopee-style Sticky Footer Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
        zIndex: 900,
        padding: '0'
      }}>
        <div className="cart-sticky-footer-inner">
          {/* Left Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#334155', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={selectedIds.length === cart.length && cart.length > 0}
                onChange={toggleSelectAll}
                style={{ cursor: 'pointer', transform: 'scale(1.2)', accentColor: '#f77f00' }}
              />
              <span style={{ fontWeight: '600' }}>Semua ({cart.length})</span>
            </div>
            <button 
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
              style={{ background: 'none', border: 'none', color: selectedIds.length > 0 ? '#ef4444' : '#cbd5e1', fontWeight: '700', cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed' }}
            >
              Hapus
            </button>
            <button 
              onClick={clearCart}
              style={{ background: 'none', border: 'none', color: '#00a896', fontWeight: '700', cursor: 'pointer' }}
            >
              Kosongkan
            </button>
          </div>

          {/* Right Footer Calculations & CTA */}
          <div className="cart-footer-right">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: '600' }}>
                Total: <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f77f00' }}>{productService.formatIDR(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={selectedIds.length === 0}
              style={{
                background: selectedIds.length > 0 ? 'linear-gradient(135deg, #f77f00 0%, #e85d04 100%)' : '#cbd5e1',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: '800',
                cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
                borderRadius: '4px',
                transition: 'all 0.2s',
                boxShadow: selectedIds.length > 0 ? '0 4px 14px rgba(247,127,0,0.3)' : 'none'
              }}
            >
              Checkout ({selectedProductsCount})
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Cart;
