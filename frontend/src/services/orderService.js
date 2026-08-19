import api from './api';

export const orderService = {
  getOrders: async () => {
    try {
      const res = await api.get('/orders');
      return res.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  getUserOrders: async (email) => {
    try {
      const res = await api.get(`/orders?email=${email || ''}`);
      return res.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  getOrderById: async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  createOrder: async (orderData) => {
    return Promise.reject("Gunakan endpoint /api/payment/create langsung seperti di Checkout.jsx");
  },
  updateOrderStatus: async (id, newStatus, paymentStatus, trackingNumber = null) => {
    try {
      const payload = { status: newStatus, paymentStatus };
      if (trackingNumber) payload.trackingNumber = trackingNumber;

      const res = await api.put(`/admin/orders/${id}/status`, payload);
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  confirmOrderReceived: async (id) => {
    try {
      const res = await api.put(`/orders/${id}/confirm-received`);
      return res.data;
    } catch (e) {
      console.error(e);
      const message = e.response?.data?.message || 'Gagal mengonfirmasi pesanan.';
      throw new Error(message);
    }
  },
};
