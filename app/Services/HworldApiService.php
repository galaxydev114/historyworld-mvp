<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class HworldApiService
{
    protected $apiKey;

    protected $apiBaseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.hworld.key');
        $this->apiBaseUrl = config('services.hworld.url');
    }

    public function get($endpoint)
    {
        $url = $this->apiBaseUrl . $endpoint;

        $response = Http::withHeaders([
                        'Authorization' => 'APIKey-v1 ' . $this->apiKey,
                        'Accept'        => 'application/json'
               ])->get($url)->body();

        return $response;
    }
}