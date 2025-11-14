<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SuperAdminController extends Controller
{
    /**
     * Create a super admin account.
     * This is a special endpoint for creating the first super admin or additional super admins.
     * Should be protected by a special secret key or only accessible by existing super admins.
     */
    public function createSuperAdmin(Request $request): JsonResponse
    {
        // Check if there are any existing super admins
        $hasSuperAdmin = User::where('role', 'super_admin')->exists();
        
        // If no super admin exists, require a secret key
        // If super admin exists, require super admin authentication
        if (!$hasSuperAdmin) {
            // First super admin creation - require secret key
            $secretKey = env('SUPER_ADMIN_SECRET_KEY', 'change-this-secret-key-in-production');
            
            $request->validate([
                'secret_key' => ['required', 'string'],
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);
            
            if ($request->secret_key !== $secretKey) {
                throw ValidationException::withMessages([
                    'secret_key' => ['Invalid secret key.'],
                ]);
            }
        } else {
            // Additional super admin creation - require existing super admin authentication
            // Manually authenticate the token since route doesn't have auth middleware
            $currentUser = null;
            if ($request->bearerToken()) {
                try {
                    $token = \Laravel\Sanctum\PersonalAccessToken::findToken($request->bearerToken());
                    if ($token) {
                        $currentUser = $token->tokenable;
                    }
                } catch (\Exception $e) {
                    // Token invalid or expired
                }
            }
            
            if (!$currentUser || $currentUser->role !== 'super_admin') {
                return response()->json([
                    'message' => 'Unauthorized. Super admin access required. Please log in as a super admin.',
                ], 403);
            }
            
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);
        }

        $user = User::create([
            'name' => htmlspecialchars(strip_tags($request->name), ENT_QUOTES, 'UTF-8'),
            'email' => filter_var($request->email, FILTER_SANITIZE_EMAIL),
            'password' => Hash::make($request->password),
            'role' => 'super_admin',
        ]);

        // Only return token if this is the first super admin (for auto-login)
        // If existing super admin created it, don't return token (they're already logged in)
        $response = [
            'message' => 'Super admin account created successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
            ],
        ];

        if (!$hasSuperAdmin) {
            // First super admin - return token for auto-login
            $expiresAt = now()->addDays(30);
            $token = $user->createToken('auth-token', ['*'], $expiresAt)->plainTextToken;
            $response['token'] = $token;
            $response['expires_at'] = $expiresAt->toIso8601String();
        }

        return response()->json($response, 201);
    }
}

