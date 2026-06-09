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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // wedding, birthday, party, etc.
            $table->decimal('price', 8, 2)->default(0.00);
            $table->string('bg_gradient')->default('from-rose-100 to-amber-100');
            $table->json('default_config');
            $table->timestamps();
        });

        Schema::create('user_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('template_id')->constrained()->cascadeOnDelete();
            $table->json('custom_config');
            $table->boolean('is_purchased')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_templates');
        Schema::dropIfExists('templates');
    }
};
