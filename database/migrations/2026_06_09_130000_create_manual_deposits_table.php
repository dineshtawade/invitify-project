<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manual_deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('utr')->unique();
            $table->string('screenshot_path');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->decimal('bonus_percentage', 5, 2)->default(0.00);
            $table->decimal('bonus_amount', 10, 2)->default(0.00);
            $table->text('admin_notes')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manual_deposits');
    }
};
