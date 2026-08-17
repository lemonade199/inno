export const productService = {
  getProducts: async () => {
    try {
      const res = await fetch('/api/products');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getProductById: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  
  createProduct: async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  updateProduct: async (id, data) => {
    try {
      // For PUT simulating in Laravel via POST because of FormData limits
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
           formData.append(key, data[key]);
        }
      });
      formData.append('_method', 'PUT');

      const res = await fetch(`/api/products/${id}`, {
        method: 'POST',
        body: formData
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
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

  formatIDR: (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(Number(val) || 0)),
};
