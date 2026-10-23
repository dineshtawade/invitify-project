<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Invitify Verification Code</title>
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
            max-width: 560px;
            margin: 35px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
            border: 1px solid #ebd9c1;
        }
        .header {
            background: linear-gradient(135deg, #3d5644 0%, #243528 100%);
            padding: 32px 30px;
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
            margin: 6px 0 0;
            font-size: 13px;
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
        .otp-box-wrapper {
            text-align: center;
            margin: 28px 0;
        }
        .otp-box {
            display: inline-block;
            background: #fdfbf7;
            border: 2px dashed #3d5644;
            border-radius: 14px;
            padding: 16px 36px;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #3d5644;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            box-shadow: 0 2px 10px rgba(61, 86, 68, 0.08);
        }
        .expiry-note {
            text-align: center;
            font-size: 13px;
            color: #8c7e6d;
            margin-bottom: 24px;
        }
        .security-box {
            margin-top: 24px;
            padding: 14px 16px;
            background: #f8fafc;
            border-radius: 10px;
            border-left: 4px solid #94a3b8;
            font-size: 12px;
            line-height: 1.5;
            color: #64748b;
        }
        .footer {
            background: #fdfbf7;
            border-top: 1px solid #ebd9c1;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #8c7e6d;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Invitify</h1>
            <p>Email Verification</p>
        </div>

        <!-- Body -->
        <div class="content">
            <div class="greeting">
                Hello {{ $name }},
            </div>
            <div class="message">
                Thank you for joining <strong>Invitify</strong>! To verify your email address and activate your account, please enter the 6-digit verification code below:
            </div>

            <!-- OTP Box -->
            <div class="otp-box-wrapper">
                <div class="otp-box">
                    {{ $otp }}
                </div>
            </div>

            <div class="expiry-note">
                ⏱️ This verification code is valid for <strong>10 minutes</strong>.
            </div>

            <div class="security-box">
                🔒 <strong>Security Tip:</strong> Never share this code with anyone. Invitify support will never ask you for your verification code. If you did not attempt to register, you can safely ignore this email.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0; font-size: 11px; opacity: 0.85;">
                © {{ date('Y') }} Invitify. All rights reserved. • Automated security message sent to your email.
            </p>
        </div>
    </div>
</body>
</html>
