Hello {{ $user->name }},

Thank you for your order with Invitify! Your digital invitation is ready.

Order Summary:
- Template: {{ $userTemplate->template?->name ?? 'Digital Invitation' }}
- Type: {{ ucfirst($userTemplate->template?->type ?? 'Invitation') }} Card
@if($orderId)
- Order Reference: {{ $orderId }}
@endif
@if($amount !== null)
- Amount Paid: Rs. {{ number_format($amount, 2) }}
@endif
- Date: {{ now()->format('d M, Y') }}

Access Your Invitation:
{{ $invitationUrl }}

You can copy and share the link above directly with your guests via WhatsApp, SMS, or Email.

Manage all your invitations anytime from your dashboard:
{{ url('/customer/my-invitations') }}

Warm regards,
Invitify Team
support@invitify.com
