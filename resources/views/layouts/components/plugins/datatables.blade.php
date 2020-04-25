@push('style')
<link rel="stylesheet" href="{{asset('js/datatables/datatables.min.css')}}">
@endpush

<script src="{{asset('js/datatables/datatables.min.js')}}"></script>
    <script src="{{asset('js/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js')}}"></script>
    <script>$('#table').DataTable();</script>