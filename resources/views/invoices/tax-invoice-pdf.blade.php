<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Tax Invoice - {{ $invoice_no }}</title>
    <style>
        @page {
            margin: 25px 30px;
            size: a4 portrait;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #1f2937;
            line-height: 1.45;
            margin: 0;
            padding: 0;
            background: #ffffff;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
        }
        .company-title {
            font-size: 22px;
            font-weight: bold;
            color: #4F46E5;
            margin-bottom: 4px;
        }
        .company-meta {
            font-size: 11px;
            color: #374151;
            line-height: 1.4;
        }
        .invoice-title {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #111827;
            text-align: right;
            margin-bottom: 6px;
        }
        .invoice-meta {
            font-size: 11px;
            color: #374151;
            text-align: right;
            line-height: 1.45;
        }
        .purple-divider {
            height: 3px;
            background-color: #4F46E5;
            margin: 14px 0 16px 0;
            border: none;
        }
        .cards-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 14px 0;
            margin-left: -14px;
            margin-right: -14px;
            margin-bottom: 16px;
        }
        .info-card {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px 14px;
            vertical-align: top;
            background-color: #ffffff;
        }
        .card-header {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-bottom: 6px;
        }
        .buyer-name {
            font-size: 13px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 2px;
        }
        .card-row {
            font-size: 11px;
            color: #374151;
            line-height: 1.45;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 12px;
        }
        .items-table th {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 8px 6px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            color: #374151;
        }
        .items-table td {
            border: 1px solid #e5e7eb;
            padding: 10px 8px;
            font-size: 11px;
            vertical-align: middle;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }

        .bottom-section-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        .calc-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e5e7eb;
        }
        .calc-table td {
            padding: 6px 10px;
            font-size: 11px;
            border-bottom: 1px solid #f3f4f6;
        }
        .calc-table td.label-col {
            color: #4b5563;
        }
        .calc-table td.val-col {
            text-align: right;
            font-weight: 500;
            color: #111827;
        }
        .total-row td {
            background-color: #4F46E5 !important;
            color: #ffffff !important;
            font-size: 13px !important;
            font-weight: bold !important;
            padding: 9px 10px !important;
            border: none !important;
        }
        .total-row td.val-col {
            color: #ffffff !important;
        }

        .words-bar {
            border-left: 4px solid #4F46E5;
            padding: 6px 10px;
            margin: 12px 0 16px 0;
            font-size: 12px;
            font-weight: bold;
            color: #1f2937;
            background-color: #faf5ff;
        }
        .terms-title {
            font-size: 11px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 4px;
        }
        .terms-list {
            margin: 0;
            padding-left: 14px;
            font-size: 10px;
            color: #4b5563;
            line-height: 1.5;
        }
        .signatory-box {
            text-align: right;
            margin-top: 30px;
            padding-right: 10px;
        }
        .signatory-company {
            font-size: 11px;
            color: #374151;
        }
        .signatory-line {
            margin-top: 45px;
            font-size: 11px;
            font-weight: 600;
            color: #111827;
        }
        .footer-note {
            margin-top: 35px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            line-height: 1.5;
            border-top: 1px solid #f3f4f6;
            padding-top: 12px;
        }
    </style>
