import React from "react";
import { Link } from "react-router-dom";

const Product = () => {
  const products = [
    {
      id: 1,
      name: "Joran Pancing Shimano",
      category: "Joran",
      price: 350000,
      stock: 10,        
      description: "Joran pancing berkualitas untuk kegiatan memancing di sungai dan danau.",
    },
    {
      id: 2,
      name: "Reel Pancing Daiwa",
      category: "Reel",
      price: 450000,
      stock: 8,
      description: "Reel pancing dengan putaran yang halus dan kuat.",
    },
    {
      id: 3,
      name: "Senar Pancing 100m",
      category: "Senar",
      price: 75000,
      stock: 20,
      description: "Senar pancing kuat dan cocok untuk berbagai jenis ikan.",
    },
    {
      id: 4,
      name: "Mata Kail Set",
      category: "Mata Kail",
      price: 50000,
      stock: 25,
      description: "Satu set mata kail dengan berbagai ukuran.",
    },
    {
      id: 5,
      name: "Umpan Pancing Buatan",
      category: "Umpan",
      price: 85000,
      stock: 15,
      description: "Umpan buatan untuk menarik perhatian ikan.",
    },
    {
      id: 6,
      name: "Pelampung Pancing",
      category: "Aksesoris",
      price: 30000,
      stock: 30,
      description: "Pelampung pancing ringan dan mudah digunakan.",
    },
  ];

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <nav>
        <Link to="/">← Kembali ke Dashboard</Link>
      </nav>

      <h1>Daftar Produk</h1>
      <p>Temukan berbagai perlengkapan pancing di Berkah Pancing.</p>

      <hr />

      {/* Pencarian */}
      <div>
        <input
          type="text"
          placeholder="Cari produk..."
        />

        <select>
          <option value="">Semua Kategori</option>
          <option value="Joran">Joran</option>
          <option value="Reel">Reel</option>
          <option value="Senar">Senar</option>
          <option value="Mata Kail">Mata Kail</option>
          <option value="Umpan">Umpan</option>
          <option value="Aksesoris">Aksesoris</option>
        </select>
      </div>

      <br />

      {/* Daftar Produk */}
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>

            <p>
              <strong>Kategori:</strong> {product.category}
            </p>

            <p>
              <strong>Harga:</strong> {formatRupiah(product.price)}
            </p>

            <p>
              <strong>Stok:</strong> {product.stock}
            </p>

            <p>{product.description}</p>

            <button>
              Tambah ke Keranjang
            </button>

            <button>
              Lihat Detail
            </button>

            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;