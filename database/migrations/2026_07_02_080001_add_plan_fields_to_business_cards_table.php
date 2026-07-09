<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('business_cards', function (Blueprint $table) {
            $table->foreignId('plan_id')
                  ->nullable()
                  ->constrained('business_card_plans')
                  ->nullOnDelete()
                  ->after('theme_css');

            $table->timestamp('plan_expires_at')->nullable()->after('plan_id');
            $table->string('payment_id')->nullable()->after('plan_expires_at');
            $table->string('order_id')->nullable()->after('payment_id');
        });
    }

    public function down(): void
    {
        Schema::table('business_cards', function (Blueprint $table) {
            $table->dropForeign(['plan_id']);
            $table->dropColumn(['plan_id', 'plan_expires_at', 'payment_id', 'order_id']);
        });
    }
};
