import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { useNotification } from '../../context/NotificationContext';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addNotification } = useNotification();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    productService.getCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });

    productService.getProductById(id).then((data) => {
      if (data) {
        setFormData({
          ...data,
          weight: data.weight || 500,
        });
      } else {
        setNotFound(true);
      }
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Nama produk wajib diisi', 'error');
      return;
    }
    if (Number(formData.price) < 0 || Number(formData.stock) < 0) {
      showToast('Harga dan stok tidak boleh bernilai negatif', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await productService.updateProduct(id, formData);
      if (!res) {
        throw new Error('Gagal memperbarui produk.');
      }
      
      addNotification({
        title: 'Data Produk Diperbarui',
        message: `Admin mengubah data produk "${formData.name}".`,
        type: 'info',
        entity_type: 'product',
        action_url: `/admin/products/edit/${id}`
      });

      if (Number(formData.stock) <= 5) {
        addNotification({
          title: 'Peringatan Stok Menipis',
          message: `Stok produk "${formData.name}" tersisa ${formData.stock}. Segera restock!`,
          type: 'warning',
          entity_type: 'product',
          action_url: `/admin/products/edit/${id}`
        });
      }

      showToast(`Perubahan produk "${formData.name}" berhasil disimpan!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      showToast(err.message || 'Terjadi kesalahan saat memperbarui produk', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div>
        <div className="page-header">
          <button onClick={() => navigate('/admin/products')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={16} /> Kembali ke Daftar Produk
          </button>
        </div>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1e293b' }}>Produk Tidak Ditemukan</h2>
          <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>Produk dengan ID #{id} tidak ditemukan di database.</p>
          <Link to="/admin/products" className="btn btn-primary">Lihat Semua Produk</Link>
        </div>
      </div>
    );
  }

  if (!formData) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Memuat data produk...</div>;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/admin/products')} className="btn btn-secondary" style={{ marginBottom: '0.75rem', padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={16} /> Kembali ke Daftar Produk
          </button>
          <h1 className="page-title">Edit Produk #{id}</h1>
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
                value={formData.weight}
                onChange={handleChange}
                title="Berat produk dalam gram untuk kalkulasi ongkir kurir"
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>Untuk kalkulasi ongkir ekspedisi</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ganti Gambar Produk (Opsional - JPG/PNG/WEBP)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              name="image"
              className="form-input"
              style={{ padding: '0.45rem', background: '#f8fafc' }}
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
            {formData.image && typeof formData.image === 'string' && (
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Gambar Saat Ini:</span>
                <img src={formData.image.startsWith('http') ? formData.image : `http://localhost:8000${formData.image}`} alt="Preview" style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', display: 'block', marginTop: '4px' }} />
              </div>
            )}
            {formData.image && typeof formData.image === 'object' && (
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Gambar Baru Terpilih:</span>
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
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Save size={18} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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

export default AdminProductEdit;
