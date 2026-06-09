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
        Schema::create('mini_websites', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->constrained()->cascadeOnDelete();
            $blueprint->string('type'); // invitation, business
            $blueprint->string('title');
            $blueprint->string('slug')->unique();
            $blueprint->string('theme'); // cozy, clean, royal, ocean
            $blueprint->boolean('is_published')->default(false);
            $blueprint->json('config');
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mini_websites');
    }
};
