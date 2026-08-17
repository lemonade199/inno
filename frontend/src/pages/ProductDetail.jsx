import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus, 
  Check, 
  Heart,
  MessageSquare,
  Store,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  ThumbsUp,
  X,
  Upload,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Shopee Reviews state
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ average: 5, totalCount: 0, breakdown: {}, withPhotoCount: 0, withCommentCount: 0 });
  const [activeStarFilter, setActiveStarFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [modalComment, setModalComment] = useState('');
  const [modalImageInput, setModalImageInput] = useState('');
  const [modalImages, setModalImages] = useState([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Lock background body scroll when review modal is open
  useEffect(() => {
    if (showReviewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReviewModal]);

  const fetchReviews = () => {
    if (!id) return;
    const revs = reviewService.getReviewsByProductId(id);
    const summary = reviewService.getProductRatingSummary(id);
    setReviews(revs);
    setRatingSummary(summary);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    reviewService.addReview({
      productId: id,
      userEmail: user?.email || 'julianto@gmail.com',
      userName: user?.name || 'Juli Anto',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: modalRating,
      variant: selectedVariant,
      comment: modalComment,
      images: modalImages.length > 0 ? modalImages : ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80']
    });
    fetchReviews();
    setShowReviewModal(false);
    setReviewSubmitted(true);
    setModalComment('');
    setModalImages([]);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleToggleHelpful = (reviewId) => {
    reviewService.toggleHelpful(reviewId);
    fetchReviews();
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeStarFilter === 'all') return true;
    if (activeStarFilter === 'photo') return r.images && r.images.length > 0;
    if (activeStarFilter === 'comment') return r.comment && r.comment.trim().length > 0;
    return r.rating === Number(activeStarFilter);
  });

  useEffect(() => {
    fetchReviews();
  }, [id]);



  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const productImages = product ? [
    product.image,
    'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80'
  ] : [];

  // Auto-slide effect
  useEffect(() => {
    if (!product || productImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [product, productImages.length]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (productImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (productImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  if (loading) return <Loading text="Memuat detail produk..." />;

  if (!product) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0', borderRadius: '14px' }}>
        <h2>Produk Tidak Ditemukan</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>Produk yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
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
    navigate('/checkout');
  };

  // Mock metadata based on product ID
  const discountPercent = product.id % 2 === 0 ? 50 : product.id % 3 === 0 ? 15 : 0;
  const originalPrice = discountPercent > 0 ? product.price / (1 - discountPercent / 100) : null;
  const reviewCount = ((product.id * 31) % 150) + 12;
  const soldCount = ((product.id * 67) % 500) + 45;
  const rating = (4.5 + (product.id % 5) * 0.1).toFixed(1);
  const variants = product.category === 'Joran' ? ['2.1m (Carbon)', '2.4m (Carbon)', '2.7m (Heavy)'] : 
                   product.category === 'Reel' ? ['2000 Series', '3000 Series', '4000 Series'] : 
                   ['Standard Edition', 'Pro Edition'];



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f5f5f5', margin: '-1.5rem -1rem', padding: '1.5rem 1rem' }}>
      
      {/* Shopee-style Breadcrumb */}
      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Link to="/" style={{ color: '#0f4c81', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
        <span>&gt;</span>
        <Link to="/products" style={{ color: '#0f4c81', textDecoration: 'none', fontWeight: '600' }}>Katalog</Link>
        <span>&gt;</span>
        <span style={{ color: '#475569' }}>{product.category}</span>
        <span>&gt;</span>
        <span style={{ color: '#1e293b', fontWeight: '700' }}>{product.name}</span>
      </div>

      {/* Main Container */}
      <div 
        className="product-detail-grid"
        style={{ 
          background: '#fff', 
          borderRadius: '3px', 
          padding: '1.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        
        {/* Left Column: Image Gallery & Social */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Large Image Slider */}
          <div style={{ 
            width: '100%', 
            aspectRatio: '1', 
            borderRadius: '2px', 
            overflow: 'hidden', 
            border: '1px solid #f1f5f9',
            background: '#fafafa',
            position: 'relative'
          }}>
            <img 
              src={productImages[currentImageIndex]} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
            />
            
            {/* Prev Image Button */}
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next Image Button */}
            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Thumbnails strip */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {productImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentImageIndex(idx)}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '2px', 
                  overflow: 'hidden', 
                  border: currentImageIndex === idx ? '2px solid #f77f00' : '1px solid #e2e8f0', 
                  cursor: 'pointer',
                  opacity: currentImageIndex === idx ? 1 : 0.7,
                  transition: 'all 0.1s'
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          {/* Share & Favorites Row */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderTop: '1px solid #f1f5f9', 
            paddingTop: '1rem',
            marginTop: '0.5rem'
          }}>
            {/* Share link buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
              <span>Share:</span>
              <button style={{ background: '#3b5998', border: 'none', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>f</button>
              <button style={{ background: '#1da1f2', border: 'none', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>t</button>
              <button style={{ background: '#e1306c', border: 'none', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</button>
            </div>
            
            {/* Favorites Heart */}
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: isFavorite ? '#ef4444' : '#64748b', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
              <span>Favorit ({isFavorite ? reviewCount + 1 : reviewCount})</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Ratings, Price, Options, Counter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Title Row */}
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.4, margin: '0 0 0.5rem 0' }}>
              <span style={{ 
                background: '#f77f00', 
                color: '#fff', 
                fontSize: '0.7rem', 
                fontWeight: '800', 
                padding: '2px 6px', 
                borderRadius: '2px',
                marginRight: '8px',
                verticalAlign: 'middle'
              }}>
                Mall
              </span>
              {product.name}
            </h1>

            {/* Ratings & Sold recap */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f77f00', borderRight: '1px solid #cbd5e1', paddingRight: '1rem' }}>
                <span style={{ fontWeight: '800', textDecoration: 'underline' }}>{rating}</span>
                <span style={{ color: '#f77f00' }}>★★★★★</span>
              </div>
              <div style={{ borderRight: '1px solid #cbd5e1', paddingRight: '1rem', color: '#1e293b' }}>
                <span style={{ fontWeight: '800', textDecoration: 'underline' }}>{reviewCount}</span> Penilaian
              </div>
              <div style={{ color: '#64748b' }}>
                <span style={{ fontWeight: '700', color: '#1e293b' }}>{soldCount}</span> Terjual
              </div>
            </div>
          </div>

          {/* Shopee-style Orange/Red Price Banner */}
          <div style={{ 
            background: '#fafafa', 
            padding: '1rem 1.25rem', 
            borderRadius: '2px', 
            display: 'flex', 
            alignItems: 'baseline', 
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {originalPrice && (
              <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#94a3b8' }}>
                {productService.formatIDR(originalPrice)}
              </span>
            )}
            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#f77f00' }}>
              {productService.formatIDR(product.price)}
            </span>
            {discountPercent > 0 && (
              <span style={{ 
                background: '#f77f00', 
                color: '#fff', 
                fontSize: '0.72rem', 
                fontWeight: '800', 
                padding: '2px 4px', 
                borderRadius: '2px' 
              }}>
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Delivery & Shipping Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span style={{ color: '#64748b', width: '100px', flexShrink: 0 }}>Pengiriman</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#1e293b' }}>
                  <Truck size={16} color="#00a896" /> Gratis Ongkir Xtra
                </div>
                <div style={{ color: '#64748b' }}>Dapatkan subsidi ongkir s/d Rp20.000 untuk pesanan ini.</div>
              </div>
            </div>
          </div>

          {/* Shopee Guarantee Info */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '1rem 0' }}>
            <span style={{ color: '#64748b', width: '100px', flexShrink: 0 }}>Jaminan Shopee</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1e293b' }}>
              <ShieldCheck size={16} color="#00a896" /> 15 Hari Pengembalian • 100% Original • COD (Bayar di Tempat)
            </div>
          </div>

          {/* Variant Options Selector */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', alignItems: 'center' }}>
            <span style={{ color: '#64748b', width: '100px', flexShrink: 0 }}>Pilih Variasi</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  style={{
                    background: selectedVariant === v ? '#fff' : '#fafafa',
                    color: selectedVariant === v ? '#f77f00' : '#1e293b',
                    border: selectedVariant === v ? '1.5px solid #f77f00' : '1px solid #cbd5e1',
                    borderRadius: '2px',
                    padding: '6px 12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'all 0.1s'
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Counter */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', alignItems: 'center' }}>
            <span style={{ color: '#64748b', width: '100px', flexShrink: 0 }}>Kuantitas</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '2px' }}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  style={{ width: '28px', height: '28px', background: '#fff', border: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                >
                  <Minus size={12} />
                </button>
                <span style={{ width: '32px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  style={{ width: '28px', height: '28px', background: '#fff', border: 'none', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                >
                  <Plus size={12} />
                </button>
              </div>
              <span style={{ marginLeft: '12px', color: '#64748b' }}>tersedia {product.stock} barang</span>
            </div>
          </div>

          {/* Action CTA Buttons */}
          {product.stock > 0 ? (
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', flexWrap: 'wrap' }}>
              {/* Masukkan Keranjang */}
              <button
                onClick={handleAddToCart}
                style={{
                  padding: '1rem 1.5rem',
                  borderRadius: '2px',
                  border: '1px solid #f77f00',
                  background: added ? '#2ec4b6' : 'rgba(247,127,0,0.08)',
                  color: added ? '#fff' : '#f77f00',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  flex: '1'
                }}
              >
                {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                <span>{added ? 'Berhasil Ditambahkan!' : 'Masukkan Keranjang'}</span>
              </button>

              {/* Beli Sekarang */}
              <button
                onClick={handleBuyNow}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '2px',
                  border: 'none',
                  background: '#f77f00',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flex: '1',
                  boxShadow: '0 4px 10px rgba(247,127,0,0.2)'
                }}
              >
                Beli Sekarang
              </button>
            </div>
          ) : (
            <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '4px', fontWeight: '700', textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem' }}>
              Maaf, stok barang ini sedang kosong.
            </div>
          )}

        </div>

      </div>

      {/* Shopee-style Merchant Card Section */}
      <div 
        className="merchant-card-grid"
        style={{ 
          background: '#fff', 
          borderRadius: '3px', 
          padding: '1.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        {/* Left Side: Merchant Info */}
        <div className="merchant-card-left" style={{ display: 'flex', gap: '16px', alignItems: 'center', borderRight: '1px solid #f1f5f9', paddingRight: '2rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '2px solid #f77f00',
            flexShrink: 0
          }}>
            <img 
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop&q=80" 
              alt="Logo Toko" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>
              Berkah Pancing Official Store
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>● Aktif 3 menit yang lalu</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button style={{ 
                background: 'rgba(0,168,150,0.08)', 
                color: '#00a896', 
                border: '1px solid #00a896', 
                borderRadius: '2px', 
                padding: '4px 8px', 
                fontSize: '0.75rem', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MessageSquare size={13} /> Chat Sekarang
              </button>
              <button 
                onClick={() => navigate('/')}
                style={{ 
                  background: '#fafafa', 
                  color: '#475569', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '2px', 
                  padding: '4px 8px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Store size={13} /> Kunjungi Toko
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Merchant Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: '1.25rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            <span>Penilaian:</span> <strong style={{ color: '#f77f00', marginLeft: '6px' }}>48,2RB</strong>
          </div>
          <div>
            <span>Persentase Chat Dibalas:</span> <strong style={{ color: '#f77f00', marginLeft: '6px' }}>100%</strong>
          </div>
          <div>
            <span>Bergabung:</span> <strong style={{ color: '#f77f00', marginLeft: '6px' }}>25 bulan lalu</strong>
          </div>
          <div>
            <span>Produk:</span> <strong style={{ color: '#f77f00', marginLeft: '6px' }}>216</strong>
          </div>
          <div>
            <span>Waktu Chat Dibalas:</span> <strong style={{ color: '#f77f00', marginLeft: '6px' }}>hitungan menit</strong>
          </div>
          <div>
            <span>Pengikut:</span> <strong style={{ color: '#f77f00', marginLeft: '6px' }}>9,4RB</strong>
          </div>
        </div>
      </div>

      {/* Product Description Section */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '3px', 
        padding: '1.5rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', margin: 0 }}>
          Spesifikasi & Deskripsi Produk
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: '#64748b', width: '120px' }}>Kategori</span>
            <span>{product.category}</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: '#64748b', width: '120px' }}>Kondisi</span>
            <span>Baru</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: '#64748b', width: '120px' }}>Garansi</span>
            <span>12 Bulan Resmi Distributor</span>
          </div>
        </div>

        <div style={{ 
          fontSize: '0.88rem', 
          color: '#475569', 
          lineHeight: 1.6, 
          whiteSpace: 'pre-line',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1rem',
          marginTop: '0.5rem'
        }}>
          {product.description || 'Produk alat pancing premium berlisensi original. Terbuat dari material terpilih berkekuatan ekstra tinggi untuk menaklukkan tarikan ikan monster. Sangat tangguh dan tahan korosi air laut.'}
        </div>
      </div>

      {/* ================= SHOPEE-STYLE PENILAIAN PRODUK / REVIEWS ================= */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '3px', 
        padding: '1.5rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            PENILAIAN PRODUK
          </h3>
          <button 
            onClick={() => setShowReviewModal(true)}
            style={{ 
              background: '#f77f00', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              fontSize: '0.82rem', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(247,127,0,0.2)'
            }}
          >
            <Edit3 size={15} /> Tulis Ulasan
          </button>
        </div>

        {reviewSubmitted && (
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '700' }}>
            ✓ Terima kasih! Ulasan produk Anda telah berhasil dipublikasikan.
          </div>
        )}

        {/* Shopee Rating Summary Banner */}
        <div style={{ 
          background: '#fffbf8', 
          border: '1px solid #fce3d2', 
          borderRadius: '4px', 
          padding: '1.5rem', 
          display: 'grid', 
          gridTemplateColumns: '180px 1fr', 
          gap: '2rem', 
          alignItems: 'center' 
        }}>
          {/* Big Score Box */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f77f00', lineHeight: 1 }}>
              {ratingSummary.average} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>dari 5</span>
            </div>
            <div style={{ color: '#f77f00', fontSize: '1.25rem' }}>
              ★★★★★
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
              {ratingSummary.totalCount} Penilaian
            </span>
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { key: 'all', label: `Semua (${ratingSummary.totalCount})` },
              { key: '5', label: `5 Bintang (${ratingSummary.breakdown[5] || 0})` },
              { key: '4', label: `4 Bintang (${ratingSummary.breakdown[4] || 0})` },
              { key: '3', label: `3 Bintang (${ratingSummary.breakdown[3] || 0})` },
              { key: 'comment', label: `Dengan Komentar (${ratingSummary.withCommentCount})` },
              { key: 'photo', label: `Dengan Foto (${ratingSummary.withPhotoCount})` }
            ].map((filter) => {
              const isActive = activeStarFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveStarFilter(filter.key)}
                  style={{
                    background: isActive ? '#fff' : '#fff',
                    color: isActive ? '#f77f00' : '#334155',
                    border: isActive ? '1.5px solid #f77f00' : '1px solid #cbd5e1',
                    padding: '6px 14px',
                    borderRadius: '2px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.88rem' }}>
              Belum ada ulasan untuk filter ini. Jadilah yang pertama memberikan ulasan!
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div 
                key={rev.id} 
                style={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  paddingBottom: '1.5rem', 
                  display: 'grid', 
                  gridTemplateColumns: '44px 1fr', 
                  gap: '12px' 
                }}
              >
                {/* User Avatar */}
                <img 
                  src={rev.userAvatar} 
                  alt={rev.userName} 
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* User Name & Stars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
                        {rev.userName}
                      </span>
                      <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '2px', fontWeight: '700' }}>
                        Pembeli Terverifikasi
                      </span>
                    </div>
                    <div style={{ color: '#f77f00', fontSize: '0.85rem' }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                  </div>

                  {/* Date & Variant */}
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {rev.date} | Variasi: {rev.variant}
                  </div>

                  {/* Comment */}
                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: '4px 0' }}>
                    {rev.comment}
                  </p>

                  {/* Review Photos */}
                  {rev.images && rev.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {rev.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} style={{ width: '72px', height: '72px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                          <img src={imgUrl} alt="Foto Ulasan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Seller Response Box */}
                  {rev.sellerResponse && (
                    <div style={{ background: '#f8fafc', borderLeft: '3px solid #00a896', padding: '10px 12px', borderRadius: '0 4px 4px 0', marginTop: '8px', fontSize: '0.8rem', color: '#475569' }}>
                      <strong style={{ color: '#00a896', display: 'block', marginBottom: '2px' }}>Respon Penjual:</strong>
                      {rev.sellerResponse}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <button 
                      onClick={() => handleToggleHelpful(rev.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#64748b', 
                        fontSize: '0.78rem', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ThumbsUp size={14} /> Membantu ({rev.helpfulCount || 0})
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= WRITE REVIEW MODAL ================= */}
      {showReviewModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.5)', 
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1rem' 
        }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: '8px', 
            maxWidth: '520px', 
            width: '100%', 
            padding: '1.5rem', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                Tulis Ulasan Produk
              </h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Product recap */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fafafa', padding: '10px', borderRadius: '6px' }}>
                <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{product.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Variasi: {selectedVariant}</span>
                </div>
              </div>

              {/* Star Rating Picker */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Kualitas Produk
                </label>
                <div style={{ display: 'flex', gap: '6px', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      onClick={() => setModalRating(star)}
                      style={{ fontSize: '1.8rem', color: star <= modalRating ? '#f77f00' : '#cbd5e1', transition: 'all 0.1s' }}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#f77f00', marginLeft: '8px', alignSelf: 'center' }}>
                    {modalRating === 5 ? 'Sangat Memuaskan' : modalRating === 4 ? 'Memuaskan' : modalRating === 3 ? 'Biasa Saja' : 'Cukup Baik'}
                  </span>
                </div>
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Ulasan Lengkap
                </label>
                <textarea 
                  required
                  rows={4}
                  value={modalComment}
                  onChange={(e) => setModalComment(e.target.value)}
                  placeholder="Bagikan pengalaman mancing Anda memakai produk ini (contoh: kekuatan joran, kelancaran reel, packing toko)..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Photo Attachment URL Picker */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Tambah URL Foto Produk (Opsional)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={modalImageInput} 
                    onChange={(e) => setModalImageInput(e.target.value)} 
                    placeholder="https://..."
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (modalImageInput.trim()) {
                        setModalImages([...modalImages, modalImageInput.trim()]);
                        setModalImageInput('');
                      }
                    }}
                    style={{ background: '#0f4c81', color: '#fff', border: 'none', padding: '0 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Tambah
                  </button>
                </div>
                
                {/* Photo Previews */}
                {modalImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {modalImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowReviewModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{ background: '#f77f00', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(247,127,0,0.3)' }}
                >
                  Kirim Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;

