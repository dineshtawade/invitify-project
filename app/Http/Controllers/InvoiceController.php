<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\TaxService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

/**
 * Developed by Dinesh Tawade
 * GST Tax Invoice Viewer & Printer Controller
 */
class InvoiceController extends Controller
{
    /**
     * List all invoices for the Super Admin panel.
     */
    public function index(Request $request)
    {
        $query = Transaction::with([
            'user:id,name,email',
            'template:id,name,type,category,hsn_sac_code',
            'miniWebsiteTemplate:id,name,type,hsn_sac_code',
            'businessWebsiteTemplate:id,name',
            'businessCard:id,title',
        ])->whereNotNull('invoice_number');

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('customer_billing_name', 'like', "%{$search}%")
                  ->orWhere('customer_billing_email', 'like', "%{$search}%")
                  ->orWhere('customer_gstin', 'like', "%{$search}%")
                  ->orWhere('order_id', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%")
                                                    ->orWhere('email', 'like', "%{$search}%"));
            });
        }

        // Payment status filter
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

        $invoices = $query->orderByDesc('invoice_date')->paginate(20)->withQueryString();
        $settings = TaxService::getSettings();

        return Inertia::render('super-admin/invoices/index', [
            'invoices' => $invoices,
            'settings' => $settings,
            'filters'  => $request->only(['search', 'status', 'from', 'to']),
        ]);
    }

    /**
     * Download multiple or all invoices matching current filters as a ZIP file.
     */
    public function downloadAllPdf(Request $request)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['super_admin', 'admin'])) {
            abort(403, 'Unauthorized.');
        }

        @ini_set('max_execution_time', '300');
        @ini_set('memory_limit', '512M');

        $query = Transaction::with([
            'user:id,name,email,role,reseller_details,mobile',
            'template:id,name,type,category,hsn_sac_code',
            'miniWebsiteTemplate:id,name,type,hsn_sac_code',
            'businessWebsiteTemplate:id,name',
            'businessCard:id,title',
            'miniWebsite:id,title',
            'businessWebsite:id,title',
        ])->whereNotNull('invoice_number');

        // Check if specific selected IDs/invoice numbers are requested
        if ($selected = $request->input('selected')) {
            $items = is_array($selected) ? $selected : explode(',', $selected);
            $query->where(function ($q) use ($items) {
                $q->whereIn('id', $items)->orWhereIn('invoice_number', $items);
            });
        } else {
            // Search filter
            if ($search = $request->input('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                      ->orWhere('customer_billing_name', 'like', "%{$search}%")
                      ->orWhere('customer_billing_email', 'like', "%{$search}%")
                      ->orWhere('customer_gstin', 'like', "%{$search}%")
                      ->orWhere('order_id', 'like', "%{$search}%")
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%")
                                                        ->orWhere('email', 'like', "%{$search}%"));
                });
            }

            // Payment status filter
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
        }

        $transactions = $query->orderByDesc('invoice_date')->limit(300)->get();

        if ($transactions->isEmpty()) {
            return redirect()->back()->with('error', 'No invoices found to download.');
        }

        $zipDir = storage_path('app/temp');
        if (!file_exists($zipDir)) {
            mkdir($zipDir, 0755, true);
        }

        $zipFileName = 'All-Invoices-' . date('Y-m-d-His') . '.zip';
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

    /**
     * Display a tax invoice by invoice number.
     */
    public function show(Request $request, $invoiceNumber)
    {
        $transaction = Transaction::with([
            'user:id,name,email,role,reseller_details,mobile',
            'template:id,name,type,category,hsn_sac_code',
            'miniWebsiteTemplate:id,name,type,hsn_sac_code',
            'businessWebsiteTemplate:id,name',
            'businessCard:id,title',
            'miniWebsite:id,title',
            'businessWebsite:id,title',
        ])
        ->where('invoice_number', $invoiceNumber)
        ->firstOrFail();

        $user = $request->user();

        // Check permission: transaction owner or admin
        if (!$user) {
            return redirect()->route('login');
        }

        $isOwner = ($user->id === $transaction->user_id);
        $isAdmin = in_array($user->role, ['super_admin', 'admin']);

        if (!$isOwner && !$isAdmin) {
            abort(403, 'You are not authorized to view this invoice.');
        }

        $invoiceData = TaxService::buildInvoiceData($transaction);

        // Role-based download and stream URLs
        $downloadUrl = $isAdmin
            ? route('super-admin.invoices.download', $transaction->invoice_number)
            : ($user->role === 'reseller'
                ? route('reseller.invoices.download', $transaction->invoice_number)
                : route('customer.invoices.download', $transaction->invoice_number));

        $streamUrl = $isAdmin
            ? route('super-admin.invoices.stream', $transaction->invoice_number)
            : ($user->role === 'reseller'
                ? route('reseller.invoices.stream', $transaction->invoice_number)
                : route('customer.invoices.stream', $transaction->invoice_number));

        return Inertia::render('invoices/show', [
            'invoice' => $invoiceData,
            'downloadUrl' => $downloadUrl,
            'streamUrl' => $streamUrl,
        ]);
    }

    /**
     * Download the tax invoice as a PDF file.
     */
    public function downloadPdf(Request $request, $invoiceNumber)
    {
        $transaction = Transaction::where('invoice_number', $invoiceNumber)->firstOrFail();
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $isOwner = ($user->id === $transaction->user_id);
        $isAdmin = in_array($user->role, ['super_admin', 'admin']);

        if (!$isOwner && !$isAdmin) {
            abort(403, 'You are not authorized to download this invoice.');
        }

        TaxService::ensureInvoice($transaction);
        $pdf = TaxService::getPdfInstance($transaction);
        return $pdf->download("Tax-Invoice-{$transaction->invoice_number}.pdf");
    }

    /**
     * View/stream the tax invoice PDF directly in the browser.
     */
    public function streamPdf(Request $request, $invoiceNumber)
    {
        $transaction = Transaction::where('invoice_number', $invoiceNumber)->firstOrFail();
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $isOwner = ($user->id === $transaction->user_id);
        $isAdmin = in_array($user->role, ['super_admin', 'admin']);

        if (!$isOwner && !$isAdmin) {
            abort(403, 'You are not authorized to view this invoice.');
        }

        TaxService::ensureInvoice($transaction);
        $pdf = TaxService::getPdfInstance($transaction);
        return $pdf->stream("Tax-Invoice-{$transaction->invoice_number}.pdf");
    }
}
