<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Administrator Utama',
            'email' => 'admin@berkahpancing.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '08000000000',
            'address' => 'Gudang Pusat Berkah Pancing'
        ]);

        User::factory()->create([
            'name' => 'Pelanggan Tes',
            'email' => 'user@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'phone' => '08123456789',
            'address' => 'Jl Sukabakti, Bandung'
        ]);

        $this->call([
            ProductSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
