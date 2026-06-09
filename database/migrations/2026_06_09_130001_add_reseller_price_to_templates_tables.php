<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->decimal('reseller_price', 10, 2)->nullable()->after('price');
        });

        Schema::table('mini_website_templates', function (Blueprint $table) {
            $table->decimal('reseller_price', 10, 2)->nullable()->after('price');
        });

        Schema::table('business_website_templates', function (Blueprint $table) {
            $table->decimal('reseller_price', 10, 2)->nullable()->after('price');
        });
    }

    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn('reseller_price');
        });

        Schema::table('mini_website_templates', function (Blueprint $table) {
            $table->dropColumn('reseller_price');
        });

        Schema::table('business_website_templates', function (Blueprint $table) {
            $table->dropColumn('reseller_price');
        });
    }
};
