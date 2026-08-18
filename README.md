<div align="center">

  <img src="frontend/public/logo.png" alt="Berkah Pancing Logo" width="120" height="120" style="border-radius: 50%; object-fit: contain;" />

  # 🎣 BERKAH PANCING E-COMMERCE PLATFORM
  **Solusi Terlengkap Kebutuhan Pakan Ternak, Pelet Ikan, Umpan Racikan & Piranti Pancing Indonesia**

  [![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
  [![Midtrans](https://img.shields.io/badge/Payment-Midtrans_Snap-002855?style=for-the-badge&logo=mastercard&logoColor=white)](https://midtrans.com)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  <p align="center">
    <a href="#-tentang-proyek">Tentang Proyek</a> •
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-teknologi--stack">Teknologi</a> •
    <a href="#-struktur-direktori">Struktur Direktori</a> •
    <a href="#-panduan-instalasi">Instalasi & Menjalankan</a> •
    <a href="#-akun-demo">Akun Demo</a> •
    <a href="#-kontribusi--lisensi">Lisensi</a>
  </p>

</div>

---

## 📖 Tentang Proyek

**Berkah Pancing** adalah platform e-commerce terintegrasi dan modern yang dirancang khusus untuk memenuhi kebutuhan peternak unggas, pembudidaya ikan, serta pemancing profesional di seluruh Indonesia. 

Dibangun dengan arsitektur **Decoupled (Headless API)** menggunakan backend **Laravel** yang tangguh dan frontend **React + Vite** yang responsif, cepat, serta mobile-friendly dengan mengadopsi standar pengalaman belanja terdepan (*Shopee / Tokopedia inspired UI/UX*).

---

## ✨ Fitur Utama

### 🛍️ 1. Customer & Pembeli Portal
- 🔍 **Pencarian Cerdas & Cepat**: Auto-suggest, histori pencarian lokal, filter kategori, dan sortir harga/terbaru.
- 📦 **Katalog Produk Lengkap**: Galeri foto dinamis, stok real-time, badge kategori, dan detail spesifikasi produk.
- 🛒 **Keranjang Belanja Interaktif**: 
  - Multi-select checkbox produk per item.
  - Stepper kuantitas responsif dengan validasi batas stok.
  - Perhitungan subtotal dan total harga real-time.
  - Tampilan *seamless* edge-to-edge khusus perangkat mobile.
- 💳 **Checkout & Pembayaran Terintegrasi (Midtrans)**:
  - Integrasi Midtrans Snap (Virtual Account, QRIS, GoPay, ShopeePay, Kartu Kredit).
  - Pilihan metode pengiriman (Reguler, Kargo, Sameday).
- 👤 **Manajemen Profil & Alamat Pelanggan**:
  - Unggah foto profil dengan fitur **Interactive Image Cropper** dan inisial avatar otomatis.
  - Buku alamat pengiriman dengan integrasi cascading wilayah (Provinsi, Kota/Kabupaten, Kecamatan, Kode Pos).
- ⭐ **Ulasan & Rating Produk**: Penilaian bintang 1–5, ulasan teks pembeli terverifikasi, dan galeri foto ulasan.
- 💬 **Live Chat Customer Service**: Komunikasi langsung dengan admin toko secara real-time.

---

### 🛡️ 2. Admin Management Dashboard
- 📊 **Dashboard Analitik & KPI**:
  - Statistik ringkasan pendapatan harian/bulanan.
  - Total transaksi, jumlah produk aktif, dan status pesanan baru.
- 🗂️ **CRUD Manajemen Kategori**:
  - Tambah, ubah, dan hapus kategori produk.
  - Visual selector icon kategori dan penghitungan otomatis jumlah produk per kategori.
- 📦 **CRUD Manajemen Produk**:
  - Manajemen katalog, upload foto produk, penetapan harga, bobot pengiriman, dan kontrol stok.
- 📑 **Manajemen Pesanan & Transaksi**:
  - Pemantauan status pesanan (*Menunggu Pembayaran, Diproses, Dikirim, Selesai, Dibatalkan*).
  - Update nomor resi pengiriman (*Tracking Number*).
- 💬 **Helpdesk & Chat Inbox**:
  - Pusat layanan pesan pelanggan dengan notifikasi pesan belum dibaca (*Unread Badges*).
- 🔔 **Pusat Notifikasi Toko**: Notifikasi instan untuk pesanan baru, pembayaran berhasil, dan pesan masuk.

---

## 🛠️ Teknologi & Stack

| Layer | Teknologi / Library | Kegunaan |
| :--- | :--- | :--- |
| **Backend** | [Laravel 11.x](https://laravel.com/) | RESTful API Engine, ORM Eloquent, MVC Architecture |
| **Authentication** | [Laravel Sanctum](https://laravel.com/docs/sanctum) | Secure SPA Token-Based Authentication |
| **Database** | MySQL / MariaDB | Relational Database Storage |
| **Frontend Framework** | [React 18 / 19](https://react.dev/) | Client-Side SPA Reactive Interface |
| **Build Tool** | [Vite 5 / 6](https://vitejs.dev/) | Ultra-Fast Bundler & Hot Module Replacement (HMR) |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) | Client-side Nested Routing & Protected Routes |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern, Clean & Consistent Feather-style Icons |
| **Payment Gateway**| [Midtrans Snap](https://midtrans.com/) | Gateway Pembayaran Nasional (VA, QRIS, E-Wallet) |
| **Styling** | Vanilla CSS + Design Tokens | Custom Component Styles, Dark/Light palettes, Mobile Fluid Media Queries |

---

## 📂 Struktur Direktori

```text
inno/
├── app/                        # Backend Core Logic (Laravel)
│   ├── Http/
│   │   └── Controllers/        # Auth, Product, Category, Order, Chat Controllers
│   └── Models/                 # Eloquent Models (User, Product, Category, Order, dll)
├── config/                     # Konfigurasi Laravel & Layanan Pihak Ketiga
├── database/
│   ├── migrations/             # Migrasi Database Skema Tabel
│   └── seeders/                # Seeder Data Awal (User, Category, Product)
├── routes/
│   ├── api.php                 # API Endpoint Definitions
│   └── web.php                 # Web & View Routes
│
├── frontend/                   # Frontend SPA (React + Vite)
│   ├── public/                 # Static Assets (Logo, Favicon, Brand Images)
│   └── src/
│       ├── assets/             # Gambar & Ilustrasi
│       ├── components/         # Komponen Reusable (Navbar, Sidebar, Avatar, Cropper, dll)
│       ├── context/            # Global State (AuthContext, CartContext, NotificationContext)
│       ├── layouts/            # Layout Wrapper (UserLayout, AdminLayout)
│       ├── pages/              # Halaman Aplikasi (Home, Cart, Checkout, Profile, Admin)
│       ├── services/           # Axios HTTP Clients & Data Handlers (api, product, order)
│       ├── index.css           # Global Styles & Responsive Media Queries
│       └── App.jsx             # Root Routing Router
└── README.md
```

---

## 🚀 Panduan Instalasi

Pastikan komputer Anda telah terinstal:
- **PHP >= 8.2**
- **Composer >= 2.x**
- **Node.js >= 18.x & npm**
- **MySQL / MariaDB Database Server**

### 1. Clone Repository
```bash
git clone https://github.com/lemonade199/inno.git
cd inno
```

---

### 2. Konfigurasi Backend (Laravel)

```bash
# 1. Install dependensi PHP
composer install

# 2. Salin file environment
cp .env.example .env

# 3. Generate Application Encryption Key
php artisan key:generate

# 4. Konfigurasi Database di file .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=berkah_pancing
# DB_USERNAME=root
# DB_PASSWORD=

# 5. Jalankan Migrasi & Database Seeder
php artisan migrate:fresh --seed

# 6. Buat Symlink Storage
php artisan storage:link

# 7. Jalankan Server Backend
php artisan serve
```
> Server backend akan aktif di: `http://127.0.0.1:8000`

---

### 3. Konfigurasi Frontend (React + Vite)

Buka terminal baru:

```bash
# 1. Masuk ke direktori frontend
cd frontend

# 2. Install dependensi Node.js
npm install

# 3. Jalankan Vite Development Server
npm run dev
```
> Aplikasi web akan aktif di: `http://localhost:5173`

---

## 🔐 Akun Demo untuk Pengujian

Setelah menjalankan `php artisan migrate --seed`, Anda dapat langsung login menggunakan akun default berikut:

| Peran (Role) | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@berkahpancing.com` | `password` | Akses penuh dashboard admin, kelola produk, kategori, pesanan, & live chat |
| **Pelanggan 1** | `julianto@gmail.com` | `password` | Berbelanja, checkout Midtrans, kelola profil, ulasan, & keranjang |
| **Pelanggan 2** | `budi.santoso@yahoo.com` | `password` | Akun pembeli aktif |

---

## 📡 Daftar Endpoint API Utama

| Method | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Autentikasi Pengguna & Dapatkan Bearer Token | Publik |
| `POST` | `/api/register` | Pendaftaran Akun Pelanggan Baru | Publik |
| `GET` | `/api/products` | Mengambil seluruh katalog produk | Publik |
| `GET` | `/api/categories` | Mengambil seluruh data kategori aktif | Publik |
| `GET` | `/api/user` | Mengambil profil user yang sedang login | Auth (Sanctum) |
| `POST`| `/api/user/profile` | Update nama, no. HP, alamat, & avatar foto | Auth (Sanctum) |
| `POST`| `/api/orders` | Membuat pesanan baru & checkout Snap Midtrans | Auth (Sanctum) |
| `POST`| `/api/admin/categories` | Tambah kategori baru | Admin Only |
| `PUT` | `/api/admin/categories/{id}` | Update informasi kategori | Admin Only |
| `DELETE`| `/api/admin/categories/{id}`| Hapus kategori | Admin Only |
| `POST`| `/api/admin/products` | Tambah produk baru | Admin Only |

---

## 🏢 Informasi Toko Resmi

- 📍 **Alamat**: Jln. Cibiru Hilir RT 02 / RW 03, Desa Cibiru Hilir, Kec. Cileunyi, Kab. Bandung, Jawa Barat 40624
- 📞 **WhatsApp / CS**: [+62 857-2172-6584](https://wa.me/6285721726584)
- ✉️ **Email Resmi**: [BerkahPancing@gmail.com](mailto:BerkahPancing@gmail.com)
- ⏰ **Jam Operasional**: Buka Setiap Hari: 06.00 WIB s/d Malam (Tutup)

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [MIT License](LICENSE). Anda bebas untuk menggunakan, mengembangkan, dan memodifikasi kode ini untuk keperluan edukasi maupun komersial.

<div align="center">
  <sub>Developed with ❤️ for Indonesian Anglers & Farmers Community.</sub>
</div>
