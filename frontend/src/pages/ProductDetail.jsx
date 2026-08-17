import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search,
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
  Edit3,
  MoreVertical,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getCartCount } = useCart();
  const cartCount = getCartCount ? getCartCount() : 0;
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedReplies, setExpandedReplies] = useState({});

  // Mobile Header Actions State
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('produk');

  const handleShareProduct = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: product ? product.name : 'Berkah Pancing',
      text: `Cek ${product ? product.name : 'produk memancing'} di Berkah Pancing!`,
      url: shareUrl
    };

    let shared = false;
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        shared = true;
      } catch (err) {
        console.log('Share dismissed/unhandled, using clipboard fallback');
      }
    }

    if (!shared) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        }
      } catch (e) {
        console.log('Clipboard fallback error', e);
      }
      setToastMessage('Tautan produk berhasil disalin!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

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
    <div className="product-detail-page-wrapper">
      
      {/* Tokopedia Mobile Clean Top Header Bar */}
      <div className="mobile-tokopedia-header">
        {showMobileSearch ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <button onClick={() => setShowMobileSearch(false)} className="mobile-header-btn" title="Batal Cari">
              <ArrowLeft size={22} color="#1e293b" />
            </button>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (mobileSearchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
                }
              }} 
              style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '0 10px' }}
            >
              <Search size={16} color="#64748b" />
              <input 
                type="text" 
                autoFocus
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Cari di Berkah Pancing..."
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '8px 6px', fontSize: '0.85rem', outline: 'none', color: '#0f172a' }}
              />
              {mobileSearchQuery && (
                <button type="button" onClick={() => setMobileSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <X size={16} color="#94a3b8" />
                </button>
              )}
            </form>
          </div>
        ) : (
          <>
            <button 
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/products');
                }
              }} 
              className="mobile-header-btn" 
              title="Kembali"
            >
              <ArrowLeft size={22} color="#1e293b" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button onClick={() => setShowMobileSearch(true)} className="mobile-header-btn" title="Cari Produk">
                <Search size={20} color="#1e293b" />
              </button>
              <button onClick={handleShareProduct} className="mobile-header-btn" title="Bagikan Produk">
                <Share2 size={20} color="#1e293b" />
              </button>
              <button onClick={() => navigate('/cart')} className="mobile-header-btn" style={{ position: 'relative' }} title="Keranjang Belanja">
                <ShoppingCart size={20} color="#1e293b" />
                {cartCount > 0 && <span className="mobile-header-cart-badge">{cartCount}</span>}
              </button>
              <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="mobile-header-btn" title="Menu Lainnya">
                <MoreVertical size={20} color="#1e293b" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.9)', color: '#ffffff', padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', zIndex: 3000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* 3-Dots Dropdown Menu Modal */}
      {showMoreMenu && (
        <div 
          onClick={() => setShowMoreMenu(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 2000 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: 'absolute', 
              top: '56px', 
              right: '12px', 
              background: '#ffffff', 
              borderRadius: '12px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)', 
              width: '200px', 
              padding: '6px 0',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 2001
            }}
          >
            <button 
              onClick={() => { navigate('/'); setShowMoreMenu(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'none', border: 'none', color: '#1e293b', fontSize: '0.85rem', fontWeight: '600', width: '100%', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '1.1rem' }}>🏠</span> Beranda Toko
            </button>
            <button 
              onClick={() => { navigate('/products'); setShowMoreMenu(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'none', border: 'none', color: '#1e293b', fontSize: '0.85rem', fontWeight: '600', width: '100%', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '1.1rem' }}>📦</span> Semua Produk
            </button>
            <button 
              onClick={() => { navigate('/cart'); setShowMoreMenu(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'none', border: 'none', color: '#1e293b', fontSize: '0.85rem', fontWeight: '600', width: '100%', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '1.1rem' }}>🛒</span> Keranjang Saya
            </button>
            <button 
              onClick={() => { navigate('/chat'); setShowMoreMenu(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'none', border: 'none', color: '#1e293b', fontSize: '0.85rem', fontWeight: '600', width: '100%', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '1.1rem' }}>💬</span> Chat Penjual
            </button>
            <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
            <button 
              onClick={() => { handleShareProduct(); setShowMoreMenu(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'none', border: 'none', color: '#1e293b', fontSize: '0.85rem', fontWeight: '600', width: '100%', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '1.1rem' }}>🔗</span> Bagikan Produk
            </button>
          </div>
        </div>
      )}

      {/* Shopee-style Breadcrumb */}
      <div className="product-detail-breadcrumb" style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Link to="/" style={{ color: '#0f4c81', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
        <span>&gt;</span>
        <Link to="/products" style={{ color: '#0f4c81', textDecoration: 'none', fontWeight: '600' }}>Katalog</Link>
        <span>&gt;</span>
        <span style={{ color: '#475569' }}>{product.category}</span>
        <span>&gt;</span>
        <span style={{ color: '#1e293b', fontWeight: '700' }}>{product.name}</span>
      </div>

      {/* Main Container */}
      <div className="product-detail-grid">
        
        {/* Left Column: Image Gallery & Social */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Large Image Slider */}
          <div 
            className="product-detail-image-box"
            style={{ 
              width: '100%', 
              aspectRatio: '1', 
              borderRadius: '2px', 
              overflow: 'hidden', 
              border: '1px solid #f1f5f9',
              background: '#fafafa',
              position: 'relative'
            }}
          >
            <img 
              src={productImages[currentImageIndex]} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
            />


            
            {/* Shopee-style Image Count Badge Pill */}
            <span className="mobile-image-badge">
              {currentImageIndex + 1}/{productImages.length}
            </span>

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

          {/* Thumbnails strip (Desktop Only) */}
          <div className="desktop-only-thumbnails" style={{ display: 'flex', gap: '8px' }}>
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

          {/* Share & Favorites Row (Desktop Only) */}
          <div className="desktop-only-thumbnails" style={{ 
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
        <div className="product-detail-info-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Price Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ef4444' }}>Rp</span>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ef4444', lineHeight: 1 }}>
                {Math.round(Number(product.price)).toLocaleString('id-ID')}
              </span>
              {originalPrice && (
                <span style={{ fontSize: '0.82rem', textDecoration: 'line-through', color: '#94a3b8', marginLeft: '4px' }}>
                  Rp {Math.round(Number(originalPrice)).toLocaleString('id-ID')}
                </span>
              )}
              {discountPercent > 0 && (
                <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: '800' }}>
                  {discountPercent}%
                </span>
              )}
            </div>

            {/* Pink Discount Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginTop: '2px' }}>
              <span style={{ background: '#fdf2f8', color: '#db2777', fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>
                Diskon Pengguna Baru 40rb
              </span>
              <ChevronRight size={16} color="#94a3b8" />
            </div>

            {/* Bonus Row */}
            <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ background: '#fef08a', color: '#854d0e', padding: '2px 5px', borderRadius: '3px', fontSize: '0.7rem' }}>⚡</span>
              Lebih hemat s.d. 3% pakai bonus di checkout
            </div>
          </div>

          {/* Title & Heart Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginTop: '0.25rem' }}>
            <h1 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.4, margin: 0 }}>
              {product.name}
            </h1>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Heart size={22} color={isFavorite ? '#ef4444' : '#64748b'} fill={isFavorite ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Rating Meta Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
            <span style={{ color: '#eab308', fontWeight: '800' }}>★ 5.0</span>
            <span style={{ textDecoration: 'underline' }}>({reviewCount})</span>
            <span>•</span>
            <span style={{ textDecoration: 'underline' }}>32 Foto ulasan</span>
            <span>•</span>
            <span>250+ Terjual</span>
          </div>

          {/* Divider */}
          <div className="shopee-section-divider" />

          {/* Shipping Row */}
          <div className="shopee-info-row" style={{ border: 'none', padding: '0.25rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={18} color="#0f4c81" />
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ fontWeight: '800', color: '#0f172a' }}>(Rp0</span>
                <span style={{ textDecoration: 'line-through', color: '#94a3b8', margin: '0 4px', fontSize: '0.75rem' }}>Rp34.500</span>
                <span style={{ color: '#334155', fontWeight: '600' }}>) Est. tiba 19 - 20 Aug</span>
              </div>
            </div>
            <ChevronRight size={16} color="#94a3b8" />
          </div>

          {/* Divider */}
          <div className="shopee-section-divider" />

          {/* Variant Selector Row */}
          <div style={{ padding: '0.25rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
                {variants.length} tipe
              </span>
              <ChevronRight size={16} color="#94a3b8" />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  style={{
                    background: selectedVariant === v ? '#dcfce7' : '#ffffff',
                    color: selectedVariant === v ? '#15803d' : '#334155',
                    border: selectedVariant === v ? '1.5px solid #22c55e' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {v}
                  {selectedVariant === v && (
                    <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', fontSize: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      👍
                    </span>
                  )}
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

          {/* Action CTA Buttons (Desktop Only) */}
          {product.stock > 0 ? (
            <div className="desktop-action-buttons" style={{ display: 'flex', gap: '12px', marginTop: '1rem', flexWrap: 'wrap' }}>
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


      {/* Product Description Section */}
      <div 
        className="product-detail-desc-box"
        style={{ 
          background: '#fff', 
          borderRadius: '3px', 
          padding: '1.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
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
      {filteredReviews && filteredReviews.length > 0 && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '3px', 
          padding: '1.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
        {/* Tokopedia Mobile Review Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Ulasan pembeli
          </h3>
          <button 
            onClick={() => setShowAllReviewsModal(true)} 
            style={{ background: 'none', border: 'none', color: '#00a896', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
          >
            Lihat Semua
          </button>
        </div>

        {/* Rating Summary Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.85rem' }}>
          <span style={{ color: '#eab308', fontWeight: '800', fontSize: '0.95rem' }}>★ {ratingSummary.average}</span>
          <span>{soldCount * 2} rating • {reviewCount} ulasan</span>
        </div>

        {/* Customer Review Photos Horizontal Scroll Strip */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          {productImages.map((imgUrl, i) => (
            <div key={i} style={{ width: '74px', height: '74px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
              <img src={imgUrl} alt="Foto ulasan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Tokopedia Mobile Full-Screen "Lihat Semua Ulasan" Modal */}
      {showAllReviewsModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#ffffff',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          {/* Top Header Bar */}
          <div style={{
            position: 'sticky',
            top: 0,
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => setShowAllReviewsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <ArrowLeft size={22} color="#0f172a" />
              </button>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Ulasan
              </h2>
            </div>
            <button 
              onClick={() => { setShowAllReviewsModal(false); navigate('/cart'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}
            >
              <ShoppingCart size={22} color="#0f172a" />
              {cartCount > 0 && (
                <span className="mobile-header-cart-badge">{cartCount}</span>
              )}
            </button>
          </div>



          {/* Main Content Area */}
          <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
            
            {/* Rating Banner Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ color: '#eab308', fontSize: '1.4rem' }}>★</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>5.0</span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/5.0</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    99% pembeli merasa puas <ChevronRight size={16} color="#0f172a" />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {reviewCount} rating • {reviews.length} ulasan
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🛍️</span> Diambil dari Tokopedia & TikTok Shop by Tokopedia
              </div>
            </div>



            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '20px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: '600', color: '#334155', flexShrink: 0 }}>
                Foto & Video
              </button>
              <button style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '20px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                Rating <ChevronDown size={14} />
              </button>
              <button style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '20px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                Varian <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.58rem', padding: '1px 4px', borderRadius: '3px', fontWeight: '800' }}>BARU</span> <ChevronDown size={14} />
              </button>
              <button style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '20px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: '600', color: '#334155', flexShrink: 0 }}>
                Topik
              </button>
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              {filteredReviews.map((rev) => (
                <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  
                  {/* User Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={rev.userAvatar} 
                      alt={rev.userName} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
                        {rev.userName}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        1 ulasan lengkap • 1 terbantu
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <span style={{ color: '#eab308' }}>{'★'.repeat(rev.rating)}</span>
                    <span style={{ color: '#64748b', fontSize: '0.78rem' }}>10 bulan lalu</span>
                  </div>

                  {/* Variant */}
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Varian: {rev.variant || selectedVariant}
                  </div>

                  {/* Comment Text */}
                  <p style={{ fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.45, margin: '2px 0' }}>
                    {rev.comment}
                  </p>

                  {/* Review Photos */}
                  {rev.images && rev.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', overflowX: 'auto' }}>
                      {rev.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} style={{ width: '84px', height: '84px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                          <img src={imgUrl} alt="Foto Ulasan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Footer Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.78rem', color: '#0f172a' }}>
                    <button 
                      onClick={() => handleToggleHelpful(rev.id)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#0f172a', fontWeight: '600' }}
                    >
                      <ThumbsUp size={15} color="#475569" />
                      <span>{rev.helpfulCount || 1} orang terbantu</span>
                    </button>
                    <button 
                      onClick={() => setExpandedReplies(prev => ({ ...prev, [rev.id]: !prev[rev.id] }))}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#0f172a', fontWeight: '600' }}
                    >
                      <span>{expandedReplies[rev.id] ? 'Sembunyikan Balasan' : 'Lihat Balasan'}</span>
                      <ChevronDown size={14} color="#0f172a" style={{ transform: expandedReplies[rev.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>
                  </div>

                  {/* Seller Reply Box */}
                  {(rev.sellerResponse || expandedReplies[rev.id]) && (
                    <div style={{ background: '#f8fafc', borderLeft: '3px solid #00a896', padding: '10px 12px', borderRadius: '0 6px 6px 0', marginTop: '8px', fontSize: '0.8rem', color: '#334155' }}>
                      <strong style={{ color: '#00a896', display: 'block', marginBottom: '4px' }}>Respon Penjual:</strong>
                      {rev.sellerResponse || 'Terima kasih banyak kak atas ulasan positif dan kepercayaannya berbelanja di Berkah Pancing! 🙏✨'}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

          {/* Sticky Bottom Action Bar */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 100
          }}>
            <button 
              onClick={() => { setShowAllReviewsModal(false); navigate('/chat'); }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <MessageSquare size={20} color="#0f172a" />
            </button>
            <button 
              onClick={() => { setShowAllReviewsModal(false); handleBuyNow(); }}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '8px',
                border: '1px solid #00a896',
                background: '#ffffff',
                color: '#00a896',
                fontWeight: '800',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Beli Langsung
            </button>
            <button 
              onClick={() => { setShowAllReviewsModal(false); handleBuyNow(); }}
              style={{
                flex: 1.2,
                padding: '10px 0',
                borderRadius: '8px',
                border: 'none',
                background: '#00a896',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Untung pakai App
            </button>
          </div>
        </div>
      )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
              Belum ada ulasan untuk produk ini.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {/* User Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={rev.userAvatar} 
                    alt={rev.userName} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
                      {rev.userName}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                      1 ulasan lengkap • 1 terbantu
                    </div>
                  </div>
                </div>

                {/* Rating Stars & Time Ago */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#eab308' }}>{'★'.repeat(rev.rating)}</span>
                  <span style={{ color: '#64748b', fontSize: '0.78rem' }}>2 bulan lalu</span>
                </div>

                {/* Variant Row */}
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Varian: {rev.variant || selectedVariant}
                </div>

                {/* Comment Text */}
                <p style={{ fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.45, margin: '2px 0' }}>
                  {rev.comment}
                </p>

                {/* Review Photos Grid */}
                {rev.images && rev.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', overflowX: 'auto' }}>
                    {rev.images.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} style={{ width: '84px', height: '84px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                        <img src={imgUrl} alt="Foto Ulasan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Footer Action Row (Helpful count + Lihat Balasan) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.78rem', color: '#0f172a' }}>
                  <button 
                    onClick={() => handleToggleHelpful(rev.id)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#0f172a', fontWeight: '600' }}
                  >
                    <ThumbsUp size={15} color="#475569" />
                    <span>{rev.helpfulCount || 1} orang terbantu</span>
                  </button>
                  <button 
                    onClick={() => setExpandedReplies(prev => ({ ...prev, [rev.id]: !prev[rev.id] }))}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#0f172a', fontWeight: '600' }}
                  >
                    <span>{expandedReplies[rev.id] ? 'Sembunyikan Balasan' : 'Lihat Balasan'}</span>
                    <ChevronDown size={14} color="#0f172a" style={{ transform: expandedReplies[rev.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </button>
                </div>

                {/* Seller Reply Box (when expanded or present) */}
                {(rev.sellerResponse || expandedReplies[rev.id]) && (
                  <div style={{ background: '#f8fafc', borderLeft: '3px solid #00a896', padding: '10px 12px', borderRadius: '0 6px 6px 0', marginTop: '8px', fontSize: '0.8rem', color: '#334155' }}>
                    <strong style={{ color: '#00a896', display: 'block', marginBottom: '4px' }}>Respon Penjual:</strong>
                    {rev.sellerResponse || 'Terima kasih banyak kak atas ulasan positif dan kepercayaannya berbelanja di Berkah Pancing! 🙏✨'}
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </div>
      )}

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

      {/* Tokopedia Mobile Sticky Bottom Bar (Chat, + Keranjang, Beli Sekarang) */}
      <div className="tokopedia-mobile-bottom-bar">
        <button onClick={() => navigate('/chat')} className="tokopedia-btn-chat" title="Chat Seller">
          <MessageSquare size={20} color="#475569" />
        </button>
        <button onClick={handleAddToCart} className="tokopedia-btn-cart">
          + Keranjang
        </button>
        <button onClick={handleBuyNow} className="tokopedia-btn-buy">
          Beli Sekarang
        </button>
      </div>

    </div>
  );
};

export default ProductDetail;


