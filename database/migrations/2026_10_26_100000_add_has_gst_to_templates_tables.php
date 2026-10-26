<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * developed by dinesh tawade
     */
    public function up(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            if (!Schema::hasColumn('templates', 'has_gst')) {
                $table->boolean('has_gst')->default(false)->after('status');
            }
        });

        if (Schema::hasTable('mini_website_templates')) {
            Schema::table('mini_website_templates', function (Blueprint $table) {
                if (!Schema::hasColumn('mini_website_templates', 'has_gst')) {
                    $table->boolean('has_gst')->default(false)->after('status');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            if (Schema::hasColumn('templates', 'has_gst')) {
                $table->dropColumn('has_gst');
            }
        });

        if (Schema::hasTable('mini_website_templates')) {
            Schema::table('mini_website_templates', function (Blueprint $table) {
                if (Schema::hasColumn('mini_website_templates', 'has_gst')) {
                    $table->dropColumn('has_gst');
                }
            });
        }
    }
};
