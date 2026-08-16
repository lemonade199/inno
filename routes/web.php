<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

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

use App\Http\Controllers\ProductController;
Route::get('/api/products', [ProductController::class, 'index']);
Route::get('/api/products/{id}', [ProductController::class, 'show']);
Route::post('/api/products', [ProductController::class, 'store']);
Route::put('/api/products/{id}', [ProductController::class, 'update']);
Route::delete('/api/products/{id}', [ProductController::class, 'destroy']);


