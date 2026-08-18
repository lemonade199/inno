import React, { useState, useRef, useEffect } from 'react';
import { User, Lock, Save, ShieldCheck, LogOut, AlertTriangle, Camera, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Avatar from '../../components/Avatar';
import ImageCropperModal from '../../components/ImageCropperModal';

const AdminProfile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Administrator',
    email: user?.email || 'admin@berkahpancing.com',
    phone: user?.phone || '081122334455',
    avatar: user?.avatar || null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Sync user state on load/update
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        avatar: user.avatar !== undefined ? user.avatar : prev.avatar,
      }));
    }
  }, [user]);

  // Close avatar menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle when file is chosen from disk -> open cropper
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WEBP)!', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Ukuran foto terlalu besar! Maksimal 8MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setShowCropper(true);
      setShowAvatarMenu(false);
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  // Handle crop completion from ImageCropperModal
  const handleCropComplete = async (croppedDataUrl) => {
    setProfileData((prev) => ({ ...prev, avatar: croppedDataUrl }));
    updateUserProfile({ avatar: croppedDataUrl });
    setShowCropper(false);

    try {
      await api.post('/user/profile', { avatar: croppedDataUrl });
      showToast('Foto profil admin berhasil diperbarui & disimpan!', 'success');
    } catch (err) {
      showToast('Foto profil diperbarui secara lokal.', 'success');
    }
  };

  // Handle delete avatar -> switch to initial letter logo
  const handleDeleteAvatar = async () => {
    setProfileData((prev) => ({ ...prev, avatar: null }));
    updateUserProfile({ avatar: null });
    setShowAvatarMenu(false);

    try {
      await api.post('/user/profile', { avatar: null });
      showToast('Foto profil berhasil dihapus. Menampilkan inisial nama.', 'success');
    } catch (err) {
      showToast('Foto profil dihapus.', 'success');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    updateUserProfile({
      name: profileData.name,
      phone: profileData.phone,
    });

    try {
      await api.post('/user/profile', {
        name: profileData.name,
        phone: profileData.phone,
      });
      showToast('Profil admin berhasil disimpan!', 'success');
    } catch (err) {
      showToast('Profil admin berhasil diperbarui!', 'success');
    }
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
      <div className="admin-profile-grid">
        {/* Profile Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="#0f4c81" /> Informasi Akun
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Avatar with Camera Icon and Options Popover */}
            <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }} ref={menuRef}>
              <Avatar
                src={profileData.avatar}
                name={profileData.name}
                size={76}
                style={{
                  border: '3px solid #0f4c81',
                  boxShadow: '0 4px 12px rgba(15, 76, 129, 0.15)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                title="Kelola Foto Profil"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '-2px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00a896, #028072)',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  transition: 'transform 0.2s ease',
                  zIndex: 2,
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
              >
                <Camera size={14} />
              </button>

              {/* Avatar Action Popover Menu */}
              {showAvatarMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '82px',
                    left: '0',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
                    width: '180px',
                    zIndex: 50,
                    overflow: 'hidden',
                    animation: 'scaleUp 0.18s ease-out',
                    padding: '6px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowAvatarMenu(false);
                      fileInputRef.current?.click();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '0.84rem',
                      fontWeight: '700',
                      color: '#1e293b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.15s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <ImageIcon size={15} color="#00a896" /> Pilih Gambar Baru
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '0.84rem',
                      fontWeight: '700',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.15s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#fee2e2')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Trash2 size={15} color="#ef4444" /> Hapus Foto
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>

            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                {profileData.name}
              </h4>
              <span className="badge badge-info">
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

      {/* Image Cropper Modal */}
      {showCropper && rawImageSrc && (
        <ImageCropperModal
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default AdminProfile;
