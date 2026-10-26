<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * developed by dinesh tawade
     */
    public function up(): void
    {
        // Add tax & fee columns to templates table
        Schema::table('templates', function (Blueprint $table) {
            if (!Schema::hasColumn('templates', 'gst_rate')) {
                $table->decimal('gst_rate', 5, 2)->nullable()->after('price');
            }
            if (!Schema::hasColumn('templates', 'platform_fee')) {
                $table->decimal('platform_fee', 8, 2)->nullable()->after('gst_rate');
            }
            if (!Schema::hasColumn('templates', 'platform_fee_type')) {
                $table->string('platform_fee_type', 20)->default('fixed')->after('platform_fee');
            }
            if (!Schema::hasColumn('templates', 'hsn_sac_code')) {
                $table->string('hsn_sac_code', 20)->nullable()->default('998314')->after('platform_fee_type');
            }
            if (!Schema::hasColumn('templates', 'tax_inclusive')) {
                $table->boolean('tax_inclusive')->default(false)->after('hsn_sac_code');
            }
        });

        // Add tax & fee columns to mini_website_templates table
        if (Schema::hasTable('mini_website_templates')) {
            Schema::table('mini_website_templates', function (Blueprint $table) {
                if (!Schema::hasColumn('mini_website_templates', 'gst_rate')) {
                    $table->decimal('gst_rate', 5, 2)->nullable()->after('price');
                }
                if (!Schema::hasColumn('mini_website_templates', 'platform_fee')) {
                    $table->decimal('platform_fee', 8, 2)->nullable()->after('gst_rate');
                }
                if (!Schema::hasColumn('mini_website_templates', 'platform_fee_type')) {
                    $table->string('platform_fee_type', 20)->default('fixed')->after('platform_fee');
                }
                if (!Schema::hasColumn('mini_website_templates', 'hsn_sac_code')) {
                    $table->string('hsn_sac_code', 20)->nullable()->default('998314')->after('platform_fee_type');
                }
                if (!Schema::hasColumn('mini_website_templates', 'tax_inclusive')) {
                    $table->boolean('tax_inclusive')->default(false)->after('hsn_sac_code');
                }
            });
        }

        // Add tax, fee and invoice columns to transactions table
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'base_amount')) {
                $table->decimal('base_amount', 10, 2)->nullable()->after('amount');
            }
            if (!Schema::hasColumn('transactions', 'platform_fee')) {
                $table->decimal('platform_fee', 10, 2)->default(0)->after('base_amount');
            }
            if (!Schema::hasColumn('transactions', 'tax_rate')) {
                $table->decimal('tax_rate', 5, 2)->default(0)->after('platform_fee');
            }
            if (!Schema::hasColumn('transactions', 'tax_amount')) {
                $table->decimal('tax_amount', 10, 2)->default(0)->after('tax_rate');
            }
            if (!Schema::hasColumn('transactions', 'cgst_amount')) {
                $table->decimal('cgst_amount', 10, 2)->default(0)->after('tax_amount');
            }
            if (!Schema::hasColumn('transactions', 'sgst_amount')) {
                $table->decimal('sgst_amount', 10, 2)->default(0)->after('cgst_amount');
            }
            if (!Schema::hasColumn('transactions', 'igst_amount')) {
                $table->decimal('igst_amount', 10, 2)->default(0)->after('sgst_amount');
            }
            if (!Schema::hasColumn('transactions', 'is_inter_state')) {
                $table->boolean('is_inter_state')->default(false)->after('igst_amount');
            }
            if (!Schema::hasColumn('transactions', 'invoice_number')) {
                $table->string('invoice_number', 60)->nullable()->unique()->after('order_id');
            }
            if (!Schema::hasColumn('transactions', 'invoice_date')) {
                $table->timestamp('invoice_date')->nullable()->after('invoice_number');
            }
            if (!Schema::hasColumn('transactions', 'customer_billing_name')) {
                $table->string('customer_billing_name', 255)->nullable()->after('invoice_date');
            }
            if (!Schema::hasColumn('transactions', 'customer_billing_email')) {
                $table->string('customer_billing_email', 255)->nullable()->after('customer_billing_name');
            }
            if (!Schema::hasColumn('transactions', 'customer_billing_phone')) {
                $table->string('customer_billing_phone', 50)->nullable()->after('customer_billing_email');
            }
            if (!Schema::hasColumn('transactions', 'customer_billing_address')) {
                $table->text('customer_billing_address')->nullable()->after('customer_billing_phone');
            }
            if (!Schema::hasColumn('transactions', 'customer_billing_state')) {
                $table->string('customer_billing_state', 100)->nullable()->after('customer_billing_address');
            }
            if (!Schema::hasColumn('transactions', 'customer_gstin')) {
                $table->string('customer_gstin', 50)->nullable()->after('customer_billing_state');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn(['gst_rate', 'platform_fee', 'platform_fee_type', 'hsn_sac_code', 'tax_inclusive']);
        });

        if (Schema::hasTable('mini_website_templates')) {
            Schema::table('mini_website_templates', function (Blueprint $table) {
                $table->dropColumn(['gst_rate', 'platform_fee', 'platform_fee_type', 'hsn_sac_code', 'tax_inclusive']);
            });
        }

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'base_amount',
                'platform_fee',
                'tax_rate',
                'tax_amount',
                'cgst_amount',
                'sgst_amount',
                'igst_amount',
                'is_inter_state',
                'invoice_number',
                'invoice_date',
                'customer_billing_name',
                'customer_billing_email',
                'customer_billing_phone',
                'customer_billing_address',
                'customer_billing_state',
                'customer_gstin',
            ]);
        });
    }
};
