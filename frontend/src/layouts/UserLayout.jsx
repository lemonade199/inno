import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Anchor, Phone, MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';

const UserLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar isAdminView={false} />
      
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Outlet />
      </main>

      <footer style={{ background: '#0b2545', color: '#94a3b8', padding: '2.5rem 1rem 1.5rem', marginTop: 'auto', borderTop: '3px solid #00a896' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ background: '#00a896', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Anchor size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>BERKAH PANCING</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Pusat penjualan perlengkapan dan perlengkapan memancing terlengkap, original, dan berkualitas tinggi di Indonesia.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64dfdf', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} /> 100% Produk Original & Bergaransi
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem' }}>Navigasi Cepat</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/user/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Dashboard</Link></li>
              <li><Link to="/user/products" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Katalog Produk</Link></li>
              <li><Link to="/user/cart" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Keranjang Belanja</Link></li>
              <li><Link to="/user/orders" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Riwayat Pesanan</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem' }}>Hubungi Kami</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="#00a896" /> Jl. Nelayan No. 88, Jakarta Utara</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} color="#00a896" /> +62 812-3456-7890</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} color="#00a896" /> cs@berkahpancing.com</li>
            </ul>
          </div>

        </div>

        <div style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          © {new Date().getFullYear()} Berkah Pancing. Developed with <Heart size={12} color="#ef4444" style={{ display: 'inline', margin: '0 2px' }} /> for Fishing Enthusiasts.
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
