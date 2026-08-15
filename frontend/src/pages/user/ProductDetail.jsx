import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle, ShieldCheck, Truck, RefreshCw, Plus, Minus, Check } from 'lucide-react';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import Loading from '../../components/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loading text="Memuat detail produk..." />;

  if (!product) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0', borderRadius: '14px' }}>
        <h2>Produk Tidak Ditemukan</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>Produk yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link to="/user/products" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product.stock || 1)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/user/checkout');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/user/products')}
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
        <ArrowLeft size={18} /> Kembali ke Katalog Produk
      </button>

      {/* Main Product Section */}
      <div className="card" style={{ padding: '2rem', borderRadius: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        
        {/* Left: Product Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '100%', height: '360px', borderRadius: '14px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Right: Product Details & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-info" style={{ fontSize: '0.8rem', textTransform: 'uppercase', tracking: '0.5px' }}>
                {product.category}
              </span>
              <span className={`badge ${product.stock > 5 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                {product.stock > 0 ? `Stok Tersedia (${product.stock})` : 'Stok Habis'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.3 }}>
              {product.name}
            </h1>
          </div>

          <div style={{ background: '#f0f9ff', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
            <span style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: '600' }}>Harga Spesial Berkah Pancing</span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f4c81', marginTop: '0.2rem' }}>
              {productService.formatIDR(product.price)}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>Deskripsi Produk:</h4>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {product.description || 'Produk alat pancing berkualitas tinggi buatan pabrikan terpercaya dengan jaminan mutu dan kekuatan terbaik untuk hobi memancing Anda.'}
            </p>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569' }}>
              <ShieldCheck size={18} color="#00a896" /> 100% Produk Original Bergaransi
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569' }}>
              <Truck size={18} color="#00a896" /> Pengiriman Cepat & Aman Packing Busa/Pipa
            </div>
          </div>

          {/* Quantity Counter & Action Buttons */}
          {product.stock > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>Jumlah:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    style={{
                      width: '36px',
                      height: '36px',
                      background: '#f8fafc',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                      color: '#475569'
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '45px', textAlign: 'center', fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    style={{
                      width: '36px',
                      height: '36px',
                      background: '#f8fafc',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                      color: '#475569'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Maksimal {product.stock} pcs</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.25rem',
                    borderRadius: '10px',
                    border: '1.5px solid #00a896',
                    background: added ? '#10b981' : '#fff',
                    color: added ? '#fff' : '#00a896',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                  {added ? 'Berhasil Ditambah!' : 'Tambah ke Keranjang'}
                </button>

                <button
                  onClick={handleBuyNow}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0f4c81',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(15,76,129,0.3)'
                  }}
                >
                  Beli Sekarang
                </button>
              </div>

            </div>
          ) : (
            <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '10px', fontWeight: '700', textAlign: 'center', fontSize: '0.9rem' }}>
              Maaf, stok barang ini sedang kosong.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;
