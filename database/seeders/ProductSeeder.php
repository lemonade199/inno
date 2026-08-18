<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Joran Daido Maguro 180cm',
                'description' => 'Joran pancing kuat, tahan beban hingga 10kg. Cocok untuk laut.',
                'price' => 150000,
                'stock' => 20,
                'category' => 'Joran',
                'image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Reel Shimano Sienna 4000',
                'description' => 'Reel spinning yang ringan dan sangat nyaman diputar.',
                'price' => 450000,
                'stock' => 15,
                'category' => 'Reel',
                'image' => 'https://images.unsplash.com/photo-1516684784402-990a8a666e6d?w=500&auto=format&fit=crop&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Senar PE 3 Berkley',
                'description' => 'Senar pancing paling kuat sedunia, sulit putus nyangkut batu.',
                'price' => 75000,
                'stock' => 50,
                'category' => 'Senar',
                'image' => 'https://images.unsplash.com/photo-1533034960301-db2dfc4f1c90?w=500&auto=format&fit=crop&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Essen Ikan Mas Sari Pandan',
                'description' => 'Rahasia strike bertubi-tubi bagi pemancing galatama.',
                'price' => 25000,
                'stock' => 2,
                'category' => 'Essen',
                'image' => 'https://images.unsplash.com/photo-1522276498395-f4f68f71833b?w=500&auto=format&fit=crop&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        DB::table('products')->insert($products);
    }
}
