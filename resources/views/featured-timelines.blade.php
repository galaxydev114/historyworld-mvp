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
                                    <!-- <span id="search_title">Featured Timelines</span> -->
                                    <span>Choose from a featured timeline below or search<span class="mobile-none"> on the left</span></span>
                                </h4>
                                <div class="historyworld-featured-timelines-container">
                                    <div class="card-columns">
                                        <?php foreach ($featured_timelines as $featured_timeline): ?>
                                        <div class="card featured-card mt-2 mb-3">
                                            <h5 class="card-title">{{ $featured_timeline['category'] }}</h5>
                                            <div class="card-body">
                                                <?php foreach ($featured_timeline['timelines'] as $timeline): ?>
                                                    <a href="{{ route('timelines.featured.events', [str_slug($featured_timeline['category']), ($timeline['slug'])?$timeline['slug']:$timeline['id']]) }}" class="d-block">{!! $timeline['title'] !!}</a>
                                                <?php endforeach; ?>
                                            </div>
                                        </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <?php if ($count_data === 0): ?>
                            <h5 class="empty-results">There were no featured timelines.</h5>
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
</script>
@endsection
