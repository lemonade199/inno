<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ShippingService;
use App\Models\Product;

class ShippingController extends Controller
{
    protected $shippingService;

    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
    }

    public function getProvinces()
    {
        try {
            $provinces = $this->shippingService->getProvinces();
            return response()->json(['status' => 'success', 'data' => $provinces]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function getCities($provinceId)
    {
        try {
            $cities = $this->shippingService->getCities($provinceId);
            return response()->json(['status' => 'success', 'data' => $cities]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function calculateCost(Request $request)
    {
        $request->validate([
            'destination_city_id' => 'required',
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.qty' => 'required|integer|min:1',
            'courier' => 'nullable|string'
        ]);

        try {
            $productIds = collect($request->items)->pluck('id')->unique();
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            $totalWeight = 0;
            foreach ($request->items as $item) {
                if ($products->has($item['id'])) {
                    $weight = $products[$item['id']]->weight > 0 ? $products[$item['id']]->weight : 500;
                    $totalWeight += $weight * $item['qty'];
                }
            }

            if ($totalWeight === 0) {
                $totalWeight = 1000; // default minimum weight
            }

            $courier = $request->courier ?? 'jne';
            
            $cost = $this->shippingService->calculateCost(
                $request->destination_city_id,
                $totalWeight,
                $courier
            );

            return response()->json([
                'status' => 'success',
                'data' => [
                    'weight' => $totalWeight,
                    'shipping' => $cost
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
