-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 19, 2026 at 11:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inno`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-shipping_cost_56_1000_JNE', 'a:2:{s:7:\"courier\";s:3:\"JNE\";s:8:\"services\";a:3:{i:0;a:5:{s:4:\"code\";s:3:\"REG\";s:4:\"name\";s:7:\"JNE REG\";s:11:\"description\";s:15:\"Layanan Reguler\";s:5:\"price\";i:20000;s:3:\"etd\";s:8:\"2-3 Hari\";}i:1;a:5:{s:4:\"code\";s:3:\"OKE\";s:4:\"name\";s:7:\"JNE OKE\";s:11:\"description\";s:21:\"Ongkos Kirim Ekonomis\";s:5:\"price\";i:13000;s:3:\"etd\";s:8:\"4-6 Hari\";}i:2;a:5:{s:4:\"code\";s:3:\"YES\";s:4:\"name\";s:7:\"JNE YES\";s:11:\"description\";s:17:\"Yakin Esok Sampai\";s:5:\"price\";i:33000;s:3:\"etd\";s:6:\"1 Hari\";}}}', 1787131194),
('laravel-cache-shipping_cost_56_1500_JNE', 'a:2:{s:7:\"courier\";s:3:\"JNE\";s:8:\"services\";a:3:{i:0;a:5:{s:4:\"code\";s:3:\"REG\";s:4:\"name\";s:7:\"JNE REG\";s:11:\"description\";s:15:\"Layanan Reguler\";s:5:\"price\";i:25000;s:3:\"etd\";s:8:\"2-3 Hari\";}i:1;a:5:{s:4:\"code\";s:3:\"OKE\";s:4:\"name\";s:7:\"JNE OKE\";s:11:\"description\";s:21:\"Ongkos Kirim Ekonomis\";s:5:\"price\";i:16000;s:3:\"etd\";s:8:\"4-6 Hari\";}i:2;a:5:{s:4:\"code\";s:3:\"YES\";s:4:\"name\";s:7:\"JNE YES\";s:11:\"description\";s:17:\"Yakin Esok Sampai\";s:5:\"price\";i:41000;s:3:\"etd\";s:6:\"1 Hari\";}}}', 1787124703),
('laravel-cache-shipping_cost_56_500_JNE', 'a:2:{s:7:\"courier\";s:3:\"JNE\";s:8:\"services\";a:3:{i:0;a:5:{s:4:\"code\";s:3:\"REG\";s:4:\"name\";s:7:\"JNE REG\";s:11:\"description\";s:15:\"Layanan Reguler\";s:5:\"price\";i:20000;s:3:\"etd\";s:8:\"2-3 Hari\";}i:1;a:5:{s:4:\"code\";s:3:\"OKE\";s:4:\"name\";s:7:\"JNE OKE\";s:11:\"description\";s:21:\"Ongkos Kirim Ekonomis\";s:5:\"price\";i:13000;s:3:\"etd\";s:8:\"4-6 Hari\";}i:2;a:5:{s:4:\"code\";s:3:\"YES\";s:4:\"name\";s:7:\"JNE YES\";s:11:\"description\";s:17:\"Yakin Esok Sampai\";s:5:\"price\";i:33000;s:3:\"etd\";s:6:\"1 Hari\";}}}', 1787131679),
('laravel-cache-shipping_cost_91_500_JNE', 'a:2:{s:7:\"courier\";s:3:\"JNE\";s:8:\"services\";a:3:{i:0;a:5:{s:4:\"code\";s:3:\"REG\";s:4:\"name\";s:7:\"JNE REG\";s:11:\"description\";s:15:\"Layanan Reguler\";s:5:\"price\";i:20000;s:3:\"etd\";s:8:\"2-3 Hari\";}i:1;a:5:{s:4:\"code\";s:3:\"OKE\";s:4:\"name\";s:7:\"JNE OKE\";s:11:\"description\";s:21:\"Ongkos Kirim Ekonomis\";s:5:\"price\";i:13000;s:3:\"etd\";s:8:\"4-6 Hari\";}i:2;a:5:{s:4:\"code\";s:3:\"YES\";s:4:\"name\";s:7:\"JNE YES\";s:11:\"description\";s:17:\"Yakin Esok Sampai\";s:5:\"price\";i:33000;s:3:\"etd\";s:6:\"1 Hari\";}}}', 1787128177);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Pakan Ayam & Unggas', 'pakan-ayam-unggas', 'Pakan berkualitas untuk ayam petelur, pedaging, dan unggas ternak.', 'Egg', 'Aktif', '2026-08-18 03:12:33', '2026-08-18 03:12:33'),
(2, 'Pakan Ikan', 'pakan-ikan', 'Pelet dan pakan apung/tenggelam untuk ikan lele, nila, mas, dan gurame.', 'Fish', 'Aktif', '2026-08-18 03:12:33', '2026-08-18 03:12:33'),
(3, 'Pakan Burung & Hewan', 'pakan-burung-hewan', 'Pakan voer, biji-bijian, dan nutrisi lengkap burung berkicau & peliharaan.', 'Feather', 'Aktif', '2026-08-18 03:12:33', '2026-08-18 03:12:33'),
(4, 'Umpan Pancing', 'umpan-pancing', 'Umpan hidup, umpan racikan, pelet, dan lure tiruan.', 'Anchor', 'Aktif', '2026-08-18 03:12:33', '2026-08-18 03:12:33'),
(5, 'Essen Pancing', 'essen-pancing', 'Essen aroma amis, wangi, gurih untuk meningkatkan daya pikat ikan.', 'Droplets', 'Aktif', '2026-08-18 03:12:33', '2026-08-18 03:12:33'),
(6, 'Alat & Aksesoris Pancing', 'alat-aksesoris-pancing', 'Joran, reel, kail, pelampung, senar, tas pancing, dan perlengkapan.', 'Sparkles', 'Aktif', '2026-08-18 03:12:33', '2026-08-18 03:12:33');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_08_16_004841_create_products_table', 1),
(5, '2026_08_16_004924_create_orders_table', 1),
(6, '2026_08_16_004940_create_order_items_table', 1),
(7, '2026_08_16_061330_create_payments_table', 1),
(8, '2026_08_16_061331_add_midtrans_fields_to_orders_table', 1),
(9, '2026_08_18_054808_create_personal_access_tokens_table', 2),
(10, '2026_08_18_062250_add_shipping_fields_to_orders_and_weight_to_products', 2),
(11, '2026_08_18_101131_create_categories_table', 3),
(12, '2026_08_18_075000_add_location_fields_to_users_table', 4),
(13, '2026_08_19_063000_ensure_shipping_and_weight_columns_exist', 5);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id_midtrans` varchar(255) DEFAULT NULL,
  `snap_token` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `shipping_fee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Menunggu Pembayaran',
  `shipping_method` varchar(255) DEFAULT NULL,
  `shipping_courier` varchar(255) DEFAULT NULL,
  `shipping_service` varchar(255) DEFAULT NULL,
  `shipping_etd` varchar(255) DEFAULT NULL,
  `shipping_province_id` varchar(255) DEFAULT NULL,
  `shipping_province` varchar(255) DEFAULT NULL,
  `shipping_city_id` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(255) DEFAULT NULL,
  `shipping_district_id` varchar(255) DEFAULT NULL,
  `shipping_district` varchar(255) DEFAULT NULL,
  `shipping_postal_code` varchar(255) DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id_midtrans`, `snap_token`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `address`, `subtotal`, `shipping_fee`, `total`, `payment_method`, `status`, `shipping_method`, `shipping_courier`, `shipping_service`, `shipping_etd`, `shipping_province_id`, `shipping_province`, `shipping_city_id`, `shipping_city`, `shipping_district_id`, `shipping_district`, `shipping_postal_code`, `tracking_number`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, 2, 'Juli Anto', 'julianto@gmail.com', '081234567890', 'Jl. Merdeka No. 45, Jakarta Selatan', 1440000.00, 25000.00, 1465000.00, 'Transfer Bank BCA', 'Diproses', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(2, NULL, NULL, 3, 'Budi Santoso', 'budi.santoso@yahoo.com', '085711223344', 'Jl. Anggrek No. 12, Bandung', 50000.00, 10000.00, 60000.00, 'QRIS', 'Selesai', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(3, NULL, NULL, 2, 'Juli Anto', 'julianto@gmail.com', '081234567890', 'Jl. Merdeka No. 45, Jakarta Selatan', 18000.00, 10000.00, 28000.00, 'Transfer Bank Mandiri', 'Menunggu Pembayaran', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(4, NULL, NULL, 4, 'Andi Wijaya', 'andi.w@gmail.com', '081344556677', 'Jl. Gajah Mada No. 101, Semarang', 15000.00, 10000.00, 25000.00, 'COD', 'Dikirim', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(5, 'TRX-1787121103-183', 'e46d5299-6e22-48a5-8bbb-015b3d08ad6c', 2, 'Juli Anto', 'julianto@gmail.com', '081234567890', 'Jl. Merdeka No. 45, Jakarta Selatan (Rumah Utama), Kabupaten Bandung, Jawa Barat, 40311', 39000.00, 25000.00, 65000.00, 'Midtrans', 'pending', 'delivery', 'JNE', 'REG', '2-3 Hari', '9', 'Jawa Barat', '56', 'Kabupaten Bandung', NULL, NULL, NULL, NULL, '2026-08-18 23:31:43', '2026-08-18 23:31:45'),
(6, 'TRX-1787124577-125', '448aaf39-91d8-4543-b2e7-7d2904f64709', 2, 'Juli Anto', 'julianto@gmail.com', '081234567890', 'Jl. Merdeka No. 45, Jakarta Selatan (Rumah Utama), Kabupaten Bekasi, Jawa Barat, 17121', 13000.00, 20000.00, 34000.00, 'Midtrans', 'pending', 'delivery', 'JNE', 'REG', '2-3 Hari', '9', 'Jawa Barat', '91', 'Kabupaten Bekasi', NULL, NULL, NULL, NULL, '2026-08-19 00:29:37', '2026-08-19 00:29:40'),
(7, 'TRX-1787125340-655', NULL, 2, 'Juli Anto', 'julianto@gmail.com', '081234567890', 'Ambil Langsung di Toko Berkah Pancing (Jln. Cibiru Hilir RT02/RW03, Cileunyi, Kab. Bandung) (Ambil di Toko / COD)', 13000.00, 0.00, 13000.00, 'COD', 'pending', 'pickup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-19 00:42:20', '2026-08-19 00:42:20'),
(8, 'TRX-1787127594-375', 'fda86e4d-5915-45d8-8229-86a9d5f1832f', 5, 'Refky F.M', 'refkyfavianmahardika@gmail.com', '081234567890', 'Jln,cibiru hilir rt02 rw03 desa cibiru hilir kecamatan cileunyi kabupaten bandung (Rumah Utama), Kabupaten Bandung, Jawa Barat, 40311', 26000.00, 13000.00, 40000.00, 'Midtrans', 'pending', 'delivery', 'JNE', 'OKE', '4-6 Hari', '9', 'Jawa Barat', '56', 'Kabupaten Bandung', NULL, NULL, NULL, NULL, '2026-08-19 01:19:54', '2026-08-19 01:19:55'),
(9, 'TRX-1787128079-463', 'a9bc3182-5b7b-416b-b14f-68b69caf165d', 5, 'Administrator Utama', 'admin@berkahpancing.com', '081299887766', 'HQ Berkah Pancing, Jakarta (Rumah Utama), Kabupaten Bandung, Jawa Barat, 40311', 300.00, 20000.00, 21300.00, 'Midtrans', 'Selesai', 'delivery', 'JNE', 'REG', '2-3 Hari', '9', 'Jawa Barat', '56', 'Kabupaten Bandung', NULL, NULL, NULL, 'JNE-BP185889', '2026-08-19 01:27:59', '2026-08-19 01:29:57');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `qty` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `name`, `price`, `qty`, `image`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Pakan Ayam 511', 13000.00, 2, '/images/products/placeholder.jpg', '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(2, 1, 7, 'Pelet Apung', 10000.00, 1, '/images/products/placeholder.jpg', '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(3, 2, 31, 'Koja Jaring Ikan (1m x 25cm)', 25000.00, 2, '/images/products/placeholder.jpg', '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(4, 3, 22, 'Umpan Jitu Merah', 1500.00, 2, '/images/products/placeholder.jpg', '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(5, 3, 27, 'Essen Udang (10ml)', 15000.00, 1, '/images/products/placeholder.jpg', '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(6, 4, 36, 'Joran Pancing Anak', 15000.00, 1, '/images/products/placeholder.jpg', '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(7, 5, 2, 'Pakan Ayam 512', 13000.00, 1, '/images/products/placeholder.jpg', '2026-08-18 23:31:43', '2026-08-18 23:31:43'),
(8, 5, 6, 'Benyer (Menir Beras / Jagung)', 13000.00, 1, '/images/products/placeholder.jpg', '2026-08-18 23:31:43', '2026-08-18 23:31:43'),
(9, 5, 1, 'Pakan Ayam 511', 13000.00, 1, '/images/products/placeholder.jpg', '2026-08-18 23:31:43', '2026-08-18 23:31:43'),
(10, 6, 2, 'Pakan Ayam 512', 13000.00, 1, '/images/products/Pakan_ayam_512.jpg', '2026-08-19 00:29:37', '2026-08-19 00:29:37'),
(11, 7, 1, 'Pakan Ayam 511', 13000.00, 1, '/images/products/Pakan_ayam_511.jpg', '2026-08-19 00:42:20', '2026-08-19 00:42:20'),
(12, 8, 2, 'Pakan Ayam 512', 13000.00, 2, '/images/products/Pakan_ayam_512.jpg', '2026-08-19 01:19:54', '2026-08-19 01:19:54'),
(13, 9, 34, 'Benang Pancing (per Meter)', 300.00, 1, '/images/products/Benang.jpg', '2026-08-19 01:28:00', '2026-08-19 01:28:00');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id_db` bigint(20) UNSIGNED NOT NULL,
  `order_id_midtrans` varchar(255) NOT NULL COMMENT 'Midtrans unique string Order ID',
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `gross_amount` decimal(12,2) NOT NULL,
  `transaction_status` varchar(255) DEFAULT NULL,
  `fraud_status` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `snap_token` varchar(255) DEFAULT NULL,
  `transaction_time` datetime DEFAULT NULL,
  `settlement_time` datetime DEFAULT NULL,
  `raw_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw_response`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id_db`, `order_id_midtrans`, `transaction_id`, `payment_type`, `gross_amount`, `transaction_status`, `fraud_status`, `payment_status`, `snap_token`, `transaction_time`, `settlement_time`, `raw_response`, `created_at`, `updated_at`) VALUES
(1, 5, 'TRX-1787121103-183', NULL, NULL, 65000.00, NULL, NULL, 'pending', 'e46d5299-6e22-48a5-8bbb-015b3d08ad6c', NULL, NULL, NULL, '2026-08-18 23:31:45', '2026-08-18 23:31:45'),
(2, 6, 'TRX-1787124577-125', NULL, NULL, 34000.00, NULL, NULL, 'pending', '448aaf39-91d8-4543-b2e7-7d2904f64709', NULL, NULL, NULL, '2026-08-19 00:29:40', '2026-08-19 00:29:40'),
(3, 7, 'TRX-1787125340-655', NULL, NULL, 13000.00, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, '2026-08-19 00:42:20', '2026-08-19 00:42:20'),
(4, 8, 'TRX-1787127594-375', NULL, NULL, 40000.00, NULL, NULL, 'pending', 'fda86e4d-5915-45d8-8229-86a9d5f1832f', NULL, NULL, NULL, '2026-08-19 01:19:55', '2026-08-19 01:19:55'),
(5, 9, 'TRX-1787128079-463', 'b1ad3559-b220-4a37-ba74-8a37a289daca', 'bank_transfer', 21300.00, 'settlement', 'accept', 'paid', 'a9bc3182-5b7b-416b-b14f-68b69caf165d', '2026-08-19 15:28:18', '2026-08-19 15:28:35', '{\"status_code\":\"200\",\"transaction_id\":\"b1ad3559-b220-4a37-ba74-8a37a289daca\",\"gross_amount\":\"21300.00\",\"currency\":\"IDR\",\"order_id\":\"TRX-1787128079-463\",\"payment_type\":\"bank_transfer\",\"signature_key\":\"ae46af4b401ad6b018a91bdf62e78fc5aa6a43b5a1f8177c75924ce855289a3b36c8481450f00586d0b98dfab94918d62f6632b821a3bb6b46f1a386eeaf519d\",\"transaction_status\":\"settlement\",\"fraud_status\":\"accept\",\"status_message\":\"Success, transaction is found\",\"merchant_id\":\"M901052693\",\"va_numbers\":[{\"bank\":\"bca\",\"va_number\":\"52693974890951468052002\"}],\"payment_amounts\":[],\"transaction_time\":\"2026-08-19 15:28:18\",\"settlement_time\":\"2026-08-19 15:28:35\",\"expiry_time\":\"2026-08-20 15:28:17\"}', '2026-08-19 01:28:01', '2026-08-19 01:28:42');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 2, 'auth_token', '9cd3b109a3231aa7dea8875f668370eb3c69b198a8c96c0aff47cd720a4b6476', '[\"*\"]', '2026-08-18 14:05:03', NULL, '2026-08-18 04:43:48', '2026-08-18 14:05:03'),
(6, 'App\\Models\\User', 2, 'auth_token', 'f55c3aa029ad4773b78c6df5e6569c6805bea1306b289c594ea983b12c3165f7', '[\"*\"]', NULL, NULL, '2026-08-19 00:59:16', '2026-08-19 00:59:16'),
(11, 'App\\Models\\User', 5, 'auth_token', '378e7d1b917201795959736a90f0291fc7e60f280ab3f672ae219f9eebde8122', '[\"*\"]', '2026-08-19 01:34:33', NULL, '2026-08-19 01:10:47', '2026-08-19 01:34:33'),
(12, 'App\\Models\\User', 1, 'auth_token', '6bc650aea3edfadd9696f55815e7b0a037a815c76882bca32ab79a076a0f4359', '[\"*\"]', '2026-08-19 01:37:42', NULL, '2026-08-19 01:29:14', '2026-08-19 01:37:42');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `weight` int(11) NOT NULL DEFAULT 500,
  `category` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `weight`, `category`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Pakan Ayam 511', 'Pakan konsentrat starter komplit kualitas unggul untuk anak ayam & unggas.', 13000.00, 48, 500, 'Pakan Ayam & Unggas', '/images/products/Pakan_ayam_511.jpg', '2026-08-16 21:51:25', '2026-08-19 00:42:20'),
(2, 'Pakan Ayam 512', 'Pakan konsentrat pemeliharaan tahap grower & finisher untuk pertumbuhan ayam.', 13000.00, 46, 500, 'Pakan Ayam & Unggas', '/images/products/Pakan_ayam_512.jpg', '2026-08-16 21:51:25', '2026-08-19 01:19:54'),
(3, 'Pakan Ayam 594', 'Pakan khusus bernutrisi tinggi untuk anak ayam aduan & unggas.', 13000.00, 40, 500, 'Pakan Ayam & Unggas', '/images/products/Pakan_ayam_594.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(4, 'Jagung Merah', 'Jagung merah giling pilihan kaya energi untuk pakan ayam, puyuh, & burung.', 14000.00, 60, 500, 'Pakan Ayam & Unggas', '/images/products/Jagung_merah.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(5, 'Jagung Campur', 'Campuran biji jagung & beras berkualitas untuk pakan harian unggas.', 11000.00, 60, 500, 'Pakan Ayam & Unggas', '/images/products/Jagung_campur.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(6, 'Benyer (Menir Beras / Jagung)', 'Menir halus mudah dicerna untuk pakan anak ayam & burung.', 13000.00, 44, 500, 'Pakan Ayam & Unggas', '/images/products/Benyer.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(7, 'Pelet Apung', 'Pelet ikan tipe apung kaya protein untuk lele, gurame, patin & ikan mas.', 10000.00, 100, 500, 'Pakan Ikan', '/images/products/Pelet apung 781-1.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(8, 'Pelet Hi-Pro-Vite 781-1', 'Pelet apung ukuran kecil (781-1) untuk benih & bibit ikan.', 17000.00, 50, 500, 'Pakan Ikan', '/images/products/Pelet apung 781-1.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(9, 'Pelet Hi-Pro-Vite 781-2', 'Pelet apung ukuran sedang (781-2) untuk tahap pertumbuhan ikan.', 17000.00, 50, 500, 'Pakan Ikan', '/images/products/Pelet apung 781-2.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(10, 'Pelet Hi-Pro-Vite 781-3', 'Pelet apung ukuran besar (781-3) untuk pembesaran ikan dewasa.', 17000.00, 50, 500, 'Pakan Ikan', '/images/products/Pelet apung 781-3.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(11, 'Pelet Takari Besar', 'Pelet pakan ikan hias Takari kemasan besar untuk koki, koi, & cichlid.', 10000.00, 30, 500, 'Pakan Ikan', '/images/products/Takari_besar.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(12, 'Pelet Takari Kecil', 'Pelet pakan ikan hias Takari kemasan ekonomis kecil.', 5000.00, 40, 500, 'Pakan Ikan', '/images/products/Takari_kecil.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(13, 'Kenari Set', 'Campuran biji-bijian racikan bernutrisi tinggi khusus burung kenari.', 14000.00, 35, 500, 'Pakan Burung & Hewan', '/images/products/Kenari_set.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(14, 'Milet Putih / Merah', 'Biji milet bersih pilihan untuk pakan lovebird, parkit, & kenari.', 10000.00, 80, 500, 'Pakan Burung & Hewan', '/images/products/Milet.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(15, 'Ebod Canary', 'Pakan racikan spesialis Ebod Canary untuk stamina & suara gacor burung.', 10000.00, 30, 500, 'Pakan Burung & Hewan', '/images/products/Ebod_canary.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(16, 'Topsong Pakan Burung', 'Voer Topsong kaya gizi & vitamin untuk murai batu, kacer, anis, & cucak.', 14000.00, 45, 500, 'Pakan Burung & Hewan', '/images/products/Topsong.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(17, 'Phoenix Pakan Burung', 'Pakan istimewa Phoenix ber-vitamin tinggi untuk burung perkutut & ocean.', 12000.00, 50, 500, 'Pakan Burung & Hewan', '/images/products/Phoenix.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(18, 'Gold Coin Burung', 'Pakan burung ramuan herbal Gold Coin untuk menjaga kesehatan vocal.', 12000.00, 40, 500, 'Pakan Burung & Hewan', '/images/products/Gold_coin.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(19, 'Bolt Cat Food (Pakan Kucing 1kg)', 'Pakan kering kucing Bolt 1kg bernutrisi tinggi rasa tuna & ayam.', 22000.00, 25, 500, 'Pakan Burung & Hewan', '/images/products/Bolt.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(20, 'Pakan Kelinci (Pelet Kelinci)', 'Pelet pakan serat tinggi sehat untuk kelinci & marmut.', 10000.00, 30, 500, 'Pakan Burung & Hewan', '/images/products/Pakan_kelinci.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(21, 'Leopard Pakan Burung Halus', 'Voer pelet halus Leopard untuk burung pleci, ciblek, & prenjak.', 9000.00, 35, 500, 'Pakan Burung & Hewan', '/images/products/Leopard.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(22, 'Umpan Jitu Merah', 'Umpan instan racikan amis harum jitu untuk mancing ikan mas & lele.', 1500.00, 200, 500, 'Umpan Pancing', '/images/products/Jitu_merah.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(23, 'Umpan Jitu Biru', 'Umpan instan racikan wangi gurih untuk mancing harian & galatama.', 1500.00, 200, 500, 'Umpan Pancing', '/images/products/Jitu_biru.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(24, 'Umpan Kinoy (Pengeras)', 'Tepung Kinoy murni sebagai pengeras umpan pancing ikan mas & patin.', 1000.00, 250, 500, 'Umpan Pancing', '/images/products/Kinoy.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(25, 'Umpan Raja Udang', 'Umpan tepung ekstrak udang rebon asli dengan daya pikat tinggi.', 5000.00, 60, 500, 'Umpan Pancing', '/images/products/Raja_udang.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(26, 'Umpan Pancing 786', 'Umpan olahan spesial 786 siap pakai untuk mancing kolam & galatama.', 6000.00, 50, 500, 'Umpan Pancing', '/images/products/Jitu_merah.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(27, 'Essen Udang (10ml)', 'Essen aroma udang murni 10ml penarik nafsu makan ikan mas, lele & bawal.', 15000.00, 25, 500, 'Essen Pancing', '/images/products/Essen_udang.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(28, 'Essen Kepiting (10ml)', 'Essen ekstrak kepiting 10ml dengan aroma amis gurih pekat.', 20000.00, 20, 500, 'Essen Pancing', '/images/products/Essen_kepiting.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(29, 'Essen Stroberi (10ml)', 'Essen aroma buah stroberi 10ml wangi segar pencetus keaktifan ikan.', 10000.00, 30, 500, 'Essen Pancing', '/images/products/Essen_strawberry.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(30, 'Essen Daging (10ml)', 'Essen aroma olahan daging sapi pilihan berkarakter amis gurih dominan.', 20000.00, 20, 500, 'Essen Pancing', '/images/products/Essen_daging.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(31, 'Koja Jaring Ikan (1m x 25cm)', 'Jaring tempat menyimpan tangkapan ikan di air ukuran panjang 1 meter.', 25000.00, 15, 500, 'Alat & Aksesoris Pancing', '/images/products/Koja.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(32, 'Sairan / Serokan Ikan Kecil', 'Serokan saringan ikan gagang kuat & jaring halus ukuran kecil.', 15000.00, 20, 500, 'Alat & Aksesoris Pancing', '/images/products/Sairan kecil.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(33, 'Sairan / Serokan Ikan Besar', 'Serokan saringan ikan gagang tebal & jaring lapis kuat ukuran besar.', 25000.00, 15, 500, 'Alat & Aksesoris Pancing', '/images/products/Sairan_besar.jpeg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(34, 'Benang Pancing (per Meter)', 'Benang senar pancing serbaguna berkualitas tinggi (harga per meter).', 300.00, 498, 500, 'Alat & Aksesoris Pancing', '/images/products/Benang.jpg', '2026-08-16 21:51:25', '2026-08-19 01:28:42'),
(35, 'Timah Daun Pemberat', 'Timah daun pemberat lembaran mudah dipotong & disesuaikan pada senar.', 1000.00, 300, 500, 'Alat & Aksesoris Pancing', '/images/products/Timah_daun.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43'),
(36, 'Joran Pancing Anak', 'Joran pancing mini lentur, ringan, & praktis khusus untuk anak-anak.', 15000.00, 25, 500, 'Alat & Aksesoris Pancing', '/images/products/Joran_anak.jpg', '2026-08-16 21:51:25', '2026-08-19 00:22:43');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('3NO3MkX8cVDlqCoQuh9cVqKspCFilhLULwvXUKIh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYjdxNHRwTlY3Z08zZ1lSNlp2UEhPUU9CcDNqWm5nbXc3Q25iOW9yMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787038359),
('45CK6o3nYwUFfwSFfIS9JntNd4NOHZk2PFBfAxot', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRG9iUnZaSUdpdnRkd3owcVQ5ZkNhRHhFZzNhQnpoV085akxOYWlUNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787038329),
('5Y0fdQxqYjdezXmgJOlVVfv3N8AiPnFzQbVWHpuN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1RlQTdmTUlkSTdSSXA5dVFjVjVaYW1oUG11VXpEUlZoaklQZmlzayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787052233),
('5yDv5AmS6d321xFnmeT7mPazpgnAhcHC8J4ZIyFG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWktnZGZQd0xZM1ZVdEg4MFZhM2ZuQVR5bFVqQXpBZVdxM1p1SjNrZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787053367),
('AU9vZMsp3nZY0Vk8Sydn0oFXoQR5IcScYPXtYlAD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibG04bzVFNmNncldvRFlwcWV1YjU3dHdVWFRpS0o2eEFjWXRMbE9SNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787052234),
('BWfUxk7f6T2xr3Sl3cEaqU3ZLCgjElCFIGvjgQXM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU004QU1oMkY4N1g2bXlpMkttZDBRNGc5dlpXT3RpS0IzZ1FBT2JUOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787053367),
('C3MB56Sk6YgKQoPr9kGUNdd29kiUCkZNULGNMhm1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSlMxTXpSWGp6MjJGcDNWc0xETEcxY2RkT0ZVZXVySTExYllNSUdpVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787052235),
('cEMT5hQwqrUuYLMPpfuunWLEPzHgvSwge3TCQmEo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkgwRkFhVTNFTm8yWU1tSnNBVG80SjRRSTAzZnM4SVdKOU5zYzRhWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787053430),
('d6SxbAPo6JHSmxKxBKPqFZnQyOvvszVKihU6i3CN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieU9Ybk9YcnJNQzZ3UHVoZVNOSGdwb0ZTd3JucW5xRVlTTDk2SEVScCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787052233),
('DWOMn7yIIIj0aLHgA9MllRFOaLkZazNh2VzXqH9m', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieEs3TEVyQ05wZ3pyRTJrOXZOY2R0TmZxVmxwbUdrSXB2Skpwbms3ViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787052234),
('fgcTD1jr3piWl45RBcnWMv2LbsYjzcDGscvFXqHG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiam5BM2hkdHdIb3d6cjhUOHI2UDVKRWd6enVjNHBpQ1ZTWkNxcDJkdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787052232),
('JSnRKuSQfmrvcpejvXft9sLVU7KjSlK4Dm9CgcLA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicjBTQmgwNEQzUGIwb0R1RWhybm5meUdKYkg2b0ZWSGNwQ3phUE1uTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787052235),
('jWkZX1I7L0XTapit75CtNeyOoMgphv2ev3QvYGxS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiME4xZzBzTWVpcmRBSkxOZHR3emJvcUVFYVc3ODdwaGpNRGI0b2VvVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787053369),
('l1YwyIDR55I3zBt88FHjDWChIzxLbE4aeBpCIHtz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDl4U1VFb1J2azdERlQ4S1kzbGk5WEJNSUg5a2dnSzlhOHJNQUZucyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787053368),
('oXKcJ9GRpZ6q3gC4IvRpRNATdeOXdXW4dEFE96B8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVlVzU0JRdUJWU2xxbjhqN2xPdjR5NDEwT2V1eU1ES1ozdjJqdkpXeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787030674),
('pbckssBJyDCruPHgZhlOZiOwiVCURhzJD4nFbdKT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieUNiZHdkTzZVVlNWcWpQYmd5VlRCaXBaUUtuaHNVQzdTQXJyYW1MZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787053365),
('SmaemJi0oNkyXniNodcnquINsifJkdsEsHurALbt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3NsSEpqbFJObnhEM2ZGaVpqMk5UTFN0dmRRRFRKd2F0aE9zR1N3biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvb3JkZXJzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787053370),
('sUhynlCjlshnoxbyRFHa5TH5L7a9tPInHM3Noi2P', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVJoSGJ2UFFiV2s3bFRIVVpXdHhpd0ZGYU1Od0dVUzVWM3Nmbk14RCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787107660),
('vsIEcP9LFZpPI4nFP821wU0OSnTd4FzqERMdl7vR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHBJMGx6NlVSeXBqa2g5bG42enVLZVJBUGc4TU1XQmFMNk9PME12byI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787053429),
('WEsgKjgpJwmIZ8q5tbDU8550NfGskuIfIQZ6K37U', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2Z3ZndTTlRjODhqdnpJS05LcTRNTmJyUzlOM1RKQllLU29OZ2haMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787052231),
('WMwjjmflmfkUm0ZolJR2zdu0RzflbtNLu8gSEYdM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMlVmMGNkc3VHYXNIS3RsTHpzN09jcldFRW1KUWZZNWhvaGJsT3FhVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787053369),
('XIAS2q34TeXLRlwh6MdQ9hqrbq2CzSRc7D6RQfYW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUUVNU0VMeFpJWG1UTEhKZk5hcnFNeFowbFZjM0Y0dWF0MHJFTU5MUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787053365);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(11,7) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `phone`, `address`, `latitude`, `longitude`, `avatar`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator Utama', 'admin@berkahpancing.com', NULL, '$2y$12$H66T91wH/RHEpzbdY9o1EuAN0ClmUJJ5d3AQsiBC3FDnxff/KO2E6', 'admin', '081299887766', 'HQ Berkah Pancing, Jakarta', NULL, NULL, '/uploads/avatars/avatar_1_1787047420.ico', NULL, '2026-08-16 21:51:23', '2026-08-18 03:03:40'),
(2, 'Juli Anto', 'julianto@gmail.com', NULL, '$2y$12$AsXb.kjgoqpeCetQn4n35eslhq/ylpVteSrU46l/TqLhgRuV7.3AS', 'user', '081234567890', 'Jl. Merdeka No. 45, Jakarta Selatan', NULL, NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', NULL, '2026-08-16 21:51:24', '2026-08-16 21:51:24'),
(3, 'Budi Santoso', 'budi.santoso@yahoo.com', NULL, '$2y$12$6YQzKI2iVDLhDskVCvd5Ke7TcMafENaFUrSU5mgNACe7pK4eirjyG', 'user', '085711223344', 'Jl. Anggrek No. 12, Bandung', NULL, NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', NULL, '2026-08-16 21:51:24', '2026-08-16 21:51:24'),
(4, 'Andi Wijaya', 'andi.w@gmail.com', NULL, '$2y$12$mm5y4hzf9XtJAxQKpS/0mefm.ATYGLoF4QJ8Y6BCEbwAs//5Qz5mK', 'user', '081344556677', 'Jl. Gajah Mada No. 101, Semarang', NULL, NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', NULL, '2026-08-16 21:51:25', '2026-08-16 21:51:25'),
(5, 'Refky F.M', 'refkyfavianmahardika@gmail.com', NULL, '$2y$12$CY/ijZN1bVj8fim2tq1cnexv9K0UcCs6ybx5tWOJmAL52llgBWXLy', 'user', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-19 01:06:49', '2026-08-19 01:06:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_id_midtrans_unique` (`order_id_midtrans`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_order_id_midtrans_unique` (`order_id_midtrans`),
  ADD KEY `payments_order_id_db_foreign` (`order_id_db`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_id_db_foreign` FOREIGN KEY (`order_id_db`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
