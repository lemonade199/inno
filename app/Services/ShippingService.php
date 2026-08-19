<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;
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
            $response = Http::withHeaders([
                'key' => $this->apiKey
            ])->get("{$this->baseUrl}/province");

            if ($response->successful()) {
                return $response->json()['rajaongkir']['results'] ?? [];
            }

            throw new Exception("Gagal mengambil data provinsi.");
        });
    }

    public function getCities($provinceId)
    {
        return Cache::remember("shipping_cities_{$provinceId}", 86400, function () use ($provinceId) {
            $response = Http::withHeaders([
                'key' => $this->apiKey
            ])->get("{$this->baseUrl}/city", [
                'province' => $provinceId
            ]);

            if ($response->successful()) {
                return $response->json()['rajaongkir']['results'] ?? [];
            }

            throw new Exception("Gagal mengambil data kota.");
        });
    }

    public function calculateCost($destinationCityId, $weight, $courier = 'jne')
    {
        $cacheKey = "shipping_cost_{$destinationCityId}_{$weight}_{$courier}";
        
        return Cache::remember($cacheKey, 3600, function () use ($destinationCityId, $weight, $courier) {
            $response = Http::withHeaders([
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
                    foreach($results[0]['costs'] as $cost) {
                        $services[] = [
                            'code' => $cost['service'],
                            'name' => strtoupper($courier) . " " . $cost['service'],
                            'description' => $cost['description'],
                            'price' => $cost['cost'][0]['value'] ?? 0,
                            'etd' => $cost['cost'][0]['etd'] ?? '-',
                        ];
                    }
                    return [
                        'courier' => strtoupper($courier),
                        'services' => $services
                    ];
                }
                
                return [
                    'courier' => strtoupper($courier),
                    'services' => []
                ];
            }

            throw new Exception($response->json()['rajaongkir']['status']['description'] ?? "Gagal menghitung ongkos kirim. Pastikan API Key valid atau tujuan tersedia.");
        });
    }
}
