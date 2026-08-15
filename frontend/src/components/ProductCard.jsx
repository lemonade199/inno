import React, { useState } from 'react';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onSelect }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDetail = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      navigate(`/user/products/${product.id}`);
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        borderRadius: '12px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={handleDetail}
    >
      <div style={{ position: 'relative', height: '180px', borderRadius: '10px', overflow: 'hidden', background: '#f1f5f9' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span
          className={`badge ${product.stock > 5 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}
          style={{ position: 'absolute', top: '10px', right: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#00a896', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.category}
        </span>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.3, height: '2.6em', overflow: 'hidden' }}>
          {product.name}
        </h4>
        <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f4c81', marginTop: 'auto' }}>
          {productService.formatIDR(product.price)}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleDetail}
          className="btn btn-secondary"
          style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
        >
          <Eye size={15} /> Detail
        </button>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          style={{
            flex: 1.2,
            padding: '0.5rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            borderRadius: '8px',
            border: 'none',
            background: added ? '#10b981' : product.stock > 0 ? '#00a896' : '#94a3b8',
            color: '#fff',
            cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.38rem',
            transition: 'background 0.2s'
          }}
        >
          {added ? (
            <>
              <Check size={15} /> Ditambah
            </>
          ) : (
            <>
              <ShoppingCart size={15} /> + Keranjang
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
