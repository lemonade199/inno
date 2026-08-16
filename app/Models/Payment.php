<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id_db',
        'order_id_midtrans',
        'transaction_id',
        'payment_type',
        'gross_amount',
        'transaction_status',
        'fraud_status',
        'payment_status',
        'snap_token',
        'transaction_time',
        'settlement_time',
        'raw_response'
    ];

    protected $casts = [
        'raw_response' => 'array',
        'transaction_time' => 'datetime',
        'settlement_time' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id_db');
    }
}
