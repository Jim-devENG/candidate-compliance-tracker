<?php

namespace App\Console\Commands;

use App\Mail\CredentialExpiryReminder;
use App\Models\Credential;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendCredentialReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'credentials:send-reminders {--days=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder emails for credentials expiring in 30, 14, or 7 days';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $reminderDays = [30, 14, 7];
        $daysOption = $this->option('days');

        // If specific days provided, use only those
        if ($daysOption) {
            $reminderDays = array_map('intval', explode(',', $daysOption));
        }

        $totalSent = 0;

        foreach ($reminderDays as $days) {
            $this->info("Checking credentials expiring in {$days} days...");

            // Find credentials expiring exactly in $days days
            $targetDate = now()->addDays($days)->startOfDay();
            $endDate = $targetDate->copy()->endOfDay();

            $credentials = Credential::whereDate('expiry_date', '>=', $targetDate)
                ->whereDate('expiry_date', '<=', $endDate)
                ->whereNotNull('expiry_date')
                ->with('user')
                ->get();

            $count = 0;

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

                            $this->line("  ✓ Sent reminder to {$credential->user->email} for {$credential->candidate_name} (expires in {$days} days)");
                            $count++;
                            $totalSent++;
                        } catch (\Exception $e) {
                            $this->error("  ✗ Failed to send email to {$credential->user->email}: {$e->getMessage()}");
                        }
                    } else {
                        $this->warn("  ⚠ Skipped {$credential->candidate_name} - no user email found");
                    }
                }
            }

            $this->info("  Sent {$count} reminder(s) for {$days}-day expiry.");
        }

        $this->info("\n✓ Total reminders sent: {$totalSent}");

        return Command::SUCCESS;
    }
}
