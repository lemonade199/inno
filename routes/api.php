<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public Products APIs
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Webhooks
Route::post('/payment/notification', [PaymentController::class, 'handleWebhook']);

// Authenticated Endpoints (Customer & Admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Orders (Customer facing)
    Route::post('/payment/create', [PaymentController::class, 'createPayment']);
    Route::get('/payment/status/{order_id_db}', [PaymentController::class, 'checkStatus']);
    Route::get('/payment/sync/{order_id_db}', [PaymentController::class, 'syncPayment']);
    Route::get('/orders', [PaymentController::class, 'getOrders']);
    Route::get('/orders/{id}', [PaymentController::class, 'getOrderById']);
});

// Admin Only Endpoints
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::put('/admin/orders/{id}/status', [PaymentController::class, 'updateStatus']);
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::put('/admin/products/{id}', [ProductController::class, 'update']);
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/admin/orders', [PaymentController::class, 'getOrders']);
});
