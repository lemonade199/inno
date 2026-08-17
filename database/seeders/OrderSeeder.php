<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $juli = User::where('email', 'julianto@gmail.com')->first();
        $budi = User::where('email', 'budi.santoso@yahoo.com')->first();
        $andi = User::where('email', 'andi.w@gmail.com')->first();

        $pakanAyam = Product::where('name', 'like', '%Pakan Ayam 511%')->first();
        $peletApung = Product::where('name', 'like', '%Pelet Apung%')->first();
        $umpanJitu = Product::where('name', 'like', '%Umpan Jitu Merah%')->first();
        $essenUdang = Product::where('name', 'like', '%Essen Udang%')->first();
        $joranAnak = Product::where('name', 'like', '%Joran Pancing Anak%')->first();
        $kojaJaring = Product::where('name', 'like', '%Koja Jaring%')->first();

        // Order 1
        $order1 = Order::create([
            'user_id' => $juli ? $juli->id : null,
            'customer_name' => 'Juli Anto',
            'customer_email' => 'julianto@gmail.com',
            'customer_phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 45, Jakarta Selatan',
            'subtotal' => 1440000,
            'shipping_fee' => 25000,
            'total' => 1465000,
            'payment_method' => 'Transfer Bank BCA',
            'status' => 'Diproses',
        ]);

        if ($pakanAyam) {
            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $pakanAyam->id,
                'name' => $pakanAyam->name,
                'price' => $pakanAyam->price,
                'qty' => 2,
                'image' => $pakanAyam->image,
            ]);
        }
        if ($peletApung) {
            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $peletApung->id,
                'name' => $peletApung->name,
                'price' => $peletApung->price,
                'qty' => 1,
                'image' => $peletApung->image,
            ]);
        }

        // Order 2
        $order2 = Order::create([
            'user_id' => $budi ? $budi->id : null,
            'customer_name' => 'Budi Santoso',
            'customer_email' => 'budi.santoso@yahoo.com',
            'customer_phone' => '085711223344',
            'address' => 'Jl. Anggrek No. 12, Bandung',
            'subtotal' => 50000,
            'shipping_fee' => 10000,
            'total' => 60000,
            'payment_method' => 'QRIS',
            'status' => 'Selesai',
        ]);

        if ($kojaJaring) {
            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => $kojaJaring->id,
                'name' => $kojaJaring->name,
                'price' => $kojaJaring->price,
                'qty' => 2,
                'image' => $kojaJaring->image,
            ]);
        }

        // Order 3
        $order3 = Order::create([
            'user_id' => $juli ? $juli->id : null,
            'customer_name' => 'Juli Anto',
            'customer_email' => 'julianto@gmail.com',
            'customer_phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 45, Jakarta Selatan',
            'subtotal' => 18000,
            'shipping_fee' => 10000,
            'total' => 28000,
            'payment_method' => 'Transfer Bank Mandiri',
            'status' => 'Menunggu Pembayaran',
        ]);

        if ($umpanJitu) {
            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => $umpanJitu->id,
                'name' => $umpanJitu->name,
                'price' => $umpanJitu->price,
                'qty' => 2,
                'image' => $umpanJitu->image,
            ]);
        }
        if ($essenUdang) {
            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => $essenUdang->id,
                'name' => $essenUdang->name,
                'price' => $essenUdang->price,
                'qty' => 1,
                'image' => $essenUdang->image,
            ]);
        }

        // Order 4
        $order4 = Order::create([
            'user_id' => $andi ? $andi->id : null,
            'customer_name' => 'Andi Wijaya',
            'customer_email' => 'andi.w@gmail.com',
            'customer_phone' => '081344556677',
            'address' => 'Jl. Gajah Mada No. 101, Semarang',
            'subtotal' => 15000,
            'shipping_fee' => 10000,
            'total' => 25000,
            'payment_method' => 'COD',
            'status' => 'Dikirim',
        ]);

        if ($joranAnak) {
            OrderItem::create([
                'order_id' => $order4->id,
                'product_id' => $joranAnak->id,
                'name' => $joranAnak->name,
                'price' => $joranAnak->price,
                'qty' => 1,
                'image' => $joranAnak->image,
            ]);
        }
    }
}
