<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::view('/', 'welcome')->name('home');
Route::view('recent', 'recent')->name('recent');
Route::view('picks', 'picks')->name('picks');
Route::view('popular', 'popular')->name('popular');

Route::get('puzzle/new', function() {}); /* 1 */
Route::get('user/{username}', 'UserController@show')->name('user');
Route::get('puzzle/{slug}', function($username, $slug) {});

Route::middleware('auth')->group(function() {
    Route::get('me', 'UserController@redirectToMe');
    Route::get('dashboard', function() {});
    Route::get('settings', function() {});

    // This is pretty hacky -- eventually should be deleted
    Route::get('logout', '\App\Http\Controllers\Auth\LoginController@logout');
});

/**
 * 1: Anyone can create a puzzle; they just have to be logged in to save it
 *    Or -- Codepen has an anonymous saved pen thing, I could do the same for
 *    puzzles
 */