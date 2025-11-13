<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Credential extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'candidate_name',
        'position',
        'credential_type',
        'issue_date',
        'expiry_date',
        'email',
        'status',
        'document_path',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'expiry_date' => 'date',
        ];
    }

    /**
     * Get the user that manages this credential.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate the status based on expiry date.
     * 
     * Rules:
     * - Active → expiry > 30 days from today
     * - Expiring Soon → expiry ≤ 30 days from today
     * - Expired → expiry ≤ today
     * 
     * @return array{status: string, color: string}
     */
    public function getCalculatedStatus(): array
    {
        if (!$this->expiry_date) {
            return [
                'status' => 'pending',
                'color' => 'gray',
            ];
        }

        $today = now()->startOfDay();
        $expiryDate = $this->expiry_date->startOfDay();
        
        // Calculate days until expiry (negative if expired)
        $daysUntilExpiry = $today->diffInDays($expiryDate, false);

        if ($expiryDate->lte($today)) {
            // Expired → expiry ≤ today
            return [
                'status' => 'expired',
                'color' => 'red',
            ];
        } elseif ($daysUntilExpiry <= 30) {
            // Expiring Soon → expiry ≤ 30 days
            return [
                'status' => 'expiring_soon',
                'color' => 'yellow',
            ];
        } else {
            // Active → expiry > 30 days
            return [
                'status' => 'active',
                'color' => 'green',
            ];
        }
    }

    protected $appends = ['document_url'];

    public function getDocumentUrlAttribute(): ?string
    {
        if (!$this->document_path) {
            return null;
        }
        
        // Get the storage URL (may be relative or absolute depending on config)
        $storageUrl = \Illuminate\Support\Facades\Storage::disk('public')->url($this->document_path);
        
        // If Storage::url already returns a full URL, use it directly
        if (str_starts_with($storageUrl, 'http://') || str_starts_with($storageUrl, 'https://')) {
            return $storageUrl;
        }
        
        // Get the base URL from request if available (for production), otherwise use config
        $baseUrl = null;
        try {
            // Try to get URL from current request (works in HTTP context)
            if (app()->runningInConsole() === false && request()) {
                $baseUrl = request()->getSchemeAndHttpHost();
            }
        } catch (\Exception $e) {
            // Fall back to config if request is not available
        }
        
        // Fall back to config if we couldn't get it from request
        if (!$baseUrl) {
            $baseUrl = rtrim(config('app.url', 'http://localhost:8000'), '/');
        }
        
        // Ensure storage path starts with / if it doesn't already
        $storagePath = $storageUrl;
        if (!str_starts_with($storagePath, '/')) {
            $storagePath = '/' . $storagePath;
        }
        
        // Construct full URL
        return $baseUrl . $storagePath;
    }
}
