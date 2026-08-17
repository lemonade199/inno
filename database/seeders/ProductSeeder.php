<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate existing products or clear them first if foreign key checks permit
        Product::query()->delete();

        $products = [
            // Pakan Ayam & Unggas
            [
                'name' => 'Pakan Ayam 511',
                'category' => 'Pakan Ayam & Unggas',
                'price' => 13000,
                'stock' => 50,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pakan konsentrat starter komplit kualitas unggul untuk anak ayam & unggas.',
            ],
            [
                'name' => 'Pakan Ayam 512',
                'category' => 'Pakan Ayam & Unggas',
                'price' => 13000,
                'stock' => 50,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pakan konsentrat pemeliharaan tahap grower & finisher untuk pertumbuhan ayam.',
            ],
            [
                'name' => 'Pakan Ayam 594',
                'category' => 'Pakan Ayam & Unggas',
                'price' => 13000,
                'stock' => 40,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pakan khusus bernutrisi tinggi untuk anak ayam aduan & unggas.',
            ],
            [
                'name' => 'Jagung Merah',
                'category' => 'Pakan Ayam & Unggas',
                'price' => 14000,
                'stock' => 60,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Jagung merah giling pilihan kaya energi untuk pakan ayam, puyuh, & burung.',
            ],
            [
                'name' => 'Jagung Campur',
                'category' => 'Pakan Ayam & Unggas',
                'price' => 11000,
                'stock' => 60,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Campuran biji jagung & beras berkualitas untuk pakan harian unggas.',
            ],
            [
                'name' => 'Benyer (Menir Beras / Jagung)',
                'category' => 'Pakan Ayam & Unggas',
                'price' => 13000,
                'stock' => 45,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Menir halus mudah dicerna untuk pakan anak ayam & burung.',
            ],

            // Pakan Ikan
            [
                'name' => 'Pelet Apung',
                'category' => 'Pakan Ikan',
                'price' => 10000,
                'stock' => 100,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pelet ikan tipe apung kaya protein untuk lele, gurame, patin & ikan mas.',
            ],
            [
                'name' => 'Pelet Hi-Pro-Vite 781-1',
                'category' => 'Pakan Ikan',
                'price' => 17000,
                'stock' => 50,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pelet apung ukuran kecil (781-1) untuk benih & bibit ikan.',
            ],
            [
                'name' => 'Pelet Hi-Pro-Vite 781-2',
                'category' => 'Pakan Ikan',
                'price' => 17000,
                'stock' => 50,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pelet apung ukuran sedang (781-2) untuk tahap pertumbuhan ikan.',
            ],
            [
                'name' => 'Pelet Hi-Pro-Vite 781-3',
                'category' => 'Pakan Ikan',
                'price' => 17000,
                'stock' => 50,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pelet apung ukuran besar (781-3) untuk pembesaran ikan dewasa.',
            ],
            [
                'name' => 'Pelet Takari Besar',
                'category' => 'Pakan Ikan',
                'price' => 10000,
                'stock' => 30,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pelet pakan ikan hias Takari kemasan besar untuk koki, koi, & cichlid.',
            ],
            [
                'name' => 'Pelet Takari Kecil',
                'category' => 'Pakan Ikan',
                'price' => 5000,
                'stock' => 40,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pelet pakan ikan hias Takari kemasan ekonomis kecil.',
            ],

            // Pakan Burung & Hewan
            [
                'name' => 'Kenari Set',
                'category' => 'Pakan Burung & Hewan',
                'price' => 14000,
                'stock' => 35,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Campuran biji-bijian racikan bernutrisi tinggi khusus burung kenari.',
            ],
            [
                'name' => 'Milet Putih / Merah',
                'category' => 'Pakan Burung & Hewan',
                'price' => 10000,
                'stock' => 80,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Biji milet bersih pilihan untuk pakan lovebird, parkit, & kenari.',
            ],
            [
                'name' => 'Ebod Canary',
                'category' => 'Pakan Burung & Hewan',
                'price' => 10000,
                'stock' => 30,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pakan racikan spesialis Ebod Canary untuk stamina & suara gacor burung.',
            ],
            [
                'name' => 'Topsong Pakan Burung',
                'category' => 'Pakan Burung & Hewan',
                'price' => 14000,
                'stock' => 45,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Voer Topsong kaya gizi & vitamin untuk murai batu, kacer, anis, & cucak.',
            ],
            [
                'name' => 'Phoenix Pakan Burung',
                'category' => 'Pakan Burung & Hewan',
                'price' => 12000,
                'stock' => 50,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pakan istimewa Phoenix ber-vitamin tinggi untuk burung perkutut & ocean.',
            ],
            [
                'name' => 'Gold Coin Burung',
                'category' => 'Pakan Burung & Hewan',
                'price' => 12000,
                'stock' => 40,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pakan burung ramuan herbal Gold Coin untuk menjaga kesehatan vocal.',
            ],
            [
                'name' => 'Bolt Cat Food (Pakan Kucing 1kg)',
                'category' => 'Pakan Burung & Hewan',
                'price' => 22000,
                'stock' => 25,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pakan kering kucing Bolt 1kg bernutrisi tinggi rasa tuna & ayam.',
            ],
            [
                'name' => 'Pakan Kelinci (Pelet Kelinci)',
                'category' => 'Pakan Burung & Hewan',
                'price' => 10000,
                'stock' => 30,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Pelet pakan serat tinggi sehat untuk kelinci & marmut.',
            ],
            [
                'name' => 'Leopard Pakan Burung Halus',
                'category' => 'Pakan Burung & Hewan',
                'price' => 9000,
                'stock' => 35,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Voer pelet halus Leopard untuk burung pleci, ciblek, & prenjak.',
            ],

            // Umpan Pancing
            [
                'name' => 'Umpan Jitu Merah',
                'category' => 'Umpan Pancing',
                'price' => 1500,
                'stock' => 200,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Umpan instan racikan amis harum jitu untuk mancing ikan mas & lele.',
            ],
            [
                'name' => 'Umpan Jitu Biru',
                'category' => 'Umpan Pancing',
                'price' => 1500,
                'stock' => 200,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Umpan instan racikan wangi gurih untuk mancing harian & galatama.',
            ],
            [
                'name' => 'Umpan Kinoy (Pengeras)',
                'category' => 'Umpan Pancing',
                'price' => 1000,
                'stock' => 250,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Tepung Kinoy murni sebagai pengeras umpan pancing ikan mas & patin.',
            ],
            [
                'name' => 'Umpan Raja Udang',
                'category' => 'Umpan Pancing',
                'price' => 5000,
                'stock' => 60,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Umpan tepung ekstrak udang rebon asli dengan daya pikat tinggi.',
            ],
            [
                'name' => 'Umpan Pancing 786',
                'category' => 'Umpan Pancing',
                'price' => 6000,
                'stock' => 50,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Umpan olahan spesial 786 siap pakai untuk mancing kolam & galatama.',
            ],

            // Essen Pancing
            [
                'name' => 'Essen Udang (10ml)',
                'category' => 'Essen Pancing',
                'price' => 15000,
                'stock' => 25,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Essen aroma udang murni 10ml penarik nafsu makan ikan mas, lele & bawal.',
            ],
            [
                'name' => 'Essen Kepiting (10ml)',
                'category' => 'Essen Pancing',
                'price' => 20000,
                'stock' => 20,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Essen ekstrak kepiting 10ml dengan aroma amis gurih pekat.',
            ],
            [
                'name' => 'Essen Stroberi (10ml)',
                'category' => 'Essen Pancing',
                'price' => 10000,
                'stock' => 30,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Essen aroma buah stroberi 10ml wangi segar pencetus keaktifan ikan.',
            ],
            [
                'name' => 'Essen Daging (10ml)',
                'category' => 'Essen Pancing',
                'price' => 20000,
                'stock' => 20,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Essen aroma olahan daging sapi pilihan berkarakter amis gurih dominan.',
            ],

            // Alat & Aksesoris Pancing
            [
                'name' => 'Koja Jaring Ikan (1m x 25cm)',
                'category' => 'Alat & Aksesoris Pancing',
                'price' => 25000,
                'stock' => 15,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Jaring tempat menyimpan tangkapan ikan di air ukuran panjang 1 meter.',
            ],
            [
                'name' => 'Sairan / Serokan Ikan Kecil',
                'category' => 'Alat & Aksesoris Pancing',
                'price' => 15000,
                'stock' => 20,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Serokan saringan ikan gagang kuat & jaring halus ukuran kecil.',
            ],
            [
                'name' => 'Sairan / Serokan Ikan Besar',
                'category' => 'Alat & Aksesoris Pancing',
                'price' => 25000,
                'stock' => 15,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Serokan saringan ikan gagang tebal & jaring lapis kuat ukuran besar.',
            ],
            [
                'name' => 'Benang Pancing (per Meter)',
                'category' => 'Alat & Aksesoris Pancing',
                'price' => 300,
                'stock' => 500,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Benang senar pancing serbaguna berkualitas tinggi (harga per meter).',
            ],
            [
                'name' => 'Timah Daun Pemberat',
                'category' => 'Alat & Aksesoris Pancing',
                'price' => 1000,
                'stock' => 300,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Timah daun pemberat lembaran mudah dipotong & disesuaikan pada senar.',
            ],
            [
                'name' => 'Joran Pancing Anak',
                'category' => 'Alat & Aksesoris Pancing',
                'price' => 15000,
                'stock' => 25,
                'image' => '/images/products/placeholder.jpg',
                'description' => 'Joran pancing mini lentur, ringan, & praktis khusus untuk anak-anak.',
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
