<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite does not support altering enum/nullability easily; recreate table
        Schema::create('credentials_tmp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('candidate_name');
            $table->string('position');
            $table->string('credential_type');
            $table->date('issue_date');
            $table->date('expiry_date');
            $table->string('email');
            // Make status nullable string to represent manual override; null means auto-calc
            $table->string('status')->nullable();
            $table->timestamps();
        });

        // Copy data from old table
        $rows = DB::table('credentials')->get();
        foreach ($rows as $row) {
            DB::table('credentials_tmp')->insert([
                'id' => $row->id,
                'user_id' => $row->user_id,
                'candidate_name' => $row->candidate_name,
                'position' => $row->position,
                'credential_type' => $row->credential_type,
                'issue_date' => $row->issue_date,
                'expiry_date' => $row->expiry_date,
                'email' => $row->email,
                // Preserve existing statuses, treat empty as null
                'status' => ($row->status === '' ? null : $row->status),
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ]);
        }

        // Replace tables
        Schema::drop('credentials');
        Schema::rename('credentials_tmp', 'credentials');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate original structure with non-null enum and default 'active'
        Schema::create('credentials_old', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('candidate_name');
            $table->string('position');
            $table->string('credential_type');
            $table->date('issue_date');
            $table->date('expiry_date');
            $table->string('email');
            $table->string('status')->default('active'); // approximate original enum
            $table->timestamps();
        });

        $rows = DB::table('credentials')->get();
        foreach ($rows as $row) {
            DB::table('credentials_old')->insert([
                'id' => $row->id,
                'user_id' => $row->user_id,
                'candidate_name' => $row->candidate_name,
                'position' => $row->position,
                'credential_type' => $row->credential_type,
                'issue_date' => $row->issue_date,
                'expiry_date' => $row->expiry_date,
                'email' => $row->email,
                'status' => $row->status ?? 'active',
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ]);
        }

        Schema::drop('credentials');
        Schema::rename('credentials_old', 'credentials');
    }
};


