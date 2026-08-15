const initialProducts = [
  {
    id: 1,
    name: 'Joran Pancing Shimano SpeedMaster 210',
    category: 'Joran',
    price: 1250000,
    stock: 15,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
    description: 'Joran pancing carbon kelas premium tahan banting cocok untuk mancing laut dan sungai.',
    createdAt: '2026-08-10',
  },
  {
    id: 2,
    name: 'Reel Pancing Daiwa BG 4000 Heavy Duty',
    category: 'Reel',
    price: 1850000,
    stock: 8,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=80',
    description: 'Reel pancing alumunium body super smooth drag system 10kg.',
    createdAt: '2026-08-11',
  },
  {
    id: 3,
    name: 'Senar Pancing Braided PE 4 Multi Color 300m',
    category: 'Senar',
    price: 185000,
    stock: 35,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    description: 'Senar pancing PE 8 strand tahan gesekan karang dan sangat kuat.',
    createdAt: '2026-08-12',
  },
  {
    id: 4,
    name: 'Umpan Lure Minnow Popper Floating 15g',
    category: 'Umpan',
    price: 65000,
    stock: 2,
    status: 'Stok Menipis',
    image: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=500&auto=format&fit=crop&q=80',
    description: 'Umpan buatan action tajam menyerupai ikan tenggiri kecil.',
    createdAt: '2026-08-13',
  },
  {
    id: 5,
    name: 'Set Mata Kail Mustad Stainless 100pcs',
    category: 'Mata Kail',
    price: 95000,
    stock: 50,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    description: 'Kail pancing tajam bebas karat ukuran 1 - 10.',
    createdAt: '2026-08-14',
  },
  {
    id: 6,
    name: 'Tas Joran Pancing Waterproof 150cm',
    category: 'Aksesoris',
    price: 240000,
    stock: 0,
    status: 'Habis',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    description: 'Tas joran busa tebal waterproof muat 4 set joran + reel.',
    createdAt: '2026-08-15',
  },
];

const initialCategories = [
  { id: 1, name: 'Joran', slug: 'joran', count: 12, status: 'Aktif' },
  { id: 2, name: 'Reel', slug: 'reel', count: 8, status: 'Aktif' },
  { id: 3, name: 'Senar', slug: 'senar', count: 15, status: 'Aktif' },
  { id: 4, name: 'Umpan', slug: 'umpan', count: 24, status: 'Aktif' },
  { id: 5, name: 'Mata Kail', slug: 'mata-kail', count: 10, status: 'Aktif' },
  { id: 6, name: 'Aksesoris', slug: 'aksesoris', count: 18, status: 'Aktif' },
];

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
