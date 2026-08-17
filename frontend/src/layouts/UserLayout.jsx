import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Anchor, Phone, MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';

const UserLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar isAdminView={false} />
      
      <main className="user-layout-main" style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Outlet />
      </main>

      <footer className="user-footer">
        <div className="footer-container">
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
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
            <h4 className="footer-heading">Navigasi Cepat</h4>
            <ul className="footer-links-list">
              <li><Link to="/" style={{ color: '#cbd5e1' }}>Dashboard</Link></li>
              <li><Link to="/products" style={{ color: '#cbd5e1' }}>Katalog Produk</Link></li>
              <li><Link to="/cart" style={{ color: '#cbd5e1' }}>Keranjang Belanja</Link></li>
              <li><Link to="/orders" style={{ color: '#cbd5e1' }}>Riwayat Pesanan</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Hubungi Kami</h4>
            <ul className="footer-links-list">
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="#00a896" /> Jl. Nelayan No. 88, Jakarta Utara</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} color="#00a896" /> +62 812-3456-7890</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} color="#00a896" /> cs@berkahpancing.com</li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Berkah Pancing. Developed with <Heart size={12} color="#ef4444" style={{ display: 'inline', margin: '0 2px' }} /> for Fishing Enthusiasts.
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
