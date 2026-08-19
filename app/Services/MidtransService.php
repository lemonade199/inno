<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;
use Midtrans\Transaction;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key') ?? env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = config('midtrans.is_production') ?? env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createTransaction(Order $order)
    {
        $params = [
            'transaction_details' => [
                'order_id' => $order->order_id_midtrans,
                'gross_amount' => (int) $order->total,
            ],
            'customer_details' => [
                'first_name' => $order->customer_name,
                'email' => $order->customer_email,
                'phone' => $order->customer_phone,
            ],
            'callbacks' => [
                'finish' => (env('FRONTEND_URL') ?? env('APP_URL') ?? 'http://localhost:5173') . '/orders/' . $order->id,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return $snapToken;
        } catch (\Exception $e) {
            Log::error('Midtrans Snap Error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function handleNotification($payload)
    {
        try {
            $notification = new Notification();
        } catch (\Exception $e) {
            // In local/testing where mock payloads are sent directly via JSON, Midtrans\Notification might fail resolving from $_POST.
            // We fallback to parsed array.
            $notification = (object) $payload;
        }

        $orderIdMidtrans = $notification->order_id;
        $transactionStatus = $notification->transaction_status;
        $fraudStatus = $notification->fraud_status ?? null;
        $grossAmount = $notification->gross_amount;
        $signatureKey = $notification->signature_key ?? null;

        // Validasi Signature
        $serverKey = Config::$serverKey;
        $calculatedSignature = hash('sha512', $orderIdMidtrans . $notification->status_code . $grossAmount . $serverKey);
        
        if ($signatureKey && $calculatedSignature !== $signatureKey) {
            Log::warning("Midtrans Invalid Signature for Order: $orderIdMidtrans");
            return ['status' => 'error', 'message' => 'Invalid signature key'];
        }

        $order = Order::where('order_id_midtrans', $orderIdMidtrans)->first();
        if (!$order) {
            return ['status' => 'error', 'message' => 'Order not found'];
        }

        $payment = Payment::firstOrCreate(
            ['order_id_midtrans' => $orderIdMidtrans],
            [
                'order_id_db' => $order->id,
                'gross_amount' => $grossAmount,
            ]
        );

        $paymentStatus = 'pending';
        $orderStatus = 'pending';

        if ($transactionStatus == 'capture') {
            if ($fraudStatus == 'challenge') {
                $paymentStatus = 'pending';
                $orderStatus = 'pending';
            } else if ($fraudStatus == 'accept') {
                $paymentStatus = 'paid';
                $orderStatus = 'paid';
            }
        } else if ($transactionStatus == 'settlement') {
            $paymentStatus = 'paid';
            $orderStatus = 'paid';
        } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
            $paymentStatus = $transactionStatus === 'expire' ? 'expired' : ($transactionStatus === 'cancel' ? 'cancelled' : 'failed');
            $orderStatus = $paymentStatus;
        } else if ($transactionStatus == 'pending') {
            $paymentStatus = 'pending';
            $orderStatus = 'pending';
        }

        // Hindari update dobel jika sudah paid (Idempotency)
        if ($payment->payment_status === 'paid' && $paymentStatus === 'paid') {
            return ['status' => 'success', 'message' => 'Already paid'];
        }

        $payment->update([
            'transaction_id' => $notification->transaction_id ?? $payment->transaction_id,
            'payment_type' => $notification->payment_type ?? $payment->payment_type,
            'transaction_status' => $transactionStatus,
            'fraud_status' => $fraudStatus,
            'payment_status' => $paymentStatus,
            'raw_response' => $payload,
            'transaction_time' => isset($notification->transaction_time) ? date('Y-m-d H:i:s', strtotime($notification->transaction_time)) : null,
            'settlement_time' => isset($notification->settlement_time) ? date('Y-m-d H:i:s', strtotime($notification->settlement_time)) : null,
        ]);

        $order->update(['status' => $orderStatus]);

        if ($orderStatus === 'paid') {
            foreach($order->items as $item) {
                $product = \App\Models\Product::find($item->product_id);
                if ($product) {
                    $product->decrement('stock', $item->qty);
                }
            }
        }

        return ['status' => 'success', 'message' => "Payment status updated to $paymentStatus"];
    }

    public function syncTransaction($orderIdMidtrans)
    {
        try {
            $status = Transaction::status($orderIdMidtrans);
            // Re-use logic from handleNotification
            return $this->handleNotification($status);
        } catch (\Exception $e) {
            Log::error('Midtrans Sync Error: ' . $e->getMessage());
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}
