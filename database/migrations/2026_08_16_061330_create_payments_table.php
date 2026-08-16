<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id_db')->constrained('orders')->onDelete('cascade');
            $table->string('order_id_midtrans')->unique()->comment('Midtrans unique string Order ID');
            $table->string('transaction_id')->nullable();
            $table->string('payment_type')->nullable();
            $table->decimal('gross_amount', 12, 2);
            $table->string('transaction_status')->nullable();
            $table->string('fraud_status')->nullable();
            $table->string('payment_status')->default('pending');
            $table->string('snap_token')->nullable();
            $table->dateTime('transaction_time')->nullable();
            $table->dateTime('settlement_time')->nullable();
            $table->json('raw_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
