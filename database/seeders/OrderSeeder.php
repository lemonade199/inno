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

        $shimanoRod = Product::where('name', 'like', '%Shimano SpeedMaster%')->first();
        $daiwaReel = Product::where('name', 'like', '%Daiwa BG%')->first();
        $peLine = Product::where('name', 'like', '%Braided PE%')->first();
        $lureMinnow = Product::where('name', 'like', '%Minnow Popper%')->first();
        $hooks = Product::where('name', 'like', '%Mustad%')->first();
        $bag = Product::where('name', 'like', '%Tas Joran%')->first();

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

        if ($shimanoRod) {
            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $shimanoRod->id,
                'name' => $shimanoRod->name,
                'price' => $shimanoRod->price,
                'qty' => 1,
                'image' => $shimanoRod->image,
            ]);
        }
        if ($hooks) {
            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $hooks->id,
                'name' => $hooks->name,
                'price' => $hooks->price,
                'qty' => 2,
                'image' => $hooks->image,
            ]);
        }

        // Order 2
        $order2 = Order::create([
            'user_id' => $budi ? $budi->id : null,
            'customer_name' => 'Budi Santoso',
            'customer_email' => 'budi.santoso@yahoo.com',
            'customer_phone' => '085711223344',
            'address' => 'Jl. Anggrek No. 12, Bandung',
            'subtotal' => 1850000,
            'shipping_fee' => 30000,
            'total' => 1880000,
            'payment_method' => 'QRIS',
            'status' => 'Selesai',
        ]);

        if ($daiwaReel) {
            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => $daiwaReel->id,
                'name' => $daiwaReel->name,
                'price' => $daiwaReel->price,
                'qty' => 1,
                'image' => $daiwaReel->image,
            ]);
        }

        // Order 3
        $order3 = Order::create([
            'user_id' => $juli ? $juli->id : null,
            'customer_name' => 'Juli Anto',
            'customer_email' => 'julianto@gmail.com',
            'customer_phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 45, Jakarta Selatan',
            'subtotal' => 685000,
            'shipping_fee' => 20000,
            'total' => 705000,
            'payment_method' => 'Transfer Bank Mandiri',
            'status' => 'Menunggu Pembayaran',
        ]);

        if ($peLine) {
            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => $peLine->id,
                'name' => $peLine->name,
                'price' => $peLine->price,
                'qty' => 3,
                'image' => $peLine->image,
            ]);
        }
        if ($lureMinnow) {
            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => $lureMinnow->id,
                'name' => $lureMinnow->name,
                'price' => $lureMinnow->price,
                'qty' => 2,
                'image' => $lureMinnow->image,
            ]);
        }

        // Order 4
        $order4 = Order::create([
            'user_id' => $andi ? $andi->id : null,
            'customer_name' => 'Andi Wijaya',
            'customer_email' => 'andi.w@gmail.com',
            'customer_phone' => '081344556677',
            'address' => 'Jl. Gajah Mada No. 101, Semarang',
            'subtotal' => 240000,
            'shipping_fee' => 15000,
            'total' => 255000,
            'payment_method' => 'COD',
            'status' => 'Dikirim',
        ]);

        if ($bag) {
            OrderItem::create([
                'order_id' => $order4->id,
                'product_id' => $bag->id,
                'name' => $bag->name,
                'price' => $bag->price,
                'qty' => 1,
                'image' => $bag->image,
            ]);
        }
    }
}
