<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('referral_discount_percentage', 5, 2)->nullable()->after('is_approved');
            $table->decimal('referral_commission_percentage', 5, 2)->nullable()->after('referral_discount_percentage');
            $table->unsignedInteger('referral_max_codes')->nullable()->default(5)->after('referral_commission_percentage');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['referral_discount_percentage', 'referral_commission_percentage', 'referral_max_codes']);
        });
    }
};
