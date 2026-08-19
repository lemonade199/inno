import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Target, Check } from 'lucide-react';

// This is a custom hook component that listens to map events
function MapCenterTracker({ onCenterChange, initialCenter }) {
  const map = useMapEvents({
    move: () => {
      onCenterChange(map.getCenter(), false);
    },
    moveend: () => {
      onCenterChange(map.getCenter(), true);
    }
  });

  // Track initial position only once when it's provided and map is ready
  useEffect(() => {
    if (initialCenter && initialCenter.lat && initialCenter.lng) {
      map.setView([initialCenter.lat, initialCenter.lng], map.getZoom());
    }
  }, []);

  return null;
}

const MapLocationPicker = ({ initialPosition, onConfirm }) => {
  // Default to Jakarta if no position provided
  const [centerPosition, setCenterPosition] = useState(
    initialPosition || { lat: -6.200000, lng: 106.816666 }
  );
  
  const [isMoving, setIsMoving] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  
  // Timeout ref for debouncing the reverse geocoding
  const geocodeTimeoutRef = useRef(null);

  const fetchAddress = async (lat, lng) => {
    setAddressLoading(true);
    try {
      // Free reverse geocoding using Nominatim (OpenStreetMap)
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'id-ID' }
      });
      const data = await response.json();
      if (data && data.display_name) {
        setCurrentAddress(data.display_name);
      } else {
        setCurrentAddress('Alamat tidak ditemukan');
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
      setCurrentAddress('Gagal memuat detail alamat');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleCenterChange = useCallback((center, isEnd = false) => {
    setCenterPosition({ lat: center.lat, lng: center.lng });
    setIsMoving(!isEnd);

    if (isEnd) {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
      geocodeTimeoutRef.current = setTimeout(() => {
        fetchAddress(center.lat, center.lng);
      }, 500); // 500ms debounce
    }
  }, []);

  // Fetch initial address on mount
  useEffect(() => {
    fetchAddress(centerPosition.lat, centerPosition.lng);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Map Container */}
      <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <MapContainer 
          center={[centerPosition.lat, centerPosition.lng]} 
          zoom={16} 
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenterTracker onCenterChange={handleCenterChange} initialCenter={initialPosition} />
        </MapContainer>

        {/* Center Marker Overlay (Absolutely Centered) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -100%)', // Lift up so the tip is exactly at the center
          zIndex: 1000,
          pointerEvents: 'none', // Allow clicking through to the map
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.2s',
          marginTop: isMoving ? '-15px' : '0px' // Bouncing effect when panning
        }}>
          {/* Custom attractive pin */}
          <div style={{
            background: '#ee4d2d',
            color: '#fff',
            padding: '8px',
            borderRadius: '50%',
            boxShadow: '0 8px 16px rgba(238, 77, 45, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '-5px'
          }}>
            <MapPin size={24} />
          </div>
          {/* Pin Shadow/Stem */}
          <div style={{
            width: '4px',
            height: '16px',
            background: 'linear-gradient(to bottom, #d03b1e, transparent)'
          }}/>
        </div>

        {/* Pointer shadow on the ground */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '4px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '50%',
          zIndex: 999,
          pointerEvents: 'none',
          filter: 'blur(1px)',
          opacity: isMoving ? 0.3 : 0.7,
          transition: 'all 0.2s'
        }} />

        {/* Crosshair target overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 998,
          pointerEvents: 'none',
          opacity: 0.1
        }}>
          <Target size={40} color="#000" />
        </div>
      </div>

      {/* Selected Address Display & Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
          Lokasi Dipilih
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <MapPin size={20} color="#ee4d2d" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1, fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.4, minHeight: '40px' }}>
            {addressLoading ? (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Memuat detail alamat...</span>
            ) : (
              currentAddress || 'Geser peta untuk menentukan titik koordinat'
            )}
          </div>
        </div>

        <button 
          onClick={() => onConfirm(centerPosition, currentAddress)}
          disabled={isMoving || addressLoading}
          style={{
            background: (isMoving || addressLoading) ? '#cbd5e1' : '#00a896',
            color: '#fff',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: (isMoving || addressLoading) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: (isMoving || addressLoading) ? 'none' : '0 4px 12px rgba(0, 168, 150, 0.3)',
            transition: 'all 0.2s'
          }}
        >
          <Check size={18} /> Konfirmasi Titik Lokasi
        </button>
      </div>

    </div>
  );
};

export default MapLocationPicker;
