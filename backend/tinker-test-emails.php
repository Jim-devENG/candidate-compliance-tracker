<?php

/**
 * Tinker Script for Testing Email Functionality
 * 
 * Run this in Tinker:
 * php artisan tinker
 * 
 * Then copy and paste the commands below:
 */

use App\Mail\CredentialExpiryReminder;
use App\Mail\CredentialExpirySummary;
use App\Models\Credential;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

// Test 1: Send a reminder email for a credential expiring in 30 days
echo "Test 1: Sending 30-day reminder email...\n";
$credential30 = Credential::where('candidate_name', 'like', '%30 Days%')->first();
if ($credential30 && $credential30->user) {
    Mail::to($credential30->user->email)->send(new CredentialExpiryReminder($credential30, 30));
    echo "✓ Sent reminder email to {$credential30->user->email}\n";
} else {
    echo "✗ No credential found for 30-day test\n";
}

// Test 2: Send a reminder email for a credential expiring in 14 days
echo "\nTest 2: Sending 14-day reminder email...\n";
$credential14 = Credential::where('candidate_name', 'like', '%14 Days%')->first();
if ($credential14 && $credential14->user) {
    Mail::to($credential14->user->email)->send(new CredentialExpiryReminder($credential14, 14));
    echo "✓ Sent reminder email to {$credential14->user->email}\n";
} else {
    echo "✗ No credential found for 14-day test\n";
}

// Test 3: Send a reminder email for a credential expiring in 7 days
echo "\nTest 3: Sending 7-day reminder email...\n";
$credential7 = Credential::where('candidate_name', 'like', '%7 Days%')->first();
if ($credential7 && $credential7->user) {
    Mail::to($credential7->user->email)->send(new CredentialExpiryReminder($credential7, 7));
    echo "✓ Sent reminder email to {$credential7->user->email}\n";
} else {
    echo "✗ No credential found for 7-day test\n";
}

// Test 4: Send daily summary email to Admin
echo "\nTest 4: Sending daily summary email to Admin...\n";
$admin = User::where('role', 'admin')->first();
if ($admin) {
    $credentials = Credential::whereDate('expiry_date', '>=', now())
        ->whereDate('expiry_date', '<=', now()->addDays(30))
        ->whereNotNull('expiry_date')
        ->with('user')
        ->orderBy('expiry_date', 'asc')
        ->get();
    
    Mail::to($admin->email)->send(new CredentialExpirySummary($credentials));
    echo "✓ Sent summary email to {$admin->email} with {$credentials->count()} credentials\n";
} else {
    echo "✗ No admin user found\n";
}

echo "\n✓ All email tests completed!\n";
echo "Check your mail configuration (Mailtrap, log, or configured SMTP) to see the emails.\n";

