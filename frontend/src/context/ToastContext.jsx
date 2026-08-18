import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, confirmText, cancelText, onConfirm }
  const [promptModal, setPromptModal] = useState(null); // { title, message, defaultValue, placeholder, confirmText, cancelText, onConfirm }
  const [promptInput, setPromptInput] = useState('');

  // Toast Function
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Confirm Modal Function
  const showConfirm = useCallback(({ title = 'Konfirmasi', message, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', onConfirm, isDanger = false }) => {
    setConfirmModal({
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      isDanger
    });
  }, []);

  // Prompt Modal Function
  const showPrompt = useCallback(({ title = 'Input Data', message, defaultValue = '', placeholder = '', confirmText = 'Simpan', cancelText = 'Batal', onConfirm }) => {
    setPromptInput(defaultValue);
    setPromptModal({
      title,
      message,
      placeholder,
      confirmText,
      cancelText,
      onConfirm
    });
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#16a34a" />;
      case 'error':
        return <AlertCircle size={20} color="#dc2626" />;
      case 'warning':
        return <AlertTriangle size={20} color="#d97706" />;
      default:
        return <Info size={20} color="#0284c7" />;
    }
  };

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' };
      case 'error':
        return { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' };
      case 'warning':
        return { background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309' };
      default:
        return { background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1' };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm, showPrompt }}>
      {children}

      {/* Floating Toasts Container — Top Center */}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '440px',
          width: 'calc(100% - 32px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const style = getToastStyle(toast.type);
          return (
            <div
              key={toast.id}
              style={{
                ...style,
                padding: '12px 20px',
                borderRadius: '9999px',
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                fontSize: '0.88rem',
                fontWeight: '700',
                pointerEvents: 'auto',
                width: 'auto',
                maxWidth: '100%',
                backdropFilter: 'blur(8px)',
                animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getToastIcon(toast.type)}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  opacity: 0.7,
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom Confirm Modal */}
      {confirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              {confirmModal.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmModal(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {confirmModal.cancelText}
              </button>
              <button
                onClick={() => {
                  const cb = confirmModal.onConfirm;
                  setConfirmModal(null);
                  if (cb) cb();
                }}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: confirmModal.isDanger ? '#dc2626' : '#0f4c81',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: confirmModal.isDanger ? '0 4px 12px rgba(220, 38, 38, 0.25)' : '0 4px 12px rgba(15, 76, 129, 0.25)',
                }}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Prompt Modal */}
      {promptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {promptModal.title}
            </h3>
            {promptModal.message && (
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 1rem 0' }}>
                {promptModal.message}
              </p>
            )}
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={promptModal.placeholder}
              autoFocus
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                marginBottom: '1.25rem',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setPromptModal(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {promptModal.cancelText}
              </button>
              <button
                onClick={() => {
                  const val = promptInput;
                  const cb = promptModal.onConfirm;
                  setPromptModal(null);
                  if (cb) cb(val);
                }}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#0f4c81',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15, 76, 129, 0.25)',
                }}
              >
                {promptModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg, type = 'info') => {
        if (type === 'error') console.error('[Toast Error]:', msg);
        else console.log('[Toast]:', msg);
      },
      showConfirm: ({ onConfirm }) => {
        if (onConfirm) onConfirm();
      },
      showPrompt: ({ onConfirm, defaultValue = '' }) => {
        if (onConfirm) onConfirm(defaultValue);
      },
    };
  }
  return context;
};
