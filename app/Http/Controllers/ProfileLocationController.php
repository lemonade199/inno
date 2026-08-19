<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileLocationController extends Controller
{
    /**
     * Render tampilan Halaman Alamat Profil Pengguna (Blade View).
     */
    public function renderView(Request $request)
    {
        $user = Auth::user() ?? User::first();
        return view('profile.address', ['user' => $user]);
    }

    /**
     * Tampilkan informasi alamat dan lokasi latitude/longitude pengguna yang sedang login.
     */
    public function show(Request $request)
    {
        $user = Auth::user() ?? User::first(); // Fallback ke user pertama untuk demonstrasi jika belum ada sesi auth

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'address' => $user->address ?? 'Lokasi belum ditentukan',
                'latitude' => $user->latitude ? (float)$user->latitude : -6.9388,
                'longitude' => $user->longitude ? (float)$user->longitude : 107.7183,
                'has_location' => !is_null($user->latitude) && !is_null($user->longitude),
            ]
        ]);
    }

    /**
     * Update data alamat, latitude, dan longitude pengguna dengan validasi ketat.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string|max:500',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ], [
            'address.required' => 'Alamat lengkap wajib diisi.',
            'latitude.between' => 'Latitude harus bernilai antara -90 hingga 90 derajat.',
            'longitude.between' => 'Longitude harus bernilai antara -180 hingga 180 derajat.',
        ]);

        $user = Auth::user() ?? User::first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak terautentikasi'
            ], 401);
        }

        $user->update([
            'address' => $validated['address'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil disimpan ke database!',
            'data' => [
                'address' => $user->address,
                'latitude' => (float)$user->latitude,
                'longitude' => (float)$user->longitude,
            ]
        ]);
    }

    /**
     * Endpoint khusus konfirmasi alamat.
     * Data HANYA disimpan ke database ketika pengguna menekan tombol "Konfirmasi Alamat".
     */
    public function confirmLocation(Request $request)
    {
        $validated = $request->validate([
            'address'   => 'required|string|max:500',
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ], [
            'address.required'  => 'Alamat preview hasil geocoding wajib ada sebelum mengonfirmasi.',
            'latitude.between'  => 'Latitude harus bernilai antara -90 hingga 90 derajat.',
            'longitude.between' => 'Longitude harus bernilai antara -180 hingga 180 derajat.',
        ]);

        $user = Auth::user() ?? User::first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak terautentikasi'
            ], 401);
        }

        // HANYA simpan lokasi TERAKHIR yang dikonfirmasi pengguna
        $user->update([
            'address'   => $validated['address'],
            'latitude'  => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil dikonfirmasi dan disimpan.',
            'data'    => [
                'address'   => $user->address,
                'latitude'  => (float)$user->latitude,
                'longitude' => (float)$user->longitude,
            ]
        ]);
    }
}
