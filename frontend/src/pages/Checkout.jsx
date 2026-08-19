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
import { PROVINCES, CITIES_BY_PROVINCE } from '../data/indonesiaRegions';

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

  const [provinces, setProvinces] = useState(PROVINCES);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [shippingCostData, setShippingCostData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showSavedAddressesModal, setShowSavedAddressesModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Midtrans');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' | 'pickup'

  const subtotal = getCartTotal(activeItems);

  const resolveRegion = (addr) => {
    if (!addr) {
      return {
        province: PROVINCES[8], // Jawa Barat
        city: CITIES_BY_PROVINCE["9"][0] // Bandung
      };
    }
    const text = `${addr.region || ''} ${addr.street || ''} ${addr.detail || ''}`.toUpperCase();
    
    let matchedProv = PROVINCES.find(p => text.includes(p.province.toUpperCase()));
    if (!matchedProv) {
      if (text.includes('JAKARTA')) {
        matchedProv = PROVINCES.find(p => p.province.toUpperCase().includes('JAKARTA'));
      } else if (text.includes('BANDUNG') || text.includes('CILEUNYI') || text.includes('BEKASI') || text.includes('BOGOR') || text.includes('DEPOK') || text.includes('CIMAHI')) {
        matchedProv = PROVINCES.find(p => p.province.toUpperCase().includes('JAWA BARAT'));
      } else if (text.includes('SURABAYA') || text.includes('MALANG') || text.includes('SIDOARJO')) {
        matchedProv = PROVINCES.find(p => p.province.toUpperCase().includes('JAWA TIMUR'));
      } else if (text.includes('SEMARANG') || text.includes('SOLO') || text.includes('SURAKARTA')) {
        matchedProv = PROVINCES.find(p => p.province.toUpperCase().includes('JAWA TENGAH'));
      } else {
        matchedProv = PROVINCES.find(p => p.province.toUpperCase().includes('JAWA BARAT')) || PROVINCES[0];
      }
    }

    const availableCities = CITIES_BY_PROVINCE[matchedProv.province_id] || [];
    let matchedCity = availableCities.find(c => text.includes(c.city_name.toUpperCase()));
    if (!matchedCity && availableCities.length > 0) {
      matchedCity = availableCities[0];
    }

    return { province: matchedProv, city: matchedCity };
  };

  const selectSavedAddress = (addr) => {
    if (!addr) return;
    setSelectedAddressId(addr.id || null);
    setFormData(prev => ({
      ...prev,
      name: addr.name || user?.name || '',
      phone: addr.phone || user?.phone || '',
      addressDetail: addr.street ? `${addr.street}${addr.detail ? ` (${addr.detail})` : ''}` : (user?.address || 'Jl. Merdeka No. 45')
    }));

    const { province, city } = resolveRegion(addr);
    setSelectedProvince(province);
    setSelectedCity(city);
    setShowSavedAddressesModal(false);
  };

  // Auto-select primary saved address on mount
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const primaryAddr = addresses.find(a => a.isPrimary) || addresses[0];
      selectSavedAddress(primaryAddr);
    } else if (user) {
      const fallbackAddr = {
        name: user.name,
        phone: user.phone || '081234567890',
        street: user.address || 'Jl. Merdeka No. 45, Jakarta Selatan',
        region: 'DKI JAKARTA, KOTA JAKARTA SELATAN, 12110',
        isPrimary: true
      };
      selectSavedAddress(fallbackAddr);
    }
  }, [addresses, user]);

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
    if (deliveryMethod === 'pickup' || paymentMethod === 'COD') return 0; // Ambil di tempat / COD: gratis ongkir (Rp 0)
    if (selectedService) return selectedService.price;
    return 0;
  };

  const shippingFee = getShippingFee();
  const serviceFee = paymentMethod === 'COD' ? 0 : 1000; // Tanpa biaya layanan / ongkir untuk COD ambil di tempat
  const grandTotal = subtotal + shippingFee + serviceFee;

  const getFullAddress = () => {
    if (deliveryMethod === 'pickup') {
      return 'Ambil Langsung di Toko Berkah Pancing (Jln. Cibiru Hilir RT02/RW03, Cileunyi, Kab. Bandung)';
    }
    const fragments = [formData.addressDetail];
    if (selectedCity) fragments.push(`${selectedCity.type} ${selectedCity.city_name}`);
    if (selectedProvince) fragments.push(selectedProvince.province);
    if (selectedCity?.postal_code) fragments.push(selectedCity.postal_code);
    return fragments.filter(f => f).join(', ');
  };

  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    
    let activeProvince = selectedProvince;
    let activeCity = selectedCity;
    let activeService = selectedService;

    if (deliveryMethod === 'delivery') {
      if (!activeProvince || !activeCity) {
        const resolved = resolveRegion(formData);
        activeProvince = resolved.province;
        activeCity = resolved.city;
        setSelectedProvince(activeProvince);
        setSelectedCity(activeCity);
      }

      if (!activeService) {
        activeService = {
          code: 'REG',
          name: 'JNE REG',
          description: 'Layanan Reguler',
          price: 15000,
          etd: '2-3 Hari'
        };
        setSelectedService(activeService);
      }
    }

    setSubmitting(true);

    const orderPayload = {
      customerName: formData.name || user?.name || 'Customer',
      customerEmail: formData.email || user?.email || '',
      customerPhone: formData.phone || user?.phone || '081234567890',
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
      shipping_service: deliveryMethod === 'pickup' ? 'PICKUP' : (activeService?.code || 'REG'),
      shipping_province_id: deliveryMethod === 'pickup' ? null : (activeProvince?.province_id || '9'),
      shipping_province: deliveryMethod === 'pickup' ? 'Ambil di Tempat' : (activeProvince?.province || 'Jawa Barat'),
      shipping_city_id: deliveryMethod === 'pickup' ? null : (activeCity?.city_id || '23'),
      shipping_city: deliveryMethod === 'pickup' ? 'Toko Berkah Pancing, Bandung' : `${activeCity?.type || 'Kota'} ${activeCity?.city_name || 'Bandung'}`,
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
              onClick={() => { setDeliveryMethod('pickup'); setPaymentMethod('COD'); }}
              style={{ padding: '0.85rem', borderRadius: '8px', border: deliveryMethod === 'pickup' ? '2px solid #16a34a' : '1.5px solid #e2e8f0', background: deliveryMethod === 'pickup' ? '#f0fdf4' : '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏪</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: deliveryMethod === 'pickup' ? '#16a34a' : '#1e293b' }}>Ambil di Tempat</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>Gratis Ongkir (Rp 0) • Ambil langsung di toko</span>
            </button>
          </div>

          {/* Info ambil di tempat */}
          {deliveryMethod === 'pickup' && (
            <div style={{ marginTop: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', fontSize: '0.8rem', color: '#15803d', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>📍</span>
              <div>
                <strong>Toko Berkah Pancing</strong><br />
                Jln. Cibiru Hilir RT02/RW03, Desa Cibiru Hilir, Kec. Cileunyi, Kab. Bandung, 40624<br />
                <span style={{ color: '#64748b', marginTop: '2px', display: 'block' }}>Jam buka: Setiap Hari, 08.00–21.00 WIB</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Alamat Pengiriman — hanya tampil jika metode Diantar */}
        {deliveryMethod === 'delivery' && (
          <div style={{ background: '#fff', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            {/* Header Row: Title on Left, Button on Right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '800', color: '#1e293b' }}>
                <MapPin size={20} color="#ee4d2d" />
                <span>Alamat Pengiriman</span>
              </div>
              <div>
                {addresses && addresses.length > 0 ? (
                  <button 
                    type="button"
                    onClick={() => setShowSavedAddressesModal(true)} 
                    style={{ background: '#fff', border: '1.5px solid #ee4d2d', color: '#ee4d2d', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                  >
                    Pilih Alamat Tersimpan &gt;
                  </button>
                ) : (
                  <Link 
                    to="/profile?tab=alamat"
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f4c81', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                  >
                    + Tambah Alamat
                  </Link>
                )}
              </div>
            </div>

            {/* Address Summary Card */}
            <div style={{ background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{formData.name || user?.name || 'Penerima'}</strong>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({formData.phone || user?.phone || '-'})</span>
                {addresses?.find(a => a.id === selectedAddressId)?.isPrimary && (
                  <span style={{ fontSize: '0.65rem', background: '#ee4d2d', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Alamat Utama</span>
                )}
                {selectedCity && (
                  <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                    {selectedCity.type} {selectedCity.city_name}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.45, marginTop: '2px' }}>
                {getFullAddress() || formData.addressDetail || 'Pilih alamat pengiriman dari daftar alamat tersimpan Anda.'}
              </div>
            </div>

            {/* Modal Alamat Tersimpan (DARI PROFIL) */}
            {showSavedAddressesModal && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)' }}>
                <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>Pilih Alamat Tersimpan</h3>
                    <button onClick={() => setShowSavedAddressesModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                    {addresses && addresses.length > 0 ? addresses.map(addr => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div 
                          key={addr.id} 
                          onClick={() => selectSavedAddress(addr)}
                          style={{ border: isSelected ? '2px solid #ee4d2d' : '1px solid #e2e8f0', background: isSelected ? '#fff5f5' : '#fff', borderRadius: '8px', padding: '12px', cursor: 'pointer', transition: 'all 0.15s' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{addr.name} | {addr.phone}</span>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              {addr.isPrimary && (
                                <span style={{ fontSize: '0.65rem', background: '#ee4d2d', color: '#fff', padding: '2px 6px', borderRadius: '12px', fontWeight: '700' }}>Utama</span>
                              )}
                              {isSelected && (
                                <span style={{ fontSize: '0.65rem', background: '#16a34a', color: '#fff', padding: '2px 6px', borderRadius: '12px', fontWeight: '700' }}>Terpilih</span>
                              )}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                            <div>{addr.street} {addr.detail ? `(${addr.detail})` : ''}</div>
                            <div>{addr.region}</div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                        Belum ada alamat tersimpan di profil Anda.
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <Link
                      to="/profile?tab=alamat"
                      onClick={() => setShowSavedAddressesModal(false)}
                      style={{ color: '#0f4c81', fontSize: '0.82rem', fontWeight: '700', textDecoration: 'none' }}
                    >
                      ⚙️ Kelola Alamat di Profil &rarr;
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowSavedAddressesModal(false)}
                      style={{ background: '#f1f5f9', border: 'none', color: '#475569', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Tutup
                    </button>
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

          {/* Opsi Pengiriman */}
          <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: '#334155', fontWeight: '600' }}>Opsi Pengiriman</span>
              <span style={{ color: deliveryMethod === 'pickup' ? '#16a34a' : '#ee4d2d', fontSize: '0.8rem', fontWeight: '700' }}>
                {deliveryMethod === 'pickup' ? 'Ambil di Toko' : 'JNE Courier'}
              </span>
            </div>
            
            {deliveryMethod === 'pickup' ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 12px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🏬 Ambil Langsung di Toko <span style={{ fontWeight: '400', color: '#475569' }}>| Self Pick-up</span>
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#166534' }}>
                    Rp 0 (Gratis Ongkir)
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#15803d' }}>
                  Pesanan disiapkan langsung di toko fisik Berkah Pancing (Cileunyi, Bandung). Tanpa ongkos kirim.
                </span>
              </div>
            ) : (
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
            )}
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
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Pilih Metode</span>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', border: paymentMethod === 'Midtrans' ? '1.5px solid #ee4d2d' : '1px solid #e2e8f0', background: paymentMethod === 'Midtrans' ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} color="#00a896" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Transfer Bank / Virtual Account / QRIS</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>BCA, Mandiri, BNI, BRI, Gopay, QRIS (Pembayaran Otomatis)</div>
              </div>
            </div>
            <input type="radio" name="payment" value="Midtrans" checked={paymentMethod === 'Midtrans'} onChange={() => setPaymentMethod('Midtrans')} style={{ accentColor: '#ee4d2d', transform: 'scale(1.2)' }} />
          </label>

          {/* COD hanya untuk Ambil di Tempat */}
          {deliveryMethod === 'pickup' && (
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', border: paymentMethod === 'COD' ? '1.5px solid #ee4d2d' : '1px solid #e2e8f0', background: paymentMethod === 'COD' ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Banknote size={20} color="#f77f00" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>COD (Ambil di Toko & Bayar Tunai)</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Ambil barang langsung di toko Berkah Pancing & bayar di tempat (Tanpa Ongkir / Rp 0)</div>
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
            <span style={{ fontWeight: '600', color: '#1e293b' }}>
              {deliveryMethod === 'pickup' || paymentMethod === 'COD' ? 'Rp 0 (Ambil di Toko)' : productService.formatIDR(shippingFee)}
            </span>
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
