const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.styles([
    'resources/css/vendor/components.css',
    'resources/css/vendor/style.css'
], 'public/css/theme.css');

mix.scripts([
    'resources/js/vendor/stisla.js',
    'resources/js/vendor/stisla-2.js',
    'resources/js/vendor/tooltip.js'
], 'public/js/theme.js');

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css');
