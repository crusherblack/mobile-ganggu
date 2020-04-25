@extends('layouts.admin')
@section('header','Details Hero')

@section('content')
<div class="card">
    <div class="row">
        <div class="col-sm-4">
            <img class="card-img-top" src="{{ asset($hero->image) }}" alt="Card image cap" style="height:32rem;width:100%">
            <div class="card-body">           
                <h2 class="card-text text-center">{{ $hero->role->name }}</h2>
            </div>         
        </div>
        <div class="col-sm-8">
            <h2>Deskripsi {{ $hero->name }}</h2>
            <p class="card-text text-left">{{ $hero->deskripsi }}</p>
            <a href="{{ route('home') }}" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Kembali ke Catalog</a>
        </div>
    </div>

</div>
@endsection
