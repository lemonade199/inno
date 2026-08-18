<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id_midtrans',
        'snap_token',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'address',
        'subtotal',
        'shipping_fee',
        'total',
        'payment_method',
        'status',
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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id_db');
    }
}
