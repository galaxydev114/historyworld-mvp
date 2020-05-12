<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\HworldApiController;

use Illuminate\Support\Facades\Cache;

use App\Services\HworldApiService;

use Response;

class HomeController extends Controller
{
    protected $cache_expire = 3 * 24 * 60 * 60; // 3h

    public function __construct()
    {
        //$this->middleware('auth');
    }

    public function index(Request $request)
    {
        $page_data['areas'] = $request->get('areas');
        $page_data['themes'] = $request->get('themes');
        $page_data['search_text'] = $request->get('q');
        $page_data['date_from'] = $request->get('from');

        $page_data['events'] = $this->all_events_filter($request);
        $page_data['search_title'] = $this->get_search_title($request);
        $page_data['page_title'] = $this->get_search_title($request);;

        return view('home', $page_data);
    }
    
    public function featured()
    {
        $response = Cache::remember('featured-timelines', $this->cache_expire, function() {
            $api = new HworldApiService;
            return $api->get('timelines');
        });

        // $page_data['timelines'] = json_decode($response);
        $timelinesObj = json_decode($response);
        $page_data['page_title'] = 'Choose from a featured timeline below or search for text';

        $categories = array();
        foreach ($timelinesObj->data as $timeline) {
            if ($timeline->categories) {
                array_push($categories, ($timeline->categories)[0]->category);
            }
        }

        // $page_data['categories'] = array_unique($categories);
        $categories = array_unique($categories);

        // sort A-Z
        sort($categories);

        $featured_timelines = array();

        foreach ($categories as $category) {

            $timelines = array();
            foreach ($timelinesObj->data as $timeline) {
                if ($timeline->categories && $category === $timeline->categories[0]->category) {
                    array_push(
                        $timelines,
                        [
                            'title' => $timeline->title,
                            'slug' => $timeline->slug,
                            'id' => $timeline->id
                        ]
                    );
                }
            }

            sort($timelines);
            array_push(
                $featured_timelines,
                [
                    'category' =>  $category,
                    'timelines' => $timelines
                ]
            );
        };
        
        $page_data['count_data'] = $timelinesObj->meta->total;
        $page_data['featured_timelines'] = $featured_timelines;
        return view('featured-timelines', $page_data);
    }

    public function featured_timeline_events(Request $request, $category, $key)
    {
        $this->event_key = $key;                  // Slug or ID

        // get timeline title
        $timelines = Cache::remember('featured-timelines', $this->cache_expire, function() {
            $api = new HworldApiService;
            return $api->get('timelines');
        });

        $timelinesObj = json_decode($timelines);
        $timeline_title = '';
        foreach ($timelinesObj->data as $timeline) {
            if ($timeline->id === (int)$this->event_key || $timeline->slug === $this->event_key) {
                $timeline_title = $timeline->title . ' timeline';
            }
        }
        $page_data['search_title'] = $timeline_title;
        $page_data['page_title'] = $timeline_title;

        $this->page = $request->get('page');

        $cache_key = 'timelines-' . $category . '-' . $key . '-page_' . $this->page;

        $response = Cache::remember($cache_key, $this->cache_expire, function() {
            $api = new HworldApiService;
            return $api->get('timelines/' . $this->event_key . '/events?per_page=25&page=' .  $this->page);
        });

        $page_data['events'] = json_decode($response);

        return view('featured-timeline-events', $page_data);
    }

    /**
     * filter method responsivle for advanced search
     * 
     */
    public function all_events_filter($request)
    {
        $areas = $request->get('areas');
        $themes = $request->get('themes');
        $search_text = $request->get('q');
        $date_from = $request->get('from');
        $page = $request->get('page');

        $this->query = 'q=' . $search_text 
            . '&from=' . $date_from 
            . '&areas=' . $this->replace_comma_to_hyphen($areas) 
            . '&themes=' . $this->replace_comma_to_hyphen($themes)
            . '&page=' . $page;
        
        $response = Cache::remember($this->query, $this->cache_expire, function() {
            $api = new HworldApiService;
            return $api->get('events?extended=y&per_page=25&' . $this->query);
        });

        return json_decode($response);
    }

    /**
     * Responsible for replacing comma into hyphen
     * 
     * @param String
     * @return String
     */
    public function replace_comma_to_hyphen($string)
    {
        $result  = preg_replace('/[ -]+/', ',', trim($string));

        return $result;
    }

