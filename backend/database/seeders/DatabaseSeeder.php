<?php

namespace Database\Seeders;

use App\Models\Credential;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Create a test recruiter user
        $recruiter = User::factory()->create([
            'name' => 'Recruiter User',
            'email' => 'recruiter@example.com',
            'role' => 'recruiter',
        ]);

        // Create 10 sample credentials with mixed expiry dates
        // Some will be expired, some expiring soon, some active
        Credential::factory(10)->create([
            'user_id' => $recruiter->id,
        ]);

        // Optionally run test email seeder for email testing
        // Uncomment the line below to seed test data for email testing
        // $this->call(TestEmailSeeder::class);
    }
}
