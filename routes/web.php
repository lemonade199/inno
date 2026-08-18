<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileLocationController;

Route::get('/', function () {
    return view('welcome');
});

// Endpoint Pembayaran Midtrans
Route::post('/api/payment/create', [PaymentController::class, 'createPayment']);
Route::post('/api/payment/notification', [PaymentController::class, 'handleWebhook']);
Route::get('/api/payment/status/{order_id_db}', [PaymentController::class, 'checkStatus']);
Route::get('/api/payment/sync/{order_id_db}', [PaymentController::class, 'syncPayment']);

Route::get('/api/orders', [PaymentController::class, 'getOrders']);
Route::get('/api/orders/{id}', [PaymentController::class, 'getOrderById']);
Route::put('/api/admin/orders/{id}/status', [PaymentController::class, 'updateStatus']);

Route::get('/api/products', [ProductController::class, 'index']);
Route::get('/api/products/{id}', [ProductController::class, 'show']);
Route::post('/api/products', [ProductController::class, 'store']);
Route::put('/api/products/{id}', [ProductController::class, 'update']);
Route::delete('/api/products/{id}', [ProductController::class, 'destroy']);

// Endpoint Profil & Lokasi OpenStreetMap User
Route::get('/profile/address', [ProfileLocationController::class, 'renderView'])->name('profile.address');
Route::get('/api/user/location', [ProfileLocationController::class, 'show']);
Route::post('/api/user/location', [ProfileLocationController::class, 'update']);
Route::put('/api/user/location', [ProfileLocationController::class, 'update']);
Route::post('/api/user/location/confirm', [ProfileLocationController::class, 'confirmLocation']);
