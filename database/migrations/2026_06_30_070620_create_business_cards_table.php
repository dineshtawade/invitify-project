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
        Schema::create('business_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('company_name');
            $table->string('logo_path')->nullable();
            $table->string('theme_css')->default('card_css1.css');
            
            // JSON columns for details and dynamic lists
            $table->json('personal_details')->nullable();
            $table->json('social_links')->nullable();
            $table->json('youtube_videos')->nullable();
            $table->json('payment_details')->nullable();
            $table->json('qr_codes')->nullable();
            $table->json('services')->nullable();
            $table->json('ecommerce_products')->nullable();
            $table->json('gallery')->nullable();
            
            $table->string('status', 20)->default('active'); // active, inactive
            $table->string('payment_status', 20)->default('Created'); // Created, Success, Failed
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_cards');
    }
};
