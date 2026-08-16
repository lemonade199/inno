const initialOrders = [];

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
