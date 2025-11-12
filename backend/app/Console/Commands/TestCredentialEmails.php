<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestCredentialEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'credentials:test {--days=30,14,7 : Comma-separated list of days to test}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manually trigger reminder and summary emails for testing';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = $this->option('days') ?: '30,14,7';

        $this->info("Triggering reminder emails for days: {$days}");
        $this->call('credentials:send-reminders', ['--days' => $days]);

        $this->newLine();
        $this->info('Triggering daily summary email to Admin...');
        $this->call('credentials:send-summary');

        $this->newLine();
        $this->info('✓ Test email commands executed.');

        return Command::SUCCESS;
    }
}



