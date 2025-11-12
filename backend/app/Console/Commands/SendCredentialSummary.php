<?php

namespace App\Console\Commands;

use App\Mail\CredentialExpirySummary;
use App\Models\Credential;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendCredentialSummary extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'credentials:send-summary';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily summary email to Admin listing all credentials expiring within 30 days';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Generating daily credential expiry summary...');

        // Find all credentials expiring within the next 30 days
        $today = now()->startOfDay();
        $thirtyDaysFromNow = now()->addDays(30)->endOfDay();

        $credentials = Credential::whereDate('expiry_date', '>=', $today)
            ->whereDate('expiry_date', '<=', $thirtyDaysFromNow)
            ->whereNotNull('expiry_date')
            ->with('user')
            ->orderBy('expiry_date', 'asc')
            ->get();

        $this->info("Found {$credentials->count()} credential(s) expiring within 30 days.");

        // Find admin users
        $admins = User::where('role', 'admin')->get();

        if ($admins->isEmpty()) {
            $this->warn('⚠ No admin users found. Skipping email send.');
            return Command::FAILURE;
        }

        $sentCount = 0;

        foreach ($admins as $admin) {
            if (!$admin->email) {
                $this->warn("⚠ Skipping admin {$admin->name} - no email address.");
                continue;
            }

            try {
                Mail::to($admin->email)->send(
                    new CredentialExpirySummary($credentials)
                );

                $this->info("✓ Sent summary email to {$admin->email} ({$admin->name})");
                $sentCount++;
            } catch (\Exception $e) {
                $this->error("✗ Failed to send email to {$admin->email}: {$e->getMessage()}");
            }
        }

        if ($sentCount > 0) {
            $this->info("\n✓ Summary emails sent successfully to {$sentCount} admin(s).");
            return Command::SUCCESS;
        }

        $this->warn("\n⚠ No summary emails were sent.");
        return Command::FAILURE;
    }
}
