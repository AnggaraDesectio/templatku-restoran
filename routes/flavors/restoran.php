<?php

use App\Http\Controllers\Web\RestoranController;
use Illuminate\Support\Facades\Route;

Route::prefix('restoran')->name('restoran.')->group(function () {
    Route::get('/', [RestoranController::class, 'index'])->name('index');
    Route::get('/reservasi', [RestoranController::class, 'reservasi'])->name('reservasi');
    Route::get('/dapur', [RestoranController::class, 'dapur'])->name('dapur');
    Route::get('/menu', [RestoranController::class, 'menu'])->name('menu');
    Route::get('/kasir', [RestoranController::class, 'kasir'])->name('kasir');
    Route::get('/laporan', [RestoranController::class, 'laporan'])->name('laporan');
});
