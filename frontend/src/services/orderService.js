export const orderService = {
  getOrders: async () => {
    try {
      const res = await fetch('/api/orders');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  getUserOrders: async (email) => {
    try {
      const res = await fetch(`/api/orders?email=${email || ''}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  getOrderById: async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  createOrder: async (orderData) => {
    // Actually the creation is handled inside Checkout.jsx via /api/payment/create !
    // We can keep this for compatibility if other components use it, but Checkout does it directly.
    return Promise.reject("Gunakan endpoint /api/payment/create langsung seperti di Checkout.jsx");
  },
  updateOrderStatus: async (id, newStatus, paymentStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, paymentStatus })
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
