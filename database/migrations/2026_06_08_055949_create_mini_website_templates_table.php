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
        Schema::create('mini_website_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // invitation or business
            $table->decimal('price', 8, 2)->default(0.00);
            $table->string('preview_image')->nullable();
            $table->json('config');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mini_website_templates');
    }
};
