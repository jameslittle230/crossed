let mix = require('laravel-mix');

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

mix.autoload({ // https://github.com/JeffreyWay/laravel-mix/issues/819#issuecomment-319853468
        jquery: ['$', 'window.jQuery',"jQuery","window.$","jquery","window.jquery"]
    })
   .js('resources/assets/js/app.js', 'public/js')
   .js('resources/assets/js/main.js', 'public/js')
   .extract(['vue', 'axios', 'jquery', 'bootstrap-sass'])
   .sass('resources/assets/sass/app.scss', 'public/css')
   .browserSync('http://crossedapp.test');
