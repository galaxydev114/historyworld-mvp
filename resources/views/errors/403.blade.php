@extends('layouts.app')

@section('content')
    <div class="insite-content">

        <div class="site-part">
            <div class="container pt-5 text-center">
                <div>
                    {{-- <i class="fas fa-exclamation fs-70"></i> --}}
                    <i class="fas fa-exclamation-circle fs-70"></i>
                    <h1 class="fw-700 mt-3">Unauthorized!</h1>
                    <div class="elash-round"></div>
                    <p>You are not authorized to access this page</p>

                    <a class="btn btn-primary mt-5" href="{{ route('user.dashboard') }}">
                        <i class="icon-arrow-right reverse-arrow ml-2"></i> Dashboard
                    </a>
                </div>
            </div>
        </div>

    </div>
@endsection