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

  // Shopee style dynamic rating & sales meta
  const summary = reviewService.getProductRatingSummary(product.id);
  const ratingScore = summary.average;
  const ratingCount = summary.totalCount;
  const discount = product.id % 2 === 0 ? '50%' : product.id % 3 === 0 ? '15%' : null;
  const sales = ((product.id * 17) % 80) + 12;
  const bonusText = product.id % 2 === 0 ? 'Hemat s.d 8% Pakai Bonus' : 'Hemat s.d 3% Pakai Bonus';
  const location = product.id % 3 === 0 ? 'Kab. Indramayu' : product.id % 3 === 1 ? 'Kota Tangerang' : 'Kota Jakarta Barat';


  return (
    <div
      onClick={handleDetail}
      style={{
        background: '#fff',
        border: '1px solid #f1f5f9',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.2s',
        height: '100%'
      }}
      onMouseOver={(e) => { 
        e.currentTarget.style.transform = 'translateY(-2px)'; 
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'; 
      }}
      onMouseOut={(e) => { 
        e.currentTarget.style.transform = 'translateY(0)'; 
        e.currentTarget.style.boxShadow = 'none'; 
      }}
    >
      {/* Discount Tag Badge */}
      {discount && (
        <span style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          background: '#ef4444',
          color: '#fff',
          fontSize: '0.68rem',
          fontWeight: '800',
          padding: '2px 6px',
          borderRadius: '2px',
          zIndex: 10
        }}>
          {discount} OFF
        </span>
      )}

      {/* Product Image */}
      <div style={{ width: '100%', height: '170px', background: '#f8fafc', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Product Meta Info */}
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {/* Title */}
        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: '600',
          color: '#1e293b',
          lineHeight: 1.3,
          height: '2.6em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0
        }}>
          {product.name}
        </h4>

        {/* Price in Bold */}
        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', marginTop: '2px' }}>
          {productService.formatIDR(product.price)}
        </div>

        {/* Orange Bonus tag */}
        <div style={{ fontSize: '0.68rem', color: '#f77f00', fontWeight: '700', marginTop: '2px' }}>
          {bonusText}
        </div>

        {/* Stars & Sales */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748b', marginTop: 'auto', paddingTop: '4px' }}>
          <span style={{ color: '#f77f00' }}>★</span>
          <span style={{ fontWeight: '700', color: '#1e293b' }}>{ratingScore}</span>
          <span>({ratingCount})</span>
          <span>·</span>
          <span>{sales} terjual</span>
        </div>

        {/* Location or Seller Name */}
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '4px' }}>
          {location}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
