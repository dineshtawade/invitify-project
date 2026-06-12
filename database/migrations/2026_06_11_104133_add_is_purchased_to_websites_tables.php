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
            $table->boolean('is_purchased')->default(false)->after('theme');
        });

        Schema::table('business_websites', function (Blueprint $table) {
            $table->boolean('is_purchased')->default(false)->after('theme');
        });

        // Set existing records to true
        \Illuminate\Support\Facades\DB::table('mini_websites')->update(['is_purchased' => true]);
        \Illuminate\Support\Facades\DB::table('business_websites')->update(['is_purchased' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mini_websites', function (Blueprint $table) {
            $table->dropColumn('is_purchased');
        });

        Schema::table('business_websites', function (Blueprint $table) {
            $table->dropColumn('is_purchased');
        });
    }
};
