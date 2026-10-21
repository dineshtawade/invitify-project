Hello {{ $user->name }},

Thank you for your order with Invitify! Your invitation website is live and ready.

Website Details:
- Title: {{ $miniWebsite->title ?? 'Invitation Website' }}
@if($days)
- Hosting Duration: {{ $days }} Days
@endif
@if($orderId)
- Order Reference: {{ $orderId }}
@endif
@if($amount !== null)
- Amount Paid: Rs. {{ number_format($amount, 2) }}
@endif
- Status: Live & Published

Your Live Website Link:
{{ $websiteUrl }}

You can share the link above with all your guests on WhatsApp, Instagram, SMS, or Email.

Manage all your websites anytime from your dashboard:
{{ url('/customer/dashboard') }}

Warm regards,
Invitify Team
support@invitify.com
