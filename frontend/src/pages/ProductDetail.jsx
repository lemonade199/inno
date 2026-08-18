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
  Edit3,
  Search,
  Menu,
  HelpCircle,
  CreditCard,
  Copy,
  MessageCircle,
  Send,
  MoreVertical,
  Smile,
  PlusCircle,
  Info,
  BadgeCheck,
  Anchor
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();
  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  
  // Tokopedia-style Chat Modal state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Halo Kak! Selamat datang di Berkah Pancing. Ada yang bisa kami bantu mengenai produk ini?', sender: 'seller', time: '10:30' }
  ]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || chatInputText;
    if (!text.trim()) return;

    const newBuyerMsg = {
      id: Date.now(),
      text: text.trim(),
      sender: 'buyer',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newBuyerMsg]);
    if (!textToSend) setChatInputText('');

    setTimeout(() => {
      const sellerReply = {
        id: Date.now() + 1,
        text: 'Terima kasih telah mengontak Berkah Pancing! Stok produk ini ready dan siap langsung dikirim hari ini. Silakan diorder ya Kak! 🎣✨',
        sender: 'seller',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, sellerReply]);
    }, 1000);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
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

  // Auto-open Review Modal if navigated with ?writeReview=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('writeReview') === 'true') {
      setShowReviewModal(true);
    }
  }, []);

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

  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

  const filteredReviews = reviews.filter((r) => {
    if (reviewSearchQuery.trim() !== '') {
      const query = reviewSearchQuery.toLowerCase();
      const matchComment = r.comment && r.comment.toLowerCase().includes(query);
      const matchVariant = r.variant && r.variant.toLowerCase().includes(query);
      const matchUser = r.userName && r.userName.toLowerCase().includes(query);
      if (!matchComment && !matchVariant && !matchUser) return false;
    }
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
    setIsExiting(false);
    setTimeout(() => setIsExiting(true), 1500);
    setTimeout(() => {
      setAdded(false);
      setIsExiting(false);
    }, 1850);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  // Mock metadata based on product ID
  const reviewCount = ((product.id * 31) % 150) + 12;
  const soldCount = ((product.id * 67) % 500) + 45;
  const rating = (4.5 + (product.id % 5) * 0.1).toFixed(1);
  const variants = product.category === 'Joran' ? ['2.1m (Carbon)', '2.4m (Carbon)', '2.7m (Heavy)'] : 
                   product.category === 'Reel' ? ['2000 Series', '3000 Series', '4000 Series'] : 
                   ['Standard Edition', 'Pro Edition'];



  return (
    <div className="product-detail-mobile-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f5f5f5', margin: '-1.5rem -1rem', padding: '1.5rem 1rem' }}>
      
      {/* Mobile Floating Top Navigation Header (Shopee / Tokopedia Style) */}
      <div className="mobile-detail-top-nav">
        {showSearchInput ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <button onClick={() => setShowSearchInput(false)} className="mobile-top-nav-btn" title="Tutup Pencarian">
              <ArrowLeft size={18} color="#1e293b" />
            </button>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (mobileSearchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
                  setShowSearchInput(false);
                }
              }}
              style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
              <input
                type="text"
                autoFocus
                placeholder="Cari produk di Berkah Pancing..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 32px 6px 34px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.82rem',
                  outline: 'none',
                  color: '#1e293b'
                }}
              />
              {mobileSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMobileSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>
        ) : (
          <>
            <button onClick={() => navigate(-1)} className="mobile-top-nav-btn" title="Kembali">
              <ArrowLeft size={18} color="#1e293b" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button onClick={() => setShowSearchInput(true)} className="mobile-top-nav-btn" title="Cari">
                <Search size={18} color="#1e293b" />
              </button>
              <button onClick={() => setShowShareModal(true)} className="mobile-top-nav-btn" title="Bagikan">
                <Share2 size={18} color="#1e293b" />
              </button>
              <Link to="/cart" className="mobile-top-nav-btn" title="Keranjang" style={{ position: 'relative' }}>
                <ShoppingCart size={18} color="#1e293b" />
                {cartCount > 0 && (
                  <span className="mobile-cart-badge">{cartCount}</span>
                )}
              </Link>
            </div>
          </>
        )}
      </div>
      
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
          <div className="product-detail-hero-image-box" style={{ 
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

            {/* Shopee Slide Counter Badge (1/9) */}
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', zIndex: 10 }}>
              {currentImageIndex + 1}/{productImages.length}
            </div>
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
          <div className="product-detail-share-fav" style={{ 
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
        <div className="product-detail-info-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Price & Terjual Row (Shopee Style) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ee4d2d' }}>
                {productService.formatIDR(product.price)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
              <span style={{ fontWeight: '600' }}>{soldCount > 50 ? '5RB+ Terjual' : `${soldCount} Terjual`}</span>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                style={{ background: 'none', border: 'none', color: isFavorite ? '#ef4444' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
              </button>
            </div>
          </div>

          {/* Product Title */}
          <div>
            <h1 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.4, margin: '4px 0 0 0' }}>
              {product.name}
            </h1>
          </div>

          {/* Shopee Feature Rows with Chevron Arrows (Pengiriman, Bebas Pengembalian, SPayLater) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', fontSize: '0.82rem' }}>
            {/* Shipping row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="#00a896" />
                <span><strong style={{ color: '#00a896' }}>19 Ags</strong> Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat.</span>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </div>

            {/* Free return row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#ee4d2d" />
                <span style={{ fontWeight: '600' }}>Bebas Pengembalian</span>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
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
            <div className="product-detail-desktop-action-cta" style={{ display: 'flex', gap: '12px', marginTop: '1rem', flexWrap: 'wrap' }}>
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

      {/* ================= TOKOPEDIA-STYLE ULASAN PEMBELI / REVIEWS ================= */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '3px', 
        padding: '1.25rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Header Row: Ulasan pembeli (Left) & Lihat Semua / Tulis Ulasan (Right) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
            Ulasan pembeli
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => setShowReviewModal(true)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#00a896', 
                fontSize: '0.88rem', 
                fontWeight: '700', 
                cursor: 'pointer' 
              }}
            >
              Lihat Semua
            </button>
          </div>
        </div>

        {/* Rating Subheader */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#475569' }}>
          <span style={{ color: '#f59e0b', fontSize: '1.1rem' }}>⭐</span>
          <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>4.9</span>
          <span style={{ color: '#64748b' }}>108,3 rb rating • 25,2 rb ulasan</span>
        </div>



        {/* Horizontal Photo Thumbnail Gallery Strip (Vertical Rectangular Images) */}
        <div className="single-line-tabs hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '4px 0' }}>
          {[
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=300&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
          ].map((imgUrl, idx) => (
            <div key={idx} style={{ width: '70px', height: '95px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
              <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {reviewSubmitted && (
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '700' }}>
            ✓ Terima kasih! Ulasan produk Anda telah berhasil dipublikasikan.
          </div>
        )}

        {/* Individual Buyer Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
          {filteredReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
              Belum ada ulasan untuk filter ini.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div 
                key={rev.id} 
                style={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  paddingBottom: '1.25rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px' 
                }}
              >
                {/* Avatar + Masked Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#64748b', fontSize: '0.8rem' }}>
                    👤
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e293b' }}>
                    {rev.userName.length > 3 ? `${rev.userName.charAt(0)}***${rev.userName.charAt(rev.userName.length - 1)}` : rev.userName}
                  </span>
                </div>

                {/* Stars */}
                <div style={{ color: '#f59e0b', fontSize: '0.9rem', letterSpacing: '1px' }}>
                  ★★★★★
                </div>

                {/* Comment Text */}
                <p style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.5, margin: 0 }}>
                  {rev.comment}
                </p>
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

              {/* Photo Attachment File Picker */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Unggah Foto Ulasan (Opsional)
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px dashed #0f4c81',
                    background: '#f0f9ff',
                    color: '#0f4c81',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <Upload size={16} /> Pilih Foto dari Galeri / Komputer
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        files.forEach((file) => {
                          const reader = new FileReader();
                          reader.onload = (uploadEvent) => {
                            setModalImages((prev) => [...prev, uploadEvent.target.result]);
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Bisa pilih beberapa foto sekaligus</span>
                </div>
                
                {/* Photo Previews */}
                {modalImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {modalImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setModalImages(modalImages.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px'
                          }}
                          title="Hapus foto ini"
                        >
                          <X size={12} />
                        </button>
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
        <button onClick={() => navigate(`/chat?productId=${product.id}`)} className="tokopedia-btn-chat" title="Chat Seller">
          <MessageSquare size={20} color="#475569" />
        </button>
        <button 
          onClick={handleAddToCart} 
          className={`tokopedia-btn-cart ${added ? (isExiting ? 'btn-added-exit' : 'btn-added-bounce') : ''}`}
          style={{
            background: added && !isExiting ? '#10b981' : '#00a896',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {added ? (
            <span className={isExiting ? 'cart-icon-pop-out' : 'cart-icon-pop-in'}>
              <CheckCircle2 size={18} /> Tersimpan!
            </span>
          ) : (
            '+ Keranjang'
          )}
        </button>
        <button onClick={handleBuyNow} className="tokopedia-btn-buy">
          Beli Sekarang
        </button>
      </div>

      {/* ================= E-COMMERCE CENTER SHARE MODAL ================= */}
      {showShareModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 2500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '420px',
              width: '100%',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={20} color="#00a896" /> Bagikan Produk
              </h3>
              <button 
                onClick={() => setShowShareModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Recap Mini Card */}
            {product && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <img src={product.image} alt={product.name} style={{ width: '46px', height: '46px', borderRadius: '6px', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ee4d2d' }}>{productService.formatIDR(product.price)}</div>
                </div>
              </div>
            )}

            {/* Center Link Input Box + Salin Button */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Link Produk</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  readOnly
                  value={window.location.href}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    color: '#475569',
                    background: '#fafafa',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleCopyLink}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isCopied ? '#10b981' : '#00a896',
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 size={16} /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Salin
                    </>
                  )}
                </button>
              </div>

              {/* Success Notification Text */}
              {isCopied && (
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={15} /> Berhasil disalin ke clipboard!
                </div>
              )}
            </div>

            {/* Social Sharing Applications Grid */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.75rem' }}>Bagikan Ke Aplikasi</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
                {/* WhatsApp */}
                <div 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + ' - ' + window.location.href)}`, '_blank')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(37,211,102,0.3)' }}>
                    <MessageCircle size={22} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155' }}>WhatsApp</span>
                </div>

                {/* Telegram */}
                <div 
                  onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`, '_blank')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#229ED9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(34,158,217,0.3)' }}>
                    <Send size={22} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155' }}>Telegram</span>
                </div>

                {/* Facebook */}
                <div 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1877F2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(24,119,242,0.3)', fontWeight: '900', fontSize: '1.2rem' }}>
                    f
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155' }}>Facebook</span>
                </div>

                {/* Twitter / X */}
                <div 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`, '_blank')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#000000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', fontWeight: '900', fontSize: '1.1rem' }}>
                    𝕏
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155' }}>Twitter / X</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;


