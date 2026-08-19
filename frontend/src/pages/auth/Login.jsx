import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Anchor, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [roleMode, setRoleMode] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('julianto@gmail.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determine return target path
  const fromLocation = location.state?.from;
  const returnPath = typeof fromLocation === 'string' 
    ? fromLocation 
    : (fromLocation?.pathname ? (fromLocation.pathname + (fromLocation.search || '')) : '/');

  const handleRoleToggle = (role) => {
    setRoleMode(role);
    if (role === 'admin') {
      setEmail('admin@berkahpancing.com');
    } else {
      setEmail('julianto@gmail.com');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(returnPath, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0b2545 0%, #0f4c81 50%, #00a896 100%)',
      padding: '1.5rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', background: '#fff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <img
              src="/logo.png"
              alt="Berkah Pancing"
              style={{ width: '72px', height: '72px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0, 168, 150, 0.3)' }}
            />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', letterSpacing: '0.5px' }}>BERKAH PANCING</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Masuk ke akun Anda untuk melanjutkannya</p>
        </div>

        {/* Role Mode Switcher Tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => handleRoleToggle('user')}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              background: roleMode === 'user' ? '#fff' : 'transparent',
              color: roleMode === 'user' ? '#0f4c81' : '#64748b',
              fontWeight: roleMode === 'user' ? '700' : '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: roleMode === 'user' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <User size={15} /> Masuk Pembeli
          </button>
          <button
            type="button"
            onClick={() => handleRoleToggle('admin')}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              background: roleMode === 'admin' ? '#fff' : 'transparent',
              color: roleMode === 'admin' ? '#0f4c81' : '#64748b',
              fontWeight: roleMode === 'admin' ? '700' : '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: roleMode === 'admin' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <ShieldCheck size={15} /> Masuk Admin
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', textAlign: 'center', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email {roleMode === 'admin' ? 'Admin' : 'Pembeli'}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={roleMode === 'admin' ? 'admin@berkahpancing.com' : 'user@gmail.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #0f4c81 0%, #00a896 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0,168,150,0.4)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Memproses...' : `Masuk ${roleMode === 'admin' ? 'Admin Portal' : 'Sebagai Pembeli'}`} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          Belum punya akun? <Link to="/register" state={{ from: fromLocation }} style={{ color: '#00a896', fontWeight: '700', textDecoration: 'none' }}>Daftar Akun Baru</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
