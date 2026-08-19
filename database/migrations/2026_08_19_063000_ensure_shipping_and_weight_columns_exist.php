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
            if (!Schema::hasColumn('products', 'weight')) {
                $table->integer('weight')->default(500)->after('stock');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'shipping_method')) {
                $table->string('shipping_method')->nullable()->after('status');
            }
            if (!Schema::hasColumn('orders', 'shipping_courier')) {
                $table->string('shipping_courier')->nullable()->after('shipping_method');
            }
            if (!Schema::hasColumn('orders', 'shipping_service')) {
                $table->string('shipping_service')->nullable()->after('shipping_courier');
            }
            if (!Schema::hasColumn('orders', 'shipping_etd')) {
                $table->string('shipping_etd')->nullable()->after('shipping_service');
            }
            if (!Schema::hasColumn('orders', 'shipping_province_id')) {
                $table->string('shipping_province_id')->nullable()->after('shipping_etd');
            }
            if (!Schema::hasColumn('orders', 'shipping_province')) {
                $table->string('shipping_province')->nullable()->after('shipping_province_id');
            }
            if (!Schema::hasColumn('orders', 'shipping_city_id')) {
                $table->string('shipping_city_id')->nullable()->after('shipping_province');
            }
            if (!Schema::hasColumn('orders', 'shipping_city')) {
                $table->string('shipping_city')->nullable()->after('shipping_city_id');
            }
            if (!Schema::hasColumn('orders', 'shipping_district_id')) {
                $table->string('shipping_district_id')->nullable()->after('shipping_city');
            }
            if (!Schema::hasColumn('orders', 'shipping_district')) {
                $table->string('shipping_district')->nullable()->after('shipping_district_id');
            }
            if (!Schema::hasColumn('orders', 'shipping_postal_code')) {
                $table->string('shipping_postal_code')->nullable()->after('shipping_district');
            }
            if (!Schema::hasColumn('orders', 'tracking_number')) {
                $table->string('tracking_number')->nullable()->after('shipping_postal_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'weight')) {
                $table->dropColumn('weight');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            $cols = [
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
                'tracking_number',
            ];
            foreach ($cols as $c) {
                if (Schema::hasColumn('orders', $c)) {
                    $table->dropColumn($c);
                }
            }
        });
    }
};
