<?php

namespace App\Services;

use App\Models\SystemSetting;
use App\Models\Transaction;

/**
 * Developed by Dinesh Tawade
 * Tax, GST, Platform Fee & Invoice Generation Service
 */
class TaxService
{
    /**
     * Retrieve global tax and invoice settings.
     */
    public static function getSettings(): array
    {
        return [
            'gst_enabled'              => (bool) SystemSetting::get('gst_enabled', true),
            'default_gst_rate'          => floatval(SystemSetting::get('default_gst_rate', '18')),
            'cgst_percent'              => floatval(SystemSetting::get('cgst_percent', '9')),
            'sgst_percent'              => floatval(SystemSetting::get('sgst_percent', '9')),
            'platform_fee_enabled' => (bool) SystemSetting::get('platform_fee_enabled', false),
            'default_platform_fee' => floatval(SystemSetting::get('default_platform_fee', '0')),
            'default_platform_fee_type' => SystemSetting::get('default_platform_fee_type', 'fixed'), // 'fixed' or 'percent'
            'default_hsn_sac' => SystemSetting::get('default_hsn_sac', '998314'),
            'company_name' => SystemSetting::get('company_name', 'Invitify Technologies'),
            'company_gstin' => SystemSetting::get('company_gstin', '27AAAAA0000A1Z5'),
            'company_pan' => SystemSetting::get('company_pan', 'AAAAA0000A'),
            'company_address' => SystemSetting::get('company_address', '101, Tech Park, Andheri East, Mumbai, Maharashtra 400069'),
            'company_state' => SystemSetting::get('company_state', 'Maharashtra'),
            'company_state_code' => SystemSetting::get('company_state_code', '27'),
            'company_email' => SystemSetting::get('company_email', 'billing@invitify.com'),
            'company_phone' => SystemSetting::get('company_phone', '+91 98765 43210'),
            'invoice_prefix' => SystemSetting::get('invoice_prefix', 'INV-'),
            'invoice_terms' => SystemSetting::get('invoice_terms', "1. This is a computer-generated tax invoice and does not require a physical signature.\n2. Digital services once delivered are non-refundable.\n3. All disputes are subject to Mumbai jurisdiction."),
        ];
    }

    /**
     * Calculate tax, platform fee, and total payable for a template or item.
     *
     * @param mixed $template Model with price, gst_rate, platform_fee, etc.
     * @param float $discount Discount in INR
     * @param string|null $customerState State of recipient for CGST/SGST vs IGST
     * @return array
     */
    public static function calculate($template, float $discount = 0.0, ?string $customerState = null): array
    {
        $settings = self::getSettings();

        $basePrice = floatval($template->price ?? 0);
        $discountAmount = min($basePrice, max(0.0, floatval($discount)));
        $discountedBase = max(0.0, $basePrice - $discountAmount);

        // Determine GST Rate: template override or global default
        $gstRate = 0.0;
        if ($template && $template->gst_rate !== null) {
            $gstRate = floatval($template->gst_rate);
        } elseif ($settings['gst_enabled']) {
            $gstRate = $settings['default_gst_rate'];
        }

        // Determine Platform Fee
        $platformFeeAmount = 0.0;
        $feeType = 'fixed';
        $feeValue = 0.0;

        if ($template && $template->platform_fee !== null) {
            $feeType = $template->platform_fee_type ?: 'fixed';
            $feeValue = floatval($template->platform_fee);
        } elseif ($settings['platform_fee_enabled']) {
            $feeType = $settings['default_platform_fee_type'];
            $feeValue = $settings['default_platform_fee'];
        }

        if ($feeValue > 0) {
            if ($feeType === 'percent') {
                $platformFeeAmount = round($discountedBase * ($feeValue / 100), 2);
            } else {
                $platformFeeAmount = round($feeValue, 2);
            }
        }

        $taxInclusive = (bool) ($template->tax_inclusive ?? false);

        if ($taxInclusive && $gstRate > 0) {
            // Price already includes tax
            $grossTotal = $discountedBase + $platformFeeAmount;
            $taxableAmount = round($grossTotal / (1 + ($gstRate / 100)), 2);
            $taxAmount = round($grossTotal - $taxableAmount, 2);
            $totalAmount = $grossTotal;
        } else {
            // Price is exclusive of tax
            $taxableAmount = round($discountedBase + $platformFeeAmount, 2);
            $taxAmount = round($taxableAmount * ($gstRate / 100), 2);
            $totalAmount = round($taxableAmount + $taxAmount, 2);
        }

        // Intra-state vs Inter-state (CGST + SGST vs IGST)
        $companyState = trim($settings['company_state']);
        $isInterState = false;

        if (!empty($customerState)) {
            $custState = trim($customerState);
            $isInterState = (strcasecmp($custState, $companyState) !== 0);
        }

        $cgstAmount = 0.0;
        $sgstAmount = 0.0;
        $igstAmount = 0.0;

        if ($taxAmount > 0) {
            if ($isInterState) {
                $igstAmount = $taxAmount;
            } else {
                $cgstAmount = round($taxAmount / 2, 2);
                $sgstAmount = round($taxAmount - $cgstAmount, 2);
            }
        }

        $hsnSac = $template->hsn_sac_code ?? $settings['default_hsn_sac'];

        return [
            'base_price' => $basePrice,
            'discount_amount' => $discountAmount,
            'discounted_base' => $discountedBase,
            'platform_fee' => $platformFeeAmount,
            'platform_fee_type' => $feeType,
            'taxable_amount' => $taxableAmount,
            'tax_rate' => $gstRate,
            'tax_amount' => $taxAmount,
            'cgst_amount' => $cgstAmount,
            'sgst_amount' => $sgstAmount,
            'igst_amount' => $igstAmount,
            'is_inter_state' => $isInterState,
            'total_amount' => $totalAmount,
            'hsn_sac_code' => $hsnSac,
            'tax_inclusive' => $taxInclusive,
            'gst_enabled' => $settings['gst_enabled'],
        ];
    }