    /**
     * Generate a Search Titile
     */
    public function get_search_title($request)
    {
        $areas = $request->get('areas');
        $themes = $request->get('themes');
        $search_text = $request->get('q');
        $date_from = $request->get('from');
        $page = $request->get('page');

        $title = "";

        if (!$date_from && !$areas && !$themes && $search_text) {
            $title = "Events relating to " . $search_text;
        } else if (!$date_from && !$areas && !$themes && !$search_text) {
            $title = "All Events";
        } else {
            $areas_title = $this->get_areas_title($areas);
            $themes_title = $this->get_themes_title($themes);

            if (!$search_text) {
                if (!$date_from) {
                    // $title = "Events in " . $areas_title . " for " . $themes_title;
                    if ($themes_title == "" && $areas_title == "") {
                        $title = "All Events";
                    }
                    $title = "Events " . $themes_title . " " . $areas_title;
                } else {
                    if ($date_from[0] === '-') {
                        // $title = "Events from " . preg_replace('/[^0-9]/', '', $date_from) . " BC in " . $areas_title . " for " . $themes_title;
                        $title = "Events from " . preg_replace('/[^0-9]/', '', $date_from) . " BC " . $themes_title . " " . $areas_title;
                    } else {
                        // $title = "Events from " . $date_from . " in " . $areas_title . " for " . $themes_title;
                        $title = "Events from " . $date_from . " " . $themes_title . " " . $areas_title;
                    }
                }
            } else {
                if (!$date_from) {
                    // $title = "Events relating to " . $search_text . " in " . $areas_title . " for " . $themes_title;
                    $title = "Events relating to " . $search_text . " " . $themes_title . " " . $areas_title;
                } else {
                    if ($date_from[0] === '-') {
                        // $title = "Events relating to " . $search_text . " from " . preg_replace('/[^0-9]/', '', $date_from) . " BC in " . $areas_title . " for " . $themes_title;
                        $title = "Events relating to " . $search_text . " from " . preg_replace('/[^0-9]/', '', $date_from) . " BC " . $themes_title . " " . $areas_title;
                    } else {
                        // $title = "Events relating to " . $search_text . " from " . $date_from . " in " . $areas_title . " for " . $themes_title;
                        $title = "Events relating to " . $search_text . " from " . $date_from . " " . $themes_title . " " . $areas_title;
                    }
                }
            }
        }

        return trim($title); 
    }

    /**
     * Generate a Title from selected areas
     */
    public function get_areas_title($selectedAreas)
    {
        $selectedAreasArray = explode('-', $selectedAreas);

        $areas = Cache::remember('areas', 60 * 60, function() {
            $api = new HworldApiService;
            return $api->get('areas');
        });
        $areasObj = json_decode($areas);

        $categories = array();
        $category_1_codes = array();

        foreach ($areasObj->data as $area) {
            // Get areas codes on level 1
            array_push($category_1_codes, $area->level_1_code);
        }

        // unique array
        $category_1_codes = array_unique($category_1_codes);

        foreach ($category_1_codes as $category_1_code) {
            $category_1 = array();
            $category_2_arr = array();
            $areas_id_arr_in_category_1 = array();

            $category_1_title = '';
            $category_2_title = '';

            $category_2_codes = array();

            foreach ($areasObj->data as $area) {
                if ($category_1_code == $area->level_1_code) {
                    array_push($areas_id_arr_in_category_1, $area->id);
                    $category_1_title = $area->level_1_title;
                    array_push($category_2_codes, $area->level_2_code);
                }
            }
            $category_1['title'] = $category_1_title;
            $category_1['area_ids'] = $areas_id_arr_in_category_1;
            $category_2_codes = array_unique($category_2_codes);

            foreach ($category_2_codes as $category_2_code) {
                $category_2 = array();
                $category_3_arr = array();
                $areas_id_arr_in_category_2 = array();

                foreach ($areasObj->data as $area) {
                    $category_3 = array();
                    if ($category_2_code === $area->level_2_code && $category_1_code === $area->level_1_code) {
                        array_push($areas_id_arr_in_category_2, $area->id);
                        $category_2_title = $area->level_2_title;
                        $category_3['id'] = $area->id;
                        $category_3['title'] = $area->level_3_title;
                        array_push($category_3_arr, $category_3);
                    }
                }
                $category_2['title'] = $category_2_title;
                $category_2['area_ids'] = $areas_id_arr_in_category_2;
                $category_2['category_3'] = $category_3_arr;

                array_push($category_2_arr, $category_2);
            }
            $category_1['category_2'] = $category_2_arr;
            array_push($categories, $category_1);
        }

        // generate a title for selected areas

        $i = 0;
        $title_string = '';
        if ($selectedAreas) {
            foreach ($categories as $category) {
                // check if selected areas array contain full sub area, and remove
                if (count(array_intersect($category['area_ids'], $selectedAreasArray)) === count($category['area_ids'])) {
                    $selectedAreasArray = array_diff($selectedAreasArray, $category['area_ids']);
                    $title_string .= $category['title'] . ', ';
                    $i++;
                }
            }

            // check if selected areas contain all areas
            if ($i === count($categories)) {
                $title_string = "All Areas";
            }
            
            if ($selectedAreasArray) {
                foreach ($categories as $category) {
                    foreach ($category['category_2'] as $category_2) {
                        if (count(array_intersect($category_2['area_ids'], $selectedAreasArray)) === count($category_2['area_ids'])) {
                            $selectedAreasArray = array_diff($selectedAreasArray, $category_2['area_ids']);
                            $title_string .= $category_2['title'] . ', ';
                        }
                    }
                }
            }
            if ($selectedAreasArray) {
                foreach ($categories as $category) {
                    foreach ($category['category_2'] as $category_2) {
                        foreach ($category_2['category_3'] as $category_3) {
                            if (in_array($category_3['id'], $selectedAreasArray)) {
                                $title_string .= $category_3['title'] . ', ';
                            }
                        }
                    }
                }
            }

            $title_string = trim($title_string);
            $title_string = substr($title_string , 0, (strlen($title_string)-1));
        } else {
            $title_string = "All Areas";
        }

        $title_string = ($title_string == "All Areas") ? '' : "in " . $title_string;
        return $title_string;
    }

