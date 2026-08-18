import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { useNotification } from '../../context/NotificationContext';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    productService.getProductById(id).then((data) => {
      if (data) {
        setFormData(data);
      } else {
        setFormData({
          name: 'Joran Pancing Shimano SpeedMaster 210',
          category: 'Joran',
          price: 1250000,
          stock: 15,
          description: 'Joran pancing carbon kelas premium tahan banting cocok untuk mancing laut dan sungai.',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
        });
      }
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await productService.updateProduct(id, formData);
    
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
  };

  if (!formData) return <div>Memuat data produk...</div>;

  return (
    <div>
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
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ganti Gambar Produk (Opsional - JPG/PNG)</label>
            <input
              type="file"
              accept="image/*"
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
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Gambar Gambar Baru:</span>
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
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Simpan Perubahan
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
