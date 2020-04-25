<div class="main-sidebar sidebar-style-2">
    <aside id="sidebar-wrapper">
        <div class="sidebar-brand">
            <a href="index.html">Mobile Ganggu</a>
        </div>
        <div class="sidebar-brand sidebar-brand-sm">
            <a href="#">MG</a>
        </div>
        <ul class="sidebar-menu">
            <li class="menu-header">Home</li>
            <li class="{{request()->routeIs('home') ? 'active' : '' }}"><a class="nav-link" href="{{route('home')}}"><i class="fas fa-tachometer-alt"></i>
                    <span>Home</span></a></li>
            <li class="menu-header">Master Data</li>

            <li class="{{request()->routeIs('hero.index') ? 'active' : '' }}"><a class="nav-link "
                    href="{{ url('/hero') }}"><i class="fas fa-box"></i> <span>Hero</span></a></li>

            <li class="{{request()->routeIs('role.index') ? 'active' : '' }}"><a class="nav-link "
                    href="{{ url('/role') }}"><i class="fas fa-box-open"></i> <span>Role
                        </span></a></li>        
    </aside>
</div>
