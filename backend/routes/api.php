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

// Public authentication routes with rate limiting
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register'])->middleware('throttle:5,1'); // 5 requests per minute
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login'])->middleware('throttle:5,1'); // 5 requests per minute
Route::post('/forgot-password', [\App\Http\Controllers\Api\AuthController::class, 'forgotPassword'])->middleware('throttle:3,1'); // 3 requests per minute
Route::post('/reset-password', [\App\Http\Controllers\Api\AuthController::class, 'resetPassword'])->middleware('throttle:3,1'); // 3 requests per minute

// Super admin creation (special endpoint)
// - If no super admin exists: requires secret key (public endpoint)
// - If super admin exists: requires super admin authentication (protected)
Route::post('/super-admin/create', [\App\Http\Controllers\Api\SuperAdminController::class, 'createSuperAdmin'])->middleware('throttle:3,1'); // 3 requests per minute

// Protected routes with rate limiting
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () { // 60 requests per minute for authenticated users
    // Authentication routes
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', [\App\Http\Controllers\Api\AuthController::class, 'user']);
    Route::put('/user/profile', [\App\Http\Controllers\Api\AuthController::class, 'updateProfile']);
    
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
        
        // Email trigger routes with stricter rate limiting
        Route::post('/emails/send-reminders', [\App\Http\Controllers\Api\EmailController::class, 'sendReminders'])->middleware('throttle:10,1'); // 10 requests per minute
        Route::post('/emails/send-summary', [\App\Http\Controllers\Api\EmailController::class, 'sendSummary'])->middleware('throttle:10,1'); // 10 requests per minute
        
        // Admin user management routes (super_admin only)
        Route::middleware('role.super_admin')->group(function () {
            Route::get('/admin/users', [\App\Http\Controllers\Api\AdminController::class, 'getUsers']);
            Route::post('/admin/users', [\App\Http\Controllers\Api\AdminController::class, 'createUser']);
            Route::put('/admin/users/{id}', [\App\Http\Controllers\Api\AdminController::class, 'updateUser']);
            Route::delete('/admin/users/{id}', [\App\Http\Controllers\Api\AdminController::class, 'deleteUser']);
        });
    });
});

