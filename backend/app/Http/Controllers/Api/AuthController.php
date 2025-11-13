<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['sometimes', 'string', 'in:admin,recruiter'],
            'avatar' => ['sometimes', 'file', 'image', 'max:2048'], // 2MB
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'recruiter',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar_path = $path;
            $user->save();
        }

        // Set token expiration: 30 days for new registrations (extended session)
        $expiresAt = now()->addDays(30);
        $token = $user->createToken('auth-token', ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
            ],
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
            'message' => 'User registered successfully',
        ], 201);
    }

    /**
     * Login user and create token.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'remember_me' => ['sometimes', 'boolean'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke all existing tokens (optional - for single device login)
        // $user->tokens()->delete();

        // Set token expiration: 30 days for "remember me", 24 hours otherwise
        $expiresAt = $request->boolean('remember_me') 
            ? now()->addDays(30) 
            : now()->addHours(24);

        $token = $user->createToken('auth-token', ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
            ],
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
            'message' => 'Login successful',
        ]);
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get authenticated user.
     * This endpoint is used for real-time token validation.
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        $token = $request->user()->currentAccessToken();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
            ],
            'token_expires_at' => $token->expires_at ? $token->expires_at->toIso8601String() : null,
        ]);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
            'current_password' => ['required_with:password', 'string'],
            'avatar' => ['sometimes', 'file', 'image', 'max:2048'], // 2MB
        ]);

        // Verify current password if changing password
        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password is incorrect.'],
                ]);
            }
        }

        // Update name if provided (sanitized)
        if ($request->filled('name')) {
            $user->name = htmlspecialchars(strip_tags($request->name), ENT_QUOTES, 'UTF-8');
        }

        // Update email if provided (sanitized)
        if ($request->filled('email')) {
            $user->email = filter_var($request->email, FILTER_SANITIZE_EMAIL);
        }

        // Update password if provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar_path);
            }
            
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar_path = $path;
            // Touch the model to update updated_at timestamp for cache-busting
            $user->touch();
        }

        $user->save();
        
        // Refresh the user model to ensure avatar_url is up to date
        $user->refresh();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
            ],
            'message' => 'Profile updated successfully',
        ]);
    }

    /**
     * Send password reset link.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        // Don't reveal if email exists or not for security
        // Always return success message
        if ($user) {
            // Get frontend URL from config or use default
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            
            // Create password reset token
            $token = Password::createToken($user);
            
            // Build reset URL with frontend URL
            $resetUrl = rtrim($frontendUrl, '/') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
            
            // Send custom notification with frontend URL
            $user->sendPasswordResetNotification($token, $resetUrl);
        }

        // Always return the same message for security
        return response()->json([
            'message' => 'If that email address exists, we will send a password reset link.',
        ], 200);
    }

    /**
     * Reset password using token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully.',
            ]);
        }

        return response()->json([
            'message' => 'Invalid or expired reset token.',
        ], 400);
    }
}


