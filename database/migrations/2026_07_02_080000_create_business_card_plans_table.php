<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_card_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');                       // e.g. "6-Month Plan", "1-Year Plan"
            $table->unsignedTinyInteger('duration_months'); // 6, 12, etc.
            $table->decimal('price', 10, 2);              // e.g. 499.00
            $table->text('description')->nullable();       // bullet points / features
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed default plans
        DB::table('business_card_plans')->insert([
            [
                'name'            => '6-Month Plan',
                'duration_months' => 6,
                'price'           => 499.00,
                'description'     => 'Full access for 6 months. Includes all features.',
                'is_active'       => true,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'name'            => '1-Year Plan',
                'duration_months' => 12,
                'price'           => 899.00,
                'description'     => 'Best value! Full access for 12 months. Includes all features.',
                'is_active'       => true,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('business_card_plans');
    }
};
