<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPassword
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar_path) {
            return null;
        }
        
        // Get the base URL from request if available (for production/mobile), otherwise use config
        $baseUrl = null;
        try {
            // Try to get URL from current request (works in HTTP context)
            // This ensures we use the actual network IP (e.g., 192.168.88.196) when accessed from mobile
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
        
        // Get the storage path (relative, e.g., /storage/avatars/filename.jpg)
        $storagePath = '/storage/' . ltrim($this->avatar_path, '/');
        
        // Remove 'public/' prefix if present (Storage::url might include it)
        $storagePath = str_replace('/storage/public/', '/storage/', $storagePath);
        
        // Construct full URL
        $url = $baseUrl . $storagePath;
        
        // Add cache-busting parameter using updated_at timestamp
        if ($this->updated_at) {
            $separator = strpos($url, '?') !== false ? '&' : '?';
            return $url . $separator . 'v=' . $this->updated_at->timestamp;
        }
        return $url;
    }

    /**
     * Get the credentials managed by this user.
     */
    public function credentials(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Credential::class);
    }

    /**
     * Send the password reset notification with custom URL.
     */
    public function sendPasswordResetNotification($token, $resetUrl = null): void
    {
        if ($resetUrl) {
            // Use custom notification with frontend URL
            $this->notify(new \App\Notifications\ResetPasswordNotification($token, $resetUrl));
        } else {
            // Fallback to default Laravel notification
            $this->notify(new \Illuminate\Auth\Notifications\ResetPassword($token));
        }
    }
}
