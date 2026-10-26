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

    public ?\App\Models\Transaction $transaction = null;

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
        public ?int $days = null,
        ?\App\Models\Transaction $transaction = null
    ) {
        $this->transaction = $transaction;
        if (!$this->transaction && $this->orderId) {
            $this->transaction = \App\Models\Transaction::where('order_id', $this->orderId)
                ->where('status', 'completed')
                ->latest()
                ->first();
        }
    }

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
            subject: "Hosting Confirmation: Your Website '{$siteTitle}' is Ready & Tax Invoice - Invitify",
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
            with: [
                'transaction' => $this->transaction,
                'invoiceNumber' => $this->transaction?->invoice_number,
                'invoiceDownloadUrl' => $this->transaction?->invoice_number ? route('customer.invoices.download', $this->transaction->invoice_number) : null,
            ],
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
        $attachments = [];
        if ($this->transaction && !empty($this->transaction->invoice_number)) {
            try {
                $pdfData = \App\Services\TaxService::generateInvoicePdf($this->transaction);
                $attachments[] = \Illuminate\Mail\Mailables\Attachment::fromData(
                    fn () => $pdfData,
                    "Tax-Invoice-{$this->transaction->invoice_number}.pdf"
                )->withMime('application/pdf');
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error("Failed to attach Tax Invoice PDF to MiniWebsitePurchaseMail: " . $e->getMessage());
            }
        }
        return $attachments;
    }
}
