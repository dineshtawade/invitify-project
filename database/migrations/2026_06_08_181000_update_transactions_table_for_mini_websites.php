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
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['template_id']);
            $table->dropForeign(['user_template_id']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('template_id')->nullable()->change();
            $table->unsignedBigInteger('user_template_id')->nullable()->change();
            
            $table->foreignId('mini_website_template_id')->nullable()->after('user_template_id')->constrained('mini_website_templates')->nullOnDelete();
            $table->foreignId('mini_website_id')->nullable()->after('mini_website_template_id')->constrained('mini_websites')->nullOnDelete();
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('template_id')->references('id')->on('templates')->nullOnDelete();
            $table->foreign('user_template_id')->references('id')->on('user_templates')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['template_id']);
            $table->dropForeign(['user_template_id']);
            $table->dropForeign(['mini_website_template_id']);
            $table->dropForeign(['mini_website_id']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['mini_website_template_id', 'mini_website_id']);
        });

        // Restore original columns as non-nullable
        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('template_id')->nullable(false)->change();
            $table->unsignedBigInteger('user_template_id')->nullable(false)->change();
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('template_id')->references('id')->on('templates')->cascadeOnDelete();
            $table->foreign('user_template_id')->references('id')->on('user_templates')->cascadeOnDelete();
        });
    }
};
