<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_websites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('template_id')->constrained('business_website_templates')->cascadeOnDelete();
            
            $table->string('title');
            $table->string('slug', 50)->unique();
            $table->string('theme', 30)->default('royal');
            $table->boolean('is_published')->default(false);
            $table->timestamp('expires_at')->nullable();
            
            $table->json('pages')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->string('meta_keywords', 500)->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_websites');
    }
};
