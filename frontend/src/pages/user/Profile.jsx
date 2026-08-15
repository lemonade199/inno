import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut, Save, ShieldCheck, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '081234567890',
    address: user?.address || 'Jl. Merdeka No. 45, Jakarta Selatan',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Profil Saya</h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Kelola informasi data diri dan alamat pengiriman Anda</p>
      </div>

      {savedSuccess && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '0.85rem 1.25rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.88rem' }}>
          ✓ Profil berhasil diperbarui!
        </div>
      )}

      {/* Profile Header Card */}
      <div className="card" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name}
          style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00a896', boxShadow: '0 4px 15px rgba(0,168,150,0.25)' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{user?.name}</h2>
            <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{user?.role || 'Pelanggan'}</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0.2rem 0 0.5rem' }}>{user?.email}</p>
          <span style={{ fontSize: '0.78rem', color: '#00a896', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
            <ShieldCheck size={14} /> Akun Terverifikasi Berkah Pancing
          </span>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-secondary"
          style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Edit3 size={16} /> {isEditing ? 'Batal' : 'Edit Profil'}
        </button>
      </div>

      {/* Main Profile Info Form */}
      <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          Informasi Pengguna
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Alamat Utama Pengiriman
              </label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.75rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
            >
              <Save size={18} /> Simpan Perubahan
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <User size={20} color="#00a896" />
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>Nama</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{user?.name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={20} color="#00a896" />
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>Email</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{user?.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Phone size={20} color="#00a896" />
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>Nomor Telepon</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{user?.phone || '081234567890'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <MapPin size={20} color="#00a896" style={{ marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>Alamat Pengiriman Utama</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.4 }}>
                  {user?.address || 'Jl. Merdeka No. 45, Jakarta Selatan'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Action Card */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ef4444', margin: 0 }}>Keluar dari Akun</h4>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Akhiri sesi login Anda di perangkat ini</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            background: '#fee2e2',
            color: '#ef4444',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

    </div>
  );
};

export default Profile;
