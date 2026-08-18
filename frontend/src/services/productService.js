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
    try {
      const res = await api.get('/categories');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        localStorage.setItem('berkah_categories', JSON.stringify(res.data));
        return res.data;
      }
    } catch (e) {
      console.warn('API getCategories error, using local storage fallback', e);
    }

    // Fallback to local storage or defaults
    const cached = localStorage.getItem('berkah_categories');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {}
    }

    const defaultCats = [
      { id: 1, name: 'Pakan Ayam & Unggas', slug: 'pakan-ayam-unggas', description: 'Pakan berkualitas untuk ayam petelur, pedaging, dan unggas ternak.', icon: 'Egg', status: 'Aktif', count: 4 },
      { id: 2, name: 'Pakan Ikan', slug: 'pakan-ikan', description: 'Pelet dan pakan apung/tenggelam untuk ikan lele, nila, mas, dan gurame.', icon: 'Fish', status: 'Aktif', count: 6 },
      { id: 3, name: 'Pakan Burung & Hewan', slug: 'pakan-burung-hewan', description: 'Pakan voer, biji-bijian, dan nutrisi lengkap burung berkicau & peliharaan.', icon: 'Feather', status: 'Aktif', count: 3 },
      { id: 4, name: 'Umpan Pancing', slug: 'umpan-pancing', description: 'Umpan hidup, umpan racikan, pelet, dan lure tiruan.', icon: 'Anchor', status: 'Aktif', count: 8 },
      { id: 5, name: 'Essen Pancing', slug: 'essen-pancing', description: 'Essen aroma amis, wangi, gurih untuk meningkatkan daya pikat ikan.', icon: 'Droplets', status: 'Aktif', count: 5 },
      { id: 6, name: 'Alat & Aksesoris Pancing', slug: 'alat-aksesoris-pancing', description: 'Joran, reel, kail, pelampung, senar, tas pancing, dan perlengkapan.', icon: 'Sparkles', status: 'Aktif', count: 12 }
    ];
    localStorage.setItem('berkah_categories', JSON.stringify(defaultCats));
    return defaultCats;
  },

  createCategory: async (categoryData) => {
    try {
      const res = await api.post('/admin/categories', categoryData);
      if (res.data?.category) {
        // Sync local cache
        const current = JSON.parse(localStorage.getItem('berkah_categories') || '[]');
        localStorage.setItem('berkah_categories', JSON.stringify([...current, res.data.category]));
        return res.data.category;
      }
    } catch (e) {
      console.warn('API createCategory error, using local fallback', e);
    }

    // Local fallback
    const current = JSON.parse(localStorage.getItem('berkah_categories') || '[]');
    const newCat = {
      id: Date.now(),
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      description: categoryData.description || '',
      icon: categoryData.icon || 'Tag',
      status: categoryData.status || 'Aktif',
      count: 0,
    };
    const updated = [...current, newCat];
    localStorage.setItem('berkah_categories', JSON.stringify(updated));
    return newCat;
  },

  updateCategory: async (id, categoryData) => {
    try {
      const res = await api.put(`/admin/categories/${id}`, categoryData);
      if (res.data?.category) {
        const current = JSON.parse(localStorage.getItem('berkah_categories') || '[]');
        const updated = current.map(c => c.id === id || c.id === parseInt(id) ? { ...c, ...res.data.category } : c);
        localStorage.setItem('berkah_categories', JSON.stringify(updated));
        return res.data.category;
      }
    } catch (e) {
      console.warn('API updateCategory error, using local fallback', e);
    }

    // Local fallback
    const current = JSON.parse(localStorage.getItem('berkah_categories') || '[]');
    const updated = current.map(c => {
      if (c.id === id || c.id === parseInt(id)) {
        return {
          ...c,
          ...categoryData,
          slug: categoryData.slug || (categoryData.name ? categoryData.name.toLowerCase().replace(/\s+/g, '-') : c.slug),
        };
      }
      return c;
    });
    localStorage.setItem('berkah_categories', JSON.stringify(updated));
    return updated.find(c => c.id === id || c.id === parseInt(id));
  },

  deleteCategory: async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);
    } catch (e) {
      console.warn('API deleteCategory error, removing from local storage', e);
    }

    const current = JSON.parse(localStorage.getItem('berkah_categories') || '[]');
    const filtered = current.filter(c => c.id !== id && c.id !== parseInt(id));
    localStorage.setItem('berkah_categories', JSON.stringify(filtered));
    return { success: true };
  },

  formatIDR: (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val),
};
