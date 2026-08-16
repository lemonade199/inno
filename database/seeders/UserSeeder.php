<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrator Utama',
            'email' => 'admin@berkahpancing.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081299887766',
            'address' => 'HQ Berkah Pancing, Jakarta',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        ]);

        User::create([
            'name' => 'Juli Anto',
            'email' => 'julianto@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 45, Jakarta Selatan',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@yahoo.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '085711223344',
            'address' => 'Jl. Anggrek No. 12, Bandung',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        ]);

        User::create([
            'name' => 'Andi Wijaya',
            'email' => 'andi.w@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '081344556677',
            'address' => 'Jl. Gajah Mada No. 101, Semarang',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        ]);
    }
}
