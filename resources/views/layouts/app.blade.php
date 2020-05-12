<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<meta content="" name="description">
	<meta content="" name="keywords">

	<title>{{ $page_title  }} | Historyworld</title>
	
	<link href="{{ url('favicon.ico') }}" rel="icon">

	<!-- Google Fonts -->
	<!-- <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Roboto:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet"> -->

	<link href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css" rel="stylesheet" type="text/css">

	<!-- Vendor CSS Files -->
	<link href="{{ url('assets/vendor/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link href="{{ url('assets/vendor/icofont/icofont.min.css') }}" rel="stylesheet">
	<!-- <link href="{{ url('assets/vendor/boxicons/css/boxicons.min.css') }}" rel="stylesheet"> -->
	<link href="{{ url('assets/vendor/animate.css/animate.min.css') }}" rel="stylesheet">
	<link href="{{ url('assets/vendor/remixicon/remixicon.css') }}" rel="stylesheet">
	<link href="{{ url('assets/vendor/owl.carousel/assets/owl.carousel.min.css') }}" rel="stylesheet">
	<link href="{{ url('assets/vendor/venobox/venobox.css') }}" rel="stylesheet">
	<link href="{{ url('assets/vendor/aos/aos.css') }}" rel="stylesheet">
	<!-- <link href="{{ url('assets/css/bootstrap-datepicker.css') }}" rel="stylesheet"> -->
	<link href="{{ url('assets/vendor/aos/aos.css') }}" rel="stylesheet">
	<link rel="stylesheet" href="{{ url('assets/font/hwico.css') }}">
	<link rel="stylesheet" href="{{ url('assets/css/hwcss.css') }}">
	<!-- w3 modal -->
	<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
	<!-- Template Main CSS File -->
	<link href="{{ url('assets/css/treeStructure.css') }}" rel="stylesheet">
	<link href="{{ url('assets/css/style.css') }}" rel="stylesheet">
	<link href="{{ url('assets/css/custom.css') }}" rel="stylesheet">
	<link href="{{ url('assets/css/spinners.css') }}" rel="stylesheet">
	<!-- Select2 -->
	<link href="{{ url('assets/vendor/select2/css/select2.min.css') }}" rel="stylesheet">

    <style type="text/css">
        .spinner-box {
          width: 100%;
          height: 100%;
          top: 0px;
          position: fixed;
          z-index: 99999;
          background-color: rgba(0, 0, 0,0.3);
        }
    </style>
	@yield('header_scripts')
</head>

<body>
	<div class="spinner-box">
		<svg class="circular" viewBox="25 25 50 50">
			<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
		</svg>  
	</div>
	<div id="preloader"></div>
	<!--[if IE]>
		<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
	<![endif]-->

	@include('partials.header')

	@yield('content')

	@include('partials.footer')

	<!-- <div id="preloader"></div> -->
	<a href="#" class="back-to-top"><i class="icofont-simple-up"></i></a>

	<!-- Vendor JS Files -->
	<script src="{{ url('assets/vendor/jquery/jquery.min.js') }}"></script>
	<script src="{{ url('assets/vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
	<script src="{{ url('assets/vendor/jquery.easing/jquery.easing.min.js') }}"></script>
	<script src="{{ url('assets/vendor/php-email-form/validate.js') }}"></script>
	<script src="{{ url('assets/vendor/waypoints/jquery.waypoints.min.js') }}"></script>
	<script src="{{ url('assets/vendor/counterup/counterup.min.js') }}"></script>
	<script src="{{ url('assets/vendor/owl.carousel/owl.carousel.min.js') }}"></script>
	<script src="{{ url('assets/vendor/isotope-layout/isotope.pkgd.min.js') }}"></script>
	<script src="{{ url('assets/vendor/venobox/venobox.min.js') }}"></script>
	<script src="{{ url('assets/vendor/aos/aos.js') }}"></script>
	<script src="{{ url('assets/vendor/typed.js/lib/typed.min.js') }}"></script>
	<script src="{{ url('assets/js/jquery.twbsPagination.min.js') }}"></script>
	<!-- <script src="{{ url('assets/js/luckmoshyJqueryPagnation.js') }}"></script> -->
	<!-- Select2 -->
	<script src="{{ url('assets/vendor/select2/js/select2.full.min.js') }}"></script>
	
	<!-- <script src="{{ url('assets/js/bootstrap-datepicker.js') }}"></script> -->
	<!-- Template Main JS File -->

	<!-- Google ads -->
	<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> -->

	<script src="{{ url('assets/js/treeStructure.js') }}"></script>
	

	<script src="{{ url('assets/js/main.js') }}"></script>

	<script>

			var text_1_1 = 'accurate';
			var text_1_2 = 'clear';
			var text_1_3 = 'truth';

			if ($(".js-text-animation")[0]) {
					var typed = new Typed(".js-text-animation", {
							strings: [text_1_3 + ".", text_1_2 + ".", text_1_1 + "."],
							typeSpeed: 90,
							loop: true,
							backSpeed: 30,
							backDelay: 2500
					});
			}

	</script>
	<script>
		// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		// (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		// m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		// })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		// ga('create', 'UA-3855518-1', 'auto');
		// ga('require', 'displayfeatures');
		// ga('require', 'GTM-WJ88MZ5');
		// ga('send', 'pageview');
	</script>

	<!-- Custom script for init select2 -->
	<script type="text/javascript">
		"use strict";

		// initialize select2
		initSelect2();

		//Initialize Select2 Elements
		function initSelect2() {
			$('.select2').select2();
		}
	</script>
	@yield('footer_scripts')

</body>
</html>