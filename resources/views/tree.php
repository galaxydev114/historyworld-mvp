@extends('layouts.app', ['menu_type' => 'light'])

@section('header_scripts')
	{{--<link rel="stylesheet" href="{{ asset('css/swiper.min.css') }}">--}}
@endsection

@section('content')
	<main id="main">
		<div id="preloader"></div>
		<!-- ======= Blog Section ======= -->
		<section id="blog" class="blog">
			<div class="container">

				<div class="row">

					<div class="col-lg-3 p-0 left-side">

						<div class="sidebar p-3" data-aos="fade-up">

							<h3 class="sidebar-title">Search</h3>
							<div class="sidebar-item search-form">
								<form action="">
									<input type="text" class="form-control">
									<button class="textSearch"><i class="icofont-search-2"></i></button>
								</form>

							</div><!-- End sidebar search formn-->

							<h3 class="sidebar-title mt-3">Search options</h3>
							<div class="sidebar-item recent-posts">

								<div class="post-item clearfix">
									<h4>Start Year</h4>
									<div class="form-group input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"> <i class="icofont-ui-calendar"></i> </span>
										</div>
										<select name="start_bcad" id="start_bcad" class="form-control bcad">
											<option value="0">BC</option>
											<option value="1">AD</option>
										</select>
										<input type="number" name="start_year" id="start_year" class="form-control search_year" placeholder="<?=date("Y")?>" onchange="pcSearch()">
									</div>
								</div>

								<div class="post-item clearfix">
									<h4>End Year</h4>
									<div class="form-group input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"> <i class="icofont-ui-calendar"></i> </span>
										</div>
										<select name="end_bcad" id="end_bcad" class="form-control bcad">
											<option value="0">BC</option>
											<option value="1">AD</option>
										</select>
										<input type="number" name="end_year" id="end_year" class="form-control search_year" placeholder="<?=date("Y")?>" onchange="pcSearch()">
									</div>
								</div>

								<div class="post-item clearfix">
									<h4>Areas</h4>
									<div class="form-group input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"> <i class="icofont-location-pin"></i> </span>
										</div>
										<!--select name="areas" id="areas" class="form-control areas" onchange="pcSearch()"></select-->
										<input name="areas" id="areas" class="form-control areas ddTree" placeholder="All Areas">
									</div>
								</div>

								<div class="post-item clearfix">
									<h4>Themes</h4>
									<div class="form-group input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"> <i class="icofont-ui-theme"></i> </span>
										</div>
										<select name="themes" id="themes" class="form-control themes" onchange="pcSearch()"></select>
									</div>
								</div>

								<div class="post-item clearfix">
									<h4>Tags</h4>
									<div class="form-group input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"> <i class="icofont-tags"></i> </span>
										</div>
										<select name="tags" id="tags" class="form-control tags" onchange="pcSearch()"></select>
									</div>
									<button class="btn btn-default mr-1 mt-2 float-right search-clear"><i class="icofont-eraser"></i> Clear</button>
								</div>

							</div><!-- End sidebar recent posts-->

						</div><!-- End sidebar -->

						<div class="sidebar p-3" data-aos="fade-up">
							<div class="sidebar-item categories">
								<ul class="mb-0">
									<li><a href="#">Selected Themes</a></li>
									<li><a href="#">People</a></li>
									<li><a href="#">Places</a></li>
								</ul>

							</div><!-- End sidebar categories-->
						</div>


					</div><!-- End blog sidebar -->
				
					<div class="col-lg-9 entries">
						<div id="accordion" role="tablist" aria-multiselectable="true"  data-aos="fade-up">
							<h4 class="timeline-title">If Data(e.g.Spain and the Americas)</h4>
							<div id="events"></div>
						</div>
					</div><!-- End blog entries list -->

				</div>

			</div>
		</section><!-- End Blog Section -->


	</main><!-- End #main -->
@endsection

@section('footer_scripts')

@endsection
