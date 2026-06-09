<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('business_website_template_id')->nullable()->after('mini_website_id')->constrained('business_website_templates')->nullOnDelete();
            $table->foreignId('business_website_id')->nullable()->after('business_website_template_id')->constrained('business_websites')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['business_website_template_id']);
            $table->dropForeign(['business_website_id']);
            $table->dropColumn(['business_website_template_id', 'business_website_id']);
        });
    }
};
