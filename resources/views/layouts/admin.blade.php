@include('layouts.components.header')

<body>
  <div id="app">
    <div class="main-wrapper main-wrapper-1">
      <div class="navbar-bg"></div>
      @include('layouts.components.navbar')
      @include('layouts.components.sidebar')

      <!-- Main Content -->
      <div class="main-content">
        <section class="section">
          <div class="section-header">
            <h1>@yield('header')</h1>
          </div>
          @yield('content')
          <div class="section-body">
          </div>
        </section>
      </div>
     @include('layouts.components.footer')
    </div>
  </div>

</body>
       
    <script src="{{ asset('js/app.js') }}" ></script>
    <script src="{{ asset('js/theme.js') }}" ></script>
    @stack('scripts')
    
</html>