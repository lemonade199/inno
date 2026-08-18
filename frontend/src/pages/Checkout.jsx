import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Banknote,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { productService } from '../services/productService';
import { shippingService } from '../services/shippingService';
import api from '../services/api';
import MapLocationPicker from '../components/MapLocationPicker';

const Checkout = () => {
  const { cart, checkoutPayload, getCartTotal, clearCart, commitCheckout } = useCart();
  const { user, addresses } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // The active items we are checking out
  const activeItems = (checkoutPayload && checkoutPayload.length > 0) ? checkoutPayload : cart;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressDetail: user?.address || '',
    notes: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [shippingCostData, setShippingCostData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  const [editingAddress, setEditingAddress] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSavedAddressesModal, setShowSavedAddressesModal] = useState(false);
  const [pendingCityName, setPendingCityName] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Midtrans');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' | 'pickup'

  const subtotal = getCartTotal(activeItems);

  // Load Provinces (data statis, selalu berhasil)
  useEffect(() => {
    shippingService.getProvinces().then(res => {
      if (res.status === 'success' && res.data.length > 0) {
        setProvinces(res.data);
      }
    });
  }, []);

  // Load Cities when Province changes
  useEffect(() => {
    if (selectedProvince) {
      setCities([]);
      if (!pendingCityName) setSelectedCity(null);
      
      if (selectedProvince.province_id) {
        shippingService.getCities(selectedProvince.province_id).then(res => {
          if (res.status === 'success') {
            setCities(res.data);
            if (pendingCityName) {
              // Find city matching the pending name
              const searchCity = pendingCityName.trim().toUpperCase();
              const foundCity = res.data.find(c => 
                (c.type + ' ' + c.city_name).toUpperCase() === searchCity ||
                c.city_name.toUpperCase() === searchCity ||
                searchCity.includes(c.city_name.toUpperCase())
              );
              if (foundCity) {
                setSelectedCity(foundCity);
              }
              setPendingCityName(null);
            }
          }
        });
      }
    }
  }, [selectedProvince, pendingCityName]);

  const selectSavedAddress = (addr) => {
    setFormData(prev => ({
      ...prev,
      name: addr.name,
      phone: addr.phone,
      addressDetail: addr.street + (addr.detail ? ` (${addr.detail})` : '')
    }));
    
    // Parse region: "JAWA BARAT, KAB. BANDUNG, CILEUNYI, 40624"
    if (addr.region) {
      const parts = addr.region.split(',');
      if (parts.length >= 2) {
        const provName = parts[0].trim().toUpperCase();
        const cityName = parts[1].trim().toUpperCase();
        
        const foundProv = provinces.find(p => p.province.toUpperCase() === provName);
        if (foundProv) {
          setSelectedProvince(foundProv);
          setPendingCityName(cityName);
        }
      }
    }
    
    setShowSavedAddressesModal(false);
    setEditingAddress(true); // Open edit mode to let them review
  };

  // Load Shipping Cost when City changes
  useEffect(() => {
    if (selectedCity && activeItems.length > 0) {
      setIsLoadingShipping(true);
      setShippingCostData(null);
      setSelectedService(null);

      const items = activeItems.map(item => ({ id: item.product.id, qty: item.qty }));

      shippingService.calculateCost(selectedCity.city_id, items, 'jne')
        .then(res => {
          if (res.status === 'success') {
            setShippingCostData(res.data);
            if (res.data.shipping.services.length > 0) {
              setSelectedService(res.data.shipping.services[0]); // default select first option
            }
          }
        })
        .catch(err => {
          console.error("Shipping calculate error:", err);
        })
        .finally(() => {
          setIsLoadingShipping(false);
        });
    }
  }, [selectedCity, activeItems]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getShippingFee = () => {
    if (deliveryMethod === 'pickup') return 0; // Ambil di tempat: gratis ongkir
    if (selectedService) return selectedService.price;
    return 0;
  };

  const shippingFee = getShippingFee();
  const serviceFee = 1000;
  const grandTotal = subtotal + shippingFee + serviceFee;

  const getFullAddress = () => {
    const fragments = [formData.addressDetail];
    if (selectedCity) fragments.push(`${selectedCity.type} ${selectedCity.city_name}`);
    if (selectedProvince) fragments.push(selectedProvince.province);
    if (selectedCity?.postal_code) fragments.push(selectedCity.postal_code);
    return fragments.filter(f => f).join(', ');
  };

  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    
    if (deliveryMethod === 'delivery') {
      if (!selectedProvince || !selectedCity || !formData.addressDetail) {
        alert('Mohon lengkapi alamat pengiriman (Provinsi, Kota, dan Detail Jalan)');
        return;
      }
      if (!selectedService) {
        alert('Mohon pilih layanan pengiriman (kurir) yang tersedia');
        return;
      }
    }

    setSubmitting(true);

    const orderPayload = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: getFullAddress(),
      items: activeItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        qty: item.qty,
        price: item.product.price,
        image: item.product.image
      })),
      shipping_method: deliveryMethod,
      shipping_courier: deliveryMethod === 'pickup' ? 'PICKUP' : 'JNE',
      shipping_service: deliveryMethod === 'pickup' ? 'PICKUP' : selectedService?.code,
      shipping_province_id: deliveryMethod === 'pickup' ? null : selectedProvince?.province_id,
      shipping_province: deliveryMethod === 'pickup' ? 'Ambil di Tempat' : selectedProvince?.province,
      shipping_city_id: deliveryMethod === 'pickup' ? null : selectedCity?.city_id,
      shipping_city: deliveryMethod === 'pickup' ? 'Toko Berkah Pancing, Bandung' : `${selectedCity?.type} ${selectedCity?.city_name}`,
      paymentMethod: paymentMethod
    };

    try {
      const createResponse = await api.post('/payment/create', orderPayload);
      const createdOrder = createResponse.data;

      if (createdOrder.status === 'error') {
        throw new Error(createdOrder.message);
      }

      addNotification({
        title: 'Pesanan Baru Masuk',
        message: `Ada pesanan baru #${createdOrder.order_id_db} dari ${formData.name}.`,
        type: 'order',
        entity_type: 'order',
        action_url: `/admin/orders/${createdOrder.order_id_db}`
      });

      commitCheckout();
      setSubmitting(false);
      navigate(`/orders/${createdOrder.order_id_db}`);
    } catch (err) {
      setSubmitting(false);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memproses pesanan. Silakan coba lagi.';
      alert('Checkout Gagal: ' + errorMessage);
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.25rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
          <ShieldCheck size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Harap Login Terlebih Dahulu</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.3rem' }}>Anda harus masuk ke akun Anda sebelum bisa melanjutkan ke proses pembayaran.</p>
        </div>
        <Link to="/login" style={{ background: '#0f4c81', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: '30px', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 4px 15px rgba(15, 76, 129, 0.3)' }}>Masuk ke Akun</Link>
      </div>
    );
  }

  if (activeItems.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.25rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e6f0fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4c81' }}>
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Keranjang Belanja Kosong</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.3rem' }}>Silakan tambahkan produk ke keranjang terlebih dahulu sebelum melakukan checkout.</p>
        </div>
        <Link to="/products" style={{ background: '#f77f00', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: '30px', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none' }}>Ke Katalog Produk</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', margin: '-1.5rem -1rem', paddingBottom: '6rem' }}>
      
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/cart')} style={{ background: 'none', border: 'none', color: '#ee4d2d', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
          <ArrowLeft size={22} color="#ee4d2d" />
        </button>
        <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Checkout</h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Section 0: Metode Pengiriman (Ambil / Antar) */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#ee4d2d' }}>🚚</span> Metode Pengiriman
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Diantar */}
            <button
              onClick={() => { setDeliveryMethod('delivery'); setPaymentMethod('Midtrans'); }}
              style={{ padding: '0.85rem', borderRadius: '8px', border: deliveryMethod === 'delivery' ? '2px solid #ee4d2d' : '1.5px solid #e2e8f0', background: deliveryMethod === 'delivery' ? '#fff5f5' : '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏠</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: deliveryMethod === 'delivery' ? '#ee4d2d' : '#1e293b' }}>Diantar</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>Pengiriman ke alamat Anda via JNE</span>
            </button>

            {/* Ambil di Tempat */}
            <button
              onClick={() => setDeliveryMethod('pickup')}
              style={{ padding: '0.85rem', borderRadius: '8px', border: deliveryMethod === 'pickup' ? '2px solid #16a34a' : '1.5px solid #e2e8f0', background: deliveryMethod === 'pickup' ? '#f0fdf4' : '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏪</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: deliveryMethod === 'pickup' ? '#16a34a' : '#1e293b' }}>Ambil di Tempat</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>Gratis Ongkir • Ambil langsung di toko</span>
            </button>
          </div>

          {/* Info ambil di tempat */}
          {deliveryMethod === 'pickup' && (
            <div style={{ marginTop: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', fontSize: '0.8rem', color: '#15803d', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>📍</span>
              <div>
                <strong>Toko Berkah Pancing</strong><br />
                Jln. Cibiru Hilir RT02/RW03, Desa Cibiru Hilir, Kec. Cileunyi, Kab. Bandung, 40624<br />
                <span style={{ color: '#64748b', marginTop: '2px', display: 'block' }}>Jam buka: Senin–Sabtu, 08.00–17.00 WIB</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Alamat Pengiriman — hanya tampil jika metode Diantar */}
        {deliveryMethod === 'delivery' && (
          <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <MapPin size={20} color="#ee4d2d" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
                <span>{formData.name} <span style={{ color: '#64748b', fontWeight: '400' }}>{formData.phone}</span></span>
                {addresses && addresses.length > 0 && (
                  <button 
                    onClick={() => setShowSavedAddressesModal(true)} 
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f4c81', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Pilih Alamat Tersimpan
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                {getFullAddress() || 'Alamat belum lengkap'}
              </div>
            </div>
            <button onClick={() => setEditingAddress(!editingAddress)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
              <ChevronRight size={20} />
            </button>
          </div>

          {editingAddress && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap Penerima" style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Nomor HP / WhatsApp" style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
              
              <select 
                value={selectedProvince?.province_id || ''} 
                onChange={(e) => {
                  const p = provinces.find(x => x.province_id === e.target.value);
                  setSelectedProvince(p || null);
                  setSelectedCity(null);
                  setCities([]);
                }}
                style={{ padding: '0.6rem', borderRadius: '4px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', background: '#fff', cursor: 'pointer' }}
              >
                <option value="">{provinces.length === 0 ? 'Memuat provinsi...' : '-- Pilih Provinsi --'}</option>
                {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.province}</option>)}
              </select>

              <select 
                value={selectedCity?.city_id || ''} 
                onChange={(e) => {
                  const c = cities.find(x => x.city_id === e.target.value);
                  setSelectedCity(c);
                }}
                disabled={!selectedProvince}
                style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: !selectedProvince ? '#f8fafc' : '#fff' }}
              >
                <option value="">{selectedProvince ? 'Pilih Kota/Kabupaten' : 'Pilih Provinsi Terlebih Dahulu'}</option>
                {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>)}
              </select>

              <div style={{ position: 'relative' }}>
                <textarea 
                  name="addressDetail" 
                  rows={3} 
                  value={formData.addressDetail} 
                  onChange={handleChange} 
                  placeholder="Alamat Lengkap (Jalan, RT/RW, Blok)" 
                  style={{ width: '100%', padding: '0.6rem 0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                />
                <button 
                  onClick={(e) => { e.preventDefault(); setShowMapModal(true); }}
                  style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#ee4d2d', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <MapPin size={12} /> Tandai di Peta
                </button>
              </div>
              
              <button 
                onClick={() => setEditingAddress(false)} 
                style={{ background: '#00a896', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Simpan Alamat
              </button>
            </div>
          )}

          {/* Modal Peta */}
          {showMapModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)' }}>
              <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>Lokasi Pengiriman</h3>
                  <button onClick={() => setShowMapModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
                </div>
                
                <MapLocationPicker 
                  initialPosition={selectedLocation} 
                  onConfirm={(coords, addressText) => {
                    setSelectedLocation(coords);
                    setFormData(prev => ({ 
                      ...prev, 
                      addressDetail: prev.addressDetail ? `${prev.addressDetail} (${addressText})` : addressText
                    }));
                    setShowMapModal(false);
                  }} 
                />
              </div>
            </div>
          )}

          {/* Modal Alamat Tersimpan (DARI PROFIL) */}
          {showSavedAddressesModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)' }}>
              <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>Pilih Alamat dari Profil</h3>
                  <button onClick={() => setShowSavedAddressesModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                  {addresses && addresses.length > 0 ? addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      onClick={() => selectSavedAddress(addr)}
                      style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s', ':hover': { borderColor: '#ee4d2d', background: '#fff5f5' } }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{addr.name} | {addr.phone}</span>
                        {addr.isPrimary && (
                          <span style={{ fontSize: '0.65rem', background: '#ee4d2d', color: '#fff', padding: '2px 6px', borderRadius: '12px', fontWeight: '700' }}>Utama</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                        <div>{addr.street} {addr.detail ? `(${addr.detail})` : ''}</div>
                        <div>{addr.region}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                      Belum ada alamat tersimpan di profil Anda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Section 2: Toko & Detail Produk */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span style={{ background: '#ee4d2d', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '2px 5px', borderRadius: '2px' }}>
              Mall ORI
            </span>
            <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#1e293b' }}>
              Berkah Pancing Official Shop
            </span>
          </div>

          {activeItems.map(({ product, qty }) => (
            <div key={product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={product.image} alt={product.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f1f5f9', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', margin: 0, lineHeight: 1.3 }}>{product.name}</h4>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{product.weight || 500}gr</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ee4d2d' }}>{productService.formatIDR(product.price)}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>x{qty}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Opsi Pengiriman (JNE) */}
          <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: '#334155', fontWeight: '600' }}>Opsi Pengiriman</span>
              <span style={{ color: '#ee4d2d', fontSize: '0.8rem', fontWeight: '600' }}>JNE</span>
            </div>
            
            <div>
              {isLoadingShipping && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Menghitung ongkos kirim JNE...</div>}
              
              {!isLoadingShipping && !selectedCity && (
                <div style={{ fontSize: '0.8rem', color: '#ef4444' }}>Silakan lengkapi alamat pengiriman untuk melihat ongkos kirim.</div>
              )}
              
              {!isLoadingShipping && shippingCostData && shippingCostData.shipping.services.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Total Berat: {shippingCostData.weight}gr</div>
                  {shippingCostData.shipping.services.map(srv => (
                    <label key={srv.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', border: selectedService?.code === srv.code ? '1px solid #ee4d2d' : '1px solid #e2e8f0', background: selectedService?.code === srv.code ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="radio" name="shippingService" value={srv.code} checked={selectedService?.code === srv.code} onChange={() => setSelectedService(srv)} style={{ accentColor: '#ee4d2d' }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{srv.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Estimasi {srv.etd} hari</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}>
                        {productService.formatIDR(srv.price)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              
              {!isLoadingShipping && shippingCostData && shippingCostData.shipping.services.length === 0 && (
                <div style={{ fontSize: '0.8rem', color: '#ef4444' }}>Layanan JNE tidak tersedia untuk tujuan ini.</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.88rem' }}>
            <span style={{ color: '#64748b' }}>Total {activeItems.reduce((sum, i) => sum + i.qty, 0)} Produk</span>
            <span style={{ fontWeight: '800', color: '#ee4d2d', fontSize: '1rem' }}>
              {productService.formatIDR(subtotal)}
            </span>
          </div>
        </div>

        {/* Section 4: Metode Pembayaran */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Metode Pembayaran</h3>
          </div>


          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', border: paymentMethod === 'Midtrans' ? '1.5px solid #ee4d2d' : '1px solid #e2e8f0', background: paymentMethod === 'Midtrans' ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} color="#00a896" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Transfer Bank / VA</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>BCA, Mandiri, BNI, BRI</div>
              </div>
            </div>
            <input type="radio" name="payment" value="Midtrans" checked={paymentMethod === 'Midtrans'} onChange={() => setPaymentMethod('Midtrans')} style={{ accentColor: '#ee4d2d', transform: 'scale(1.2)' }} />
          </label>

          {/* COD hanya tersedia untuk Ambil di Tempat */}
          {deliveryMethod === 'pickup' && (
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', border: paymentMethod === 'COD' ? '1.5px solid #ee4d2d' : '1px solid #e2e8f0', background: paymentMethod === 'COD' ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Banknote size={20} color="#f77f00" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>COD (Bayar di Tempat)</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Bayar tunai saat mengambil barang di toko</div>
                </div>
              </div>
              <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} style={{ accentColor: '#ee4d2d', transform: 'scale(1.2)' }} />
            </label>
          )}
        </div>

        {/* Section 5: Rincian Pembayaran */}
        <div style={{ background: '#fff', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.25rem 0' }}>Rincian Pembayaran</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
            <span>Subtotal Pesanan</span>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>{productService.formatIDR(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
            <span>Subtotal Pengiriman</span>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>{productService.formatIDR(shippingFee)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
            <span>Biaya Layanan</span>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>{productService.formatIDR(serviceFee)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>Total Pembayaran</span>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ee4d2d' }}>{productService.formatIDR(grandTotal)}</span>
          </div>
        </div>

      </div>

      {/* Shopee-style Sticky Bottom Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', boxShadow: '0 -3px 12px rgba(0,0,0,0.1)', zIndex: 1000, padding: '0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0.65rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>Total <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ee4d2d' }}>{productService.formatIDR(grandTotal)}</span></div>
          </div>
          <button onClick={handleSubmitOrder} disabled={submitting || isLoadingShipping} style={{ background: 'linear-gradient(135deg, #ee4d2d 0%, #d03b1e 100%)', color: '#fff', border: 'none', padding: '0.75rem 1.75rem', fontSize: '0.95rem', fontWeight: '800', cursor: (submitting || isLoadingShipping) ? 'not-allowed' : 'pointer', opacity: (submitting || isLoadingShipping) ? 0.7 : 1, borderRadius: '4px', boxShadow: '0 4px 14px rgba(238,77,45,0.3)', marginLeft: 'auto', flexShrink: 0 }}>
            {submitting ? 'Memproses...' : 'Buat Pesanan'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
