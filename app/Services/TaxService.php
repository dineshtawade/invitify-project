<?php

namespace App\Services;

use App\Models\SystemSetting;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

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
            'gst_enabled'               => (bool) SystemSetting::get('gst_enabled', true),
            'default_gst_rate'          => floatval(SystemSetting::get('default_gst_rate', '18')),
            'cgst_percent'              => floatval(SystemSetting::get('cgst_percent', '9')),
            'sgst_percent'              => floatval(SystemSetting::get('sgst_percent', '9')),
            'platform_fee_enabled'      => (bool) SystemSetting::get('platform_fee_enabled', false),
            'default_platform_fee'      => floatval(SystemSetting::get('default_platform_fee', '0')),
            'default_platform_fee_type' => SystemSetting::get('default_platform_fee_type', 'fixed'), // 'fixed' or 'percent'
            'default_hsn_sac'           => SystemSetting::get('default_hsn_sac', '998439'),
            'company_name'              => SystemSetting::get('company_name', 'Avinya Digitech Private Limited'),
            'company_gstin'             => SystemSetting::get('company_gstin', '27AABCA1234F1Z5'),
            'company_pan'               => SystemSetting::get('company_pan', 'AABCA1234F'),
            'company_cin'               => SystemSetting::get('company_cin', 'U72900MH2024PTC123456'),
            'company_address'           => SystemSetting::get('company_address', 'Plot No. 12, IT Park, Gayatri Nagar'),
            'company_city'              => SystemSetting::get('company_city', 'Nagpur'),
            'company_state'             => SystemSetting::get('company_state', 'Maharashtra'),
            'company_state_code'        => SystemSetting::get('company_state_code', '27'),
            'company_country'           => SystemSetting::get('company_country', 'India'),
            'company_email'             => SystemSetting::get('company_email', 'support@theinvitify.com'),
            'company_phone'             => SystemSetting::get('company_phone', '+91 98765 43210'),
            'company_website'           => SystemSetting::get('company_website', 'theinvitify.com'),
            'invoice_prefix'            => SystemSetting::get('invoice_prefix', 'INV-'),
            'validity_period'           => SystemSetting::get('validity_period', '1 Year'),
            'invoice_terms'             => SystemSetting::get('invoice_terms', "1. This is a digital product delivered electronically; no physical goods are shipped.\n2. Refunds/cancellations are governed by the policy at theinvitify.com/refund-policy.\n3. Hosted invitation links remain active for 1 Year from the date of purchase.\n4. Subject to Nagpur jurisdiction."),
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

        // Determine whether GST applies to this template:
        // Only apply GST if template has has_gst checkbox enabled
        $hasGst = false;
        if ($template) {
            $hasGst = (bool) ($template->has_gst ?? false);
        }

        // Determine GST Rate: template override or global default if has_gst is active
        $gstRate = 0.0;
        if ($hasGst && $settings['gst_enabled']) {
            if ($template && $template->gst_rate !== null && floatval($template->gst_rate) > 0) {
                $gstRate = floatval($template->gst_rate);
            } else {
                $gstRate = floatval($settings['default_gst_rate'] ?? 18.0);
            }
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
            'has_gst' => $hasGst,
            'cgst_percent' => $hasGst ? ($settings['cgst_percent'] ?? 9.0) : 0,
            'sgst_percent' => $hasGst ? ($settings['sgst_percent'] ?? 9.0) : 0,
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

    /**
     * Map Indian states to their official 2-digit GST state code.
     */
    public static function getStateCode(?string $stateName): string
    {
        if (empty($stateName)) {
            return '27'; // Default Maharashtra
        }

        $stateCodes = [
            'jammu and kashmir' => '01',
            'himachal pradesh' => '02',
            'punjab' => '03',
            'chandigarh' => '04',
            'uttarakhand' => '05',
            'haryana' => '06',
            'delhi' => '07',
            'rajasthan' => '08',
            'uttar pradesh' => '09',
            'bihar' => '10',
            'sikkim' => '11',
            'arunachal pradesh' => '12',
            'nagaland' => '13',
            'manipur' => '14',
            'mizoram' => '15',
            'tripura' => '16',
            'meghalaya' => '17',
            'assam' => '18',
            'west bengal' => '19',
            'jharkhand' => '20',
            'odisha' => '21',
            'chhattisgarh' => '22',
            'madhya pradesh' => '23',
            'gujarat' => '24',
            'dadra and nagar haveli and daman and diu' => '26',
            'maharashtra' => '27',
            'andhra pradesh' => '28',
            'karnataka' => '29',
            'goa' => '30',
            'lakshadweep' => '31',
            'kerala' => '32',
            'tamil nadu' => '33',
            'puducherry' => '34',
            'andaman and nicobar islands' => '35',
            'telangana' => '36',
            'ladakh' => '38',
        ];

        $clean = strtolower(trim($stateName));
        return $stateCodes[$clean] ?? '27';
    }

    /**
     * Ensure a transaction has an invoice number, tax breakdown, and buyer details.
     * Automatically backfills for existing or freshly created transactions.
     */
    public static function ensureInvoice(Transaction $transaction): Transaction
    {
        $dirty = false;

        if (empty($transaction->invoice_number)) {
            $transaction->invoice_number = self::generateInvoiceNumber();
            $transaction->invoice_date = $transaction->invoice_date ?: ($transaction->created_at ?: now());
            $dirty = true;
        }

        $transaction->loadMissing(['user', 'template', 'miniWebsiteTemplate', 'businessWebsiteTemplate']);
        $user = $transaction->user;

        if ($user && ($user->role === 'reseller' || !empty($user->reseller_details))) {
            $details = is_array($user->reseller_details) ? $user->reseller_details : (json_decode($user->reseller_details ?? '', true) ?: []);

            if (empty($transaction->customer_billing_name) && !empty($details['business_name'])) {
                $transaction->customer_billing_name = $details['business_name'];
                $dirty = true;
            }
            if (empty($transaction->customer_gstin) && !empty($details['gst_number'])) {
                $transaction->customer_gstin = $details['gst_number'];
                $dirty = true;
            }
            if (empty($transaction->customer_billing_address) && !empty($details['business_address'])) {
                $transaction->customer_billing_address = $details['business_address'];
                $dirty = true;
            }
            if (empty($transaction->customer_billing_email) && !empty($details['email'])) {
                $transaction->customer_billing_email = $details['email'];
                $dirty = true;
            }
            if (empty($transaction->customer_billing_phone) && !empty($details['mobile_number'])) {
                $transaction->customer_billing_phone = $details['mobile_number'];
                $dirty = true;
            }
        }

        // Calculate tax breakdown if tax_amount is not set but amount > 0
        if (is_null($transaction->tax_amount) && floatval($transaction->amount) > 0) {
            $settings = self::getSettings();
            $gstRate = floatval($settings['default_gst_rate'] ?? 18.0);
            $total = floatval($transaction->amount);
            $taxable = round($total / (1 + ($gstRate / 100)), 2);
            $tax = round($total - $taxable, 2);
            $cgst = round($tax / 2, 2);
            $sgst = round($tax - $cgst, 2);

            $transaction->base_amount = $taxable;
            $transaction->tax_rate = $gstRate;
            $transaction->tax_amount = $tax;
            $transaction->cgst_amount = $cgst;
            $transaction->sgst_amount = $sgst;
            $transaction->igst_amount = 0;
            $dirty = true;
        }

        if ($dirty) {
            $transaction->save();
        }

        return $transaction;
    }

    /**
     * Prepare complete structured data for Tax Invoice views and PDF.
     */
    public static function buildInvoiceData(Transaction $transaction): array
    {
        // Auto-assign invoice number and tax details if missing
        self::ensureInvoice($transaction);

        $transaction->loadMissing([
            'user:id,name,email,role,reseller_details,mobile',
            'template:id,name,type,category,hsn_sac_code',
            'miniWebsiteTemplate:id,name,type,hsn_sac_code',
            'businessWebsiteTemplate:id,name',
            'businessCard:id,title',
            'miniWebsite:id,title',
            'businessWebsite:id,title',
        ]);

        $settings = self::getSettings();

        // Item details
        $itemName = 'Digital Invitation Template';
        $itemType = 'Card';
        $hsnSac = $settings['default_hsn_sac'] ?? '998314';

        if ($transaction->template) {
            $itemName = $transaction->template->name;
            $itemType = ucfirst($transaction->template->type ?? 'Card');
            $hsnSac = $transaction->template->hsn_sac_code ?: $hsnSac;
        } elseif ($transaction->miniWebsiteTemplate) {
            $itemName = $transaction->miniWebsiteTemplate->name;
            $itemType = 'Invitation Website';
            $hsnSac = $transaction->miniWebsiteTemplate->hsn_sac_code ?: $hsnSac;
        } elseif ($transaction->businessCard) {
            $itemName = 'Digital Business Card: ' . $transaction->businessCard->title;
            $itemType = 'Business Card';
        } elseif ($transaction->businessWebsiteTemplate) {
            $itemName = $transaction->businessWebsiteTemplate->name;
            $itemType = 'Business Website';
        } elseif ($transaction->miniWebsite) {
            $itemName = 'Invitation Website: ' . $transaction->miniWebsite->title;
            $itemType = 'Invitation Website Hosting';
        } elseif ($transaction->businessWebsite) {
            $itemName = 'Business Website: ' . $transaction->businessWebsite->title;
            $itemType = 'Business Website Hosting';
        } elseif ($transaction->payment_method === 'razorpay' && empty($transaction->template_id)) {
            $itemName = 'Reseller Wallet Recharge Credits';
            $itemType = 'Wallet Recharge';
        }

        // Buyer details (check transaction fields first, then reseller details, then user profile)
        $user = $transaction->user;
        $resellerDetails = is_array($user?->reseller_details)
            ? $user->reseller_details
            : (json_decode($user?->reseller_details ?? '', true) ?: []);

        $buyerName = $transaction->customer_billing_name
            ?: (!empty($resellerDetails['business_name']) ? $resellerDetails['business_name'] : ($user?->name ?: 'Customer'));
        $buyerEmail = $transaction->customer_billing_email
            ?: (!empty($resellerDetails['email']) ? $resellerDetails['email'] : ($user?->email ?: ''));
        $buyerPhone = $transaction->customer_billing_phone
            ?: (!empty($resellerDetails['mobile_number']) ? $resellerDetails['mobile_number'] : ($user?->mobile ?: ''));
        $buyerAddress = $transaction->customer_billing_address
            ?: (!empty($resellerDetails['business_address']) ? $resellerDetails['business_address'] : 'Digital Delivery / Online Service');
        $buyerState = $transaction->customer_billing_state ?: $settings['company_state'];
        $buyerStateCode = self::getStateCode($buyerState);
        $buyerGstin = $transaction->customer_gstin
            ?: (!empty($resellerDetails['gst_number']) ? $resellerDetails['gst_number'] : 'Unregistered');

        // Amounts
        $grandTotal = floatval($transaction->amount ?? 0);
        $taxAmount = floatval($transaction->tax_amount ?? 0);
        $baseAmount = floatval($transaction->base_amount ?? ($grandTotal - $taxAmount));
        $taxRate = floatval($transaction->tax_rate ?? 18);
        $cgstAmount = floatval($transaction->cgst_amount ?? 0);
        $sgstAmount = floatval($transaction->sgst_amount ?? 0);
        $igstAmount = floatval($transaction->igst_amount ?? 0);
        $discountAmount = floatval($transaction->discount_amount ?? 0);

        // Calculate tax components if not pre-populated
        if ($taxAmount > 0 && $cgstAmount == 0 && $sgstAmount == 0 && $igstAmount == 0) {
            if ($transaction->is_inter_state) {
                $igstAmount = $taxAmount;
            } else {
                $cgstAmount = round($taxAmount / 2, 2);
                $sgstAmount = round($taxAmount - $cgstAmount, 2);
            }
        }

        $cgstRate = ($cgstAmount > 0 || !$transaction->is_inter_state) ? round($taxRate / 2, 1) : 0;
        $sgstRate = ($sgstAmount > 0 || !$transaction->is_inter_state) ? round($taxRate / 2, 1) : 0;
        $igstRate = ($igstAmount > 0 || $transaction->is_inter_state) ? $taxRate : 0;

        $calcTotal = round($baseAmount + $cgstAmount + $sgstAmount + $igstAmount - $discountAmount, 2);
        $roundOff = round($grandTotal - $calcTotal, 2);

        $amountInWords = self::amountToWords($grandTotal);

        // Format payment method nicely
        $paymentMethodLabel = ucfirst($transaction->payment_method ?? 'Razorpay');
        if (strtolower($transaction->payment_method ?? '') === 'wallet') {
            $paymentMethodLabel = 'Reseller Wallet';
        }

        return [
            'transaction' => $transaction,
            'settings' => $settings,
            'invoice_no' => $transaction->invoice_number,
            'invoice_date' => Carbon::parse($transaction->invoice_date ?? $transaction->created_at)->format('d M, Y'),
            'order_id' => $transaction->order_id ?: 'ORD-' . $transaction->id,
            'payment_id' => $transaction->payment_id ?: 'PAY-' . $transaction->id,
            'payment_method' => $paymentMethodLabel,
            'payment_status' => ucfirst($transaction->status ?? 'paid'),
            'buyer_name' => $buyerName,
            'buyer_email' => $buyerEmail,
            'buyer_phone' => $buyerPhone,
            'buyer_address' => $buyerAddress,
            'buyer_state' => $buyerState,
            'buyer_state_code' => $buyerStateCode,
            'buyer_gstin' => $buyerGstin,
            'place_of_supply' => $buyerState,
            'item_name' => $itemName,
            'item_type' => $itemType,
            'sac_code' => $hsnSac,
            'taxable_value' => $baseAmount,
            'gst_rate' => $taxRate,
            'total_gst' => $taxAmount,
            'line_total' => round($baseAmount + $taxAmount, 2),
            'cgst_rate' => $cgstRate,
            'cgst_amount' => $cgstAmount,
            'sgst_rate' => $sgstRate,
            'sgst_amount' => $sgstAmount,
            'igst_rate' => $igstRate,
            'igst_amount' => $igstAmount,
            'discount_amount' => $discountAmount,
            'round_off' => $roundOff,
            'grand_total' => $grandTotal,
            'amount_in_words' => $amountInWords,
            'validity_period' => $settings['validity_period'] ?? '1 Year',
        ];
    }

    /**
     * Generate raw binary PDF of the tax invoice.
     */
    public static function generateInvoicePdf(Transaction $transaction): string
    {
        $data = self::buildInvoiceData($transaction);
        $pdf = Pdf::loadView('invoices.tax-invoice-pdf', $data);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true]);
        return $pdf->output();
    }

    /**
     * Get DomPDF instance for downloading or streaming in controller.
     */
    public static function getPdfInstance(Transaction $transaction)
    {
        $data = self::buildInvoiceData($transaction);
        $pdf = Pdf::loadView('invoices.tax-invoice-pdf', $data);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true]);
        return $pdf;
    }
}
