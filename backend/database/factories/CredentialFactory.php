<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Credential>
 */
class CredentialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issueDate = fake()->dateTimeBetween('-2 years', 'now');
        
        // Create mixed expiry dates: some expired, some expiring soon, some active
        $expiryType = fake()->randomElement(['expired', 'expiring_soon', 'active', 'active']);
        
        $expiryDate = match ($expiryType) {
            'expired' => fake()->dateTimeBetween('-1 year', '-1 day'),
            'expiring_soon' => fake()->dateTimeBetween('now', '+30 days'),
            default => fake()->dateTimeBetween('+31 days', '+2 years'),
        };
        
        $daysUntilExpiry = (int) (new \DateTime($expiryDate->format('Y-m-d')))->diff(new \DateTime())->format('%r%a');
        
        $status = match (true) {
            $daysUntilExpiry < 0 => 'expired',
            $daysUntilExpiry <= 30 => 'expiring_soon',
            default => 'active',
        };

        $credentialTypes = [
            'Professional License',
            'Certification',
            'Background Check',
            'Drug Test',
            'Medical Clearance',
            'Security Clearance',
            'Education Verification',
            'Employment Verification',
        ];

        $positions = [
            'Software Engineer',
            'Nurse',
            'Teacher',
            'Accountant',
            'Project Manager',
            'Data Analyst',
            'Sales Representative',
            'Marketing Manager',
        ];

        return [
            'user_id' => User::factory(),
            'candidate_name' => fake()->name(),
            'position' => fake()->randomElement($positions),
            'credential_type' => fake()->randomElement($credentialTypes),
            'issue_date' => $issueDate->format('Y-m-d'),
            'expiry_date' => $expiryDate->format('Y-m-d'),
            'email' => fake()->unique()->safeEmail(),
            'status' => $status,
        ];
    }
}
