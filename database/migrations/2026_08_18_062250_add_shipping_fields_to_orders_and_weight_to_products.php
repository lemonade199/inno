<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->integer('weight')->default(500); // weight in grams
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_method')->nullable(); // pickup, delivery
            $table->string('shipping_courier')->nullable();
            $table->string('shipping_service')->nullable();
            $table->string('shipping_etd')->nullable();
            $table->string('shipping_province_id')->nullable();
            $table->string('shipping_province')->nullable();
            $table->string('shipping_city_id')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_district_id')->nullable();
            $table->string('shipping_district')->nullable();
            $table->string('shipping_postal_code')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('weight');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_method',
                'shipping_courier',
                'shipping_service',
                'shipping_etd',
                'shipping_province_id',
                'shipping_province',
                'shipping_city_id',
                'shipping_city',
                'shipping_district_id',
                'shipping_district',
                'shipping_postal_code',
            ]);
        });
    }
};
