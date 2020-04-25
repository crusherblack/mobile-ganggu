@extends('layouts.admin')
@section('header','List Hero')

@section('content')

@if(Session::has('delete'))
@include('layouts.components.partials.flash-delete',[ 'message'=> Session('delete') ])
@endif

@if(Session::has('message'))
@include('layouts.components.partials.flash-success',[ 'message'=> Session('message') ])
@endif

<div class="row">
    <div class="col-sm-8">
        <div class="card" style="min-height: 75vh">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover table-borderless table-sm" width="100%" id="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nama</th>
                                <th>Role</th>
                                <th>Gambar</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($hero as $index=>$item)
                            <tr>
                                <td>{{ $index + 1}}</td>
                                <td>{{ $item->name }}</td>
                                <td>@if($item->role)
                                    {{ $item->role->name }}
                                    @else
                                    Tidak ada relasi
                                    @endif
                                </td>
                                <td><img src="{{ asset($item->image) }}" class="img-fluid" style="width:70px;height:70px"></td>                                
                                <td>
                                    <form action="{{route('hero.destroy', $item->id)}}" method="POST">
                                        @csrf
                                        @method('delete')
                                        <a href="javascript:void(0)" data-id="{{$item->id}}"
                                            class="edit edit-post btn btn-primary btn-sm"><i class="fas fa-edit"></i>
                                            </a>
                                        <button class="btn btn-danger btn-sm"
                                            onclick="return confirm('Apakah anda yakin menghapus data ini ?');"><i
                                                class="fas fa-trash-alt" type="submit"></i> </button>
                                    </form>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="card" style="min-height: 75vh">
            <div class="card-header font-weight-bold text-dark" id="title"><h3>Tambah Hero</h3></div>
            <div class="card-body">
                <form action="{{route('hero.store')}}" method="post" enctype="multipart/form-data">
                    @csrf
                    <input type="hidden" name="id" id="id">

                    <div class="form-group">
                        <label>Nama Hero</label>
                        <input type="text" name="name" id="name" class="form-control" placeholder="Nama Hero"
                            value="{{old('name')}}">
                        @include('layouts.components.partials.error', ['name' => 'name'])
                    </div>

                    <div class="form-group">
                        <label>Role</label>
                        <select name="id_role" id="id_role" class="form-control">
                            <option value="" holder>Pilih Role</option>
                            @foreach($role as $item)
                            <option value="{{ $item->id }}">{{ $item->name }}</option>                            
                            @endforeach
                        </select>
                        @include('layouts.components.partials.error', ['name' => 'name'])
                    </div>

                    <div class="form-group">
                        <label>Gambar Hero</label>            
                        <div>
                            <div class="custom-file">
                                <br>
                                <input name="image" id="image" type="file" class="custom-file-input" accept="image/*"
                                    onchange="document.getElementById('output').src = window.URL.createObjectURL(this.files[0])"><label
                                    class="custom-file-label">Choose File</label>
                                @include('layouts.components.partials.error', ['name' => 'image'])
                            </div>
                        </div>
                        <div class="col-sm-12"><img id="output" src="" class="img-fluid"></div>
                    </div>

                    <div class="form-group">
                        <label>Deskripsi</label>
                        <textarea type="text" name="deskripsi" id="deskripsi" class="form-control"></textarea>
                        @include('layouts.components.partials.error', ['name' => 'name'])
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-block">
                            <div id="save-button">Simpan Hero</div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
@include('layouts.components.plugins.datatables')
<script>
    $(document).ready(function () {
        $('body').on('click', '.edit-post', function () {
            var id = $(this).data('id');
            console.log(id);
            $.get('hero/' + id + '/edit', function (data) {
                $('#save-button').html("Update Hero");
                $('#title').html("Edit Hero");
                $('#id').val(data.id);
                $('#name').val(data.name);                
                $('#id_role').val(data.id_role);
                $('#deskripsi').val(data.deskripsi);
            })
        })
        window.setTimeout(function () {
            $(".alert").fadeTo(1000, 0).slideUp(1000, function () {
                $(this).remove();
            });
        }, 500);
    });

</script>
@endpush
