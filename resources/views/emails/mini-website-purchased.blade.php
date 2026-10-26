<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Invitation Website is Live</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f6f3ed;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #3e3832;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
            border: 1px solid #ebd9c1;
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            padding: 36px 30px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header p {
            margin: 8px 0 0;
            font-size: 14px;
            opacity: 0.9;
            color: #93c5fd;
        }
        .content {
            padding: 32px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1e3a8a;
            margin-bottom: 12px;
        }
        .message {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
        }
        .card-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .card-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #cbd5e1;
            font-size: 13px;
        }
        .card-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .card-label {
            color: #64748b;
            font-weight: 500;
        }
        .card-value {
            color: #0f172a;
            font-weight: 700;
            text-align: right;
        }
        .btn-wrapper {
            text-align: center;
            margin: 28px 0;
        }
        .btn-primary {
            display: inline-block;
            background: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 15px;
            padding: 14px 32px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .link-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 12px 14px;
            word-break: break-all;
            font-size: 12px;
            color: #1e40af;
            margin-top: 10px;
            font-family: monospace;
        }
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Invitify</h1>
            <p>Smart Invitation & Event Websites</p>
        </div>

        <!-- Body -->
        <div class="content">
            <div class="greeting">
                Congratulations, {{ $user->name }}! 🌐
            </div>
            <div class="message">
                Your Invitation Website <strong>"{{ $miniWebsite->title }}"</strong> is now active and live on the internet! Guests can now view event details, maps, photo galleries, and submit RSVPs online.
            </div>

            <!-- Details Box -->
            <div class="card-box">
                <div class="card-row">
                    <span class="card-label">Website Title:</span>
                    <span class="card-value">{{ $miniWebsite->title }}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Status:</span>
                    <span class="card-value" style="color: #16a34a;">● Published & Live</span>
                </div>
                @if($days)
                <div class="card-row">
                    <span class="card-label">Hosting Duration:</span>
                    <span class="card-value">{{ $days }} Day{{ $days > 1 ? 's' : '' }}</span>
                </div>
                @endif
                @if($miniWebsite->expires_at)
                <div class="card-row">
                    <span class="card-label">Valid Until:</span>
                    <span class="card-value">{{ $miniWebsite->expires_at->format('d M, Y') }}</span>
                </div>
                @endif
                @if($orderId)
                <div class="card-row">
                    <span class="card-label">Order Reference:</span>
                    <span class="card-value">{{ $orderId }}</span>
                </div>
                @endif
                @if($amount !== null)
                <div class="card-row">
                    <span class="card-label">Amount Paid:</span>
                    <span class="card-value">₹{{ number_format($amount, 2) }}</span>
                </div>
                @endif
                @if(!empty($invoiceNumber))
                <div class="card-row">
                    <span class="card-label">Tax Invoice:</span>
                    <span class="card-value" style="color: #4F46E5; font-family: monospace;">#{{ $invoiceNumber }}</span>
                </div>
                @endif
            </div>

            @if(!empty($invoiceNumber) && !empty($invoiceDownloadUrl))
            <!-- Tax Invoice Box -->
            <div style="margin: 20px 0 24px; padding: 16px 20px; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px;">
                <div style="font-weight: 700; font-size: 14px; color: #4F46E5; margin-bottom: 3px;">
                    📄 Tax Invoice: {{ $invoiceNumber }}
                </div>
                <div style="font-size: 12px; color: #4b5563; margin-bottom: 12px; line-height: 1.4;">
                    Your official GST Tax Invoice has been generated and is attached to this email as a PDF. You can also download or view it anytime online.
                </div>
                <a href="{{ $invoiceDownloadUrl }}" target="_blank" style="display: inline-block; background: #4F46E5; color: #ffffff !important; text-decoration: none; font-size: 12px; font-weight: 700; padding: 9px 18px; border-radius: 8px;">
                    Download Tax Invoice PDF ↓
                </a>
            </div>
            @endif

            <!-- CTA Button -->
            <div class="btn-wrapper">
                <a href="{{ $websiteUrl }}" target="_blank" class="btn-primary">
                    Visit Your Live Website →
                </a>
            </div>

            <div style="font-size: 13px; color: #475569; margin-bottom: 6px;">
                <strong>Public Website URL:</strong>
            </div>
            <div class="link-box">
                <a href="{{ $websiteUrl }}" target="_blank" style="color: #1e40af; text-decoration: none;">
                    {{ $websiteUrl }}
                </a>
            </div>

            <div style="margin-top: 24px; padding: 14px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #16a34a; font-size: 13px; color: #166534;">
                ✨ <strong>RSVP Tracking:</strong> When guests submit RSVP forms on your website, you can track them in real-time from your <a href="{{ url('/customer/mini-websites') }}" style="color: #166534; font-weight: bold; text-decoration: underline;">Invitify Dashboard</a>.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 6px;">
                Edit your website content or download your invite QR pack anytime from your <a href="{{ url('/customer/mini-websites') }}">Invitify Dashboard</a>.
            </p>
            <p style="margin: 0; font-size: 11px; opacity: 0.8;">
                © {{ date('Y') }} Invitify. All rights reserved. • Sent automatically from {{ config('mail.from.address') }}
            </p>
        </div>
    </div>
</body>
</html>
