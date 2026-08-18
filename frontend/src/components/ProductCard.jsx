import React from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';

const ProductCard = ({ product, onSelect }) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      navigate(`/products/${product.id}`);
    }
  };

  // Dynamic rating & sales meta
  const summary = reviewService.getProductRatingSummary(product.id);
  const ratingScore = summary.average;
  const ratingCount = summary.totalCount;
  const sales = ((product.id * 17) % 80) + 12;

  return (
    <div
      onClick={handleDetail}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%'
      }}
      onMouseOver={(e) => { 
        e.currentTarget.style.transform = 'translateY(-3px)'; 
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)'; 
      }}
      onMouseOut={(e) => { 
        e.currentTarget.style.transform = 'translateY(0)'; 
        e.currentTarget.style.boxShadow = 'none'; 
      }}
    >
      {/* Product Image */}
      <div className="product-card-img-wrapper" style={{ width: '100%', height: '175px', background: '#f8fafc', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />
      </div>

      {/* Product Meta Info */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        
        {/* Title */}
        <h4 style={{
          fontSize: '0.86rem',
          fontWeight: '700',
          color: '#0f172a',
          lineHeight: 1.35,
          height: '2.7em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          margin: 0
        }}>
          {product.name}
        </h4>

        {/* Price in Bold */}
        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f4c81', marginTop: '2px' }}>
          {productService.formatIDR(product.price)}
        </div>

        {/* Stars & Sales */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#64748b', marginTop: 'auto', paddingTop: '4px' }}>
          <span style={{ color: '#f59e0b', fontSize: '0.82rem' }}>★</span>
          <span style={{ fontWeight: '700', color: '#1e293b' }}>{ratingScore}</span>
          <span style={{ color: '#94a3b8' }}>({ratingCount})</span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span>{sales} terjual</span>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
