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
        Schema::table('redemption_requests', function (Blueprint $table) {
            $table->string('upi_id')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->string('qr_code_path')->nullable();
            $table->string('payment_proof_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('redemption_requests', function (Blueprint $table) {
            $table->dropColumn([
                'upi_id',
                'bank_name',
                'account_holder_name',
                'account_number',
                'ifsc_code',
                'qr_code_path',
                'payment_proof_path',
            ]);
        });
    }
};
