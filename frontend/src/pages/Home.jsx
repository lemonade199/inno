import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Flame, 
  ChevronRight, 
  Gift, 
  ShieldCheck, 
  Anchor, 
  Compass, 
  Award, 
  Truck, 
  ThumbsUp, 
  HelpCircle,
  Percent,
  ChevronDown
} from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeProductTab, setActiveProductTab] = useState('🌟 Rekomendasi Toko');

  // Slides for Shopee-style carousel
  const slides = [
    {
      title: "PROMO PILIHAN ANGLER",
      subtitle: "Diskon Alat Pancing Terlengkap Se-Indonesia",
      highlight: "HEMAT HINGGA 50%",
      image: "/images/banner_hero_1.jpg",
      bg: "linear-gradient(135deg, #0b2545 0%, #0f4c81 100%)",
      btnText: "Beli Joran & Reel"
    },
    {
      title: "BERKAH PANCING MALL",
      subtitle: "Perlengkap Pancing & Pakan Burung Phoenix Terlengkap",
      highlight: "GRATIS ONGKIR SE-INDONESIA",
      image: "/images/banner_hero_2.jpg",
      bg: "linear-gradient(135deg, #007f5f 0%, #00a896 100%)",
      btnText: "Belanja Sekarang"
    },
    {
      title: "FLASH SALE AKHIR PEKAN",
      subtitle: "Dapatkan Kail, Senar & Umpan Jitu Termurah",
      highlight: "Mulai dari Rp5.000",
      image: "/images/banner_side_1.jpg",
      bg: "linear-gradient(135deg, #d81159 0%, #f77f00 100%)",
      btnText: "Serbu Flash Sale"
    }
  ];



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allProducts = await productService.getProducts();
      const allCategories = await productService.getCategories();
      setProducts(allProducts || []);
      setCategories(allCategories || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Carousel auto-slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) return <Loading text="Memuat halaman utama..." />;

  // Filter out Flash Sale products (e.g. stock menipis or discounted)
  const flashSaleProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
  const regularProducts = products.filter(p => p.stock > 0);

  const getCategoryIcon = (name) => {
    if (name.includes('Ayam')) return '🌾';
    if (name.includes('Ikan')) return '🐟';
    if (name.includes('Burung') || name.includes('Hewan')) return '🦜';
    if (name.includes('Umpan')) return '🪱';
    if (name.includes('Essen')) return '💧';
    return '🎣';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      
      {/* Banner / Promotion Carousel Section */}
      <div className="home-hero-grid">
        {/* Main Carousel Slider */}
        <div 
          className="home-carousel-slide" 
          style={{ 
            backgroundImage: `linear-gradient(135deg, rgba(11, 37, 69, 0.85) 0%, rgba(15, 76, 129, 0.45) 100%), url(${slides[currentSlide].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            padding: '2rem',
            color: '#fff',
            position: 'relative',
            minHeight: '240px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.5s ease-in-out'
          }}
        >
          <div className="home-carousel-content" style={{ zIndex: 2, maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span className="home-carousel-badge" style={{ 
              background: '#f77f00', 
              color: '#fff', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.75rem', 
              fontWeight: '800', 
              width: 'fit-content' 
            }}>
              {slides[currentSlide].highlight}
            </span>
            <h2 className="home-carousel-title" style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: 1.2, margin: 0, color: '#fff' }}>
              {slides[currentSlide].title}
            </h2>
            <p className="home-carousel-subtitle" style={{ fontSize: '0.92rem', color: '#f8fafc', margin: 0, opacity: 0.95 }}>
              {slides[currentSlide].subtitle}
            </p>
            <button 
              className="home-carousel-btn"
              onClick={() => navigate('/products')}
              style={{
                background: '#fff',
                color: '#0f4c81',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '6px',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                width: 'fit-content',
                marginTop: '0.5rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              {slides[currentSlide].btnText}
            </button>
          </div>

          {/* Slider Indicators */}
          <div style={{ 
            position: 'absolute', 
            bottom: '12px', 
            left: '2rem', 
            display: 'flex', 
            gap: '8px', 
            zIndex: 3 
          }}>
            {slides.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentSlide ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Side Static Promo Banners */}
        <div className="home-side-banners">
          {/* Banner 1 */}
          <div className="side-banner-card" style={{
            flex: 1,
            backgroundImage: 'linear-gradient(to right, rgba(15, 76, 129, 0.85), rgba(15, 76, 129, 0.45)), url("/images/banner_side_1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            padding: '1.25rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '115px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 className="side-banner-title" style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#fff' }}>PANCING MALL</h4>
            <p className="side-banner-desc" style={{ fontSize: '0.75rem', color: '#e2e8f0', margin: '4px 0 6px 0' }}>100% Produk Original Garansi Uang Kembali</p>
            <span className="side-banner-btn" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64dfdf' }}>Kunjungi Mall →</span>
          </div>

          {/* Banner 2 */}
          <div className="side-banner-card" style={{
            flex: 1,
            backgroundImage: 'linear-gradient(to right, rgba(0, 168, 150, 0.85), rgba(0, 168, 150, 0.45)), url("/images/banner_side_2.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            padding: '1.25rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '115px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 className="side-banner-title" style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#fff' }}>DISKON BRAND SULTAN</h4>
            <p className="side-banner-desc" style={{ fontSize: '0.75rem', color: '#e2e8f0', margin: '4px 0 6px 0' }}>Voucher Belanja Rp100RB Khusus Shimano & Daiwa</p>
            <span className="side-banner-btn" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fcd34d' }}>Klaim Sekarang →</span>
          </div>
        </div>
      </div>

      {/* Category Section (Shopee Mobile Style Horizontal Swipe) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fff', borderRadius: '12px', padding: '1rem 0.85rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ paddingLeft: '4px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            KATEGORI PILIHAN
          </h3>
        </div>

        {/* Responsive Desktop 6-Grid / Mobile Swipeable Category Container */}
        <div className="category-container-responsive">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              className="cat-responsive-item"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div className="cat-responsive-icon-box">
                {getCategoryIcon(cat.name)}
              </div>
              <span className="cat-responsive-label">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale Section */}
      {flashSaleProducts.length > 0 && (
        <div style={{ 
          background: 'linear-gradient(135deg, #d81159 0%, #f77f00 100%)',
          borderRadius: '8px',
          padding: '1.25rem',
          color: '#fff',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={24} color="#fff" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
                FLASH SALE ANGLER
              </h3>
            </div>
            <Link to="/products" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>
              Lihat Semua →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem' }}>
            {flashSaleProducts.slice(0, 4).map((product) => (
              <div key={product.id} style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Product Recommendations & Buyer Tabs */}
      <div className="home-product-section-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', borderRadius: '8px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
        {/* Horizontal Smart Tab Bar */}
        <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
          <div className="single-line-tabs hide-scrollbar" style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              '🌟 Rekomendasi Toko',
              '🔥 Paling Laris',
              '💥 Serba Di Bawah 15rb',
              '🎣 Alat Pancing & Umpan',
              '🌾 Pakan Burung & Ternak',
              '⭐ Rating Tinggi'
            ].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveProductTab(tab)}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: activeProductTab === tab ? '800' : '600',
                  color: activeProductTab === tab ? '#00a896' : '#475569',
                  cursor: 'pointer',
                  paddingBottom: '8px',
                  borderBottom: activeProductTab === tab ? '3px solid #00a896' : '3px solid transparent',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>

        {/* Smart Product Cards Grid */}
        {(() => {
          let filteredProducts = regularProducts;
          if (activeProductTab === '🔥 Paling Laris') {
            filteredProducts = [...regularProducts].sort((a, b) => b.id - a.id);
          } else if (activeProductTab === '💥 Serba Di Bawah 15rb') {
            filteredProducts = regularProducts.filter(p => p.price <= 15000);
          } else if (activeProductTab === '🎣 Alat Pancing & Umpan') {
            filteredProducts = regularProducts.filter(p => 
              p.category.includes('Pancing') || p.category.includes('Umpan') || p.category.includes('Essen')
            );
          } else if (activeProductTab === '🌾 Pakan Burung & Ternak') {
            filteredProducts = regularProducts.filter(p => p.category.includes('Pakan'));
          } else if (activeProductTab === '⭐ Rating Tinggi') {
            filteredProducts = regularProducts.filter(p => p.price >= 12000);
          }

          if (filteredProducts.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                Belum ada produk untuk filter "{activeProductTab}".
              </div>
            );
          }

          return (
            <div className="product-responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginTop: '1rem' }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
};

export default Home;
