const initialProducts = [];

const initialCategories = [];

const getStoredProducts = () => {
  const saved = localStorage.getItem('berkah_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return initialProducts;
    }
  }
  localStorage.setItem('berkah_products', JSON.stringify(initialProducts));
  return initialProducts;
};

const getStoredCategories = () => {
  const saved = localStorage.getItem('berkah_categories');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return initialCategories;
    }
  }
  localStorage.setItem('berkah_categories', JSON.stringify(initialCategories));
  return initialCategories;
};

export const productService = {
  getProducts: () => Promise.resolve(getStoredProducts()),
  getProductById: (id) => Promise.resolve(getStoredProducts().find(p => p.id === Number(id))),
  
  createProduct: (data) => {
    const products = getStoredProducts();
    const newProduct = {
      id: Date.now(),
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      status: Number(data.stock) > 5 ? 'Tersedia' : Number(data.stock) > 0 ? 'Stok Menipis' : 'Habis',
      image: data.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
      description: data.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newProduct, ...products];
    localStorage.setItem('berkah_products', JSON.stringify(updated));
    return Promise.resolve(newProduct);
  },

  updateProduct: (id, data) => {
    const products = getStoredProducts();
    const updated = products.map(p => {
      if (p.id === Number(id)) {
        const newStock = Number(data.stock !== undefined ? data.stock : p.stock);
        return {
          ...p,
          ...data,
          price: data.price !== undefined ? Number(data.price) : p.price,
          stock: newStock,
          status: newStock > 5 ? 'Tersedia' : newStock > 0 ? 'Stok Menipis' : 'Habis',
        };
      }
      return p;
    });
    localStorage.setItem('berkah_products', JSON.stringify(updated));
    return Promise.resolve(updated.find(p => p.id === Number(id)));
  },

  deleteProduct: (id) => {
    const products = getStoredProducts();
    const updated = products.filter(p => p.id !== Number(id));
    localStorage.setItem('berkah_products', JSON.stringify(updated));
    return Promise.resolve({ success: true });
  },

  getCategories: () => Promise.resolve(getStoredCategories()),
  
  createCategory: (name) => {
    const categories = getStoredCategories();
    const newCat = {
      id: Date.now(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
      status: 'Aktif',
    };
    const updated = [...categories, newCat];
    localStorage.setItem('berkah_categories', JSON.stringify(updated));
    return Promise.resolve(newCat);
  },

  deleteCategory: (id) => {
    const categories = getStoredCategories();
    const updated = categories.filter(c => c.id !== Number(id));
    localStorage.setItem('berkah_categories', JSON.stringify(updated));
    return Promise.resolve({ success: true });
  },

  formatIDR: (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val),
};
