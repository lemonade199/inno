const initialOrders = [
  {
    id: 'ORD-2026-001',
    customerName: 'Juli Anto',
    customerEmail: 'julianto@gmail.com',
    customerPhone: '081234567890',
    address: 'Jl. Merdeka No. 45, Jakarta Selatan',
    date: '15 Agustus 2026',
    items: [
      { id: 1, name: 'Joran Pancing Shimano SpeedMaster 210', qty: 1, price: 1250000, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80' },
      { id: 5, name: 'Set Mata Kail Mustad Stainless', qty: 2, price: 95000, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80' },
    ],
    subtotal: 1440000,
    shippingFee: 25000,
    total: 1465000,
    status: 'Diproses',
    paymentStatus: 'Lunas',
    paymentMethod: 'Transfer Bank BCA',
  },
  {
    id: 'ORD-2026-002',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@yahoo.com',
    customerPhone: '085711223344',
    address: 'Jl. Anggrek No. 12, Bandung',
    date: '14 Agustus 2026',
    items: [
      { id: 2, name: 'Reel Pancing Daiwa BG 4000', qty: 1, price: 1850000, image: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=80' },
    ],
    subtotal: 1850000,
    shippingFee: 30000,
    total: 1880000,
    status: 'Selesai',
    paymentStatus: 'Lunas',
    paymentMethod: 'QRIS',
  },
  {
    id: 'ORD-2026-003',
    customerName: 'Juli Anto',
    customerEmail: 'julianto@gmail.com',
    customerPhone: '081234567890',
    address: 'Jl. Merdeka No. 45, Jakarta Selatan',
    date: '14 Agustus 2026',
    items: [
      { id: 3, name: 'Senar Pancing Braided PE 4', qty: 3, price: 185000, image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80' },
      { id: 4, name: 'Umpan Lure Minnow Popper', qty: 2, price: 65000, image: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=500&auto=format&fit=crop&q=80' },
    ],
    subtotal: 685000,
    shippingFee: 20000,
    total: 705000,
    status: 'Menunggu Pembayaran',
    paymentStatus: 'Belum Bayar',
    paymentMethod: 'Transfer Bank Mandiri',
  },
  {
    id: 'ORD-2026-004',
    customerName: 'Andi Wijaya',
    customerEmail: 'andi.w@gmail.com',
    customerPhone: '081344556677',
    address: 'Jl. Gajah Mada No. 101, Semarang',
    date: '13 Agustus 2026',
    items: [
      { id: 6, name: 'Tas Joran Pancing Waterproof', qty: 1, price: 240000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80' },
    ],
    subtotal: 240000,
    shippingFee: 15000,
    total: 255000,
    status: 'Dikirim',
    paymentStatus: 'Lunas',
    paymentMethod: 'COD',
  },
];

const getStoredOrders = () => {
  const saved = localStorage.getItem('berkah_orders');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return initialOrders;
    }
  }
  localStorage.setItem('berkah_orders', JSON.stringify(initialOrders));
  return initialOrders;
};

export const orderService = {
  getOrders: () => {
    return Promise.resolve(getStoredOrders());
  },
  getUserOrders: (email) => {
    const orders = getStoredOrders();
    if (!email) return Promise.resolve(orders);
    return Promise.resolve(orders.filter(o => o.customerEmail === email || o.customerName === 'Juli Anto'));
  },
  getOrderById: (id) => {
    const orders = getStoredOrders();
    return Promise.resolve(orders.find((o) => o.id === id));
  },
  createOrder: (orderData) => {
    const orders = getStoredOrders();
    const newId = `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`;
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'Long', year: 'numeric' });
    
    const newOrder = {
      id: newId,
      customerName: orderData.customerName || 'Juli Anto',
      customerEmail: orderData.customerEmail || 'julianto@gmail.com',
      customerPhone: orderData.customerPhone || '081234567890',
      address: orderData.address || 'Jl. Merdeka No. 45, Jakarta',
      date: dateStr,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shippingFee: orderData.shippingFee || 20000,
      total: orderData.total || 0,
      status: 'Menunggu Pembayaran',
      paymentStatus: 'Belum Bayar',
      paymentMethod: orderData.paymentMethod || 'Transfer Bank BCA',
    };

    const updated = [newOrder, ...orders];
    localStorage.setItem('berkah_orders', JSON.stringify(updated));
    return Promise.resolve(newOrder);
  },
  updateOrderStatus: (id, newStatus, paymentStatus) => {
    const orders = getStoredOrders();
    const updated = orders.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          status: newStatus !== undefined ? newStatus : o.status,
          paymentStatus: paymentStatus !== undefined ? paymentStatus : o.paymentStatus,
        };
      }
      return o;
    });
    localStorage.setItem('berkah_orders', JSON.stringify(updated));
    return Promise.resolve(updated.find(o => o.id === id));
  },
};
