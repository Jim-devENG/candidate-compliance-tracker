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
     * 
     * NOTE: Seeding is disabled for production use.
     * All users must be created through the registration endpoint.
     * This ensures real-time authentication without test data.
     */
    public function run(): void
    {
        // Seeding is disabled - use registration endpoint for creating users
        // This ensures all authentication is done through the proper API endpoints
        // and no test data interferes with real-time authentication
    }
}
