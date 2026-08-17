import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, ShoppingBag } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allProducts = await productService.getProducts();
      const allCategories = await productService.getCategories();
      setProducts(allProducts);
      setCategories(allCategories);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search'));
    }
  }, [searchParams]);

  // Filtering and Sorting logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return b.id - a.id; // latest
  });

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSortBy('latest');
    setSearchParams({});
  };

  if (loading) return <Loading text="Memuat katalog produk..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Katalog Produk Alat Pancing</h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
          Temukan joran, reel, senar, umpan, dan perlengkapan mancing berkualitas terbaik
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Input (Cari Produk) */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari nama produk, joran, reel, umpan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.6rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.65rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                background: '#fff',
                cursor: 'pointer',
                outline: 'none',
                flex: 1
              }}
            >
              <option value="latest">Terbaru</option>
              <option value="price-low">Harga: Rendah ke Tinggi</option>
              <option value="price-high">Harga: Tinggi ke Rendah</option>
              <option value="name">Nama (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Category Pills (Filter Kategori) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.3rem', whiteSpace: 'nowrap' }}>
            <Filter size={14} /> Kategori:
          </span>
          
          <button
            onClick={() => setSelectedCategory('Semua')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              border: selectedCategory === 'Semua' ? 'none' : '1px solid #cbd5e1',
              background: selectedCategory === 'Semua' ? '#0f4c81' : '#f8fafc',
              color: selectedCategory === 'Semua' ? '#fff' : '#475569',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            Semua ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '20px',
                border: selectedCategory === cat.name ? 'none' : '1px solid #cbd5e1',
                background: selectedCategory === cat.name ? '#0f4c81' : '#f8fafc',
                color: selectedCategory === cat.name ? '#fff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat.name}
            </button>
          ))}

          {(searchQuery || selectedCategory !== 'Semua') && (
            <button
              onClick={handleResetFilter}
              style={{
                padding: '0.45rem 0.8rem',
                borderRadius: '20px',
                border: 'none',
                background: '#fee2e2',
                color: '#ef4444',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                whiteSpace: 'nowrap',
                marginLeft: 'auto'
              }}
            >
              <RefreshCw size={13} /> Reset Filter
            </button>
          )}
        </div>

      </div>

      {/* Results Count & Product Grid */}
      <div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', fontWeight: '600' }}>
          Menampilkan <strong style={{ color: '#0f172a' }}>{filteredProducts.length}</strong> produk {selectedCategory !== 'Semua' && `dalam kategori "${selectedCategory}"`} {searchQuery && `pencarian "${searchQuery}"`}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem 1rem', textAlign: 'center', borderRadius: '14px' }}>
            <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#334155' }}>Produk Tidak Ditemukan</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Coba kata kunci pencarian lain atau pilih kategori produk berbeda.
            </p>
            <button
              onClick={handleResetFilter}
              className="btn btn-secondary"
              style={{ marginTop: '1.25rem', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
            >
              Lihat Semua Produk
            </button>
          </div>
        ) : (
          <div className="product-catalog-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Products;
