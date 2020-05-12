@extends('layouts.app', ['menu_type' => 'light'])

@section('header_scripts')
    <!-- <link rel="stylesheet" href="{{ asset('css/swiper.min.css') }}"> -->
@endsection

@section('content')
    <main id="main">
        <!-- Mobile Search Form -->
        @include('partials.mobile-search')
        <!-- Mobile Search Form Ends -->
        
        <!-- Histroyworld All Starts -->
        <section id="blog" class="blog">
            <div class="container">
                <div class="row justify-content-center">
                    <!-- Left Sidebar Starts -->
                    <div class="col-lg-4 p-0 left-side">
                        <!-- Search Form Starts -->
                        <form action="{{route('timelines.events')}}" method="get" id="pc_search_terms">
                            <div class="sidebar p-3" data-aos="fade-up">
                                <div class="row p-3">
                                    <div class="col-md-4 p-0">
                                        <h3 class="sidebar-title">Search</h3>
                                    </div>
                                    <div class="col-md-8 p-0 text-right">
                                        <div class="btn-group">
                                            <a href="{{ route('timelines.featured') }}" class="hw-search-type btn btn-default btn-sm">Featured</a>
                                            <a href="{{ route('timelines.events') }}" class="hw-search-type active btn btn-default btn-sm">All</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="sidebar-item search-form mb-3">
                                    <div id="all_view_text_search">
                                        <input type="text" id="text_all_search" name="q" value="{{ $search_text }}" class="form-control" placeholder="Search for text" autocomplete="off" />
                                    </div>
                                </div>
                                <div class="sidebar-item recent-posts" id="advanced_search">
                                    <div class="post-item clearfix">
                                        <h4 class="text-capitalize">from year</h4>
                                        <div class="form-group input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"> <i class="icofont-ui-calendar"></i> </span>
                                            </div>
                                            <input type="text" id="start_year" onchange="handleYear(this, 'from', '#startYearLabel')" class="form-control historyworld-year search_year" value="{!! preg_replace('/[^0-9]/', '', $date_from) !!}" placeholder="Type Year" autocomplete="off"/>
                                            <input type="hidden" name="from" value="{{ $date_from }}" />
                                            <div class="btn-group" data-toggle="buttons" id="start_year_adbc_switch">
                                                <label class="form-control btn btn-default hw-ad-bc from-adbc-on adbc-label-first s-not-default-label" onclick="selectYear('#start_year', 'from', 'BC')">
                                                <input type="radio" class="d-none s-not-default-input" id="from_bc_year" <?php if ($date_from) { echo ($date_from[0] === '-')?'checked':''; } ?>>BC</label>
                                                
                                                <label class="form-control btn btn-default hw-ad-bc from-adbc-off active adbc-label-second s-default-label" id="startYearLabel" onclick="selectYear('#start_year', 'from', 'AD')">
                                                <input type="radio" class="d-none s-default-input" id="from_ad_year" <?php if ($date_from) { echo ($date_from[0] !== '-')?'checked':''; } else { echo 'checked'; } ?>>AD</label>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="post-item clearfix">
                                        <h4 class="text-capitalize">to year</h4>
                                        <div class="form-group input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"> <i class="icofont-ui-calendar"></i> </span>
                                            </div>
                                            <input type="text" name="end_year" id="end_year" class="form-control historyworld-year search_year" placeholder="Type Year">
                                            <div class="btn-group" data-toggle="buttons" id="end_year_adbc_switch">
                                                <label class="form-control btn btn-default to_adbc-on-1 adbc-label-first">
                                                <input type="radio" class="d-none" id="to_bc_year" name="to_adbc">BC</label>
                                                
                                                <label class="form-control btn btn-default to_adbc-off-1 active adbc-label-second">
                                                <input type="radio"class="d-none" id="to_ad_year" name="to_adbc" checked="checked">AD</label>
                                            </div>
                                        </div>
                                    </div> -->
                                    <div class="post-item clearfix">
                                        <h4>Themes</h4>
                                        <div class="form-group input-group">
                                            <label for="themesDropdownTrigger">
                                                <div class="input-group-prepend" style="cursor: pointer">
                                                    <span class="input-group-text"> <i class="icofont-ui-theme"></i> </span>
                                                </div>
                                            </label>
                                            <input class="form-control dropdown-toggle themesTree-input" id="themesDropdownTrigger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" placeholder="All Themes" onclick="treeAdjust('themesTree')" autocomplete="off" readonly>
                                            <input type="hidden" id="themes" name="themes" value="{{ $themes }}">
                                            <div class="dropdown-menu themesTree-menu" aria-labelledby="themes">
                                                <div id="ddTreeThemes"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="post-item clearfix">
                                        <h4>Areas</h4>
                                        <div class="form-group input-group dropdown">
                                            <label for="areasDropdownTrigger">
                                                <div class="input-group-prepend" style="cursor: pointer">
                                                    <span class="input-group-text"> <i class="icofont-location-pin"></i> </span>
                                                </div>
                                            </label>
                                            <input class="form-control dropdown-toggle areasTree-input" id="areasDropdownTrigger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" placeholder="All Areas" onclick="treeAdjust('areasTree')" autocomplete="off" readonly />
                                            <input type="hidden" id="areas" name="areas" value="{{ $areas }}">
                                            <div class="dropdown-menu areasTree-menu" aria-labelledby="areas">
                                                <div id="ddTreeAreas"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="post-item clearfix">
                                        <h4>Tags</h4>
                                        <div class="form-group input-group">
                                            <select name="tags" id="tags" class="form-control select2" multiple="multiple">
                                                
                                            </select>
                                        </div>
                                    </div> -->
                                    <div class="clearfix">
                                        <!-- <button class="btn btn-primary mr-3 mt-2 mb-2 search-apply" onclick="historyworldSearch()"><i class="icofont-search-2"></i> Apply</button>
                                        <button class="btn btn-default mr-0 mt-2 mb-2 search-clear" onclick="searchItermsClear()"><i class="icofont-eraser"></i> Clear</button> -->
                                        <button type="submit" class="btn btn-primary mr-3 mt-2 mb-2 search-apply float-left"><i class="icofont-search-2"></i> Apply</button>
                                        <button type="button" class="btn btn-default mr-0 mt-2 mb-2 search-clear float-right" onclick="clearSearchForm()"><i class="icofont-eraser"></i> Clear</button>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="sidebar p-3 mt-3">
                                <div class="sidebar-item categories">
                                    <ul class="mb-0 text-capitalize">
                                        <li><a href="#">featured timelines</a></li>
                                        <li><a href="#">people</a></li>
                                        <li><a href="#">places</a></li>
                                    </ul>
                                </div>
                            </div> -->
                        </form>
                        <!-- Search Form Ends -->
                        
                        <!-- Left Ads Starts -->
                        @include('partials.ads.left-ads')
                        <!-- Left Ads Ends -->
                    </div>
                    <!-- Left Sidebar Ends -->
                    <!-- Eevent List Starts -->
                    <div class="col-lg-8 entries">
                        <div id="accordion" role="tablist" aria-multiselectable="true"  data-aos="fade-up">
                            <div id="common_events">
                                <h4 class="timeline-title">
                                    <span id="search_title">{{ $search_title }}</span>
                                    <?php if ($events->meta->total !== 0): ?>
                                    <a href="javascript:void(0)" id="all_collapse_btn"><i class="fa fa-chevron-left pull-right" style="font-size: 23px;"></i></a>
                                    <?php endif; ?>
                                </h4>
                                <div class="historyworld-events-container">
                                    <?php foreach ($events->data as $key => $event): ?>
                                        <div class="card">
                                            <h5 class="card-header collapsed d-block mt-0" role="tab" id="heading{{$key}}" data-toggle="collapse" data-parent="#accordion"
                                                aria-controls="collapse{{$key}}" aria-expanded="false" href="#collapse{{$key}}">
                                                <div class="row">
                                                    <div class="<?php echo ($event->images)?'col-lg-9':'col-lg-12'; ?>">
                                                        <a href="javascript:void(0)">{!! sanitize_html($event->event_year_text) !!}<br>{!! sanitize_html($event->event) !!}</a>
                                                        <span class="alignb">
                                                            <?php if ($event->images): ?>
                                                                <a href="javascript:void(0)"><i class="fa fa-image"></i></a>
                                                            <?php endif; ?>

                                                            <?php if ($event->history_world_id_1 && $event->history_world_id_2): ?>
                                                                <a href="javascript:void(0)"><i class="hw-icon"></i></a>
                                                            <?php endif; ?>

                                                            <?php if ($event->google_map_link): ?>
                                                                <a href="javascript:void(0)"><i class="fa fa-map-pin"></i></a>
                                                            <?php endif; ?>

                                                            <?php if ($event->links): ?>
                                                                <?php foreach ($event->links as $link): ?>
                                                                    <?php if (strpos($link->url, 'en.wikipedia.org')): ?>
                                                                        <a href="javascript:void(0)"><i class="fa fa-wikipedia-w"></i></a>
                                                                    <?php else: ?>
                                                                        <a href="javascript:void(0)"><i class="icofont-link" style="font-size: 18px;"></i></a>
                                                                    <?php endif; ?>
                                                                <?php endforeach; ?>
                                                            <?php endif; ?>
                                                        </span>
                                                    </div>
                                                    <?php if ($event->images): ?>
                                                    <div class="col-lg-3">
                                                        <img class="event-thumbnail" src="{{ ($event->images[0])->thumbnail_url }}" />
                                                    </div>
                                                    <?php endif; ?>
                                                </div>
                                            </h5>
                                            <div id="collapse{{ $key }}" class="collapse multi-collapse" role="tabpanel" aria-labelledby="heading{{ $key }}">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <?php if ($event->images): ?>
                                                        <div class="col-md-4" style="text-align: center">
                                                            <img src="{{ ($event->images[0])->url }}" style="width: 100%;<?php echo ($event->id == 'ok')?'cursor: zoom-in':''; ?>" <?php if ($event->id == 'ok'): ?>onclick="imgEnlarge(this)"<?php endif; ?> />
                                                            <!-- <a href="javascript:void(0)" class="gallery-caption"> -->
                                                            <div  class="gallery-caption">
                                                                <span>{!! sanitize_html($event->images[0]->caption) !!}</span>
                                                            </div>
                                                            <!-- </a> -->
                                                        </div>
                                                        <?php endif; ?>
                                                        <div class="<?php echo ($event->images)?'col-md-8':'col-md-12'; ?>">
                                                            <p style="margin-bottom: 0;">{!! sanitize_html($event->event_long) !!}</p>
                                                            <div class="alignb">
                                                                <?php if ($event->history_world_id_1 && $event->history_world_id_2): ?>
                                                                    <a href="http://historyworld.net/wrldhis/PlainTextHistories.asp?HistoryID={{ $event->history_world_id_2 }}&paragraphid={{ $event->history_world_id_1 }}#{{ $event->history_world_id_1 }}" class="event-link" target="_blank" style="display: block"><i class="hw-icon"></i>
                                                                        {{ $event->history_world_link }}
                                                                    </a>
                                                                <?php endif; ?>
                                                                <?php if ($event->links): ?>
                                                                    <?php foreach ($event->links as $link): ?>
                                                                        <?php if (strpos($link->url, 'en.wikipedia.org')): ?>
                                                                        <a href="{{ $link->url }}" target="_blank" style="display: block;"><i class="fa fa-wikipedia-w"></i>
                                                                            &nbsp;{{ $link->url }}
                                                                        </a>
                                                                        <?php else: ?>
                                                                        <a href="{{ $link->url }}" target="_blank" style="display: block;"><i class="icofont-link" style="font-size: 18px;"></i>
                                                                            &nbsp;{{ $link->url }}
                                                                        </a>
                                                                        <?php endif; ?>
                                                                    <?php endforeach; ?>
                                                                <?php endif; ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="historyworld-pagination" data-aos="fade-up">
                             <ul id="pagination" class="pagination-sm"></ul>
                        </div> -->
                        <?php if ($events->meta->last_page > 1): ?>
                        <div id="pagination"></div>
                        <?php endif; ?>

                        <?php if ($events->meta->total === 0): ?>
                            <h5 class="empty-results">There were no results matching the query.</h5>
                        <?php endif; ?>
                    </div>
                    <!-- Event List Ends -->
                </div>
            </div>
        </section>
        <!-- Historyworld All Ends -->

        <!-- Modal Starts -->
        @include('partials.modal')
        <!-- Modal Ends -->

        <!-- Bottom Ads Starts -->
        @include('partials.ads.bottom-ads')
        <!-- Bottom Ads Ends -->
    </main>
@endsection

@section('footer_scripts')
<script src="{{ url('js/init.js') }}"></script>

<script>
    "use strict"
    var pagination  = new HistoryWorldPagination ({
        pages: {!! $events->meta->last_page !!},
        curPage: {!! $events->meta->current_page !!},
        searchFrmId: 'pc_search_terms',
    });

    jQuery("document").ready(function($) {
        drawAreasTree('{{ $areas }}');
        drawThemesTree('{{ $themes }}');
    });
</script>
@endsection
