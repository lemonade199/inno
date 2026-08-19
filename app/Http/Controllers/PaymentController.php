<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MidtransService;
use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function createPayment(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Silakan login terlebih dahulu untuk melakukan checkout.'], 401);
        }

        $request->validate([
            'customerName' => 'required',
            'customerEmail' => 'required',
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $subtotal = 0;
            $paymentMethod = $request->paymentMethod ?? 'Midtrans';
            $shippingFee = ($paymentMethod === 'COD' || $paymentMethod === 'Cash') ? 0 : ($request->shippingFee ?? 0);
            $itemsData = [];

            // Sort product IDs to prevent deadlock
            $productIds = collect($request->items)->pluck('id')->sort()->values()->all();
            
            // Lock all products needed for update
            $products = \App\Models\Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

            foreach ($request->items as $item) {
                $productId = $item['id'];
                $qty = $item['qty'];

                if (!$products->has($productId)) {
                    throw new \Exception("Product ID not found: $productId");
                }

                $product = $products[$productId];

                if ($product->stock < $qty) {
                    return response()->json(['message' => "Stok produk {$product->name} tidak mencukupi. Tersedia: {$product->stock}"], 422);
                }

                $subtotal += $product->price * $qty;
                
                $itemsData[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'qty' => $qty,
                    'image' => $product->image,
                    'model' => $product
                ];
            }

            $total = $subtotal + $shippingFee;
            $orderIdMidtrans = 'TRX-' . time() . '-' . rand(100, 999);

            $order = Order::create([
                'order_id_midtrans' => $orderIdMidtrans,
                'user_id' => $user->id,
                'customer_name' => $request->customerName,
                'customer_email' => $request->customerEmail,
                'customer_phone' => $request->customerPhone ?? '-',
                'address' => ($paymentMethod === 'COD' || $paymentMethod === 'Cash')
                    ? ($request->address ? $request->address . ' (Ambil di Toko / COD)' : 'Ambil di Toko Berkah Pancing')
                    : ($request->address ?? '-'),
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'payment_method' => $paymentMethod,
                'status' => 'pending',
            ]);

            foreach ($itemsData as $data) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $data['product_id'],
                    'name' => $data['name'],
                    'price' => $data['price'],
                    'qty' => $data['qty'],
                    'image' => $data['image'],
                ]);

                // Reduce stock
                $data['model']->decrement('stock', $data['qty']);
            }

            if ($paymentMethod === 'Cash' || $paymentMethod === 'COD') {
                Payment::create([
                    'order_id_db' => $order->id,
                    'order_id_midtrans' => $orderIdMidtrans,
                    'gross_amount' => $order->total,
                    'payment_status' => 'pending',
                    'snap_token' => null,
                ]);

                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'token' => null,
                    'order_id_db' => $order->id,
                    'order_id_midtrans' => $orderIdMidtrans,
                    'data' => $order
                ], 201);
            }

            // Midtrans flow
            $token = null;
            try {
                $token = $this->midtransService->createTransaction($order);
            } catch (\Exception $e) {
                $token = 'DEMO-SNAP-TOKEN-' . rand(1000, 9999);
            }

            $order->update(['snap_token' => $token]);
            
            Payment::create([
                'order_id_db' => $order->id,
                'order_id_midtrans' => $orderIdMidtrans,
                'gross_amount' => $order->total,
                'payment_status' => 'pending',
                'snap_token' => $token,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'token' => $token,
                'order_id_db' => $order->id,
                'order_id_midtrans' => $orderIdMidtrans,
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
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
        $previousStatus = $order->status;
        
        $order->status = $inputStatus;
        if ($request->has('trackingNumber') && $request->trackingNumber != '') {
            $order->tracking_number = $request->trackingNumber;
        }

        try {
            DB::beginTransaction();

            if ($inputStatus === 'cancelled' && $previousStatus !== 'cancelled') {
                $items = OrderItem::where('order_id', $order->id)->get();
                foreach ($items as $item) {
                    $product = \App\Models\Product::lockForUpdate()->find($item->product_id);
                    if ($product) {
                        $product->increment('stock', $item->qty);
                    }
                }
            }
            
            $order->save();

            if ($request->paymentStatus && $order->payment) {
                $paymentStatusMap = [
                    'Belum Bayar' => 'pending',
                    'Lunas' => 'paid'
                ];
                $order->payment->payment_status = $paymentStatusMap[$request->paymentStatus] ?? 'paid';
                $order->payment->save();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Gagal mengubah status.'], 500);
        }

        return response()->json(['status' => 'success', 'data' => $order]);
    }

    public function getOrders(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Silakan login terlebih dahulu.'], 401);
        }

        $query = Order::with(['payment', 'items']);
        
        // If not admin, restrict to user's orders only
        if ($user->role !== 'admin') {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('customer_email', $user->email);
            });
        } elseif ($request->email) {
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
                'created_at_raw' => $o->created_at->toISOString(),
                'subtotal' => $o->subtotal,
                'shippingFee' => $o->shipping_fee,
                'total' => $o->total,
                'status' => $statusMap[$o->status] ?? $o->status,
                'paymentStatus' => $paymentStatus,
                'paymentMethod' => $o->payment_method,
                'snap_token' => $o->snap_token,
                'trackingNumber' => $o->tracking_number,
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

    public function getOrderById(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Silakan login terlebih dahulu.'], 401);
        }

        $o = Order::with(['payment', 'items'])->find($id);
        if (!$o) return response()->json(null, 404);

        // Security check: non-admin can only view their own orders
        if ($user->role !== 'admin' && $o->user_id && $o->user_id !== $user->id && $o->customer_email !== $user->email) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

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
            'trackingNumber' => $o->tracking_number,
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
