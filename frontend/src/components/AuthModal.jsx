import React from 'react';
import { createPortal } from 'react-dom';
import { Lock, LogIn, UserPlus, X, ArrowRight } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, message = 'Silakan login terlebih dahulu untuk menggunakan fitur ini.', onLogin, onRegister }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '2rem 1.75rem',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
          position: 'relative',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* Glowing Icon Header */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(15, 76, 129, 0.1) 0%, rgba(0, 168, 150, 0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            border: '1px solid rgba(0, 168, 150, 0.25)',
            boxShadow: '0 10px 25px rgba(0, 168, 150, 0.15)'
          }}
        >
          <Lock size={30} color="#0f4c81" />
        </div>

        {/* Title & Message */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.3px'
          }}
        >
          Perlu Masuk Akun
        </h3>

        <p
          style={{
            fontSize: '0.9rem',
            color: '#475569',
            lineHeight: 1.5,
            margin: '0 0 1.75rem 0'
          }}
        >
          {message}
        </p>

        {/* Buttons: Login & Register */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={onLogin}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0f4c81 0%, #00a896 100%)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(15, 76, 129, 0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 76, 129, 0.45)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 76, 129, 0.35)'; }}
          >
            <LogIn size={18} />
            <span>Login</span>
            <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
          </button>

          <button
            onClick={onRegister}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              background: '#f8fafc',
              color: '#0f4c81',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#94a3b8'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          >
            <UserPlus size={18} />
            <span>Daftar</span>
          </button>
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: '#94a3b8' }}>
          Setelah login, Anda akan langsung dikembalikan ke halaman ini.
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
