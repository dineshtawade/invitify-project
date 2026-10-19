<?php

namespace App\Mail;

use App\Models\User;
use App\Models\UserTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
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
        return new Envelope(
            subject: "🎉 Congratulations! Your {$templateName} is Ready - Invitify",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.template-purchased',
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
