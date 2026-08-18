import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Phone, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  Clock,
  ChevronRight
} from 'lucide-react';

const UserLayout = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const hideFooter = location.pathname.startsWith('/products') || location.pathname === '/cart' || isChatPage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      {!isChatPage && <Navbar isAdminView={false} />}
      
      <main style={{ flex: 1, maxWidth: isChatPage ? '100%' : '1200px', width: '100%', margin: '0 auto', padding: isChatPage ? 0 : '1.5rem 1rem' }}>
        <Outlet />
      </main>

      {!hideFooter && (
        <footer style={{ background: 'linear-gradient(180deg, #07172b 0%, #05101f 100%)', color: '#94a3b8', borderTop: '1px solid #0f2d4a', marginTop: 'auto' }}>
          
          {/* Main Footer Container */}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 1.5rem 2rem 1.5rem' }}>
            
            {/* 4-Column Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '2.5rem',
              marginBottom: '3rem'
            }}>
              
              {/* Col 1: Brand & Professional Overview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                  <img 
                    src="/logo.png" 
                    alt="Berkah Pancing" 
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 8px rgba(0, 168, 150, 0.45))'
                    }} 
                  />
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.3px', display: 'block', lineHeight: 1.1 }}>
                      BERKAH PANCING
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#00a896', fontWeight: '700', letterSpacing: '0.5px' }}>
                      Pusat Pakan & Piranti Pancing
                    </span>
                  </div>
                </Link>

                <p style={{ fontSize: '0.85rem', lineHeight: 1.65, color: '#94a3b8', margin: 0 }}>
                  Platform e-commerce terpercaya penyedia pakan ternak unggas berkualitas, nutrisi pelet ikan, racikan umpan, serta piranti pancing original bergaransi resmi untuk kebutuhan hobi dan budidaya di seluruh Indonesia.
                </p>

                {/* Trust Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#e2e8f0', fontWeight: '600' }}>
                    <ShieldCheck size={16} color="#00a896" /> 100% Produk Original & Terverifikasi
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#e2e8f0', fontWeight: '600' }}>
                    <Truck size={16} color="#00a896" /> Pengiriman Cepat ke Seluruh Nusantara
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#e2e8f0', fontWeight: '600' }}>
                    <CreditCard size={16} color="#00a896" /> Pembayaran Aman & Otomatis (Midtrans)
                  </div>
                </div>
              </div>

              {/* Col 2: Kategori Unggulan */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderLeft: '3px solid #00a896', paddingLeft: '8px' }}>
                  Kategori Produk
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem' }}>
                  {[
                    { name: 'Pakan Ayam & Unggas', to: '/products?category=Pakan+Ayam+%26+Unggas' },
                    { name: 'Pakan & Pelet Ikan', to: '/products?category=Pakan+Ikan' },
                    { name: 'Pakan Burung & Hewan', to: '/products?category=Pakan+Burung+%26+Hewan' },
                    { name: 'Umpan Pancing & Racikan', to: '/products?category=Umpan+Pancing' },
                    { name: 'Essen & Aroma Pancing', to: '/products?category=Essen+Pancing' },
                    { name: 'Alat & Aksesoris Pancing', to: '/products?category=Alat+%26+Aksesoris+Pancing' },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        to={item.to} 
                        style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#00a896'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                      >
                        <ChevronRight size={13} color="#00a896" /> {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Layanan & Informasi */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderLeft: '3px solid #00a896', paddingLeft: '8px' }}>
                  Layanan & Bantuan
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem' }}>
                  {[
                    { name: 'Katalog Semua Produk', to: '/products' },
                    { name: 'Keranjang Belanja', to: '/cart' },
                    { name: 'Riwayat & Status Pesanan', to: '/orders' },
                    { name: 'Profil & Alamat Pengiriman', to: '/profile' },
                    { name: 'Layanan Live Chat Pelanggan', to: '/chat' },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        to={item.to} 
                        style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#00a896'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                      >
                        <ChevronRight size={13} color="#00a896" /> {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: Kontak & Operasional */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderLeft: '3px solid #00a896', paddingLeft: '8px' }}>
                  Hubungi Kami
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.86rem' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <MapPin size={18} color="#00a896" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#cbd5e1', lineHeight: 1.5, fontSize: '0.84rem' }}>
                      Jln. Cibiru Hilir RT 02 / RW 03, Desa Cibiru Hilir, Kec. Cileunyi, Kab. Bandung, Jawa Barat 40624 (Berkah Pancing)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={18} color="#00a896" style={{ flexShrink: 0 }} />
                    <div>
                      <a 
                        href="https://wa.me/6285721726584" 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ color: '#cbd5e1', fontWeight: '700', textDecoration: 'none', display: 'block' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#00a896'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
                      >
                        +62 857-2172-6584
                      </a>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>WhatsApp / Customer Service</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={18} color="#00a896" style={{ flexShrink: 0 }} />
                    <div>
                      <a 
                        href="mailto:BerkahPancing@gmail.com" 
                        style={{ color: '#cbd5e1', fontWeight: '700', textDecoration: 'none', display: 'block' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#00a896'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
                      >
                        BerkahPancing@gmail.com
                      </a>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Email Resmi Toko</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingTop: '0.25rem' }}>
                    <Clock size={18} color="#00a896" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.45 }}>
                      Buka Setiap Hari:<br />
                      <strong style={{ color: '#00a896' }}>06.00 WIB</strong> s/d <strong style={{ color: '#00a896' }}>Malam (Tutup)</strong>
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Copyright Divider & Text */}
            <div style={{ 
              borderTop: '1px solid #0f2d4a', 
              paddingTop: '1.75rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.8rem',
              color: '#64748b'
            }}>
              <div>
                © {new Date().getFullYear()} <strong style={{ color: '#e2e8f0' }}>PT Berkah Pancing Nusantara</strong>. Seluruh Hak Cipta Dilindungi.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                <span>Keamanan Terjamin</span>
                <span>•</span>
                <span>Standar Mutu Produk</span>
                <span>•</span>
                <span>Layanan Resmi</span>
              </div>
            </div>

          </div>
        </footer>
      )}
    </div>
  );
};

export default UserLayout;
