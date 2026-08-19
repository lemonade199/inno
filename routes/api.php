<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileLocationController;
use App\Http\Controllers\ShippingController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public APIs - Browsing products & categories without login
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Shipping APIs
Route::get('/shipping/provinces', [ShippingController::class, 'getProvinces']);
Route::get('/shipping/cities/{provinceId}', [ShippingController::class, 'getCities']);
Route::post('/shipping/cost', [ShippingController::class, 'calculateCost']);

// Webhooks
Route::post('/payment/notification', [PaymentController::class, 'handleWebhook']);

// Authenticated Endpoints (Customer & Admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // User Location & OpenStreetMap
    Route::get('/user/location', [ProfileLocationController::class, 'show']);
    Route::post('/user/location', [ProfileLocationController::class, 'update']);
    Route::put('/user/location', [ProfileLocationController::class, 'update']);
    Route::post('/user/location/confirm', [ProfileLocationController::class, 'confirmLocation']);

    // Orders & Payment (Customer facing)
    Route::post('/payment/create', [PaymentController::class, 'createPayment']);
    Route::get('/payment/status/{order_id_db}', [PaymentController::class, 'checkStatus']);
    Route::get('/payment/sync/{order_id_db}', [PaymentController::class, 'syncPayment']);
    Route::get('/orders', [PaymentController::class, 'getOrders']);
    Route::get('/orders/{id}', [PaymentController::class, 'getOrderById']);
    Route::put('/orders/{id}/confirm-received', [PaymentController::class, 'confirmReceived']);
});

// Admin Only Endpoints
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::put('/admin/orders/{id}/status', [PaymentController::class, 'updateStatus']);
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::put('/admin/products/{id}', [ProductController::class, 'update']);
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/admin/orders', [PaymentController::class, 'getOrders']);

    // Categories CRUD
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);
});

