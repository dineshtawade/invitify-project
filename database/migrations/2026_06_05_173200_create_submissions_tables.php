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
        Schema::create('rsvps', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('mini_website_id')->constrained('mini_websites')->cascadeOnDelete();
            $blueprint->string('name');
            $blueprint->string('email');
            $blueprint->integer('guests_count')->default(1);
            $blueprint->string('status'); // attending, declined
            $blueprint->text('message')->nullable();
            $blueprint->timestamps();
        });

        Schema::create('contact_submissions', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('mini_website_id')->constrained('mini_websites')->cascadeOnDelete();
            $blueprint->string('name');
            $blueprint->string('email');
            $blueprint->string('subject');
            $blueprint->text('message');
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_submissions');
        Schema::dropIfExists('rsvps');
    }
};
