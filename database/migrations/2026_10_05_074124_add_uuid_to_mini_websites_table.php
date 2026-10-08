<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mini_websites', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id')->unique();
        });

        // Generate UUIDs for existing records
        $websites = \Illuminate\Support\Facades\DB::table('mini_websites')->get();
        foreach ($websites as $website) {
            \Illuminate\Support\Facades\DB::table('mini_websites')
                ->where('id', $website->id)
                ->update(['uuid' => (string) \Illuminate\Support\Str::uuid()]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mini_websites', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
