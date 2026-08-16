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
  const [activeProductTab, setActiveProductTab] = useState('For You');

  // Slides for Shopee-style carousel
  const slides = [
    {
      title: "PROMO PILIHAN ANGLER",
      subtitle: "Diskon Alat Pancing Terlengkap Se-Indonesia",
      highlight: "HEMAT HINGGA 50%",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80",
      bg: "linear-gradient(135deg, #0b2545 0%, #0f4c81 100%)",
      btnText: "Beli Joran & Reel"
    },
    {
      title: "BERKAH PANCING MALL",
      subtitle: "Jaminan 100% Produk Original & Bergaransi Resmi",
      highlight: "GRATIS ONGKIR SE-INDONESIA",
      image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=1000&auto=format&fit=crop&q=80",
      bg: "linear-gradient(135deg, #007f5f 0%, #00a896 100%)",
      btnText: "Belanja Sekarang"
    },
    {
      title: "FLASH SALE AKHIR PEKAN",
      subtitle: "Dapatkan Kail, Senar & Umpan Jitu Termurah",
      highlight: "Mulai dari Rp5.000",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80",
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      
      {/* Banner / Promotion Carousel Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '12px',
        width: '100%',
        minHeight: '280px'
      }}>
        {/* Main Carousel Slider */}
        <div style={{ 
          background: slides[currentSlide].bg,
          borderRadius: '8px',
          padding: '2.5rem',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
          transition: 'background 0.5s ease-in-out'
        }}>
          {/* Subtle graphic overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: `url(${slides[currentSlide].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            zIndex: 1,
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '65%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ 
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
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1.2, margin: 0 }}>
              {slides[currentSlide].title}
            </h2>
            <p style={{ fontSize: '1rem', color: '#f8fafc', margin: 0, opacity: 0.9 }}>
              {slides[currentSlide].subtitle}
            </p>
            <button 
              onClick={() => navigate('/products')}
              style={{
                background: '#fff',
                color: '#0f4c81',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                width: 'fit-content',
                marginTop: '1rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {slides[currentSlide].btnText}
            </button>
          </div>

          {/* Slider Indicators */}
          <div style={{ 
            position: 'absolute', 
            bottom: '15px', 
            left: '2.5rem', 
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Banner 1 */}
          <div style={{
            flex: 1,
            backgroundImage: 'linear-gradient(to right, rgba(15, 76, 129, 0.9), rgba(15, 76, 129, 0.65)), url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            padding: '1.25rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>PANCING MALL</h4>
            <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '4px 0 8px 0' }}>100% Produk Original Garansi Uang Kembali</p>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64dfdf' }}>Kunjungi Mall →</span>
          </div>

          {/* Banner 2 */}
          <div style={{
            flex: 1,
            backgroundImage: 'linear-gradient(to right, rgba(0, 168, 150, 0.9), rgba(0, 168, 150, 0.65)), url("https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=400&auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            padding: '1.25rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>DISKON BRAND SULTAN</h4>
            <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '4px 0 8px 0' }}>Voucher Belanja Rp100RB Khusus Shimano & Daiwa</p>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fcd34d' }}>Klaim Sekarang →</span>
          </div>
        </div>
      </div>



      {/* Category Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            KATEGORI PILIHAN
          </h3>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(6, 1fr)', 
          gap: '10px',
          background: '#fff',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.name}`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '1rem 0.5rem',
                border: '1px solid #f1f5f9',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00a896'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,168,150,0.06)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e6f0fa',
                color: '#0f4c81',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {cat.name.charAt(0)}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', textAlign: 'center' }}>
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

      {/* Regular Products Grid with Shopee Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', borderRadius: '8px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
        {/* Shopee-style Horizontal Tab Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {['For You', 'Joran', 'Reel', 'Senar', 'Umpan', 'Mata Kail', 'Aksesoris'].map((tab) => (
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
                {tab === 'For You' ? 'For You' : tab}
              </div>
            ))}
          </div>

          {/* Delivery Location indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#475569', fontWeight: '600' }}>
            <span style={{ color: '#64748b' }}>📍 Dikirim ke</span>
            <strong style={{ color: '#1e293b' }}>Jakarta Pusat</strong>
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Shopee-style Product Cards Grid */}
        {(() => {
          const filteredProducts = activeProductTab === 'For You' 
            ? regularProducts 
            : regularProducts.filter(p => p.category === activeProductTab);

          if (filteredProducts.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                Belum ada produk untuk kategori "{activeProductTab}".
              </div>
            );
          }

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginTop: '1rem' }}>
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
