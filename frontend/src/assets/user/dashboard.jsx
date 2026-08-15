import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Data sementara user
  const user = {
    name: "Juli Anto",
    email: "julianto@gmail.com",
  };

  // Data ringkasan
  const summary = {
    totalPesanan: 5,
    pesananDiproses: 2,
    pesananSelesai: 3,
  };

  return (
    <div>
      {/* Header */}
      <header>
        <h1>Berkah Pancing</h1>
        <p>Dashboard User</p>
      </header>

      <hr />

      {/* Informasi User */}
      <section>
        <h2>Selamat Datang, {user.name}</h2>
        <p>Email: {user.email}</p>
      </section>

      <hr />

      {/* Ringkasan */}
      <section>
        <h2>Ringkasan Pesanan</h2>

        <div>
          <h3>Total Pesanan</h3>
          <p>{summary.totalPesanan}</p>
        </div>

        <div>
          <h3>Pesanan Diproses</h3>
          <p>{summary.pesananDiproses}</p>
        </div>

        <div>
          <h3>Pesanan Selesai</h3>
          <p>{summary.pesananSelesai}</p>
        </div>
      </section>

      <hr />

      {/* Menu User */}
      <section>
        <h2>Menu</h2>

        <ul>
          <li>
            <Link to="/produk">Lihat Produk</Link>
          </li>
          <li>
            <Link to="/pesanan">Pesanan Saya</Link>
          </li>
          <li>
            <Link to="/keranjang">Keranjang</Link>
          </li>
          <li>
            <Link to="/profil">Profil Saya</Link>
          </li>
        </ul>
      </section>

      <hr />

      {/* Pesanan Terbaru */}
      <section>
        <h2>Pesanan Terbaru</h2>

        <table border="1">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Tanggal</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>ORD-001</td>
              <td>15 Agustus 2026</td>
              <td>Rp150.000</td>
              <td>Diproses</td>
            </tr>

            <tr>
              <td>ORD-002</td>
              <td>14 Agustus 2026</td>
              <td>Rp275.000</td>
              <td>Selesai</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;