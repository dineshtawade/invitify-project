<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('referral_code_id')->nullable()->after('payment_method')->constrained('referral_codes')->nullOnDelete();
            $table->decimal('discount_amount', 10, 2)->default(0)->after('referral_code_id');
            $table->decimal('commission_amount', 10, 2)->default(0)->after('discount_amount');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['referral_code_id']);
            $table->dropColumn(['referral_code_id', 'discount_amount', 'commission_amount']);
        });
    }
};
