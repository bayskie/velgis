<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect(route('map.index'));
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/map', [MapController::class, 'index'])->name('map.index');
    Route::post('/map/bulk', [MapController::class, 'bulkUpsert'])->name('map.bulkUpsert');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