    /**
     * Generate next sequential invoice number.
     * E.g. INV-2026-0001
     */
    public static function generateInvoiceNumber(): string
    {
        $settings = self::getSettings();
        $prefix = $settings['invoice_prefix'] ?: 'INV-';
        $year = date('Y');
        $fullPrefix = "{$prefix}{$year}-";

        $lastTransaction = Transaction::whereNotNull('invoice_number')
            ->where('invoice_number', 'LIKE', "{$fullPrefix}%")
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;
        if ($lastTransaction && preg_match('/' . preg_quote($fullPrefix, '/') . '(\d+)/', $lastTransaction->invoice_number, $matches)) {
            $nextNumber = intval($matches[1]) + 1;
        }

        return $fullPrefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Convert an amount into Indian English words.
     */
    public static function amountToWords(float $amount): string
    {
        $amount = round($amount, 2);
        $rupees = (int) floor($amount);
        $paise = (int) round(($amount - $rupees) * 100);

        $words = self::convertNumberToWords($rupees) . ' Rupees';

        if ($paise > 0) {
            $words .= ' and ' . self::convertNumberToWords($paise) . ' Paise';
        }

        return $words . ' Only';
    }

    private static function convertNumberToWords(int $num): string
    {
        if ($num == 0) {
            return 'Zero';
        }

        $ones = [
            0 => '', 1 => 'One', 2 => 'Two', 3 => 'Three', 4 => 'Four',
            5 => 'Five', 6 => 'Six', 7 => 'Seven', 8 => 'Eight', 9 => 'Nine',
            10 => 'Ten', 11 => 'Eleven', 12 => 'Twelve', 13 => 'Thirteen', 14 => 'Fourteen',
            15 => 'Fifteen', 16 => 'Sixteen', 17 => 'Seventeen', 18 => 'Eighteen', 19 => 'Nineteen'
        ];

        $tens = [
            2 => 'Twenty', 3 => 'Thirty', 4 => 'Forty', 5 => 'Fifty',
            6 => 'Sixty', 7 => 'Seventy', 8 => 'Eighty', 9 => 'Ninety'
        ];

        $output = '';

        if ($num >= 10000000) {
            $crore = intdiv($num, 10000000);
            $output .= self::convertNumberToWords($crore) . ' Crore ';
            $num %= 10000000;
        }

        if ($num >= 100000) {
            $lakh = intdiv($num, 100000);
            $output .= self::convertNumberToWords($lakh) . ' Lakh ';
            $num %= 100000;
        }

        if ($num >= 1000) {
            $thousand = intdiv($num, 1000);
            $output .= self::convertNumberToWords($thousand) . ' Thousand ';
            $num %= 1000;
        }

        if ($num >= 100) {
            $hundred = intdiv($num, 100);
            $output .= self::convertNumberToWords($hundred) . ' Hundred ';
            $num %= 100;
        }

        if ($num > 0) {
            if ($num < 20) {
                $output .= $ones[$num];
            } else {
                $t = intdiv($num, 10);
                $o = $num % 10;
                $output .= $tens[$t] . ($o > 0 ? ' ' . $ones[$o] : '');
            }
        }

        return trim($output);
    }
}
