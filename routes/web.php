<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/map', [MapController::class, 'index'])->name('map.index');
    Route::post('/map/bulk', [MapController::class, 'bulkUpsert'])->name('map.bulkUpsert');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
