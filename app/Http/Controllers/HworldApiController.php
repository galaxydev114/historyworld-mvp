<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Cache;

use App\Services\HworldApiService;

/**
 * Class HworldApiController
 */
class HworldApiController extends ApiController
{
    protected $cache_expire = 60 * 60; // 60 min

    public function getAreas()
    {
        $areas = Cache::remember('areas', $this->cache_expire, function() {
            $api = new HworldApiService;
            return $api->get('areas');
        });

        return $this->passThrough($areas);
    }
    
    public function getThemes()
    {
        $themes = Cache::remember('themes', $this->cache_expire, function() {
            $api = new HworldApiService;
            return $api->get('themes');
        });

        return $this->passThrough($themes);
    }
    
    public function getTags()
    {
        $tags = Cache::remember('tags', $this->cache_expire, function() {
            $api = new HworldApiService;
            return $api->get('tags');
        });

        return $this->passThrough($tags);
    }

    // public function getTimelines(HworldApiService $api)
    // {
    //     $response = $api->get('timelines');

    //     return $this->passThrough($response);
    // }

    // public function getEvents($query)
    // {
    //     $api = new HworldApiService;
    //     $response = $api->get('events?extended=y&per_page=25&' . $query);

    //     return $response;
    // }

    // public function getFeaturedEvents(HworldApiService $api, $id)
    // {
    //     $response = $api->get('timelines/' . $id . '/events');

    //     return $this->passThrough($response);
    // }
}