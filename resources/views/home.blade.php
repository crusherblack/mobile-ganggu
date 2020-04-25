@extends('layouts.admin')
@section('header','Mobile Ganggu (Silahkan tambah Hero dan Role pada menu Master Data)')

@section('content')
<div class="container">
<div class="row">
    @foreach($hero as $item)
    <div class="col-sm-3">        
        <div class="card" style="min-height:32rem">
            <img class="card-img-top" src="{{ asset($item->image) }}" alt="Card image cap">
            <div class="card-body" >
                <h4 class="text-center">{{ $item->name }}</h4>
                <p class="card-text text-center">{{ $item->role->name }}</p>
                
            </div>
            <div class="card-footer">
                <a href="{{ route('hero.details', $item->id ) }}" class="btn btn-info btn-block">Details</a>
            </div>       
        </div>        
    </div>
    @endforeach
    <div>{{ $hero->links() }}</div>
    
</div>
</div>
@endsection
