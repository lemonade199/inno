import React, { useState, useEffect } from 'react';

const getFullAvatarUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') return null;
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  const backendBase = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
    : 'http://127.0.0.1:8000';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
};

const Avatar = ({ src, name = 'User', size = 40, style = {}, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const getInitials = (str) => {
    if (!str || typeof str !== 'string') return 'U';
    const trimmed = str.trim();
    if (!trimmed) return 'U';
    return trimmed.charAt(0).toUpperCase();
  };

  const fullSrc = getFullAvatarUrl(src);

  if (fullSrc && !hasError) {
    return (
      <img
        src={fullSrc}
        alt={name}
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          flexShrink: 0,
          ...style,
        }}
        onError={() => setHasError(true)}
      />
    );
  }

  // Initial letter badge fallback (when no image or image failed to load)
  const fontSize = Math.max(Math.round(size * 0.42), 11);

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0f4c81 0%, #00a896 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: `${fontSize}px`,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        flexShrink: 0,
        userSelect: 'none',
        boxShadow: '0 2px 8px rgba(15, 76, 129, 0.2)',
        ...style,
      }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
