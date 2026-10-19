<?php

namespace App\Mail;

use App\Models\MiniWebsite;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
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
        return new Envelope(
            subject: "🌐 Congratulations! Your Invitation Website '{$siteTitle}' is Live - Invitify",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.mini-website-purchased',
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
