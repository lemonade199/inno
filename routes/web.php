<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileLocationController;

Route::get('/', function () {
    return view('welcome');
});

// Blade View for Address Geocoding (if accessed directly via browser)
Route::get('/profile/address', [ProfileLocationController::class, 'renderView'])->name('profile.address');

