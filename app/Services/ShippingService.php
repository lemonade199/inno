<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ShippingService
{
    protected $baseUrl;
    protected $apiKey;
    protected $originCityId;

    public function __construct()
    {
        $this->baseUrl = config('services.shipping.base_url', env('SHIPPING_BASE_URL', 'https://api.rajaongkir.com/starter'));
        $this->apiKey = config('services.shipping.api_key', env('SHIPPING_API_KEY'));
        $this->originCityId = config('services.shipping.origin_city_id', env('SHIPPING_ORIGIN_CITY_ID', '115'));
    }

    public function getProvinces()
    {
        return Cache::remember('shipping_provinces', 86400, function () {
            if (empty($this->apiKey)) {
                return [];
            }

            try {
                $response = Http::timeout(3)->withHeaders([
                    'key' => $this->apiKey
                ])->get("{$this->baseUrl}/province");

                if ($response->successful()) {
                    return $response->json()['rajaongkir']['results'] ?? [];
                }
            } catch (\Exception $e) {
                Log::warning('RajaOngkir getProvinces failed/timeout: ' . $e->getMessage());
            }

            return [];
        });
    }

    public function getCities($provinceId)
    {
        return Cache::remember("shipping_cities_{$provinceId}", 86400, function () use ($provinceId) {
            if (empty($this->apiKey)) {
                return [];
            }

            try {
                $response = Http::timeout(3)->withHeaders([
                    'key' => $this->apiKey
                ])->get("{$this->baseUrl}/city", [
                    'province' => $provinceId
                ]);

                if ($response->successful()) {
                    return $response->json()['rajaongkir']['results'] ?? [];
                }
            } catch (\Exception $e) {
                Log::warning('RajaOngkir getCities failed/timeout: ' . $e->getMessage());
            }

            return [];
        });
    }

    public function calculateCost($destinationCityId, $weight, $courier = 'jne')
    {
        $cacheKey = "shipping_cost_{$destinationCityId}_{$weight}_{$courier}";
        
        return Cache::remember($cacheKey, 3600, function () use ($destinationCityId, $weight, $courier) {
            if (!empty($this->apiKey)) {
                try {
                    $response = Http::timeout(3)->withHeaders([
                        'key' => $this->apiKey
                    ])->post("{$this->baseUrl}/cost", [
                        'origin' => $this->originCityId,
                        'destination' => $destinationCityId,
                        'weight' => $weight,
                        'courier' => $courier
                    ]);

                    if ($response->successful()) {
                        $results = $response->json()['rajaongkir']['results'] ?? [];
                        if (count($results) > 0 && count($results[0]['costs']) > 0) {
                            $services = [];
                            foreach ($results[0]['costs'] as $cost) {
                                $services[] = [
                                    'code' => $cost['service'],
                                    'name' => strtoupper($courier) . " " . $cost['service'],
                                    'description' => $cost['description'],
                                    'price' => (int) ($cost['cost'][0]['value'] ?? 0),
                                    'etd' => $cost['cost'][0]['etd'] ?? '2-3 Hari',
                                ];
                            }
                            return [
                                'courier' => strtoupper($courier),
                                'services' => $services
                            ];
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning("RajaOngkir calculateCost failed/timeout (Destination: {$destinationCityId}, Weight: {$weight}): " . $e->getMessage());
                }
            }

            // Fallback estimation so checkout never fails
            return $this->getFallbackCost($weight, $courier);
        });
    }

    public function getFallbackCost($weight, $courier = 'jne')
    {
        $weightKg = max(1, (int) ceil($weight / 1000));
        return [
            'courier' => strtoupper($courier),
            'services' => [
                [
                    'code' => 'REG',
                    'name' => strtoupper($courier) . ' REG',
                    'description' => 'Layanan Reguler',
                    'price' => 15000 + ($weightKg * 5000),
                    'etd' => '2-3 Hari',
                ],
                [
                    'code' => 'OKE',
                    'name' => strtoupper($courier) . ' OKE',
                    'description' => 'Ongkos Kirim Ekonomis',
                    'price' => 10000 + ($weightKg * 3000),
                    'etd' => '4-6 Hari',
                ],
                [
                    'code' => 'YES',
                    'name' => strtoupper($courier) . ' YES',
                    'description' => 'Yakin Esok Sampai',
                    'price' => 25000 + ($weightKg * 8000),
                    'etd' => '1 Hari',
                ],
            ]
        ];
    }
}
