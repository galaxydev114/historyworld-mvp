@if (Route::has('login'))
    <div class="top-right links">
        @auth
            <a href="{{ url('/home') }}">Home</a>
        @else
            <a href="{{ route('login') }}">Login</a>

            @if (Route::has('register'))
                <a href="{{ route('register') }}">Register</a>
            @endif
        @endauth
    </div>
@endif

<!-- Historyworld header -->
<header id="header" class="fixed-top">
    <div class="container d-flex align-items-center">
        <p class="mobile-title">Historyworld Timelines</p>

        <div class="desktop-none">
            <?php if (request()->segment('1') == 'event-timelines'): ?>
                <a href="{{ route('timelines.featured') }}" class="text-white go-to-favourites"><span class="fa fa-star-o"></span></a>
            <?php else: ?>
                <a href="{{ route('timelines.events') }}" class="text-white go-to-favourites"><span class="fa fa-search"></span></a>
            <?php endif; ?>
        </div>
        <!-- nav-menu -->
        <nav class="nav-menu d-none d-lg-block">
            <ul>
                <li class="active"><a href="{{ route('home') }}">Home</a></li>
                <li class="drop-down"><a href="">Histories</a>
                    <ul>
                        <li><a href="#">index</a></li>
                        <li><a href="#">About Histories</a></li>
                    </ul>
                </li>
                <li class="drop-down"><a href="">Timelines</a>
                    <ul>
                        <li><a href="#">Selected Themes</a></li>
                        <li><a href="#">People</a></li>
                        <li><a href="#">Places</a></li>
                    </ul>
                </li>
                <li class="drop-down"><a href="">About</a>
                    <ul>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
        <!-- // nav-menu -->
    </div>
</header>
<!-- Header Ends -->

<!-- Hero section -->
<section id="hero" class="d-flex align-items-center">
    <div class="container" data-aos="fade" data-aos-delay="100">
        <div class="row justify-content-center">
            <div class="col-md-4 logo">
                <img src="{{ url('assets/img/HWhomelogo.png') }}">
            </div>
            <div class="col-md-8 mt-3">
                <!-- <h1><font class="hero-title">Timelines</font> <span class="js-text-animation"></span></h1>
                <h2>Make History Make Sense</h2> -->

                <!-- Top Ads Starts -->
                @include('partials.ads.top-ads')
                <!-- Top Ads Ends -->
            </div>
        </div>
    </div>
</section>