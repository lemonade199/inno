import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, UserCheck, Trash2 } from 'lucide-react';
import { userService } from '../../services/userService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userService.getUsers().then(setUsers);
  }, []);

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Aktif' ? 'Non-Aktif' : 'Aktif' } : u));
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={26} color="#0f4c81" /> Kelola Pengguna
          </h1>
          <p className="page-subtitle">Daftar pelanggan dan administrator toko Berkah Pancing.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.85rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Cari nama / email pengguna..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Pengguna</th>
              <th>Kontak</th>
              <th>Role</th>
              <th>Total Pesanan</th>
              <th>Tanggal Bergabung</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: '700', color: '#1e293b' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#475569' }}>{u.phone}</td>
                <td>
                  <span className={`badge ${u.role === 'Admin' ? 'badge-info' : 'badge-secondary'}`}>
                    {u.role === 'Admin' && <Shield size={12} />} {u.role}
                  </span>
                </td>
                <td style={{ fontWeight: '700', color: '#0f4c81' }}>{u.ordersCount} Pesanan</td>
                <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{u.joined}</td>
                <td>
                  <span className={`badge ${u.status === 'Aktif' ? 'badge-success' : 'badge-danger'}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    {u.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
