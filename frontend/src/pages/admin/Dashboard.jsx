import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  Plus,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Bell,
  CheckSquare,
  Activity,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Search,
  Download,
  Trash2,
  Filter,
  Check,
  ExternalLink,
  Layers,
  Boxes,
  BarChart3,
  CreditCard,
  Send,
  Smartphone,
  X,
  Edit3,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Store,
  Phone,
  Mail,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import { chatService } from '../../services/chatService';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // State Data
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Interactive States
  const [orderTab, setOrderTab] = useState('Semua');
  const [orderSearch, setOrderSearch] = useState('');
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [chartPeriod, setChartPeriod] = useState('7d'); // '7d' | '30d'
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);

  // Quick Restock Modal State
  const [restockModalItem, setRestockModalItem] = useState(null);
  const [restockQty, setRestockQty] = useState(10);

  // Tasks / Admin To-Do State (persisted in localStorage)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('berkah_admin_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { id: 1, text: 'Konfirmasi bukti transfer pesanan ORD-2026-003', done: false, priority: 'urgent' },
      { id: 2, text: 'Kemas & input resi paket Joran Shimano untuk Juli Anto', done: false, priority: 'urgent' },
      { id: 3, text: 'Restock Umpan Lure Minnow & Tas Joran waterproof', done: false, priority: 'medium' },
      { id: 4, text: 'Cek promo akhir pekan Berkah Pancing di banner utama', done: true, priority: 'low' },
    ];
  });
  const [newTaskInput, setNewTaskInput] = useState('');

  // Notifications / Activity Log
  const [activities, setActivities] = useState([
    { id: 1, title: 'Pesanan Baru Masuk', desc: 'ORD-2026-001 dari Juli Anto (Rp1.465.000)', time: '10 mnt lalu', type: 'order' },
    { id: 2, title: 'Peringatan Stok Kritis', desc: 'Umpan Lure Minnow Popper tersisa 2 pcs di gudang', time: '45 mnt lalu', type: 'warning' },
    { id: 3, title: 'Pembayaran Dikonfirmasi', desc: 'ORD-2026-002 via QRIS Rp1.880.000 Lunas', time: '2 jam lalu', type: 'success' },
    { id: 4, title: 'Pengiriman Kurir', desc: 'ORD-2026-004 telah diserahkan ke kurir J&T Express', time: '4 jam lalu', type: 'info' },
    { id: 5, title: 'Pelanggan Baru', desc: 'Budi Santoso mendaftarkan akun baru', time: '1 hari lalu', type: 'user' },
  ]);

  // Load All Data
  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [fetchedOrders, fetchedProducts, fetchedUsers, fetchedCategories] = await Promise.all([
        orderService.getOrders(),
        productService.getProducts(),
        userService.getUsers(),
        productService.getCategories(),
      ]);

      setOrders(fetchedOrders || []);
      setProducts(fetchedProducts || []);
      setUsers(fetchedUsers || []);
      setCategories(fetchedCategories || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      if (isRefresh) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save tasks to localStorage whenever modified
  useEffect(() => {
    localStorage.setItem('berkah_admin_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskInput.trim(),
      done: false,
      priority: 'medium',
    };
    setTasks([newTask, ...tasks]);
    setNewTaskInput('');
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Quick Order Status Change
  const handleQuickStatusChange = async (orderId, newStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    // Add activity
    setActivities(prev => [
      {
        id: Date.now(),
        title: 'Status Pesanan Diperbarui',
        desc: `Pesanan ${orderId} diubah menjadi "${newStatus}"`,
        time: 'Baru saja',
        type: 'info'
      },
      ...prev.slice(0, 7)
    ]);
  };

  // Quick Restock Execution
  const executeRestock = async () => {
    if (!restockModalItem || restockQty <= 0) return;
    const newStock = Number(restockModalItem.stock) + Number(restockQty);
    await productService.updateProduct(restockModalItem.id, { stock: newStock });
    setProducts(prev => prev.map(p => p.id === restockModalItem.id ? { ...p, stock: newStock, status: newStock > 5 ? 'Tersedia' : 'Stok Menipis' } : p));
    setActivities(prev => [
      {
        id: Date.now(),
        title: 'Stok Ditambahkan',
        desc: `+${restockQty} unit untuk "${restockModalItem.name}" (Total: ${newStock})`,
        time: 'Baru saja',
        type: 'success'
      },
      ...prev.slice(0, 7)
    ]);
    setRestockModalItem(null);
    setRestockQty(10);
  };

  // Calculated Real-time Analytics & KPIs
  const stats = useMemo(() => {
    const totalOrders = orders.length;

    // Omzet calculations
    const verifiedRevenue = orders
      .filter(o => o.status === 'Selesai' || o.paymentStatus === 'Lunas')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const pendingRevenue = orders
      .filter(o => o.status === 'Menunggu Pembayaran' || o.paymentStatus === 'Belum Bayar')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const totalPotentialRevenue = verifiedRevenue + pendingRevenue;

    // Order status counts
    const pendingCount = orders.filter(o => o.status === 'Menunggu Pembayaran').length;
    const processingCount = orders.filter(o => o.status === 'Diproses').length;
    const shippingCount = orders.filter(o => o.status === 'Dikirim').length;
    const completedCount = orders.filter(o => o.status === 'Selesai').length;

    // Stock analytics
    const totalStockUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const totalStockValuation = products.reduce((sum, p) => sum + ((Number(p.stock) || 0) * (Number(p.price) || 0)), 0);
    const outOfStockProducts = products.filter(p => Number(p.stock) <= 0);
    const lowStockProducts = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5);
    const criticalProducts = [...outOfStockProducts, ...lowStockProducts];

    // Average Order Value (AOV)
    const aov = totalOrders > 0 ? verifiedRevenue / (completedCount + processingCount || 1) : 0;

    // User metrics
    const totalAnglers = users.length;

    return {
      verifiedRevenue,
      pendingRevenue,
      totalPotentialRevenue,
      totalOrders,
      pendingCount,
      processingCount,
      shippingCount,
      completedCount,
      totalProducts: products.length,
      totalStockUnits,
      totalStockValuation,
      outOfStockCount: outOfStockProducts.length,
      lowStockCount: lowStockProducts.length,
      criticalProducts,
      aov,
      totalAnglers,
    };
  }, [orders, products, users]);

  // Dynamic Chart Points (7 Days vs 30 Days)
  const chartData = useMemo(() => {
    const days7 = [
      { label: 'Senin', short: 'Sen', revenue: 1450000, orders: 3 },
      { label: 'Selasa', short: 'Sel', revenue: 2180000, orders: 5 },
      { label: 'Rabu', short: 'Rab', revenue: 1890000, orders: 4 },
      { label: 'Kamis', short: 'Kam', revenue: 3120000, orders: 7 },
      { label: 'Jumat', short: 'Jum', revenue: 2750000, orders: 6 },
      { label: 'Sabtu', short: 'Sab', revenue: 4680000, orders: 11 },
      { label: 'Minggu', short: 'Min', revenue: 5240000, orders: 13 },
    ];

    const days30 = [
      { label: 'Mgg 1 (1-7)', short: 'W1', revenue: 12400000, orders: 28 },
      { label: 'Mgg 2 (8-14)', short: 'W2', revenue: 15800000, orders: 35 },
      { label: 'Mgg 3 (15-21)', short: 'W3', revenue: 18200000, orders: 42 },
      { label: 'Mgg 4 (22-28)', short: 'W4', revenue: 21300000, orders: 49 },
    ];

    const points = chartPeriod === '7d' ? days7 : days30;
    const maxVal = Math.max(...points.map(p => chartMetric === 'revenue' ? p.revenue : p.orders));

    return {
      points,
      maxVal: maxVal > 0 ? maxVal : 1,
      totalRev: points.reduce((acc, p) => acc + p.revenue, 0),
      totalOrd: points.reduce((acc, p) => acc + p.orders, 0),
    };
  }, [chartPeriod, chartMetric]);

  // Best Sellers Calculation
  const bestSellers = useMemo(() => {
    // Map existing products with realistic simulated order volume
    return products.slice(0, 5).map((prod, idx) => {
      const soldUnits = [48, 36, 29, 22, 18][idx] || (5 - idx) * 4;
      const totalSales = soldUnits * Number(prod.price);
      return {
        ...prod,
        soldUnits,
        totalSales,
        ranking: idx + 1,
      };
    });
  }, [products]);

  // Category Contribution Analytics
  const categoryStats = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const categoriesList = [
      { name: 'Joran', share: 38, count: counts['Joran'] || 6, revenue: 16500000, color: '#0f4c81' },
      { name: 'Reel', share: 28, count: counts['Reel'] || 4, revenue: 12800000, color: '#00a896' },
      { name: 'Senar', share: 16, count: counts['Senar'] || 5, revenue: 4200000, color: '#0284c7' },
      { name: 'Umpan', share: 10, count: counts['Umpan'] || 7, revenue: 2400000, color: '#f59e0b' },
      { name: 'Aksesoris & Kail', share: 8, count: (counts['Mata Kail'] || 2) + (counts['Aksesoris'] || 2), revenue: 1850000, color: '#64748b' },
    ];

    return categoriesList;
  }, [products]);

  // Payment Methods Breakdown
  const paymentMethods = useMemo(() => {
    return [
      { name: 'QRIS / E-Wallet', share: '45%', count: 18, icon: Smartphone, color: '#00a896' },
      { name: 'Transfer BCA', share: '32%', count: 12, icon: CreditCard, color: '#0f4c81' },
      { name: 'COD (Bayar di Tempat)', share: '15%', count: 6, icon: Truck, color: '#f59e0b' },
      { name: 'Transfer Mandiri', share: '8%', count: 3, icon: DollarSign, color: '#64748b' },
    ];
  }, []);

  // Filtered Orders for Table
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchTab = orderTab === 'Semua' ? true : order.status === orderTab;
      const q = orderSearch.toLowerCase().trim();
      const matchSearch = !q ||
        order.id.toLowerCase().includes(q) ||
        (order.customerName && order.customerName.toLowerCase().includes(q)) ||
        (order.items && order.items.some(it => it.name.toLowerCase().includes(q)));
      return matchTab && matchSearch;
    });
  }, [orders, orderTab, orderSearch]);

  // Export CSV Handler
  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      alert('Tidak ada data pesanan untuk diekspor.');
      return;
    }
    const headers = ['ID Pesanan', 'Tanggal', 'Nama Pelanggan', 'Email', 'No Telepon', 'Metode Bayar', 'Status Bayar', 'Status Pesanan', 'Total Belanja'];
    const rows = orders.map(o => [
      o.id,
      `"${o.date || ''}"`,
      `"${o.customerName || ''}"`,
      `"${o.customerEmail || ''}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.paymentMethod || ''}"`,
      `"${o.paymentStatus || ''}"`,
      `"${o.status || ''}"`,
      o.total || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap-pesanan-berkahpancing-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper Badge Renderers
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: '700' }}>
            <CheckCircle2 size={13} /> Selesai
          </span>
        );
      case 'Diproses':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: '700' }}>
            <Clock size={13} /> Diproses
          </span>
        );
      case 'Dikirim':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: '700' }}>
            <Truck size={13} /> Dikirim
          </span>
        );
      case 'Menunggu Pembayaran':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: '700' }}>
            <AlertCircle size={13} /> Butuh Bayar
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: '700' }}>
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status) => {
    const isLunas = status === 'Lunas';
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: isLunas ? '#f0fdf4' : '#fffbeb',
        color: isLunas ? '#166534' : '#9a3412',
        border: `1px solid ${isLunas ? '#bbf7d0' : '#fed7aa'}`,
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '0.72rem',
        fontWeight: '700'
      }}>
        {isLunas ? <Check size={11} /> : <Clock size={11} />} {status || 'Belum Bayar'}
      </span>
    );
  };

  // Live Date / Time formatting
  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. TOP HEADER & OPERATIONAL PULSE */}
      <div style={{
        background: 'linear-gradient(135deg, #0b192c 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        color: '#ffffff',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        {/* Subtle Decorative Ambient Lighting */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(0, 168, 150, 0.22) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50%',
          left: '20%',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(15, 76, 129, 0.3) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '3px 10px',
              borderRadius: '100px',
              fontSize: '0.74rem',
              fontWeight: '700',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px #34d399' }} />
              Toko Buka & Operasional Normal
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              padding: '3px 10px',
              borderRadius: '100px',
              fontSize: '0.74rem',
              fontWeight: '600',
            }}>
              <Calendar size={12} /> {todayStr}
            </span>
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: '800', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Pusat Kontrol & Dashboard Admin
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, maxWidth: '620px' }}>
            Ringkasan data real-time: penjualan, inventaris gudang, pesanan butuh tindakan, dan performa katalog produk Berkah Pancing.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.84rem',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(6px)',
              transition: 'var(--transition)',
            }}
            title="Muat ulang data terbaru"
          >
            <RefreshCw size={15} className={refreshing ? 'spin-animation' : ''} />
            {refreshing ? 'Memperbarui...' : 'Segarkan Data'}
          </button>

          <button
            onClick={exportOrdersCSV}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(6px)',
              transition: 'var(--transition)',
            }}
            title="Download file rekap CSV pesanan"
          >
            <Download size={15} /> Rekap CSV
          </button>

          <button
            onClick={() => navigate('/admin/chat')}
            style={{
              background: '#ee4d2d',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              boxShadow: '0 4px 14px rgba(238, 77, 45, 0.4)',
              transition: 'var(--transition)',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <MessageSquare size={16} /> Live Chat Pelanggan
          </button>

          <button
            onClick={() => navigate('/admin/products/create')}
            style={{
              background: 'linear-gradient(135deg, #00a896, #0284c7)',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              boxShadow: '0 4px 14px rgba(0, 168, 150, 0.35)',
              transition: 'var(--transition)',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={16} /> Tambah Produk
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE 6-KPI GRID (Comprehensive Essential Metrics) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        
        {/* KPI 1: Total Revenue (Omzet) */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Omzet Lunas
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f4c81', margin: '0.2rem 0 0.1rem 0' }}>
                {productService.formatIDR(stats.verifiedRevenue)}
              </h2>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: '#16a34a', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <ArrowUpRight size={13} /> +14.2% bln lalu
            </span>
            <span style={{ color: '#94a3b8' }}>
              Pending: {productService.formatIDR(stats.pendingRevenue)}
            </span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Transaksi
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', margin: '0.2rem 0 0.1rem 0' }}>
                {stats.totalOrders} Pesanan
              </h2>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: '#16a34a', fontWeight: '700' }}>
              {stats.completedCount} Selesai / Lunas
            </span>
            <span style={{ color: '#94a3b8' }}>
              {stats.shippingCount} Dalam Kurir
            </span>
          </div>
        </div>

        {/* KPI 3: Action Required (Pending + Processing) */}
        <div style={{
          background: stats.pendingCount + stats.processingCount > 0 ? '#fffdf7' : '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.25rem',
          border: stats.pendingCount + stats.processingCount > 0 ? '1px solid #fde68a' : '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Perlu Tindakan
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b45309', margin: '0.2rem 0 0.1rem 0' }}>
                {stats.pendingCount + stats.processingCount} Pesanan
              </h2>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #fef08a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: '#dc2626', fontWeight: '700' }}>
              {stats.pendingCount} Menunggu Bayar
            </span>
            <span style={{ color: '#0284c7', fontWeight: '700' }}>
              {stats.processingCount} Siap Dikirim
            </span>
          </div>
        </div>

        {/* KPI 4: Inventory & Asset Valuation */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Katalog & Valuasi Stok
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', margin: '0.2rem 0 0.1rem 0' }}>
                {stats.totalProducts} Produk
              </h2>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: '#475569', fontWeight: '600' }}>
              {stats.totalStockUnits} Unit Fisik
            </span>
            <span style={{ color: '#0f4c81', fontWeight: '700' }}>
              {productService.formatIDR(stats.totalStockValuation)}
            </span>
          </div>
        </div>

        {/* KPI 5: Critical Inventory / Restock Alerts */}
        <div style={{
          background: stats.criticalProducts.length > 0 ? '#fff8f8' : '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.25rem',
          border: stats.criticalProducts.length > 0 ? '1px solid #fecaca' : '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Stok Kritis / Habis
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#dc2626', margin: '0.2rem 0 0.1rem 0' }}>
                {stats.criticalProducts.length} Item
              </h2>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: '#b91c1c', fontWeight: '700' }}>
              {stats.outOfStockCount} Habis (0)
            </span>
            <span style={{ color: '#d97706', fontWeight: '700' }}>
              {stats.lowStockCount} Menipis (≤5)
            </span>
          </div>
        </div>

        {/* KPI 6: Customers & Average Order Value */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pelanggan & Rata-rata Order
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', margin: '0.2rem 0 0.1rem 0' }}>
                {stats.totalAnglers} Angler
              </h2>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748b' }}>
              AOV: <strong style={{ color: '#0f4c81' }}>{productService.formatIDR(stats.aov)}</strong>
            </span>
            <span style={{ color: '#16a34a', fontWeight: '700' }}>
              100% Aktif
            </span>
          </div>
        </div>

      </div>

      {/* 3. ORDER STATUS ACTION HUB (Quick Status Tracker & Filter Cards) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#0f4c81" /> Status Alur Pesanan (Quick Tracker)
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Klik salah satu status untuk langsung menyaring daftar pesanan di bawah ini.
            </p>
          </div>
          {orderTab !== 'Semua' && (
            <button
              onClick={() => setOrderTab('Semua')}
              style={{
                background: '#f1f5f9',
                border: 'none',
                color: '#475569',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <X size={12} /> Reset Filter ({orderTab})
            </button>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {/* Status 1: Menunggu Bayar */}
          <div
            onClick={() => setOrderTab(orderTab === 'Menunggu Pembayaran' ? 'Semua' : 'Menunggu Pembayaran')}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: orderTab === 'Menunggu Pembayaran' ? '#fee2e2' : '#fff5f5',
              border: `1.5px solid ${orderTab === 'Menunggu Pembayaran' ? '#dc2626' : '#fecaca'}`,
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#991b1b', textTransform: 'uppercase' }}>
                1. Butuh Bayar
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#7f1d1d', margin: '2px 0' }}>
                {stats.pendingCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#b91c1c' }}>
                Verifikasi Bukti Transfer
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>

          {/* Status 2: Diproses */}
          <div
            onClick={() => setOrderTab(orderTab === 'Diproses' ? 'Semua' : 'Diproses')}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: orderTab === 'Diproses' ? '#e0f2fe' : '#f0f9ff',
              border: `1.5px solid ${orderTab === 'Diproses' ? '#0284c7' : '#bae6fd'}`,
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#075985', textTransform: 'uppercase' }}>
                2. Perlu Diproses
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0369a1', margin: '2px 0' }}>
                {stats.processingCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>
                Kemas & Siapkan Barang
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} />
            </div>
          </div>

          {/* Status 3: Sedang Dikirim */}
          <div
            onClick={() => setOrderTab(orderTab === 'Dikirim' ? 'Semua' : 'Dikirim')}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: orderTab === 'Dikirim' ? '#fef3c7' : '#fffbeb',
              border: `1.5px solid ${orderTab === 'Dikirim' ? '#d97706' : '#fde68a'}`,
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#92400e', textTransform: 'uppercase' }}>
                3. Sedang Dikirim
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b45309', margin: '2px 0' }}>
                {stats.shippingCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#d97706' }}>
                Dalam Perjalanan Kurir
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} />
            </div>
          </div>

          {/* Status 4: Selesai */}
          <div
            onClick={() => setOrderTab(orderTab === 'Selesai' ? 'Semua' : 'Selesai')}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: orderTab === 'Selesai' ? '#dcfce7' : '#f0fdf4',
              border: `1.5px solid ${orderTab === 'Selesai' ? '#16a34a' : '#bbf7d0'}`,
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>
                4. Selesai / Lunas
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#15803d', margin: '2px 0' }}>
                {stats.completedCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>
                Sukses Diterima Angler
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>

        </div>
      </div>

      {/* 4. ANALYTICS & VISUAL INSIGHTS (Dual Cards: Sales Trend + Category Breakdown) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
        gap: '1.5rem',
      }}>
        
        {/* Left: Interactive Sales Trend Visualizer */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Chart Controls & Titles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#0f4c81" /> Tren Penjualan & Transaksi
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {chartPeriod === '7d' ? 'Pergerakan 7 hari terakhir' : 'Pergerakan bulanan (4 minggu)'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Metric Toggle */}
              <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                <button
                  onClick={() => setChartMetric('revenue')}
                  style={{
                    border: 'none',
                    background: chartMetric === 'revenue' ? '#ffffff' : 'transparent',
                    color: chartMetric === 'revenue' ? '#0f4c81' : '#64748b',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    boxShadow: chartMetric === 'revenue' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Omzet (Rp)
                </button>
                <button
                  onClick={() => setChartMetric('orders')}
                  style={{
                    border: 'none',
                    background: chartMetric === 'orders' ? '#ffffff' : 'transparent',
                    color: chartMetric === 'orders' ? '#00a896' : '#64748b',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    boxShadow: chartMetric === 'orders' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Pesanan (Qty)
                </button>
              </div>

              {/* Period Switcher */}
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.76rem',
                  fontWeight: '600',
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                <option value="7d">7 Hari Terakhir</option>
                <option value="30d">30 Hari (4 Minggu)</option>
              </select>
            </div>
          </div>

          {/* Quick Summary Pill above Chart */}
          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Total Periode Ini</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f4c81' }}>
                {chartMetric === 'revenue' ? productService.formatIDR(chartData.totalRev) : `${chartData.totalOrd} Pesanan`}
              </strong>
            </div>
            <div style={{ width: '1px', background: '#e2e8f0' }} />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Rata-rata Harian</span>
              <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                {chartMetric === 'revenue' 
                  ? productService.formatIDR(Math.round(chartData.totalRev / chartData.points.length)) 
                  : `${(chartData.totalOrd / chartData.points.length).toFixed(1)} / hari`}
              </strong>
            </div>
            <div style={{ width: '1px', background: '#e2e8f0' }} />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Puncak Tertinggi</span>
              <strong style={{ fontSize: '0.95rem', color: '#16a34a' }}>
                {chartMetric === 'revenue' ? productService.formatIDR(chartData.maxVal) : `${chartData.maxVal} Pesanan`}
              </strong>
            </div>
          </div>

          {/* SVG Area / Line Chart */}
          <div style={{ width: '100%', height: '220px', position: 'relative', marginTop: '0.5rem' }}>
            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="dashboardChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartMetric === 'revenue' ? '#0f4c81' : '#00a896'} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={chartMetric === 'revenue' ? '#0f4c81' : '#00a896'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="30" x2="100%" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="85" x2="100%" y2="85" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="100%" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="190" x2="100%" y2="190" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Dynamic Path Construction */}
              {(() => {
                const points = chartData.points;
                const count = points.length;
                const max = chartData.maxVal;

                const coords = points.map((p, i) => {
                  const val = chartMetric === 'revenue' ? p.revenue : p.orders;
                  const xPct = count > 1 ? (i / (count - 1)) * 92 + 4 : 50;
                  const yVal = 185 - (val / max) * 145;
                  return { x: `${xPct}%`, xNum: xPct, y: yVal, item: p, val };
                });

                const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
                const areaPath = `${linePath} L ${coords[coords.length - 1].x} 190 L ${coords[0].x} 190 Z`;
                const themeColor = chartMetric === 'revenue' ? '#0f4c81' : '#00a896';

                return (
                  <>
                    <path d={areaPath} fill="url(#dashboardChartGrad)" />
                    <path d={linePath} fill="none" stroke={themeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {coords.map((c, i) => (
                      <g key={i}>
                        {/* Hover bar detector */}
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r={hoveredChartPoint === i ? '7' : '5'}
                          fill="#ffffff"
                          stroke={themeColor}
                          strokeWidth="3"
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          onMouseOver={() => setHoveredChartPoint(i)}
                          onMouseOut={() => setHoveredChartPoint(null)}
                        />

                        {/* X-axis Label */}
                        <text x={c.x} y="210" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="600">
                          {c.item.short}
                        </text>

                        {/* Interactive Tooltip on Hover */}
                        {hoveredChartPoint === i && (
                          <foreignObject
                            x={`calc(${c.x} - 70px)`}
                            y={Math.max(0, c.y - 52)}
                            width="140"
                            height="50"
                          >
                            <div style={{
                              background: '#1e293b',
                              color: '#ffffff',
                              padding: '5px 8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              textAlign: 'center',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              pointerEvents: 'none'
                            }}>
                              <div style={{ fontWeight: '600', color: '#94a3b8', fontSize: '0.68rem' }}>{c.item.label}</div>
                              <div style={{ fontWeight: '800', color: '#38bdf8' }}>
                                {chartMetric === 'revenue' ? productService.formatIDR(c.val) : `${c.val} Pesanan`}
                              </div>
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Right: Category Distribution & Payment Shares */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} color="#00a896" /> Kontribusi Penjualan Kategori
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>Berdasarkan volume penjualan & omzet</p>
              </div>
              <Link to="/admin/categories" style={{ fontSize: '0.75rem', color: '#0f4c81', fontWeight: '700', textDecoration: 'none' }}>
                Kategori →
              </Link>
            </div>

            {/* Category Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {categoryStats.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                      {cat.name} ({cat.count} item)
                    </span>
                    <span>
                      <strong style={{ color: cat.color }}>{cat.share}%</strong>
                      <span style={{ color: '#94a3b8', fontWeight: '500', marginLeft: '6px', fontSize: '0.74rem' }}>({productService.formatIDR(cat.revenue)})</span>
                    </span>
                  </div>
                  <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${cat.share}%`, height: '100%', background: cat.color, borderRadius: '4px', transition: 'width 0.8s ease-in-out' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Quick Share */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Metode Pembayaran Pilihan Angler
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {paymentMethods.map((pm, idx) => {
                const IconComponent = pm.icon;
                return (
                  <div key={idx} style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: pm.color }}><IconComponent size={16} /></div>
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#1e293b' }}>{pm.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{pm.share} ({pm.count}x trx)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* 5. MAIN OPERATIONAL GRID (Orders Feed on Left, Critical Modules on Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.1fr)',
        gap: '1.5rem',
      }}>
        
        {/* LEFT COLUMN: LIVE RECENT TRANSACTIONS TABLE */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Header & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} color="#0f4c81" /> Transaksi & Pesanan Masuk
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Kelola status pembayaran, pengemasan, dan pengiriman pesanan
              </p>
            </div>

            <Link
              to="/admin/orders"
              style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                color: '#0f4c81',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
              }}
            >
              Semua Pesanan ({orders.length}) <ChevronRight size={16} />
            </Link>
          </div>

          {/* Search Bar and Sub-filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari ID Pesanan, nama pembeli, atau item..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem 0.55rem 2.25rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              {orderSearch && (
                <button
                  onClick={() => setOrderSearch('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Filter Chips */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
              {['Semua', 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'].map((tab) => {
                const isSelected = orderTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setOrderTab(tab)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      border: isSelected ? '1px solid #0f4c81' : '1px solid #e2e8f0',
                      background: isSelected ? '#0f4c81' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tab === 'Menunggu Pembayaran' ? 'Butuh Bayar' : tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.88rem' }}>
              <RefreshCw size={24} className="spin-animation" style={{ margin: '0 auto 0.5rem auto', color: '#0f4c81' }} />
              Memuat data transaksi...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <ShoppingBag size={36} color="#94a3b8" style={{ margin: '0 auto 0.5rem auto' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569', margin: '0 0 4px 0' }}>Tidak ada transaksi yang cocok</p>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Coba ubah kata kunci pencarian atau ganti filter status di atas.</span>
            </div>
          ) : (
            <div className="table-container" style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#64748b', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    <th style={{ padding: '10px 12px' }}>ID & Tanggal</th>
                    <th style={{ padding: '10px 12px' }}>Pelanggan</th>
                    <th style={{ padding: '10px 12px' }}>Barang Belanja</th>
                    <th style={{ padding: '10px 12px' }}>Total & Bayar</th>
                    <th style={{ padding: '10px 12px' }}>Status Pesanan</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 8).map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }} className="table-row-hover">
                      
                      {/* ID & Date */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '800', color: '#0f4c81', fontSize: '0.85rem' }}>{order.id}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                          <Clock size={11} /> {order.date}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
                            color: '#0369a1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            flexShrink: 0,
                          }}>
                            {order.customerName ? order.customerName.charAt(0) : 'A'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.82rem' }}>{order.customerName}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{order.customerPhone || order.customerEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td style={{ padding: '12px', maxWidth: '210px' }}>
                        {order.items && order.items.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {order.items[0].image && (
                              <img
                                src={order.items[0].image}
                                alt="item"
                                style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                              />
                            )}
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <span style={{ fontWeight: '600', color: '#334155', fontSize: '0.78rem' }}>
                                {order.items[0].name}
                              </span>
                              {order.items.length > 1 && (
                                <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: '700', marginLeft: '4px' }}>
                                  +{order.items.length - 1} item lainnya
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>-</span>
                        )}
                      </td>

                      {/* Total & Payment */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.85rem' }}>
                          {productService.formatIDR(order.total)}
                        </div>
                        <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {getPaymentBadge(order.paymentStatus)}
                        </div>
                      </td>

                      {/* Order Status Badge & Quick Dropdown */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {getOrderStatusBadge(order.status)}
                          
                          {/* Quick Status Select */}
                          <select
                            value={order.status}
                            onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                            style={{
                              padding: '2px 4px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              background: '#ffffff',
                              fontSize: '0.68rem',
                              color: '#475569',
                              fontWeight: '600',
                              cursor: 'pointer',
                              marginTop: '2px',
                            }}
                          >
                            <option value="Menunggu Pembayaran">Menunggu Bayar</option>
                            <option value="Diproses">Diproses (Siap Kirim)</option>
                            <option value="Dikirim">Sedang Dikirim</option>
                            <option value="Selesai">Selesai / Lunas</option>
                          </select>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                            style={{
                              background: '#f1f5f9',
                              border: 'none',
                              color: '#0f4c81',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: '700',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            title="Buka detail lengkap pesanan"
                          >
                            <Eye size={13} /> Detail
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredOrders.length > 8 && (
            <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
              <Link to="/admin/orders" style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f4c81', textDecoration: 'none' }}>
                Lihat Semua {filteredOrders.length} Pesanan →
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 3 ESSENTIAL ADMIN OPERATIONAL PANELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Panel 1: Critical Stock / Restock Action Watchlist */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.35rem',
            border: stats.criticalProducts.length > 0 ? '1px solid #fecaca' : '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#dc2626', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={17} color="#dc2626" /> Peringatan Stok Kritis
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Item persediaan menipis (≤5) atau habis</span>
              </div>
              <span style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '2px 8px',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: '800',
              }}>
                {stats.criticalProducts.length} Produk
              </span>
            </div>

            {stats.criticalProducts.length === 0 ? (
              <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '10px', textAlign: 'center', color: '#15803d', fontSize: '0.78rem', fontWeight: '600' }}>
                <CheckCircle2 size={20} style={{ margin: '0 auto 4px auto' }} />
                Semua stok produk dalam kondisi aman & melimpah!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {stats.criticalProducts.slice(0, 4).map((prod) => {
                  const isOut = Number(prod.stock) <= 0;
                  return (
                    <div
                      key={prod.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        background: isOut ? '#fef2f2' : '#fffbeb',
                        border: `1px solid ${isOut ? '#fee2e2' : '#fef3c7'}`,
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{ width: '34px', height: '34px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                        />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: isOut ? '#dc2626' : '#d97706', fontWeight: '700' }}>
                            {isOut ? 'Habis (0 Pcs)' : `Tersisa ${prod.stock} Pcs`} • {prod.category}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setRestockModalItem(prod);
                          setRestockQty(10);
                        }}
                        style={{
                          background: isOut ? '#dc2626' : '#d97706',
                          color: '#ffffff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        + Restock
                      </button>
                    </div>
                  );
                })}

                {stats.criticalProducts.length > 4 && (
                  <Link to="/admin/products" style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#dc2626', textDecoration: 'none', marginTop: '2px' }}>
                    Lihat Semua {stats.criticalProducts.length} Produk Kritis →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Panel 2: Top 5 Best Selling Products */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.35rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={17} color="#00a896" /> Produk Terlaris (Top Performers)
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Item dengan perputaran penjualan tercepat</span>
              </div>
              <Link to="/admin/products" style={{ fontSize: '0.74rem', fontWeight: '700', color: '#0f4c81', textDecoration: 'none' }}>
                Katalog →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {bestSellers.map((prod) => (
                <div key={prod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    {/* Rank Badge */}
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: prod.ranking === 1 ? '#fef3c7' : prod.ranking === 2 ? '#e2e8f0' : prod.ranking === 3 ? '#fed7aa' : '#f1f5f9',
                      color: prod.ranking === 1 ? '#b45309' : prod.ranking === 2 ? '#475569' : prod.ranking === 3 ? '#c2410c' : '#64748b',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {prod.ranking}
                    </span>

                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                    />

                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {productService.formatIDR(prod.price)} • Stok: {prod.stock}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#00a896', display: 'block' }}>
                      {prod.soldUnits} Terjual
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      {productService.formatIDR(prod.totalSales)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 3: Interactive Admin To-Do Checklist & Activity Log */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.35rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckSquare size={17} color="#0f4c81" /> Catatan Tugas Harian Admin
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {tasks.filter(t => t.done).length} dari {tasks.length} tugas selesai
                </span>
              </div>
            </div>

            {/* Add Task Input */}
            <form onSubmit={addTask} style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="Tulis tugas baru lalu tekan Enter..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.76rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#0f4c81',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0 10px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                }}
              >
                + Tambah
              </button>
            </form>

            {/* Task Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    background: task.done ? '#f8fafc' : '#ffffff',
                    border: `1px solid ${task.done ? '#f1f5f9' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => {}}
                      style={{ cursor: 'pointer', accentColor: '#00a896' }}
                    />
                    <span style={{
                      fontSize: '0.76rem',
                      fontWeight: task.done ? '500' : '600',
                      color: task.done ? '#94a3b8' : '#334155',
                      textDecoration: task.done ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {task.text}
                    </span>
                  </div>

                  <button
                    onClick={(e) => deleteTask(task.id, e)}
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '2px' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
                    title="Hapus tugas"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Activity Log Accordion / List */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                <Bell size={14} color="#f59e0b" /> Riwayat & Audit Aktivitas Toko
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {activities.slice(0, 4).map((act) => (
                  <div key={act.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: act.type === 'warning' ? '#ef4444' : act.type === 'success' ? '#10b981' : act.type === 'order' ? '#0284c7' : '#64748b',
                      marginTop: '5px',
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#1e293b', lineHeight: 1.2 }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>
                        {act.desc}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {act.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 6. MODAL QUICK RESTOCK POPUP */}
      {restockModalItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '440px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="#0f4c81" /> Tambah Stok Cepat
              </h3>
              <button
                onClick={() => setRestockModalItem(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', marginBottom: '1.25rem' }}>
              <img
                src={restockModalItem.image}
                alt={restockModalItem.name}
                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{restockModalItem.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Stok Sekarang: <strong style={{ color: restockModalItem.stock <= 0 ? '#dc2626' : '#d97706' }}>{restockModalItem.stock} pcs</strong>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Jumlah Stok Tambahan yang Masuk:
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '1rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    color: '#0f4c81',
                  }}
                />
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[5, 10, 25, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRestockQty(num)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        background: restockQty === num ? '#0f4c81' : '#f1f5f9',
                        color: restockQty === num ? '#ffffff' : '#334155',
                        fontWeight: '700',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Total stok setelah penambahan: <strong>{Number(restockModalItem.stock) + Number(restockQty)} pcs</strong>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setRestockModalItem(null)}
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeRestock}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00a896, #0284c7)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 168, 150, 0.3)',
                }}
              >
                Konfirmasi Tambah Stok
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