    /**
     * Generate a Title from selected areas
     */
    public function get_themes_title($selectedThemes)
    {
        $selectedThemesArray = explode('-', $selectedThemes);

        $themes = Cache::remember('themes', 60 * 60, function() {
            $api = new HworldApiService;
            return $api->get('themes');
        });
        $themesObj = json_decode($themes);

        $categories = array();
        $level_1_codes = array();

        foreach ($themesObj->data as $theme) {
            // Get themes codes on level 1
            array_push($level_1_codes, $theme->level_1_code);
        }

        $level_1_codes = array_unique($level_1_codes);
 
        foreach ($level_1_codes as $level_1_code) {
            $level_1_title = '';
            $level_1_ids = array();
            $level_1 = array();
            $level_2_arr = array();

            foreach ($themesObj->data as $theme) {
                $level_2 = array();
                if ($level_1_code == $theme->level_1_code) {
                    array_push($level_1_ids, $theme->id);
                    $level_1_title = $theme->level_1_title;

                    $level_2['theme_id'] = $theme->id;
                    $level_2['sub_theme_title'] = $theme->level_2_title;
                    array_push($level_2_arr, $level_2);
                }
            }

            $level_1['theme_title'] = $level_1_title;
            $level_1['theme_ids'] = $level_1_ids;
            $level_1['sub_themes'] = $level_2_arr;

            array_push($categories, $level_1);
        }

        $title_string = '';
        $i = 0;

        if ($selectedThemes) {
            foreach ($categories as $category) {
                if (count(array_intersect($category['theme_ids'], $selectedThemesArray)) === count($category['theme_ids'])) {
                    $selectedThemesArray = array_diff($selectedThemesArray, $category['theme_ids']);
                    $title_string .= $category['theme_title'] . ', ';
                    $i++;
                }
            }

            if ($i === count($categories)) {
                $title_string = "All Themes";
            }
       
            if ($selectedThemesArray) {
                foreach ($categories as $category) {
                    foreach ($category['sub_themes'] as $sub_theme) {
                        if (in_array($sub_theme['theme_id'], $selectedThemesArray)) {
                            $title_string .= $sub_theme['sub_theme_title'] . ', ';
                        }
                    }
                }
            }
            $title_string = trim($title_string);
            $title_string = substr($title_string , 0, (strlen($title_string)-1));
        } else {
            $title_string = "All Themes";
        }

        $title_string = ($title_string == "All Themes") ? '' : "about " . $title_string;
        return $title_string;
    }
}
