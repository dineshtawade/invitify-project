<?php

namespace App\Http\Controllers;

use App\Models\BusinessCard;
use App\Models\BusinessCardFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicCardController extends Controller
{
    public function show($slug)
    {
        $card = BusinessCard::where('slug', $slug)->firstOrFail();
        
        $feedbacks = BusinessCardFeedback::where('business_card_id', $card->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('public/business-card', [
            'card' => $card,
            'feedbacks' => $feedbacks
        ]);
    }

    public function submitFeedback(Request $request, $slug)
    {
        $card = BusinessCard::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'r_name' => 'required|string|max:100',
            'r_email' => 'required|email|max:100',
            'r_contact' => 'nullable|string|max:20',
            'r_star' => 'required|integer|min:1|max:5',
            'r_msg' => 'nullable|string|max:1000'
        ]);

        BusinessCardFeedback::create([
            'business_card_id' => $card->id,
            'r_name' => $validated['r_name'],
            'r_email' => $validated['r_email'],
            'r_contact' => $validated['r_contact'] ?? null,
            'r_star' => $validated['r_star'],
            'r_msg' => $validated['r_msg'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Thank you for your feedback!');
    }

    public function downloadVcard($slug)
    {
        $card = BusinessCard::where('slug', $slug)->firstOrFail();
        $personal = $card->personal_details ?? [];
        
        $firstName = $personal['first_name'] ?? '';
        $lastName = $personal['last_name'] ?? '';
        $company = $card->company_name ?? '';
        $title = $personal['designation'] ?? '';
        $email = $personal['email'] ?? '';
        $phone1 = $personal['phone_1'] ?? '';
        $phone2 = $personal['phone_2'] ?? '';
        $whatsapp = $personal['whatsapp'] ?? '';
        $address = $personal['address'] ?? '';
        $website = $personal['website'] ?? '';
        
        $vcard = "BEGIN:VCARD\r\n";
        $vcard .= "VERSION:3.0\r\n";
        $vcard .= "N:{$lastName};{$firstName};;;\r\n";
        $vcard .= "FN:{$firstName} {$lastName}\r\n";
        $vcard .= "ORG:{$company};\r\n";
        $vcard .= "TITLE:{$title}\r\n";
        $vcard .= "EMAIL;type=INTERNET;type=WORK;type=pref:{$email}\r\n";
        $vcard .= "TEL;type=WORK;type=pref:{$phone1}\r\n";
        if (!empty($phone2)) {
            $vcard .= "TEL;type=CELL:{$phone2}\r\n";
        }
        if (!empty($whatsapp)) {
            $vcard .= "TEL;type=HOME:{$whatsapp}\r\n";
        }
        $vcard .= "URL;type=pref:https://" . request()->getHost() . "/card/{$card->slug}\r\n";
        $vcard .= "END:VCARD";

        return response($vcard)
            ->header('Content-Type', 'text/x-vcard')
            ->header('Content-Disposition', 'attachment; filename="' . strtolower($firstName . '_' . $lastName) . '.vcf"');
    }
}
