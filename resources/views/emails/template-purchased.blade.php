<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Digital Invitation is Ready</title>
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
            background: linear-gradient(135deg, #3d5644 0%, #243528 100%);
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
            color: #d3c0a3;
        }
        .content {
            padding: 32px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #3e3832;
            margin-bottom: 12px;
        }
        .message {
            font-size: 14px;
            line-height: 1.6;
            color: #706557;
            margin-bottom: 24px;
        }
        .card-box {
            background: #fdfbf7;
            border: 1px solid #ebd9c1;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .card-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #ebd9c1;
            font-size: 13px;
        }
        .card-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .card-label {
            color: #8c7e6d;
            font-weight: 500;
        }
        .card-value {
            color: #3e3832;
            font-weight: 700;
            text-align: right;
        }
        .btn-wrapper {
            text-align: center;
            margin: 28px 0;
        }
        .btn-primary {
            display: inline-block;
            background: #3d5644;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 15px;
            padding: 14px 32px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(61, 86, 68, 0.25);
        }
        .link-box {
            background: #f4efe6;
            border: 1px solid #d3c0a3;
            border-radius: 8px;
            padding: 12px 14px;
            word-break: break-all;
            font-size: 12px;
            color: #3d5644;
            margin-top: 10px;
            font-family: monospace;
        }
        .footer {
            background: #fdfbf7;
            border-top: 1px solid #ebd9c1;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #8c7e6d;
        }
        .footer a {
            color: #3d5644;
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
            <p>Digital Invitations & Celebrations</p>
        </div>

        <!-- Body -->
        <div class="content">
            <div class="greeting">
                Congratulations, {{ $user->name }}! 🎉
            </div>
            <div class="message">
                Your purchase was successful! Your personalized digital invitation template is now generated and ready to share with your family and guests.
            </div>

            <!-- Details Box -->
            <div class="card-box">
                <div class="card-row">
                    <span class="card-label">Template:</span>
                    <span class="card-value">{{ $userTemplate->template?->name ?? 'Digital Invitation' }}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Type:</span>
                    <span class="card-value">{{ ucfirst($userTemplate->template?->type ?? 'Invitation') }} Card</span>
                </div>
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
                <div class="card-row">
                    <span class="card-label">Date:</span>
                    <span class="card-value">{{ now()->format('d M, Y') }}</span>
                </div>
            </div>

            <!-- CTA Button -->
            <div class="btn-wrapper">
                <a href="{{ $invitationUrl }}" target="_blank" class="btn-primary">
                    View & Share Your Invitation →
                </a>
            </div>

            <div style="font-size: 13px; color: #706557; margin-bottom: 6px;">
                <strong>Your Shareable Invitation Link:</strong>
            </div>
            <div class="link-box">
                <a href="{{ $invitationUrl }}" target="_blank" style="color: #3d5644; text-decoration: none;">
                    {{ $invitationUrl }}
                </a>
            </div>

            <div style="margin-top: 24px; padding: 14px; background: #eef5f0; border-radius: 8px; border-left: 4px solid #3d5644; font-size: 13px; color: #2c4332;">
                💡 <strong>Tip:</strong> You can copy the link above and paste it directly into WhatsApp, SMS, Instagram, or Email to invite all your guests seamlessly!
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 6px;">
                You can manage all your invitations anytime from your <a href="{{ url('/customer/my-invitations') }}">Invitify Customer Dashboard</a>.
            </p>
            <p style="margin: 0; font-size: 11px; opacity: 0.8;">
                © {{ date('Y') }} Invitify. All rights reserved. • Sent automatically from dineshaiits@gmail.com
            </p>
        </div>
    </div>
</body>
</html>
