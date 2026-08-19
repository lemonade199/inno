import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { useNotification } from '../../context/NotificationContext';

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addNotification } = useNotification();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    weight: 500,
    description: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    productService.getCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
        setFormData(prev => ({
          ...prev,
          category: prev.category || cats[0].name
        }));
      }
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Nama produk wajib diisi', 'error');
      return;
    }
    if (Number(formData.price) < 0 || Number(formData.stock) < 0) {
      showToast('Harga dan stok tidak boleh bernilai negatif', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await productService.createProduct(formData);
      if (!res) {
        throw new Error('Gagal menyimpan produk.');
      }
      addNotification({
        title: 'Barang Ditambahkan',
        message: `Admin menambahkan produk baru "${formData.name}" ke kategori ${formData.category}.`,
        type: 'success',
        entity_type: 'product',
        action_url: '/admin/products'
      });
      showToast(`Produk "${formData.name}" berhasil ditambahkan!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      showToast(err.message || 'Terjadi kesalahan saat menambahkan produk', 'error');
    } finally {
      setIsSubmitting(false);
    }
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

          <div className="admin-form-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))
                ) : (
                  <>
                    <option value="Joran">Joran</option>
                    <option value="Reel">Reel</option>
                    <option value="Senar">Senar</option>
                    <option value="Umpan">Umpan</option>
                    <option value="Pakan Ikan">Pakan Ikan</option>
                    <option value="Aksesoris">Aksesoris</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Harga (Rp) *</label>
              <input
                type="number"
                name="price"
                min="0"
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
                min="0"
                required
                className="form-input"
                placeholder="10"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Berat Produk (Gram) *</label>
              <input
                type="number"
                name="weight"
                min="1"
                required
                className="form-input"
                placeholder="500"
                value={formData.weight}
                onChange={handleChange}
                title="Berat produk dalam gram untuk perhitungan ongkos kirim"
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>Untuk kalkulasi ongkir ekspedisi</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Gambar Produk Asli (JPG/PNG/WEBP)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              name="image"
              className="form-input"
              style={{ padding: '0.45rem', background: '#f8fafc' }}
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
            {formData.image && typeof formData.image === 'object' && (
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Preview Gambar:</span>
                <img src={URL.createObjectURL(formData.image)} alt="Preview" style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', display: 'block', marginTop: '4px' }} />
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
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Save size={18} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
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
