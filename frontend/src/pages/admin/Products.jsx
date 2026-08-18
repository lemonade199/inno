import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package } from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { useNotification } from '../../context/NotificationContext';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { showToast, showConfirm } = useToast();
  const { addNotification } = useNotification();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    productService.getProducts().then(setProducts);
    productService.getCategories().then(setCategories);
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter ? item.category === categoryFilter : true;
    return matchSearch && matchCat;
  });

  const handleDelete = (id, name) => {
    showConfirm({
      title: 'Hapus Produk',
      message: `Apakah Anda yakin ingin menghapus produk "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      isDanger: true,
      onConfirm: () => {
        setProducts(prev => prev.filter((p) => p.id !== id));
        addNotification({
          title: 'Produk Dihapus',
          message: `Admin menghapus produk "${name}" dari katalog.`,
          type: 'error',
          entity_type: 'product',
          action_url: '/admin/products'
        });
        showToast(`Produk "${name}" berhasil dihapus.`, 'success');
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Package size={26} color="#0f4c81" /> Kelola Produk Pancing
          </h1>
          <p className="page-subtitle">Daftar seluruh perlengkapan pancing yang tersedia di toko Berkah Pancing.</p>
        </div>
        <button onClick={() => navigate('/admin/products/create')} className="btn btn-primary">
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Cari nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
            <Filter size={18} color="#64748b" />
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Dibuat: {product.createdAt}</div>
                  </td>
                  <td>
                    <span className="badge badge-info">{product.category}</span>
                  </td>
                  <td style={{ fontWeight: '700', color: '#0f4c81' }}>
                    {productService.formatIDR(product.price)}
                  </td>
                  <td style={{ fontWeight: '600' }}>{product.stock} pcs</td>
                  <td>
                    <span className={`badge ${
                      product.stock > 5
                        ? 'badge-success'
                        : product.stock > 0
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}>
                      {product.stock > 5 ? 'Tersedia' : product.stock > 0 ? 'Stok Menipis' : 'Habis'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="btn btn-secondary btn-icon"
                        title="Edit Produk"
                      >
                        <Edit size={16} color="#0f4c81" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="btn btn-secondary btn-icon"
                        title="Hapus Produk"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
