<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /**
     * Get all users (super_admin only).
     */
    public function getUsers(Request $request): JsonResponse
    {
        // This method is protected by role.super_admin middleware
        $users = User::withCount('credentials')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar_url' => $user->avatar_url,
                    'credentials_count' => $user->credentials_count,
                    'created_at' => $user->created_at?->toISOString(),
                    'updated_at' => $user->updated_at?->toISOString(),
                ];
            });

        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Create a new user (super_admin only).
     * - Super Admin: Can create admin, recruiter, or super_admin
     */
    public function createUser(Request $request): JsonResponse
    {
        // This method is protected by role.super_admin middleware
        // Super Admin can create any role
        $allowedRoles = ['super_admin', 'admin', 'recruiter'];

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'in:' . implode(',', $allowedRoles)],
        ]);

        $user = User::create([
            'name' => htmlspecialchars(strip_tags($request->name), ENT_QUOTES, 'UTF-8'),
            'email' => filter_var($request->email, FILTER_SANITIZE_EMAIL),
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
            ],
        ], 201);
    }

    /**
     * Update a user (super_admin only).
     * - Super Admin: Can update any role
     */
    public function updateUser(Request $request, $id): JsonResponse
    {
        // This method is protected by role.super_admin middleware
        $user = User::findOrFail($id);
        $currentUser = $request->user();
        
        // Super Admin can assign any role
        $allowedRoles = ['super_admin', 'admin', 'recruiter'];

        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
            'role' => ['sometimes', 'string', 'in:' . implode(',', $allowedRoles)],
        ]);

        if ($request->filled('name')) {
            $user->name = htmlspecialchars(strip_tags($request->name), ENT_QUOTES, 'UTF-8');
        }

        if ($request->filled('email')) {
            $user->email = filter_var($request->email, FILTER_SANITIZE_EMAIL);
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->filled('role')) {
            $newRole = $request->role;
            
            // Prevent super_admin from removing their own super_admin role
            if ($user->id === $currentUser->id && $currentUser->role === 'super_admin' && $newRole !== 'super_admin') {
                throw ValidationException::withMessages([
                    'role' => ['You cannot remove your own super admin role.'],
                ]);
            }
            
            $user->role = $newRole;
        }

        $user->save();
        $user->refresh();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
            ],
        ]);
    }

    /**
     * Delete a user (super_admin only).
     * - Super Admin: Can delete any user
     */
    public function deleteUser(Request $request, $id): JsonResponse
    {
        // This method is protected by role.super_admin middleware
        $user = User::findOrFail($id);
        $currentUser = $request->user();

        // Prevent users from deleting themselves
        if ($user->id === $currentUser->id) {
            throw ValidationException::withMessages([
                'user' => ['You cannot delete your own account.'],
            ]);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}

