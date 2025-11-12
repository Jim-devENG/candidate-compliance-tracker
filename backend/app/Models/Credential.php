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
        $relativeUrl = \Illuminate\Support\Facades\Storage::url($this->document_path);
        $base = rtrim(config('app.url', ''), '/');
        if ($base) {
            return $base . $relativeUrl;
        }
        return $relativeUrl;
    }
}
