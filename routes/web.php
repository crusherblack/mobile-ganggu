<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/','HeroController@home')->name('home');
Route::resource('/hero','HeroController');
Route::resource('/role','RoleController');
Route::get('/hero/details/{id}','HeroController@details')->name('hero.details');