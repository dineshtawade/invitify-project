<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\MiniWebsiteTemplate;
use App\Models\SystemSetting;
use App\Models\Template;
use App\Models\Transaction;
use App\Services\TaxService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Developed by Dinesh Tawade
 * Super Admin Controller for GST, Platform Fees, and Invoices
 */
class TaxController extends Controller
{
    /**
     * Display GST, platform fee settings, and item-level tax overrides.
     */
    public function index()
    {
        $settings = TaxService::getSettings();

        $cardTemplates = Template::select([
            'id', 'name', 'type', 'category', 'price', 'gst_rate',
            'platform_fee', 'platform_fee_type', 'hsn_sac_code', 'tax_inclusive'
        ])->orderBy('id', 'desc')->get();

        $websiteTemplates = MiniWebsiteTemplate::select([
            'id', 'name', 'type', 'price', 'gst_rate',
            'platform_fee', 'platform_fee_type', 'hsn_sac_code', 'tax_inclusive'
        ])->orderBy('id', 'desc')->get();

        $recentInvoices = Transaction::with(['user:id,name,email'])
            ->whereNotNull('invoice_number')
            ->orderBy('id', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('super-admin/taxes/index', [
            'settings' => $settings,
            'cardTemplates' => $cardTemplates,
            'websiteTemplates' => $websiteTemplates,
            'recentInvoices' => $recentInvoices,
        ]);
    }

    /**
     * Update global GST, platform fee, and company billing settings.
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'gst_enabled'               => 'required|boolean',
            'cgst_percent'              => 'required|numeric|min:0|max:100',
            'sgst_percent'              => 'required|numeric|min:0|max:100',
            'platform_fee_enabled'      => 'required|boolean',
            'default_platform_fee'      => 'required|numeric|min:0',
            'default_platform_fee_type' => 'required|in:fixed,percent',
            'default_hsn_sac'           => 'nullable|string|max:20',
            'company_name'              => 'nullable|string|max:255',
            'company_gstin'             => 'nullable|string|max:50',
            'company_pan'               => 'nullable|string|max:50',
            'company_address'           => 'nullable|string|max:500',
            'company_state'             => 'nullable|string|max:100',
            'company_state_code'        => 'nullable|string|max:10',
            'company_email'             => 'nullable|email|max:255',
            'company_phone'             => 'nullable|string|max:50',
            'invoice_prefix'            => 'nullable|string|max:20',
            'invoice_terms'             => 'nullable|string|max:1000',
        ]);

        // Auto-compute the combined GST rate for backward compatibility
        $validated['default_gst_rate'] = floatval($validated['cgst_percent']) + floatval($validated['sgst_percent']);

        foreach ($validated as $key => $val) {
            SystemSetting::set($key, is_bool($val) ? ($val ? '1' : '0') : (string) $val);
        }

        return redirect()->back()->with('status', 'GST and tax settings updated successfully.');
    }

    /**
     * Update tax override for an invitation card/video template.
     */
    public function updateTemplateTax(Request $request, $id)
    {
        $template = Template::findOrFail($id);

        $validated = $request->validate([
            'gst_rate' => 'nullable|numeric|min:0|max:100',
            'platform_fee' => 'nullable|numeric|min:0',
            'platform_fee_type' => 'nullable|in:fixed,percent',
            'hsn_sac_code' => 'nullable|string|max:20',
            'tax_inclusive' => 'required|boolean',
        ]);

        $template->update($validated);

        return redirect()->back()->with('status', "Tax configuration for '{$template->name}' updated successfully.");
    }

    /**
     * Update tax override for a mini website template.
     */
    public function updateWebsiteTemplateTax(Request $request, $id)
    {
        $template = MiniWebsiteTemplate::findOrFail($id);

        $validated = $request->validate([
            'gst_rate' => 'nullable|numeric|min:0|max:100',
            'platform_fee' => 'nullable|numeric|min:0',
            'platform_fee_type' => 'nullable|in:fixed,percent',
            'hsn_sac_code' => 'nullable|string|max:20',
            'tax_inclusive' => 'required|boolean',
        ]);

        $template->update($validated);

        return redirect()->back()->with('status', "Tax configuration for '{$template->name}' updated successfully.");
    }
}
