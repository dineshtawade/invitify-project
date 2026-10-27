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

    public ?\App\Models\Transaction $transaction = null;

    /**
     * Create a new message instance.
     * developed by dinesh tawade
     */
    public function __construct(
        public User $user,
        public UserTemplate $userTemplate,
        public string $invitationUrl,
        public ?string $orderId = null,
        public ?float $amount = null,
        ?\App\Models\Transaction $transaction = null
    ) {
        $this->transaction = $transaction;
        if (!$this->transaction && $this->userTemplate) {
            $this->transaction = \App\Models\Transaction::where('user_template_id', $this->userTemplate->id)
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
        $templateName = $this->userTemplate->template?->name ?? 'Digital Invitation';
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name', 'Invitify');

        return new Envelope(
            from: new Address($fromAddress, $fromName),
            replyTo: [new Address($fromAddress, $fromName)],
            subject: "Order Confirmation: Your {$templateName} Access Details & Tax Invoice - Invitify",
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
                'Feedback-ID' => 'orders:invitify',
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
                \Illuminate\Support\Facades\Log::error("Failed to attach Tax Invoice PDF to TemplatePurchaseMail: " . $e->getMessage());
            }
        }
        return $attachments;
    }
}
