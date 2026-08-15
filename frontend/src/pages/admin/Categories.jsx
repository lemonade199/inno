import React, { useEffect, useState } from 'react';
import { FolderTree, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { productService } from '../../services/productService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newCat,
      slug: newCat.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
      status: 'Aktif',
    };
    setCategories([...categories, newItem]);
    setNewCat('');
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Hapus kategori "${name}"?`)) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FolderTree size={26} color="#0f4c81" /> Kelola Kategori Produk
          </h1>
          <p className="page-subtitle">Kategori alat pancing untuk mempermudah navigasi pelanggan.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', background: '#fff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Tambah Kategori Baru</h3>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label className="form-label">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Contoh: Aksesoris Laut"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {categories.map((cat) => (
          <div key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Tag size={20} color="#0f4c81" />
              </div>
              <span className="badge badge-success">{cat.status}</span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{cat.name}</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Slug: <code>{cat.slug}</code>
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f4c81' }}>
                {cat.count} Produk
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn btn-secondary btn-icon" title="Edit">
                  <Edit size={15} color="#0f4c81" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="btn btn-secondary btn-icon" title="Hapus">
                  <Trash2 size={15} color="#ef4444" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
