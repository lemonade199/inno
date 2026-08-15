import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderService.getOrderById(id || 'ORD-2026-001').then(data => {
      if (data) setOrder(data);
      else {
        setOrder({
          id: id || 'ORD-2026-001',
          customerName: 'Juli Anto',
          customerEmail: 'julianto@gmail.com',
          customerPhone: '081234567890',
          address: 'Jl. Merdeka No. 45, Jakarta Selatan',
          date: '15 Agustus 2026',
          items: [
            { id: 1, name: 'Joran Pancing Shimano SpeedMaster 210', qty: 1, price: 1250000 },
            { id: 5, name: 'Set Mata Kail Mustad Stainless', qty: 2, price: 95000 },
          ],
          subtotal: 1440000,
          shippingFee: 25000,
          total: 1465000,
          status: 'Diproses',
          paymentStatus: 'Lunas',
          paymentMethod: 'Transfer Bank BCA',
        });
      }
    });
  }, [id]);

  if (!order) return <div>Memuat detail pesanan...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/admin/orders')} className="btn btn-secondary" style={{ marginBottom: '0.75rem', padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={16} /> Kembali ke Daftar Pesanan
          </button>
          <h1 className="page-title">
            Detail Pesanan <span style={{ color: '#0f4c81' }}>#{order.id}</span>
          </h1>
          <p className="page-subtitle">Dibuat pada {order.date}</p>
        </div>

        <div>
          <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Status: {order.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Items */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="#0f4c81" /> Rincian Produk Dipesan
          </h3>

          <div className="table-container" style={{ marginBottom: '1.25rem' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Harga Satuan</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '700' }}>{item.name}</td>
                    <td>{productService.formatIDR(item.price)}</td>
                    <td style={{ fontWeight: '700' }}>{item.qty} pcs</td>
                    <td style={{ fontWeight: '800', color: '#0f4c81' }}>
                      {productService.formatIDR(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Calculation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '280px', marginLeft: 'auto', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Subtotal Produk:</span>
              <span style={{ fontWeight: '600' }}>{productService.formatIDR(order.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Ongkos Kirim:</span>
              <span style={{ fontWeight: '600' }}>{productService.formatIDR(order.shippingFee)}</span>
            </div>
            <hr style={{ borderColor: '#e2e8f0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '800', color: '#0f4c81' }}>
              <span>Total Pembayaran:</span>
              <span>{productService.formatIDR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Shipping */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Customer */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#0f4c81" /> Informasi Pemesan
            </h4>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{order.customerName}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>{order.customerEmail}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>No. HP: {order.customerPhone}</div>
          </div>

          {/* Address */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#0f4c81" /> Alamat Pengiriman
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
              {order.address}
            </p>
          </div>

          {/* Payment */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="#0f4c81" /> Informasi Pembayaran
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem' }}>Metode:</span>
              <span className="badge badge-info">{order.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Status Bayar:</span>
              <span className="badge badge-success">{order.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
