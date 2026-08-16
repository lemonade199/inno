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
    // For now, categories can be hardcoded or extracted from products
    return [
      { id: 1, name: 'Joran (Rod)' },
      { id: 2, name: 'Reel (Gulungan)' },
      { id: 3, name: 'Senar (Line)' },
      { id: 4, name: 'Umpan (Bait/Lure)' },
      { id: 5, name: 'Aksesoris' }
    ];
  },

  formatIDR: (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val),
};
