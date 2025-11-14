<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\CredentialExpiryReminder;
use App\Mail\CredentialExpirySummary;
use App\Models\Credential;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    /**
     * Send reminder emails.
     * 
     * Manual trigger (from button): Sends to ALL candidates with expiry dates
     * Automatic (scheduled): Sends only to candidates expiring in 30/14/7 days
     */
    public function sendReminders(Request $request): JsonResponse
    {
        $sendToAll = $request->boolean('send_to_all', true); // Default to true for manual button clicks
        $daysOption = $request->input('days');

        $totalSent = 0;
        $errors = [];

        if ($sendToAll) {
            // Manual trigger: Send to ALL candidates with expiry dates
            $credentials = Credential::whereNotNull('expiry_date')
                ->whereDate('expiry_date', '>=', now()->startOfDay()) // Only future expiry dates
                ->with('user')
                ->get();

            foreach ($credentials as $credential) {
                if ($credential->user && $credential->user->email) {
                    // Calculate days until expiry
                    $daysUntilExpiry = now()->startOfDay()->diffInDays($credential->expiry_date->startOfDay(), false);
                    
                    // Use appropriate reminder message based on days
                    $reminderDays = $daysUntilExpiry > 0 ? $daysUntilExpiry : 0;
                    
                    try {
                        Mail::to($credential->user->email)->send(
                            new CredentialExpiryReminder($credential, $reminderDays)
                        );
                        $totalSent++;
                    } catch (\Exception $e) {
                        $errors[] = "Failed to send email to {$credential->user->email}: {$e->getMessage()}";
                    }
                }
            }
        } else {
            // Automatic: Send only to candidates expiring in 30, 14, or 7 days
            $reminderDays = [30, 14, 7];
            
            // If specific days provided, use only those
            if ($daysOption) {
                $reminderDays = array_map('intval', explode(',', $daysOption));
            }

            foreach ($reminderDays as $days) {
                // Find credentials expiring exactly in $days days
                $targetDate = now()->addDays($days)->startOfDay();
                $endDate = $targetDate->copy()->endOfDay();

                $credentials = Credential::whereDate('expiry_date', '>=', $targetDate)
                    ->whereDate('expiry_date', '<=', $endDate)
                    ->whereNotNull('expiry_date')
                    ->with('user')
                    ->get();

                foreach ($credentials as $credential) {
                    // Verify it's exactly $days away
                    $daysUntilExpiry = now()->startOfDay()->diffInDays($credential->expiry_date->startOfDay(), false);

                    if ($daysUntilExpiry == $days) {
                        // Send email to the user who manages this credential
                        if ($credential->user && $credential->user->email) {
                            try {
                                Mail::to($credential->user->email)->send(
                                    new CredentialExpiryReminder($credential, $days)
                                );
                                $totalSent++;
                            } catch (\Exception $e) {
                                $errors[] = "Failed to send email to {$credential->user->email}: {$e->getMessage()}";
                            }
                        }
                    }
                }
            }
        }

        return response()->json([
            'message' => $sendToAll 
                ? "Reminder emails sent to all candidates successfully" 
                : "Reminder emails sent successfully",
            'total_sent' => $totalSent,
            'errors' => $errors,
        ]);
    }

    /**
     * Send daily summary email to Admin users.
     */
    public function sendSummary(Request $request): JsonResponse
    {
        // Find all credentials expiring within the next 30 days
        $today = now()->startOfDay();
        $thirtyDaysFromNow = now()->addDays(30)->endOfDay();

        $credentials = Credential::whereDate('expiry_date', '>=', $today)
            ->whereDate('expiry_date', '<=', $thirtyDaysFromNow)
            ->whereNotNull('expiry_date')
            ->with('user')
            ->orderBy('expiry_date', 'asc')
            ->get();

        // Find admin and super_admin users
        $admins = User::whereIn('role', ['admin', 'super_admin'])->get();

        if ($admins->isEmpty()) {
            return response()->json([
                'message' => 'No admin users found',
                'total_sent' => 0,
            ], 400);
        }

        $sentCount = 0;
        $errors = [];

        foreach ($admins as $admin) {
            if (!$admin->email) {
                continue;
            }

            try {
                Mail::to($admin->email)->send(
                    new CredentialExpirySummary($credentials)
                );
                $sentCount++;
            } catch (\Exception $e) {
                $errors[] = "Failed to send email to {$admin->email}: {$e->getMessage()}";
            }
        }

        return response()->json([
            'message' => "Summary emails sent successfully",
            'total_sent' => $sentCount,
            'credentials_count' => $credentials->count(),
            'errors' => $errors,
        ]);
    }
}

