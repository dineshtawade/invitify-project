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
        Schema::create('business_card_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_card_id')->constrained('business_cards')->cascadeOnDelete();
            $table->string('r_name');
            $table->string('r_email');
            $table->string('r_contact')->nullable();
            $table->integer('r_star')->default(5);
            $table->text('r_msg')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_card_feedback');
    }
};
