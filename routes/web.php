<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::group(['prefix' => 'api'], function() {
    Route::get('areas', 'HworldApiController@getAreas')->name('areas');
    Route::get('themes', 'HworldApiController@getThemes')->name('themes');
    Route::get('tags', 'HworldApiController@getTags')->name('themes');

    Route::get('timelines', 'HworldApiController@getTimelines')->name('timelines');

    Route::get('events/{query}', 'HworldApiController@getEvents')->name('events');
    Route::get('events/featured/{id}', 'HworldApiController@getFeaturedEvents')->name('featured-events');
});

// Route::get('/',  'HomeController@index')->name('home');
// Route::get('/home',  'HomeController@index')->name('home');
Route::get('/',  'HomeController@featured');
Route::get('/home',  'HomeController@featured')->name('home');
Route::get('/featured-timelines', 'HomeController@featured')->name('timelines.featured');

Route::get('/event-timelines', 'HomeController@index')->name('timelines.events');

// Route::get('/featured-timelines/{id}/{category}/{slug}', 'HomeController@featured_timeline_events')->name('timelines.featured.events');
Route::get('/featured-timelines/{category}/{key}', 'HomeController@featured_timeline_events')->name('timelines.featured.events');

