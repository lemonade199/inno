import api from './api';

export const productService = {
  getProducts: async () => {
    try {
      const res = await api.get('/products');
      return res.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getProductById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  
  createProduct: async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));

      const res = await api.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  updateProduct: async (id, data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
           formData.append(key, data[key]);
        }
      });
      formData.append('_method', 'PUT');

      const res = await api.post(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await api.delete(`/admin/products/${id}`);
      return res.data;
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  getCategories: async () => {
    return [
      { id: 1, name: 'Pakan Ayam & Unggas' },
      { id: 2, name: 'Pakan Ikan' },
      { id: 3, name: 'Pakan Burung & Hewan' },
      { id: 4, name: 'Umpan Pancing' },
      { id: 5, name: 'Essen Pancing' },
      { id: 6, name: 'Alat & Aksesoris Pancing' }
    ];
  },

  formatIDR: (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val),
};
