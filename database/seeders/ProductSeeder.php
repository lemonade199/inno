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
        $products = [
            [
                'name' => 'Joran Pancing Shimano SpeedMaster 210',
                'category' => 'Joran',
                'price' => 1250000,
                'stock' => 15,
                'image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
                'description' => 'Joran pancing carbon kelas premium tahan banting cocok untuk mancing laut dan sungai.',
            ],
            [
                'name' => 'Reel Pancing Daiwa BG 4000 Heavy Duty',
                'category' => 'Reel',
                'price' => 1850000,
                'stock' => 8,
                'image' => 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=80',
                'description' => 'Reel pancing alumunium body super smooth drag system 10kg.',
            ],
            [
                'name' => 'Senar Pancing Braided PE 4 Multi Color 300m',
                'category' => 'Senar',
                'price' => 185000,
                'stock' => 35,
                'image' => 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
                'description' => 'Senar pancing PE 8 strand tahan gesekan karang dan sangat kuat.',
            ],
            [
                'name' => 'Umpan Lure Minnow Popper Floating 15g',
                'category' => 'Umpan',
                'price' => 65000,
                'stock' => 2,
                'image' => 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=500&auto=format&fit=crop&q=80',
                'description' => 'Umpan buatan action tajam menyerupai ikan tenggiri kecil.',
            ],
            [
                'name' => 'Set Mata Kail Mustad Stainless 100pcs',
                'category' => 'Mata Kail',
                'price' => 95000,
                'stock' => 50,
                'image' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
                'description' => 'Kail pancing tajam bebas karat ukuran 1 - 10.',
            ],
            [
                'name' => 'Tas Joran Pancing Waterproof 150cm',
                'category' => 'Aksesoris',
                'price' => 240000,
                'stock' => 5,
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
                'description' => 'Tas joran busa tebal waterproof muat 4 set joran + reel.',
            ],
            [
                'name' => 'Joran Penn Pursuit III Spinning Rod 1.8m',
                'category' => 'Joran',
                'price' => 980000,
                'stock' => 10,
                'image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
                'description' => 'Joran tangguh berbahan dasar fiberglass komposit tinggi.',
            ],
            [
                'name' => 'Reel Shimano Vanford C3000 HG',
                'category' => 'Reel',
                'price' => 3100000,
                'stock' => 4,
                'image' => 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=80',
                'description' => 'Reel ultra ringan dengan rotor MGL super responsif.',
            ]
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
