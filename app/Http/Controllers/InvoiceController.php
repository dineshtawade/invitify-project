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
     * Display a tax invoice by invoice number.
     */
    public function show(Request $request, $invoiceNumber)
    {
        $transaction = Transaction::with([
            'user:id,name,email',
            'template:id,name,type,category,hsn_sac_code',
            'miniWebsiteTemplate:id,name,type,hsn_sac_code',
            'businessWebsiteTemplate:id,name',
            'businessCard:id,title',
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

        $settings = TaxService::getSettings();
        $amountInWords = TaxService::amountToWords(floatval($transaction->amount));

        // Determine item name and HSN/SAC
        $itemName = 'Invitation Template';
        $hsnSac = $settings['default_hsn_sac'];

        if ($transaction->template) {
            $itemName = $transaction->template->name . ' (' . ucfirst($transaction->template->type) . ' Template)';
            $hsnSac = $transaction->template->hsn_sac_code ?: $hsnSac;
        } elseif ($transaction->miniWebsiteTemplate) {
            $itemName = $transaction->miniWebsiteTemplate->name . ' (Invitation Website Template)';
            $hsnSac = $transaction->miniWebsiteTemplate->hsn_sac_code ?: $hsnSac;
        } elseif ($transaction->businessCard) {
            $itemName = 'Digital Business Card: ' . $transaction->businessCard->title;
        } elseif ($transaction->businessWebsiteTemplate) {
            $itemName = $transaction->businessWebsiteTemplate->name . ' (Business Website)';
        }

        return Inertia::render('invoices/show', [
            'transaction' => $transaction,
            'settings' => $settings,
            'amountInWords' => $amountInWords,
            'itemName' => $itemName,
            'hsnSac' => $hsnSac,
        ]);
    }
}
