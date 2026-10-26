<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\TaxService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Reseller Invoice & Billing Controller
 * Developed for Reseller Panel self-service invoices
 */
class InvoiceController extends Controller
{
    /**
     * Display a listing of invoices for the authenticated reseller.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Auto-assign invoice number & tax data to any un-invoiced transactions of this reseller
        $unInvoiced = Transaction::where('user_id', $user->id)
            ->whereNull('invoice_number')
            ->get();

        foreach ($unInvoiced as $tx) {
            TaxService::ensureInvoice($tx);
        }

        $query = Transaction::with([
            'template:id,name,type,category,hsn_sac_code',
            'miniWebsiteTemplate:id,name,type,hsn_sac_code',
            'businessWebsiteTemplate:id,name',
            'businessCard:id,title',
            'miniWebsite:id,title',
            'businessWebsite:id,title',
        ])
        ->where('user_id', $user->id);

        // Search filter
        if ($search = trim($request->input('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('order_id', 'like', "%{$search}%")
                  ->orWhere('payment_id', 'like', "%{$search}%")
                  ->orWhere('customer_billing_name', 'like', "%{$search}%")
                  ->orWhereHas('template', fn($t) => $t->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('miniWebsiteTemplate', fn($t) => $t->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('businessWebsiteTemplate', fn($t) => $t->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('businessCard', fn($t) => $t->where('title', 'like', "%{$search}%"));
            });
        }

        // Status filter
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Date range filter
        if ($from = $request->input('from')) {
            $query->whereDate('invoice_date', '>=', $from);
        }
        if ($to = $request->input('to')) {
            $query->whereDate('invoice_date', '<=', $to);
        }

        // Reseller summary KPIs (computed across all own transactions)
        $allOwn = Transaction::where('user_id', $user->id)->get();
        $totalSpend = (float) $allOwn->where('status', 'completed')->sum('amount');
        $totalTaxPaid = (float) $allOwn->where('status', 'completed')->sum('tax_amount');
        $invoicesCount = $allOwn->count();

        $invoices = $query->orderByDesc('invoice_date')->orderByDesc('id')->paginate(15)->withQueryString();
        $settings = TaxService::getSettings();

        // Reseller business & GST profile
        $resellerDetails = is_array($user->reseller_details)
            ? $user->reseller_details
            : (json_decode($user->reseller_details ?? '', true) ?: []);

        return Inertia::render('reseller/invoices/index', [
            'invoices' => $invoices,
            'stats' => [
                'total_invoices' => $invoicesCount,
                'total_spend' => $totalSpend,
                'total_tax_paid' => $totalTaxPaid,
            ],
            'reseller' => [
                'name' => $user->name,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'business_name' => $resellerDetails['business_name'] ?? $user->name,
                'gst_number' => $resellerDetails['gst_number'] ?? null,
                'business_address' => $resellerDetails['business_address'] ?? null,
                'mobile_number' => $resellerDetails['mobile_number'] ?? $user->mobile,
                'contact_email' => $resellerDetails['email'] ?? $user->email,
            ],
            'settings' => $settings,
            'filters'  => $request->only(['search', 'status', 'from', 'to']),
        ]);
    }

    /**
     * Display a specific invoice for the reseller.
     */
    public function show(Request $request, $invoiceNumber)
    {
        $transaction = Transaction::where('invoice_number', $invoiceNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $invoiceData = TaxService::buildInvoiceData($transaction);

        return Inertia::render('invoices/show', [
            'invoice' => $invoiceData,
            'downloadUrl' => route('reseller.invoices.download', $transaction->invoice_number),
            'streamUrl' => route('reseller.invoices.stream', $transaction->invoice_number),
        ]);
    }

    /**
     * Download invoice as PDF for the reseller.
     */
    public function downloadPdf(Request $request, $invoiceNumber)
    {
        $transaction = Transaction::where('invoice_number', $invoiceNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $pdf = TaxService::getPdfInstance($transaction);
        return $pdf->download("Tax-Invoice-{$transaction->invoice_number}.pdf");
    }

    /**
     * View/stream invoice PDF directly in the browser for the reseller.
     */
    public function streamPdf(Request $request, $invoiceNumber)
    {
        $transaction = Transaction::where('invoice_number', $invoiceNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $pdf = TaxService::getPdfInstance($transaction);
        return $pdf->stream("Tax-Invoice-{$transaction->invoice_number}.pdf");
    }

    /**
     * Download multiple or all invoices for the reseller as a ZIP file.
     */
    public function downloadAllPdf(Request $request)
    {
        $user = $request->user();

        @ini_set('max_execution_time', '300');
        @ini_set('memory_limit', '512M');

        $query = Transaction::with([
            'template',
            'miniWebsiteTemplate',
            'businessWebsiteTemplate',
            'businessCard',
            'miniWebsite',
            'businessWebsite',
        ])
        ->where('user_id', $user->id)
        ->whereNotNull('invoice_number');

        // Check if specific selected IDs/invoice numbers are requested
        if ($selected = $request->input('selected')) {
            $items = is_array($selected) ? $selected : explode(',', $selected);
            $query->where(function ($q) use ($items) {
                $q->whereIn('id', $items)->orWhereIn('invoice_number', $items);
            });
        } else {
            // Apply search filter
            if ($search = trim($request->input('search', ''))) {
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                      ->orWhere('order_id', 'like', "%{$search}%")
                      ->orWhere('payment_id', 'like', "%{$search}%")
                      ->orWhere('customer_billing_name', 'like', "%{$search}%")
                      ->orWhereHas('template', fn($t) => $t->where('name', 'like', "%{$search}%"))
                      ->orWhereHas('miniWebsiteTemplate', fn($t) => $t->where('name', 'like', "%{$search}%"))
                      ->orWhereHas('businessWebsiteTemplate', fn($t) => $t->where('name', 'like', "%{$search}%"))
                      ->orWhereHas('businessCard', fn($t) => $t->where('title', 'like', "%{$search}%"));
                });
            }

            if ($status = $request->input('status')) {
                $query->where('status', $status);
            }

            if ($from = $request->input('from')) {
                $query->whereDate('invoice_date', '>=', $from);
            }
            if ($to = $request->input('to')) {
                $query->whereDate('invoice_date', '<=', $to);
            }
        }

        $transactions = $query->orderByDesc('invoice_date')->limit(300)->get();

        if ($transactions->isEmpty()) {
            return redirect()->back()->with('error', 'No invoices found to download.');
        }

        $zipDir = storage_path('app/temp');
        if (!file_exists($zipDir)) {
            mkdir($zipDir, 0755, true);
        }

        $zipFileName = 'Reseller-Invoices-' . date('Y-m-d-His') . '.zip';
        $zipPath = $zipDir . '/' . $zipFileName;

        $zip = new \ZipArchive();
        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Could not create ZIP archive on server.');
        }

        foreach ($transactions as $tx) {
            TaxService::ensureInvoice($tx);
            $pdfContent = TaxService::generateInvoicePdf($tx);
            $pdfFileName = "Tax-Invoice-{$tx->invoice_number}.pdf";
            $zip->addFromString($pdfFileName, $pdfContent);
        }

        $zip->close();

        return response()->download($zipPath, $zipFileName, [
            'Content-Type' => 'application/zip',
        ])->deleteFileAfterSend(true);
    }
}
