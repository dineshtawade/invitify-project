<?php

namespace App\Mail;

use App\Models\MiniWebsite;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class MiniWebsitePurchaseMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     * developed by dinesh tawade
     */
    public function __construct(
        public User $user,
        public MiniWebsite $miniWebsite,
        public string $websiteUrl,
        public ?string $orderId = null,
        public ?float $amount = null,
        public ?int $days = null
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $siteTitle = $this->miniWebsite->title ?? 'Invitation Website';
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name', 'Invitify');

        return new Envelope(
            from: new Address($fromAddress, $fromName),
            replyTo: [new Address($fromAddress, $fromName)],
            subject: "Hosting Confirmation: Your Website '{$siteTitle}' is Ready - Invitify",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.mini-website-purchased',
            text: 'emails.mini-website-purchased-text',
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
                'Feedback-ID' => 'websites:invitify',
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
