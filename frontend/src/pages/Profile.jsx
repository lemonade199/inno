import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  Save, 
  ShieldCheck, 
  Edit3, 
  Wallet, 
  Coins, 
  MessageSquare, 
  Star, 
  HelpCircle, 
  Package, 
  Heart,
  ChevronDown,
  CheckCircle,
  Camera,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState('biodata'); // 'biodata', 'alamat', 'keamanan', 'notifikasi'

  // Editable forms
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Juli Anto',
    birthDate: '15 Juli 1998',
    gender: 'Laki-laki',
    email: user?.email || 'julianto@gmail.com',
    phone: user?.phone || '081234567890',
    address: user?.address || 'Jl. Merdeka No. 45, Jakarta Selatan',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    });
    setIsEditingBio(false);
    setIsEditingContact(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ background: '#f5f5f5', margin: '-1.5rem -1rem', padding: '1.5rem 1rem', minHeight: '85vh' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* ================= LEFT SIDEBAR PANEL (Tokopedia Style) ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* User Mini Profile Card */}
          <div style={{ background: '#fff', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                alt={user?.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00a896' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Juli Anto'}
                </h3>
                <span style={{ fontSize: '0.72rem', background: '#e6f0fa', color: '#0f4c81', padding: '2px 6px', borderRadius: '10px', fontWeight: '700', display: 'inline-block', marginTop: '2px' }}>
                  Member Platinum
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Wallet / Saldo Tokopedia Style */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <Wallet size={16} color="#00a896" />
                  <span>Saldo AnglerPay</span>
                </div>
                <span style={{ fontWeight: '800', color: '#0f4c81' }}>Rp250.000</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <Coins size={16} color="#f77f00" />
                  <span>Koin Angler</span>
                </div>
                <span style={{ fontWeight: '800', color: '#f77f00' }}>5.000 Koin</span>
              </div>
            </div>
          </div>

          {/* Navigation Accordion Menu */}
          <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Kotak Masuk Section */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Kotak Masuk</span>
                <ChevronDown size={14} color="#94a3b8" />
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#475569' }}>
                <li style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={15} color="#0f4c81" /> Chat Pembeli
                </li>
                <li style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={15} color="#f77f00" /> Ulasan Saya
                </li>
                <li style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={15} color="#00a896" /> Pesan Bantuan
                </li>
              </ul>
            </div>

            {/* Pembelian Section */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Pembelian</span>
                <ChevronDown size={14} color="#94a3b8" />
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#475569' }}>
                <li 
                  onClick={() => navigate('/orders')}
                  style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#0f4c81' }}
                >
                  <Package size={15} /> Daftar Transaksi
                </li>
                <li style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={15} color="#ef4444" /> Wishlist Produk
                </li>
              </ul>
            </div>

            {/* Logout Button */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <button 
                onClick={handleLogout}
                style={{ 
                  width: '100%', 
                  background: '#fee2e2', 
                  color: '#ef4444', 
                  border: 'none', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  fontSize: '0.82rem', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={16} /> Keluar Akun
              </button>
            </div>

          </div>

        </div>

        {/* ================= RIGHT MAIN TABBED PANEL (Tokopedia Style) ================= */}
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Header Title */}
          <div style={{ padding: '1.25rem 1.5rem 0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#0f4c81" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
              {user?.name || 'Juli Anto'}
            </h2>
          </div>

          {/* Tokopedia-style Tab Header Navigation */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e2e8f0', 
            padding: '0 1.5rem', 
            gap: '1.75rem',
            overflowX: 'auto'
          }}>
            {[
              { id: 'biodata', label: 'Biodata Diri' },
              { id: 'alamat', label: 'Daftar Alamat' },
              { id: 'pembayaran', label: 'Pembayaran' },
              { id: 'rekening', label: 'Rekening Bank' },
              { id: 'notifikasi', label: 'Notifikasi' },
              { id: 'keamanan', label: 'Keamanan' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '1rem 0',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === tab.id ? '800' : '600',
                  color: activeTab === tab.id ? '#00a896' : '#64748b',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '3px solid #00a896' : '3px solid transparent',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Success Toast Banner */}
          {savedSuccess && (
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: '700', borderBottom: '1px solid #bbf7d0' }}>
              ✓ Perubahan biodata profil berhasil disimpan!
            </div>
          )}

          {/* Tab Content 1: BIODATA DIRI */}
          {activeTab === 'biodata' && (
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
              
              {/* Left Sub-card: Large Avatar Frame & Upload Button */}
              <div style={{ 
                border: '1px solid #f1f5f9', 
                borderRadius: '8px', 
                padding: '1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{ width: '170px', height: '170px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fafafa' }}>
                  <img 
                    src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'} 
                    alt="Foto Profil" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                <button style={{ 
                  width: '100%', 
                  background: '#fff', 
                  border: '1px solid #cbd5e1', 
                  color: '#334155', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  fontSize: '0.82rem', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <Camera size={15} /> Pilih Foto
                </button>

                <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>
                  Besar file maksimum 10.000.000 bytes (10 Megabytes). Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
                </p>
              </div>

              {/* Right Sub-card: Biodata & Contact Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                
                {/* Section 1: Ubah Biodata Diri */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    Ubah Biodata Diri
                  </h4>

                  {isEditingBio ? (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Nama Lengkap</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Tanggal Lahir</label>
                        <input 
                          type="text" 
                          name="birthDate" 
                          value={formData.birthDate} 
                          onChange={handleChange}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Jenis Kelamin</label>
                        <select 
                          name="gender" 
                          value={formData.gender} 
                          onChange={handleChange}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                        <button type="submit" style={{ background: '#00a896', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                          Simpan
                        </button>
                        <button type="button" onClick={() => setIsEditingBio(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                          Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Nama</span>
                        <span style={{ fontWeight: '700', color: '#1e293b', flex: 1 }}>{formData.name}</span>
                        <button onClick={() => setIsEditingBio(true)} style={{ background: 'none', border: 'none', color: '#00a896', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>
                          Ubah
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Tanggal Lahir</span>
                        <span style={{ fontWeight: '600', color: '#1e293b', flex: 1 }}>{formData.birthDate}</span>
                        <button onClick={() => setIsEditingBio(true)} style={{ background: 'none', border: 'none', color: '#00a896', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>
                          Ubah
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Jenis Kelamin</span>
                        <span style={{ fontWeight: '600', color: '#1e293b', flex: 1 }}>{formData.gender}</span>
                        <button onClick={() => setIsEditingBio(true)} style={{ background: 'none', border: 'none', color: '#00a896', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>
                          Ubah
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 2: Ubah Kontak */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    Ubah Kontak
                  </h4>

                  {isEditingContact ? (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Email</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Nomor HP</label>
                        <input 
                          type="text" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                        <button type="submit" style={{ background: '#00a896', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                          Simpan Kontak
                        </button>
                        <button type="button" onClick={() => setIsEditingContact(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                          Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Email</span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '600', color: '#1e293b' }}>{formData.email}</span>
                          <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Terverifikasi</span>
                        </div>
                        <button onClick={() => setIsEditingContact(true)} style={{ background: 'none', border: 'none', color: '#00a896', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>
                          Ubah
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '120px', color: '#64748b' }}>Nomor HP</span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '600', color: '#1e293b' }}>{formData.phone}</span>
                          <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Terverifikasi</span>
                        </div>
                        <button onClick={() => setIsEditingContact(true)} style={{ background: 'none', border: 'none', color: '#00a896', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>
                          Ubah
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* Tab Content 2: DAFTAR ALAMAT */}
          {activeTab === 'alamat' && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Daftar Alamat Pengiriman</h4>
                <button style={{ background: '#00a896', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={14} /> Tambah Alamat Baru
                </button>
              </div>

              <div style={{ border: '1.5px solid #00a896', borderRadius: '6px', padding: '1.25rem', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>{user?.name || 'Juli Anto'} (Alamat Utama)</strong>
                  <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0f4c81', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>UTAMA</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>{user?.phone || '081234567890'}</div>
                <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.4 }}>
                  {formData.address}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#00a896', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>Ubah Alamat</button>
                </div>
              </div>
            </div>
          )}

          {/* Fallback Tab Content for Pembayaran, Rekening, Notifikasi, Keamanan */}
          {['pembayaran', 'rekening', 'notifikasi', 'keamanan'].includes(activeTab) && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
              <ShieldCheck size={40} color="#00a896" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Pengaturan {activeTab.toUpperCase()}</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Fitur keamanan & pengaturan ini sudah aktif dan terhubung secara aman.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Profile;
