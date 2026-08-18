import React, { useState } from 'react';
import { User, Lock, Save, ShieldCheck, LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Administrator',
    email: user?.email || 'admin@berkahpancing.com',
    phone: '081122334455',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showToast('Profil berhasil diperbarui!', 'success');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok!', 'error');
      return;
    }
    showToast('Kata sandi berhasil diperbarui!', 'success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">
            <User size={26} color="#0f4c81" /> Profil Saya (Admin)
          </h1>
          <p className="page-subtitle">Kelola informasi akun administrator dan kata sandi Anda.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            background: '#fee2e2',
            color: '#ef4444',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(239,68,68,0.15)'
          }}
        >
          <LogOut size={16} /> Keluar Akun Admin
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="#0f4c81" /> Informasi Akun
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img
              src={profileData.avatar}
              alt={profileData.name}
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0f4c81' }}
            />
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{profileData.name}</h4>
              <span className="badge badge-info" style={{ marginTop: '4px' }}>
                <ShieldCheck size={12} /> Super Admin
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-input"
                value={profileData.name}
                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={profileData.email}
                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nomor HP / WhatsApp</label>
              <input
                type="text"
                className="form-input"
                value={profileData.phone}
                onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={18} /> Simpan Perubahan Profil
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="#0f4c81" /> Ubah Kata Sandi
          </h3>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Kata Sandi Saat Ini *</label>
              <input
                type="password"
                required
                className="form-input"
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kata Sandi Baru *</label>
              <input
                type="password"
                required
                className="form-input"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Konfirmasi Kata Sandi Baru *</label>
              <input
                type="password"
                required
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={18} /> Perbarui Kata Sandi
            </button>
          </form>
        </div>
      </div>

      {/* Admin Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '380px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <AlertTriangle size={28} color="#dc2626" />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
              Konfirmasi Keluar Admin
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
              Apakah Anda yakin ingin keluar dari akun <strong>Admin Portal</strong>?
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
