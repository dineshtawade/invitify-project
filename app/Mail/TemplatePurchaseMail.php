<?php

namespace App\Mail;

use App\Models\User;
use App\Models\UserTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class TemplatePurchaseMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     * developed by dinesh tawade
     */
    public function __construct(
        public User $user,
        public UserTemplate $userTemplate,
        public string $invitationUrl,
        public ?string $orderId = null,
        public ?float $amount = null
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $templateName = $this->userTemplate->template?->name ?? 'Digital Invitation';
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name', 'Invitify');

        return new Envelope(
            from: new Address($fromAddress, $fromName),
            replyTo: [new Address($fromAddress, $fromName)],
            subject: "Order Confirmation: Your {$templateName} Access Details - Invitify",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.template-purchased',
            text: 'emails.template-purchased-text',
        );
    }

    /**
     * Custom transactional email headers to ensure Primary Inbox delivery.
     */
    public function headers(): Headers
    {
        return new Headers(
            text: [
                'X-Auto-Response-Suppress' => 'All',
                'Auto-Submitted' => 'auto-generated',
                'Feedback-ID' => 'orders:invitify',
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
