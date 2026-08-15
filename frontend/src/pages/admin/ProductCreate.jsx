import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import { productService } from '../../services/productService';

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Joran',
    price: '',
    stock: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Produk "${formData.name}" berhasil ditambahkan!`);
    navigate('/admin/products');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/admin/products')} className="btn btn-secondary" style={{ marginBottom: '0.75rem', padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={16} /> Kembali ke Daftar Produk
          </button>
          <h1 className="page-title">Tambah Produk Baru</h1>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Produk *</label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              placeholder="Contoh: Joran Pancing Shimano Carbon 210cm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="Joran">Joran</option>
                <option value="Reel">Reel</option>
                <option value="Senar">Senar</option>
                <option value="Umpan">Umpan</option>
                <option value="Mata Kail">Mata Kail</option>
                <option value="Aksesoris">Aksesoris</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Harga (Rp) *</label>
              <input
                type="number"
                name="price"
                required
                className="form-input"
                placeholder="250000"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jumlah Stok *</label>
              <input
                type="number"
                name="stock"
                required
                className="form-input"
                placeholder="10"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">URL Gambar Produk</label>
            <input
              type="text"
              name="image"
              className="form-input"
              placeholder="https://..."
              value={formData.image}
              onChange={handleChange}
            />
            {formData.image && (
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Preview Gambar:</span>
                <img src={formData.image} alt="Preview" style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', display: 'block', marginTop: '4px' }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Lengkap *</label>
            <textarea
              name="description"
              rows="4"
              required
              className="form-textarea"
              placeholder="Jelaskan spesifikasi, bahan, dan keunggulan produk..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Simpan Produk
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductCreate;
