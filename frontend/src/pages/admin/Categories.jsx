import React, { useEffect, useState } from 'react';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  Tag, 
  Search, 
  X, 
  Save, 
  AlertTriangle,
  Package,
  Layers,
  Fish,
  Anchor,
  Feather,
  Egg,
  Droplets,
  Sparkles,
  Box,
  Compass
} from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

// Available category icons mapping
const AVAILABLE_ICONS = [
  { id: 'Tag', label: 'Tag Umum', icon: Tag },
  { id: 'Egg', label: 'Pakan Unggas', icon: Egg },
  { id: 'Fish', label: 'Pakan Ikan', icon: Fish },
  { id: 'Feather', label: 'Pakan Burung', icon: Feather },
  { id: 'Anchor', label: 'Umpan Pancing', icon: Anchor },
  { id: 'Droplets', label: 'Essen Aroma', icon: Droplets },
  { id: 'Sparkles', label: 'Alat & Aksesoris', icon: Sparkles },
  { id: 'Box', label: 'Perlengkapan', icon: Box },
  { id: 'Compass', label: 'Outdoor', icon: Compass },
];

const AdminCategories = () => {
  const { showToast, showConfirm } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State (Simplified without Slug and Status)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Tag',
  });

  const [formError, setFormError] = useState('');

  // Fetch categories on load
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await productService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat daftar kategori.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle open modal for Create
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setFormData({
      name: '',
      description: '',
      icon: 'Tag',
    });
    setFormError('');
    setModalOpen(true);
  };

  // Handle open modal for Edit
  const handleOpenEditModal = (cat) => {
    setIsEditing(true);
    setCurrentEditId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || 'Tag',
    });
    setFormError('');
    setModalOpen(true);
  };

  // Submit Handler (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Nama kategori wajib diisi!');
      return;
    }

    // Check duplicate name
    const duplicate = categories.find(
      (c) => c.name.toLowerCase() === formData.name.trim().toLowerCase() && (!isEditing || c.id !== currentEditId)
    );
    if (duplicate) {
      setFormError(`Kategori dengan nama "${formData.name.trim()}" sudah ada!`);
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing) {
        // Update existing category
        const updated = await productService.updateCategory(currentEditId, {
          name: formData.name.trim(),
          description: formData.description,
          icon: formData.icon,
        });

        setCategories((prev) =>
          prev.map((c) => (c.id === currentEditId ? { ...c, ...updated } : c))
        );
        showToast(`Kategori "${formData.name}" berhasil diperbarui!`, 'success');
      } else {
        // Create new category
        const created = await productService.createCategory({
          name: formData.name.trim(),
          description: formData.description,
          icon: formData.icon,
        });

        setCategories((prev) => [...prev, created]);
        showToast(`Kategori baru "${formData.name}" berhasil ditambahkan!`, 'success');
      }

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Terjadi kesalahan saat menyimpan kategori.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler with confirmation dialog
  const handleDelete = (id, name, productCount) => {
    showConfirm({
      title: 'Hapus Kategori Produk',
      message: productCount > 0 
        ? `Kategori "${name}" memiliki ${productCount} produk terkait. Apakah Anda yakin ingin menghapus kategori ini?`
        : `Apakah Anda yakin ingin menghapus kategori "${name}"?`,
      confirmText: 'Ya, Hapus Kategori',
      cancelText: 'Batal',
      isDanger: true,
      onConfirm: async () => {
        try {
          await productService.deleteCategory(id);
          setCategories((prev) => prev.filter((c) => c.id !== id));
          showToast(`Kategori "${name}" berhasil dihapus.`, 'success');
        } catch (err) {
          showToast('Gagal menghapus kategori.', 'error');
        }
      },
    });
  };

  // Filter categories by search
  const filteredCategories = categories.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Helper to render category icon component
  const renderCategoryIcon = (iconName) => {
    const found = AVAILABLE_ICONS.find((i) => i.id === iconName);
    const IconComp = found ? found.icon : Tag;
    return <IconComp size={22} color="#0f4c81" />;
  };

  return (
    <div>
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FolderTree size={26} color="#0f4c81" /> Kelola Kategori Produk
          </h1>
          <p className="page-subtitle">
            Kelola kelompok etalase produk, pakan, umpan, dan perlengkapan pancing di toko.
          </p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#475569' }}>
            Total Kategori: <strong style={{ color: '#0f4c81' }}>{categories.length}</strong>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '350px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari nama kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem', height: '2.3rem', fontSize: '0.82rem', width: '100%' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
          <FolderTree size={36} color="#94a3b8" style={{ margin: '0 auto 1rem auto', animation: 'spin 2s linear infinite' }} />
          <p style={{ fontWeight: '700' }}>Memuat daftar kategori...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Layers size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0' }}>
            Tidak Ada Kategori Ditemukan
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem 0' }}>
            {searchQuery ? `Tidak ada kategori yang cocok dengan kata kunci "${searchQuery}".` : 'Belum ada kategori yang ditambahkan.'}
          </p>
          {searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="btn btn-secondary">
              Reset Pencarian
            </button>
          ) : (
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={16} /> Buat Kategori Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="admin-categories-grid">
          {filteredCategories.map((cat) => (
            <div 
              key={cat.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.85rem',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Card Header: Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}>
                  {renderCategoryIcon(cat.icon)}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                  {cat.name}
                </h3>
                {cat.description ? (
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {cat.description}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                    Tidak ada deskripsi
                  </p>
                )}
              </div>

              {/* Card Footer: Product Count & Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f4c81', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Package size={14} color="#00a896" /> {cat.count || 0} Produk
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    onClick={() => handleOpenEditModal(cat)}
                    className="btn btn-secondary btn-icon" 
                    title="Edit Kategori"
                    style={{ padding: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Edit3 size={15} color="#0f4c81" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id, cat.name, cat.count || 0)} 
                    className="btn btn-secondary btn-icon" 
                    title="Hapus Kategori"
                    style={{ padding: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#fecaca', color: '#ef4444' }}
                  >
                    <Trash2 size={15} color="#ef4444" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div 
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.2rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderTree size={20} color="#0f4c81" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  {isEditing ? 'Edit Kategori Produk' : 'Tambah Kategori Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              
              {/* Error Alert */}
              {formError && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <AlertTriangle size={16} /> {formError}
                </div>
              )}

              {/* Category Name */}
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label">
                  Nama Kategori <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Contoh: Senar & Leader Pancing"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', height: '2.6rem', fontSize: '0.88rem' }}
                />
              </div>

              {/* Category Icon Picker */}
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label">Pilih Ikon Visual</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(68px, 1fr))', gap: '8px', marginTop: '4px' }}>
                  {AVAILABLE_ICONS.map((item) => {
                    const IconC = item.icon;
                    const isSelected = formData.icon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.id })}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px 4px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #00a896' : '1px solid #e2e8f0',
                          background: isSelected ? '#f0fdfa' : '#f8fafc',
                          color: isSelected ? '#00a896' : '#64748b',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        title={item.label}
                      >
                        <IconC size={18} color={isSelected ? '#00a896' : '#64748b'} />
                        <span style={{ fontSize: '0.65rem', fontWeight: isSelected ? '800' : '600', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Deskripsi Singkat (Opsional)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Keterangan singkat tentang kategori produk ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', fontSize: '0.84rem', padding: '8px 12px', resize: 'vertical' }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5 }}
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : (
                    <>
                      <Save size={16} /> {isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
