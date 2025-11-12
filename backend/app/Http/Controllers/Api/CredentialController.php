<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCredentialRequest;
use App\Http\Requests\UpdateCredentialRequest;
use App\Models\Credential;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CredentialController extends Controller
{
    /**
     * Display a listing of the resource with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Credential::with('user:id,name,email');
        
        // Recruiters can only see their own credentials
        if ($request->user()->role === 'recruiter') {
            $query->where('user_id', $request->user()->id);
        }
        // Admins can see all credentials

        // Filter by candidate name
        if ($request->has('name')) {
            $query->where('candidate_name', 'like', '%' . $request->input('name') . '%');
        }

        // Filter by credential type
        if ($request->has('type')) {
            $query->where('credential_type', 'like', '%' . $request->input('type') . '%');
        }

        // Pagination
        $perPage = (int) $request->integer('per_page', 10);
        if ($perPage < 1) {
            $perPage = 10;
        }
        if ($perPage > 100) {
            $perPage = 100;
        }
        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Add calculated status to each credential
        $paginator->getCollection()->transform(function ($credential) {
            $calculatedStatus = $credential->getCalculatedStatus();
            // Use manual status if set (not null and not empty), otherwise use calculated status
            $status = ($credential->status && $credential->status !== '') 
                ? $credential->status 
                : $calculatedStatus['status'];
            $statusColor = ($credential->status && $credential->status !== '') 
                ? $this->getStatusColor($credential->status) 
                : $calculatedStatus['color'];
            
            return [
                'id' => $credential->id,
                'user_id' => $credential->user_id,
                'user' => $credential->user ? [
                    'id' => $credential->user->id,
                    'name' => $credential->user->name,
                    'email' => $credential->user->email,
                ] : null,
                'candidate_name' => $credential->candidate_name,
                'position' => $credential->position,
                'credential_type' => $credential->credential_type,
                'issue_date' => $credential->issue_date?->format('Y-m-d'),
                'expiry_date' => $credential->expiry_date?->format('Y-m-d'),
                'email' => $credential->email,
                'status' => $status,
                'status_color' => $statusColor,
                'calculated_status' => $calculatedStatus['status'],
                'calculated_status_color' => $calculatedStatus['color'],
                'document_url' => $credential->document_url,
                'created_at' => $credential->created_at?->toISOString(),
                'updated_at' => $credential->updated_at?->toISOString(),
            ];
        });

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCredentialRequest $request): JsonResponse
    {
        // Use authenticated user ID
        $userId = $request->user()->id;

        $credential = Credential::create([
            'user_id' => $userId,
            'candidate_name' => $request->input('candidate_name'),
            'position' => $request->input('position'),
            'credential_type' => $request->input('credential_type'),
            'issue_date' => $request->input('issue_date'),
            'expiry_date' => $request->input('expiry_date'),
            'email' => $request->input('email'),
            'status' => $request->input('status') ?: null, // Allow manual status, null if empty to use calculated
        ]);

        // Handle document upload
        if ($request->hasFile('document')) {
            $path = $request->file('document')->store('credentials', 'public');
            $credential->document_path = $path;
            $credential->save();
        }

        $calculatedStatus = $credential->getCalculatedStatus();
        // Use manual status if set (not null and not empty), otherwise use calculated status
        $status = ($credential->status && $credential->status !== '') 
            ? $credential->status 
            : $calculatedStatus['status'];
        $statusColor = ($credential->status && $credential->status !== '') 
            ? $this->getStatusColor($credential->status) 
            : $calculatedStatus['color'];

        return response()->json([
            'data' => [
                'id' => $credential->id,
                'user_id' => $credential->user_id,
                'candidate_name' => $credential->candidate_name,
                'position' => $credential->position,
                'credential_type' => $credential->credential_type,
                'issue_date' => $credential->issue_date?->format('Y-m-d'),
                'expiry_date' => $credential->expiry_date?->format('Y-m-d'),
                'email' => $credential->email,
                'status' => $status,
                'status_color' => $statusColor,
                'calculated_status' => $calculatedStatus['status'],
                'calculated_status_color' => $calculatedStatus['color'],
                'document_url' => $credential->document_url,
                'created_at' => $credential->created_at?->toISOString(),
                'updated_at' => $credential->updated_at?->toISOString(),
            ],
            'message' => 'Credential created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $credential = Credential::with('user:id,name,email')->findOrFail($id);
        
        // Recruiters can only view their own credentials
        if ($request->user()->role === 'recruiter' && $credential->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only view your own credentials.',
            ], 403);
        }
        
        $calculatedStatus = $credential->getCalculatedStatus();
        // Use manual status if set (not null and not empty), otherwise use calculated status
        $status = ($credential->status && $credential->status !== '') 
            ? $credential->status 
            : $calculatedStatus['status'];
        $statusColor = ($credential->status && $credential->status !== '') 
            ? $this->getStatusColor($credential->status) 
            : $calculatedStatus['color'];

        return response()->json([
            'data' => [
                'id' => $credential->id,
                'user_id' => $credential->user_id,
                'user' => $credential->user ? [
                    'id' => $credential->user->id,
                    'name' => $credential->user->name,
                    'email' => $credential->user->email,
                ] : null,
                'candidate_name' => $credential->candidate_name,
                'position' => $credential->position,
                'credential_type' => $credential->credential_type,
                'issue_date' => $credential->issue_date?->format('Y-m-d'),
                'expiry_date' => $credential->expiry_date?->format('Y-m-d'),
                'email' => $credential->email,
                'status' => $status,
                'status_color' => $statusColor,
                'calculated_status' => $calculatedStatus['status'],
                'calculated_status_color' => $calculatedStatus['color'],
                'document_url' => $credential->document_url,
                'created_at' => $credential->created_at?->toISOString(),
                'updated_at' => $credential->updated_at?->toISOString(),
            ],
        ]);
    }

    /**
     * Get color for manual status.
     */
    private function getStatusColor(string $status): string
    {
        return match ($status) {
            'active' => 'green',
            'expiring_soon' => 'yellow',
            'expired' => 'red',
            'pending' => 'gray',
            default => 'gray',
        };
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCredentialRequest $request, string $id): JsonResponse
    {
        $credential = Credential::findOrFail($id);
        
        // Recruiters can only update their own credentials
        if ($request->user()->role === 'recruiter' && $credential->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only update your own credentials.',
            ], 403);
        }

        $validated = $request->validated();
        // If status is empty string, set it to null to allow auto-calculation
        if (isset($validated['status']) && $validated['status'] === '') {
            $validated['status'] = null;
        }

        // Handle document upload replace (optional)
        if ($request->hasFile('document')) {
            $path = $request->file('document')->store('credentials', 'public');
            $validated['document_path'] = $path;
        }

        $credential->update($validated);

        $credential->refresh();
        $calculatedStatus = $credential->getCalculatedStatus();
        // Use manual status if set (not null and not empty), otherwise use calculated status
        $status = ($credential->status && $credential->status !== '') 
            ? $credential->status 
            : $calculatedStatus['status'];
        $statusColor = ($credential->status && $credential->status !== '') 
            ? $this->getStatusColor($credential->status) 
            : $calculatedStatus['color'];

        return response()->json([
            'data' => [
                'id' => $credential->id,
                'user_id' => $credential->user_id,
                'candidate_name' => $credential->candidate_name,
                'position' => $credential->position,
                'credential_type' => $credential->credential_type,
                'issue_date' => $credential->issue_date?->format('Y-m-d'),
                'expiry_date' => $credential->expiry_date?->format('Y-m-d'),
                'email' => $credential->email,
                'status' => $status,
                'status_color' => $statusColor,
                'calculated_status' => $calculatedStatus['status'],
                'calculated_status_color' => $calculatedStatus['color'],
                'document_url' => $credential->document_url,
                'created_at' => $credential->created_at?->toISOString(),
                'updated_at' => $credential->updated_at?->toISOString(),
            ],
            'message' => 'Credential updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $credential = Credential::findOrFail($id);
        
        // Recruiters can only delete their own credentials
        if ($request->user()->role === 'recruiter' && $credential->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own credentials.',
            ], 403);
        }
        
        $credential->delete();

        return response()->json([
            'message' => 'Credential deleted successfully',
        ]);
    }
}
