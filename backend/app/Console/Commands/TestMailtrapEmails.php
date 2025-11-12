<?php

namespace App\Console\Commands;

use App\Mail\CredentialExpiryReminder;
use App\Mail\CredentialExpirySummary;
use App\Models\Credential;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMailtrapEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:mailtrap';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically test Mailtrap email configuration by sending test emails';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🧪 Testing Mailtrap Email Configuration...');
        $this->newLine();

        // Check if we have users
        $users = User::all();
        if ($users->isEmpty()) {
            $this->error('❌ No users found. Please create a user first.');
            return Command::FAILURE;
        }

        // Check if we have credentials
        $credentials = Credential::with('user')->get();
        if ($credentials->isEmpty()) {
            $this->error('❌ No credentials found. Please create a credential first.');
            return Command::FAILURE;
        }

        $this->info('✓ Found ' . $users->count() . ' user(s) and ' . $credentials->count() . ' credential(s)');
        $this->newLine();

        $successCount = 0;
        $failCount = 0;

        // Test 1: Send reminder email
        $this->info('📧 Test 1: Sending Reminder Email...');
        try {
            $credential = $credentials->first();
            if ($credential->user && $credential->user->email) {
                Mail::to($credential->user->email)->send(
                    new CredentialExpiryReminder($credential, 30)
                );
                $this->line("  ✓ Reminder email sent to: {$credential->user->email}");
                $this->line("    Credential: {$credential->candidate_name} ({$credential->credential_type})");
                $successCount++;
            } else {
                $this->warn('  ⚠ Skipped - credential has no associated user email');
                $failCount++;
            }
        } catch (\Exception $e) {
            $this->error("  ✗ Failed: {$e->getMessage()}");
            $failCount++;
        }
        $this->newLine();

        // Test 2: Send summary email to admin
        $this->info('📧 Test 2: Sending Summary Email to Admin...');
        try {
            $admin = User::where('role', 'admin')->first();
            if (!$admin) {
                $admin = $users->first();
                $this->warn("  ⚠ No admin found, using first user: {$admin->email}");
            }

            // Get credentials expiring within 30 days
            $expiringCredentials = Credential::whereDate('expiry_date', '>=', now())
                ->whereDate('expiry_date', '<=', now()->addDays(30))
                ->whereNotNull('expiry_date')
                ->with('user')
                ->orderBy('expiry_date', 'asc')
                ->get();

            if ($expiringCredentials->isEmpty()) {
                // Use all credentials for testing
                $expiringCredentials = $credentials->take(3);
            }

            Mail::to($admin->email)->send(
                new CredentialExpirySummary($expiringCredentials)
            );
            $this->line("  ✓ Summary email sent to: {$admin->email}");
            $this->line("    Credentials included: {$expiringCredentials->count()}");
            $successCount++;
        } catch (\Exception $e) {
            $this->error("  ✗ Failed: {$e->getMessage()}");
            $failCount++;
        }
        $this->newLine();

        // Test 3: Send multiple reminder emails (different days)
        $this->info('📧 Test 3: Sending Multiple Reminder Emails (30, 14, 7 days)...');
        $reminderDays = [30, 14, 7];
        $sentReminders = 0;

        foreach ($reminderDays as $days) {
            try {
                $testCredential = $credentials->first();
                if ($testCredential->user && $testCredential->user->email) {
                    Mail::to($testCredential->user->email)->send(
                        new CredentialExpiryReminder($testCredential, $days)
                    );
                    $this->line("  ✓ {$days}-day reminder sent to: {$testCredential->user->email}");
                    $sentReminders++;
                }
            } catch (\Exception $e) {
                $this->error("  ✗ {$days}-day reminder failed: {$e->getMessage()}");
            }
        }

        if ($sentReminders > 0) {
            $successCount++;
            $this->line("  ✓ Sent {$sentReminders} reminder email(s)");
        } else {
            $failCount++;
        }
        $this->newLine();

        // Summary
        $this->newLine();
        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if ($successCount > 0 && $failCount == 0) {
            $this->info("✅ All tests passed! ({$successCount} test(s) successful)");
            $this->newLine();
            $this->info('📬 Check your Mailtrap inbox at: https://mailtrap.io');
            $this->info('   You should see ' . ($successCount + $sentReminders) . ' email(s) in your inbox.');
        } elseif ($successCount > 0) {
            $this->warn("⚠ Partial success: {$successCount} passed, {$failCount} failed");
            $this->newLine();
            $this->info('📬 Check your Mailtrap inbox for successful emails.');
            $this->error('   Review errors above and check your .env configuration.');
        } else {
            $this->error("❌ All tests failed! ({$failCount} failure(s))");
            $this->newLine();
            $this->error('Please check:');
            $this->line('  1. Your .env file has correct Mailtrap credentials');
            $this->line('  2. Run: php artisan config:clear');
            $this->line('  3. Check storage/logs/laravel.log for detailed errors');
        }
        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return $failCount == 0 ? Command::SUCCESS : Command::FAILURE;
    }
}
