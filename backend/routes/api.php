<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Public authentication routes
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', [\App\Http\Controllers\Api\AuthController::class, 'user']);
    
    // Credentials routes with role-based access
    // Admin: full access (create, update, delete)
    // Recruiter: view and export only
    Route::get('/credentials', [\App\Http\Controllers\Api\CredentialController::class, 'index']);
    Route::get('/credentials/{id}', [\App\Http\Controllers\Api\CredentialController::class, 'show']);
    
    // Admin-only routes
    Route::middleware('role.admin')->group(function () {
        Route::post('/credentials', [\App\Http\Controllers\Api\CredentialController::class, 'store']);
        Route::put('/credentials/{id}', [\App\Http\Controllers\Api\CredentialController::class, 'update']);
        Route::delete('/credentials/{id}', [\App\Http\Controllers\Api\CredentialController::class, 'destroy']);
        
        // Email trigger routes
        Route::post('/emails/send-reminders', [\App\Http\Controllers\Api\EmailController::class, 'sendReminders']);
        Route::post('/emails/send-summary', [\App\Http\Controllers\Api\EmailController::class, 'sendSummary']);
    });
});

