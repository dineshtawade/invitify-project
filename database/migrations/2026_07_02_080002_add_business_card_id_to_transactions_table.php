<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('business_card_id')
                  ->nullable()
                  ->constrained('business_cards')
                  ->nullOnDelete()
                  ->after('business_website_id');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['business_card_id']);
            $table->dropColumn('business_card_id');
        });
    }
};