</head>
<body>

    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 58%; vertical-align: top;">
                <div class="company-title">{{ $settings['company_name'] }}</div>
                <div class="company-meta">
                    {{ $settings['company_address'] }}<br/>
                    {{ $settings['company_city'] }}, {{ $settings['company_state'] }}, {{ $settings['company_country'] ?? 'India' }}<br/>
                    <strong>GSTIN:</strong> {{ $settings['company_gstin'] }} &nbsp;|&nbsp; <strong>PAN:</strong> {{ $settings['company_pan'] }}<br/>
                    <strong>CIN:</strong> {{ $settings['company_cin'] }}<br/>
                    {{ $settings['company_email'] }} &nbsp;|&nbsp; {{ $settings['company_website'] }}
                </div>
            </td>
            <td style="width: 42%; vertical-align: top; text-align: right;">
                <div class="invoice-title">TAX INVOICE</div>
                <div class="invoice-meta">
                    <strong>Invoice No:</strong> {{ $invoice_no }}<br/>
                    <strong>Date:</strong> {{ $invoice_date }}<br/>
                    <strong>Order ID:</strong> {{ $order_id }}<br/>
                    <strong>Payment ID:</strong> {{ $payment_id }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Purple Divider -->
    <div class="purple-divider"></div>

    <!-- Billed To & Supply Details Cards -->
    <table class="cards-table">
        <tr>
            <td class="info-card" style="width: 50%;">
                <div class="card-header">BILLED TO</div>
                <div class="buyer-name">{{ $buyer_name }}</div>
                <div class="card-row">
                    {{ $buyer_email }}@if($buyer_phone) &nbsp;{{ $buyer_phone }}@endif
                </div>
                <div class="card-row">{{ $buyer_address }}</div>
                <div class="card-row">
                    <strong>State:</strong> {{ $buyer_state }} ({{ $buyer_state_code }})
                </div>
                <div class="card-row">
                    <strong>GSTIN:</strong> {{ $buyer_gstin }}
                </div>
            </td>
            <td class="info-card" style="width: 50%;">
                <div class="card-header">SUPPLY DETAILS</div>
                <div class="card-row">
                    <strong>Place of Supply:</strong> {{ $place_of_supply }}
                </div>
                <div class="card-row">
                    <strong>Supply Type:</strong> Digital service (online delivery)
                </div>
                <div class="card-row">
                    <strong>Reverse Charge:</strong> No
                </div>
                <div class="card-row">
                    <strong>Payment Mode:</strong> {{ $payment_method }} (via Razorpay)
                </div>
                <div class="card-row">
                    <strong>Payment Status:</strong> {{ $payment_status }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Line Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 4%;">#</th>
                <th style="width: 38%;" class="text-left">DESCRIPTION</th>
                <th style="width: 10%;">SAC</th>
                <th style="width: 6%;">QTY</th>
                <th style="width: 14%;" class="text-right">TAXABLE VALUE (₹)</th>
                <th style="width: 8%;">GST %</th>
                <th style="width: 10%;" class="text-right">GST AMOUNT (₹)</th>
                <th style="width: 10%;" class="text-right">TOTAL (₹)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center">1</td>
                <td class="text-left">
                    <strong style="color: #111827;">{{ $item_name }}</strong><br/>
                    <span style="font-size: 10px; color: #6b7280;">Digital invitation template ({{ $item_type }}) – access/download via TheInvitify</span>
                </td>
                <td class="text-center font-mono">{{ $sac_code }}</td>
                <td class="text-center">1</td>
                <td class="text-right">{{ number_format($taxable_value, 2) }}</td>
                <td class="text-center">{{ $gst_rate }}%</td>
                <td class="text-right">{{ number_format($total_gst, 2) }}</td>
                <td class="text-right"><strong>{{ number_format($line_total, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    <!-- Amount Breakdown (Right) & Terms / Words (Left) -->
    <table class="bottom-section-table">
        <tr>
            <td style="width: 52%; vertical-align: top; padding-right: 18px;">
                <!-- Amount in Words -->
                <div class="words-bar">
                    Amount in words: {{ $amount_in_words }}
                </div>

                <!-- Terms & Notes -->
                <div class="terms-title">Terms &amp; Notes</div>
                <ul class="terms-list">
                    <li>This is a digital product delivered electronically; no physical goods are shipped.</li>
                    <li>Refunds/cancellations are governed by the policy at theinvitify.com/refund-policy.</li>
                    <li>Hosted invitation links remain active for {{ $validity_period }} from the date of purchase.</li>
                    <li>Subject to Nagpur jurisdiction.</li>
                </ul>
            </td>
            <td style="width: 48%; vertical-align: top;">
                <!-- Calculation Table -->
                <table class="calc-table">
                    <tr>
                        <td class="label-col">Taxable Value</td>
                        <td class="val-col">₹ {{ number_format($taxable_value, 2) }}</td>
                    </tr>
                    @if($cgst_amount > 0 || $igst_amount == 0)
                    <tr>
                        <td class="label-col">CGST @ {{ $cgst_rate }}%</td>
                        <td class="val-col">₹ {{ number_format($cgst_amount, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">SGST @ {{ $sgst_rate }}%</td>
                        <td class="val-col">₹ {{ number_format($sgst_amount, 2) }}</td>
                    </tr>
                    @endif
                    @if($igst_amount > 0)
                    <tr>
                        <td class="label-col">IGST @ {{ $igst_rate }}%</td>
                        <td class="val-col">₹ {{ number_format($igst_amount, 2) }}</td>
                    </tr>
                    @endif
                    @if($discount_amount > 0)
                    <tr>
                        <td class="label-col">Discount (if any)</td>
                        <td class="val-col" style="color: #059669;">- ₹ {{ number_format($discount_amount, 2) }}</td>
                    </tr>
                    @else
                    <tr>
                        <td class="label-col">Discount (if any)</td>
                        <td class="val-col">- ₹ 0.00</td>
                    </tr>
                    @endif
                    <tr>
                        <td class="label-col">Round off</td>
                        <td class="val-col">₹ {{ number_format($round_off, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Amount Paid</td>
                        <td class="val-col">₹ {{ number_format($grand_total, 2) }}</td>
                    </tr>
                </table>

                <!-- Signatory -->
                <div class="signatory-box">
                    <div class="signatory-company">For <strong>{{ $settings['company_name'] }}</strong></div>
                    <div class="signatory-line">Authorised Signatory</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Footer Note -->
    <div class="footer-note">
        This is a computer-generated invoice and does not require a physical signature.<br/>
        Need help? Write to {{ $settings['company_email'] }} with your Order ID.
    </div>

</body>
</html>
