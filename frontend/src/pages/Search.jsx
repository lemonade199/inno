import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Filter, 
  RefreshCw, 
  ShoppingBag, 
  ChevronDown, 
  Star, 
  Truck, 
  Check,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { addSearchHistory, getSearchHistory, getPopularSearches } from '../utils/searchHistory';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('relevance'); // relevance, latest, sales, price-low, price-high

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

  useEffect(() => {
    if (queryParam.trim()) {
      addSearchHistory(queryParam.trim());
    }
  }, [queryParam]);

  const handleCategoryToggle = (catName) => {
    setSelectedCategories(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

  const handleQuickPrice = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setSortBy('relevance');
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    // 1. Search Query Match
    const q = queryParam.toLowerCase().trim();
    const matchesQuery = !q || 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q);

    // 2. Category Filter Match
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);

    // 3. Price Range Match
    const pMin = appliedMinPrice !== '' ? Number(appliedMinPrice) : 0;
    const pMax = appliedMaxPrice !== '' ? Number(appliedMaxPrice) : Infinity;
    const matchesPrice = p.price >= pMin && p.price <= pMax;

    return matchesQuery && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'latest') return b.id - a.id;
    if (sortBy === 'sales') return (b.id % 7) - (a.id % 7);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // relevance
  });

  if (loading) return <Loading text="Mencari produk Toko Berkah Pancing..." />;

  const isAnyFilterActive = selectedCategories.length > 0 || appliedMinPrice !== '' || appliedMaxPrice !== '';

  return (
    <div className="search-page-container" style={{ display: 'flex', gap: '1.5rem', width: '100%', alignItems: 'flex-start' }}>
      
      {/* LEFT SIDEBAR: Tokopedia / Shopee Style Filter Panel */}
      <aside className="search-sidebar-panel" style={{
        width: '250px',
        flexShrink: 0,
        background: '#fff',
        borderRadius: '8px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        border: '1px solid #f1f5f9'
      }}>
        {/* Sidebar Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={18} color="#00a896" /> Filter
          </span>
          {isAnyFilterActive && (
            <button
              onClick={handleResetFilters}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
            >
              Reset
            </button>
          )}
        </div>

        {/* 1. Kategori Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#334155', margin: 0 }}>Kategori</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.name);
              return (
                <label 
                  key={cat.id} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat.name)}
                    style={{ accentColor: '#00a896', width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: isChecked ? '700' : '400', color: isChecked ? '#00a896' : '#475569' }}>
                    {cat.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 2. Batas Harga Filter */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#334155', margin: 0 }}>Batas Harga</h4>
          <form onSubmit={handleApplyPriceFilter} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                placeholder="Rp Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
              />
              <span style={{ color: '#94a3b8' }}>-</span>
              <input
                type="number"
                placeholder="Rp Maks"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
              />
            </div>
            <button
              type="submit"
              style={{ background: '#00a896', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.4rem', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Terapkan Harga
            </button>
          </form>

          {/* Quick Price Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
            <button
              onClick={() => handleQuickPrice('0', '15000')}
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2px 8px', fontSize: '0.72rem', color: '#475569', cursor: 'pointer' }}
            >
              &lt; Rp15rb
            </button>
            <button
              onClick={() => handleQuickPrice('15000', '25000')}
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2px 8px', fontSize: '0.72rem', color: '#475569', cursor: 'pointer' }}
            >
              15rb - 25rb
            </button>
            <button
              onClick={() => handleQuickPrice('25000', '')}
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2px 8px', fontSize: '0.72rem', color: '#475569', cursor: 'pointer' }}
            >
              &gt; Rp25rb
            </button>
          </div>
        </div>

        {/* Reset Filter Button */}
        {isAnyFilterActive && (
          <button
            onClick={handleResetFilters}
            style={{
              marginTop: '0.5rem',
              background: '#fee2e2',
              color: '#ef4444',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} /> Reset Filter
          </button>
        )}
      </aside>

      {/* RIGHT MAIN AREA: Search Results & Sorting Toolbar */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Results Info Banner */}
        <div style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
              Hasil pencarian untuk {queryParam ? <strong style={{ color: '#0f4c81' }}>"{queryParam}"</strong> : <strong>semua produk</strong>}
            </span>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '700' }}>
            Menampilkan {filteredProducts.length} barang
          </span>
        </div>

        {/* Shopee & Tokopedia Style Sort Toolbar */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Urutkan:</span>
          
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
            {[
              { id: 'relevance', label: 'Terkait' },
              { id: 'latest', label: 'Terbaru' },
              { id: 'sales', label: 'Terlaris' },
              { id: 'price-low', label: 'Harga: Terendah' },
              { id: 'price-high', label: 'Harga: Tertinggi' },
            ].map((tab) => {
              const isActive = sortBy === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSortBy(tab.id)}
                  style={{
                    background: isActive ? '#f77f00' : '#fff',
                    color: isActive ? '#fff' : '#334155',
                    border: isActive ? 'none' : '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? '700' : '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ background: '#fff', padding: '3.5rem 1.5rem', textAlign: 'center', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
            <ShoppingBag size={50} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#334155', margin: 0 }}>
              Tidak ada produk yang cocok
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              Coba kurangi filter atau cari kata kunci lain seperti <strong style={{ color: '#00a896' }}>pakan, pelet, umpan, essen, atau joran</strong>.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                marginTop: '1.25rem',
                background: '#0f4c81',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.6rem 1.5rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="product-responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '12px' }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>

    </div>
  );
};

export default Search;
