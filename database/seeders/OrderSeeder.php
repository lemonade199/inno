<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'customer_name' => 'Budi Santoso',
                'customer_email' => 'budi@gmail.com',
                'customer_phone' => '08111222333',
                'address' => 'Jl. Pancing No. 1, Jakarta',
                'subtotal' => 150000,
                'shipping_fee' => 15000,
                'total' => 165000,
                'payment_method' => 'QRIS',
                'status' => 'Menunggu Pembayaran',
                'created_at' => Carbon::parse('-1 days'),
                'updated_at' => Carbon::parse('-1 days'),
            ],
            [
                'customer_name' => 'Andi Wijaya',
                'customer_email' => 'andi@gmail.com',
                'customer_phone' => '08222333444',
                'address' => 'Jl. Pemuda No. 10, Bandung',
                'subtotal' => 450000,
                'shipping_fee' => 0,
                'total' => 450000,
                'payment_method' => 'Midtrans',
                'status' => 'Dikirim',
                'created_at' => Carbon::parse('-2 days'),
                'updated_at' => Carbon::parse('-2 days'),
            ],
            [
                'customer_name' => 'Siti Aminah',
                'customer_email' => 'siti@gmail.com',
                'customer_phone' => '08333444555',
                'address' => 'Jl. Kebon Jeruk No. 5, Surabaya',
                'subtotal' => 75000,
                'shipping_fee' => 20000,
                'total' => 95000,
                'payment_method' => 'COD',
                'status' => 'Selesai',
                'created_at' => Carbon::parse('-5 days'),
                'updated_at' => Carbon::parse('-5 days'),
            ]
        ];

        DB::table('orders')->insert($orders);

        // Optional: seed order items if needed to show details
        $items = [
            ['order_id' => 1, 'product_id' => 1, 'name' => 'Joran Daido', 'qty' => 1, 'price' => 150000, 'image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['order_id' => 2, 'product_id' => 2, 'name' => 'Reel Shimano', 'qty' => 1, 'price' => 450000, 'image' => 'https://images.unsplash.com/photo-1516684784402-990a8a666e6d?w=500', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['order_id' => 3, 'product_id' => 3, 'name' => 'Senar PE 3', 'qty' => 1, 'price' => 75000, 'image' => 'https://images.unsplash.com/photo-1533034960301-db2dfc4f1c90?w=500', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ];

        DB::table('order_items')->insert($items);
    }
}
