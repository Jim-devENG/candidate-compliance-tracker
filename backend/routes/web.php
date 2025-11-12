<?php

use Illuminate\Support\Facades\Route;

// API-only application - no Blade views
Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel API',
        'version' => app()->version(),
    ]);
});
