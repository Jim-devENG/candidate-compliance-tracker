<?php

namespace Database\Seeders;

use App\Models\Credential;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestEmailSeeder extends Seeder
{
    /**
     * Seed test data for email testing.
     */
    public function run(): void
    {
        // Get or create test users
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        $recruiter = User::firstOrCreate(
            ['email' => 'recruiter@example.com'],
            [
                'name' => 'Recruiter User',
                'password' => bcrypt('password'),
                'role' => 'recruiter',
            ]
        );

        // Create test credentials with specific expiry dates for testing
        $today = now();
        
        // Credential expiring in 30 days
        Credential::firstOrCreate(
            [
                'candidate_name' => 'John Doe - 30 Days',
                'email' => 'john30@example.com',
            ],
            [
                'user_id' => $recruiter->id,
                'position' => 'Software Engineer',
                'credential_type' => 'Professional License',
                'issue_date' => $today->copy()->subYear()->format('Y-m-d'),
                'expiry_date' => $today->copy()->addDays(30)->format('Y-m-d'),
                'status' => 'active',
            ]
        );

        // Credential expiring in 14 days
        Credential::firstOrCreate(
            [
                'candidate_name' => 'Jane Smith - 14 Days',
                'email' => 'jane14@example.com',
            ],
            [
                'user_id' => $recruiter->id,
                'position' => 'Nurse',
                'credential_type' => 'Certification',
                'issue_date' => $today->copy()->subYear()->format('Y-m-d'),
                'expiry_date' => $today->copy()->addDays(14)->format('Y-m-d'),
                'status' => 'active',
            ]
        );

        // Credential expiring in 7 days
        Credential::firstOrCreate(
            [
                'candidate_name' => 'Bob Johnson - 7 Days',
                'email' => 'bob7@example.com',
            ],
            [
                'user_id' => $recruiter->id,
                'position' => 'Teacher',
                'credential_type' => 'Background Check',
                'issue_date' => $today->copy()->subYear()->format('Y-m-d'),
                'expiry_date' => $today->copy()->addDays(7)->format('Y-m-d'),
                'status' => 'active',
            ]
        );

        // Credential expiring in 5 days (for summary email)
        Credential::firstOrCreate(
            [
                'candidate_name' => 'Alice Brown - 5 Days',
                'email' => 'alice5@example.com',
            ],
            [
                'user_id' => $recruiter->id,
                'position' => 'Accountant',
                'credential_type' => 'Professional License',
                'issue_date' => $today->copy()->subYear()->format('Y-m-d'),
                'expiry_date' => $today->copy()->addDays(5)->format('Y-m-d'),
                'status' => 'active',
            ]
        );

        // Credential expiring in 20 days (for summary email)
        Credential::firstOrCreate(
            [
                'candidate_name' => 'Charlie Wilson - 20 Days',
                'email' => 'charlie20@example.com',
            ],
            [
                'user_id' => $recruiter->id,
                'position' => 'Project Manager',
                'credential_type' => 'Security Clearance',
                'issue_date' => $today->copy()->subYear()->format('Y-m-d'),
                'expiry_date' => $today->copy()->addDays(20)->format('Y-m-d'),
                'status' => 'active',
            ]
        );

        $this->command->info('Test email data seeded successfully!');
        $this->command->info('Created credentials expiring in: 30, 14, 7, 5, and 20 days');
    }
}

