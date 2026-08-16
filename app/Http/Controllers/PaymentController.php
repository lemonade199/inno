<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MidtransService;
use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderItem;

class PaymentController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function createPayment(Request $request)
    {
        $request->validate([
            'customerName' => 'required',
            'customerEmail' => 'required',
            'total' => 'required|numeric',
        ]);

        $orderIdMidtrans = 'TRX-' . time() . '-' . rand(100, 999);

        $paymentMethod = $request->paymentMethod ?? 'Midtrans';

        // Buat Order 
        $order = Order::create([
            'order_id_midtrans' => $orderIdMidtrans,
            'customer_name' => $request->customerName,
            'customer_email' => $request->customerEmail,
            'customer_phone' => $request->customerPhone ?? '-',
            'address' => $request->address ?? '-',
            'subtotal' => $request->subtotal ?? ($request->total - 20000),
            'shipping_fee' => $request->shippingFee ?? 20000,
            'total' => $request->total,
            'payment_method' => $paymentMethod,
            'status' => $paymentMethod === 'Cash' ? 'paid' : 'pending',
        ]);

        if ($request->items && is_array($request->items)) {
            foreach ($request->items as $item) {
                $productId = $item['id'] ?? null;
                if ($productId) {
                    $exists = \App\Models\Product::find($productId);
                    if (!$exists) $productId = null;
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productId,
                    'name' => $item['name'] ?? 'Product Unnamed',
                    'price' => $item['price'] ?? 0,
                    'qty' => $item['qty'] ?? 1,
                    'image' => $item['image'] ?? null,
                ]);
            }
        }

        if ($paymentMethod === 'Cash') {
            Payment::create([
                'order_id_db' => $order->id,
                'order_id_midtrans' => $orderIdMidtrans,
                'gross_amount' => $order->total,
                'payment_status' => 'paid',
                'snap_token' => null,
            ]);

            return response()->json([
                'status' => 'success',
                'token' => null,
                'order_id_db' => $order->id, 
                'order_id_midtrans' => $orderIdMidtrans,
                'data' => $order
            ]);
        }

        try {
            $token = $this->midtransService->createTransaction($order);
            
            $order->update(['snap_token' => $token]);
            
            Payment::create([
                'order_id_db' => $order->id,
                'order_id_midtrans' => $orderIdMidtrans,
                'gross_amount' => $order->total,
                'payment_status' => 'pending',
                'snap_token' => $token,
            ]);

            return response()->json([
                'status' => 'success',
                'token' => $token,
                'order_id_db' => $order->id, 
                'order_id_midtrans' => $orderIdMidtrans,
                'data' => $order
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        $result = $this->midtransService->handleNotification($payload);

        if ($result['status'] === 'error') {
            return response()->json(['message' => $result['message']], 400);
        }

        return response()->json(['message' => 'OK']);
    }

    public function syncPayment($order_id_db)
    {
        $order = Order::find($order_id_db);
        if ($order) {
            $this->midtransService->syncTransaction($order->order_id_midtrans);
        }
        return response()->json(['status' => 'synced']);
    }

    public function checkStatus($order_id_db)
    {
        $order = Order::with('payment')->find($order_id_db);
        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Not found'], 404);
        }
        
        return response()->json([
            'order_id_db' => $order->id,
            'order_id_midtrans' => $order->order_id_midtrans,
            'status' => $order->status,
            'payment_status' => $order->payment ? $order->payment->payment_status : 'expired',
            'snap_token' => $order->snap_token,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Not found'], 404);
        }

        $inputStatus = $request->status;
        
        $dbStatusMap = [
            'Menunggu Pembayaran' => 'pending',
            'Diproses' => 'paid',
            'Dikirim' => 'paid', // just keeping it paid in midtrans logic but maybe we should map frontent string back to db correctly
            'Selesai' => 'paid',
            'Dibatalkan' => 'cancelled'
        ];

        // Let's just directly store the string for now, but wait! The frontend relies on mapping!
        // In getOrders: 
        // $statusMap = ['pending' => 'Menunggu Pembayaran', 'paid' => 'Diproses', 'expired' => 'Dibatalkan', 'cancelled' => 'Dibatalkan', 'failed' => 'Dibatalkan'];
        // If the admin sends 'Dikirim', we should probably just store it as 'Dikirim' and handle it if we want.
        // Actually, we can add 'Dikirim', 'Selesai' to DB straight away!
        $order->status = $inputStatus;
        $order->save();

        if ($request->paymentStatus && $order->payment) {
            $paymentStatusMap = [
                'Belum Bayar' => 'pending',
                'Lunas' => 'paid'
            ];
            $order->payment->payment_status = $paymentStatusMap[$request->paymentStatus] ?? 'paid';
            $order->payment->save();
        }

        return response()->json(['status' => 'success', 'data' => $order]);
    }

    public function getOrders(Request $request)
    {
        $query = Order::with(['payment', 'items']);
        if ($request->email) {
            $query->where('customer_email', $request->email);
        }
        $orders = $query->orderBy('created_at', 'desc')->get()->map(function($o) {
            $statusMap = ['pending' => 'Menunggu Pembayaran', 'paid' => 'Diproses', 'expired' => 'Dibatalkan', 'cancelled' => 'Dibatalkan', 'failed' => 'Dibatalkan'];
            $paymentStatus = $o->payment ? ($o->payment->payment_status === 'paid' ? 'Lunas' : 'Belum Bayar') : 'Belum Bayar';

            return [
                'id' => $o->id,
                'order_id_midtrans' => $o->order_id_midtrans,
                'customerName' => $o->customer_name,
                'customerEmail' => $o->customer_email,
                'customerPhone' => $o->customer_phone,
                'address' => $o->address,
                'date' => $o->created_at->format('d F Y'),
                'subtotal' => $o->subtotal,
                'shippingFee' => $o->shipping_fee,
                'total' => $o->total,
                'status' => $statusMap[$o->status] ?? $o->status,
                'paymentStatus' => $paymentStatus,
                'paymentMethod' => $o->payment_method,
                'snap_token' => $o->snap_token,
                'items' => $o->items->map(function($i) {
                    return [
                        'id' => $i->product_id,
                        'name' => $i->name ?? 'Product ' . $i->product_id,
                        'qty' => $i->qty,
                        'price' => $i->price,
                        'image' => $i->image ?? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500' 
                    ];
                })
            ];
        });
        return response()->json($orders);
    }

    public function getOrderById($id)
    {
        $o = Order::with(['payment', 'items'])->find($id);
        if (!$o) return response()->json(null);

        $statusMap = ['pending' => 'Menunggu Pembayaran', 'paid' => 'Diproses', 'expired' => 'Dibatalkan', 'cancelled' => 'Dibatalkan', 'failed' => 'Dibatalkan'];
        $paymentStatus = $o->payment ? ($o->payment->payment_status === 'paid' ? 'Lunas' : 'Belum Bayar') : 'Belum Bayar';

        return response()->json([
            'id' => $o->id,
            'order_id_midtrans' => $o->order_id_midtrans,
            'customerName' => $o->customer_name,
            'customerEmail' => $o->customer_email,
            'customerPhone' => $o->customer_phone,
            'address' => $o->address,
            'date' => $o->created_at->format('d F Y'),
            'subtotal' => $o->subtotal,
            'shippingFee' => $o->shipping_fee,
            'total' => $o->total,
            'status' => $statusMap[$o->status] ?? $o->status,
            'paymentStatus' => $paymentStatus,
            'paymentMethod' => $o->payment_method,
            'snap_token' => $o->snap_token,
            'items' => $o->items->map(function($i) {
                return [
                    'id' => $i->product_id,
                    'name' => $i->name ?? 'Product ' . $i->product_id,
                    'qty' => $i->qty,
                    'price' => $i->price,
                    'image' => $i->image ?? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500' 
                ];
            })
        ]);
    }
}
