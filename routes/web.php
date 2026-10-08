<?php

use App\Http\Controllers\Web\AuthController;
use App\Support\TemplateFlavor;
use Illuminate\Support\Facades\Route;

// Di-generate oleh php artisan template:zip - minimal untuk flavor "restoran".
// "/" selalu redirect ke "home" flavor aktif (config/template.php).
Route::get('/', function () {
    return redirect()->route(TemplateFlavor::homeRoute());
})->name('home');

// Auth demo (visual saja).
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::get('/register', [AuthController::class, 'register'])->name('register');
Route::get('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.request');
Route::get('/reset-password/{token}', [AuthController::class, 'resetPassword'])->name('password.reset');

// Rute domain flavor ini.
require __DIR__.'/flavors/restoran.php';
