@extends('layouts.app', ['menu_type' => 'light'])

@section('header_scripts')
    <!-- <link rel="stylesheet" href="{{ asset('css/swiper.min.css') }}"> -->
@endsection

@section('content')
    <main id="main">

        <form action="{{route('timelines.events')}}" method="get" id="mobile_search_terms">
            <div class="card search-card mobile-search-card">
                <!-- <h5 class="card-header" role="tab" id="searchCard">
                    <a data-toggle="collapse" data-parent="#mobile_search_terms" href="#collapseSearch" aria-expanded="false" aria-controls="collapseSearch" class="collapsed d-block">
                        <i class="icofont-search-2"></i> <i class="fa fa-chevron-down pull-right"></i>Search options
                    </a>
                </h5> -->
                <div class="row mt-4 text-center search-form">
                    <div class="col-md-12 pl-0 pr-0">
                        <!-- <input type="text" id="mobile_text_all_search" class="mobile-text-search form-control" placeholder="Search for text"> -->
                        <input type="text" name="q" value="" class="form-control" placeholder="Search for text" autocomplete="off" />
                        <!-- <button type="button" class="mobile-textSearch search-magnifying-glass-btn" onclick="historyworldSearch('mobile')"><i class="icofont-search-2"></i></button> -->
                    </div>
                </div>
            </div>
        </form>

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
                                            <a href="{{ route('timelines.featured') }}" class="hw-search-type btn btn-default btn-sm active">Featured</a>
                                            <a href="{{ route('timelines.events') }}" class="hw-search-type btn btn-default btn-sm">All</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="sidebar-item search-form mb-3">
                                    <div id="featued_view_text_search" class="form">
                                        <input type="text" name="q" id="text_featured_search" class="form-control" placeholder="Search for text">
                                        <button type="submit" class="textSearch"><i class="icofont-search-2"></i></button>
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
                        
                        <!-- Featured Events Pagination submit form -->
                        <form action="{{ route('timelines.featured.events', [request()->segment('2'), request()->segment('3'), request()->segment('4')]) }}" method="get" id="featured_events_frm">

                        </form>

                        <!-- Left Ads Starts -->
                        @include('partials.ads.left-ads')
                        <!-- Left Ads Ends -->
                    </div>
                    <!-- Left Sidebar Ends -->
                    <!-- Eevent List Starts -->
                    <div class="col-lg-8 entries">
                        <div id="accordion" role="tablist" aria-multiselectable="true"  data-aos="fade-up">
                            <div>
                                <h4 class="timeline-title">
                                    <span id="search_title">{!! $search_title !!}</span>
                                    <?php if ($events->meta->total !== 0): ?>
                                    <a href="javascript:void(0)" id="all_collapse_btn"><i class="fa fa-chevron-left pull-right" style="font-size: 23px;"></i></a>
                                    <?php endif; ?>
                                </h4>
                                <div class="historyworld-featured-timelines-container">
                                    <?php foreach ($events->data as $key => $event): ?>
                                        <div class="card featured-event-card">
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
                        <!-- <div>
                            <a href="javascript:void(0)" id="showMore" class="font-weight-bold float-right">Read More</a>
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
        searchFrmId: 'featured_events_frm',
    });

    // jQuery("document").ready(function($) {
    //     $(".featured-event-card").slice(0, 25).show();
    //     if ($('.featured-event-card:hidden').length == 0) {
    //         $("#showMore").hide();
    //     }

    //     $("#showMore").on('click', function (e) {
    //         e.preventDefault();
    //         $(".featured-event-card:hidden").slice(0, 10).slideDown();
    //         if ($(".featured-event-card:hidden").length == 0) {
    //             $("#showMore").fadeOut('slow');
    //         }
    //         $('html, body').animate({
    //             scrollTop: $(this).offset().top
    //         }, 1500);
    //     })
    // });
</script>
@endsection
