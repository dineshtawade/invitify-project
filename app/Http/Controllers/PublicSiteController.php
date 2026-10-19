<?php

namespace App\Http\Controllers;

use App\Models\MiniWebsite;
use App\Models\Rsvp;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicSiteController extends Controller
{
    /**
     * Show a published mini website (invitation).
     */
    public function show($slug)
    {
        $website = MiniWebsite::where('slug', $slug)->firstOrFail();
        $website->load('template');

        // Check if draft or expired
        if (!$website->is_published || $website->isSubscriptionExpired()) {
            $reason = !$website->is_published 
                ? 'This website is currently in draft mode.' 
                : 'The hosting subscription for this website has expired. Please contact the owner to renew.';

            return Inertia::render('public/buy', [
                'website' => [
                    'id' => $website->id,
                    'title' => $website->title,
                    'slug' => $website->slug,
                    'theme' => $website->theme,
                    'is_published' => $website->is_published,
                    'user_id' => $website->user_id,
                    'expires_at' => $website->expires_at ? $website->expires_at->toDateTimeString() : null,
                    'template' => $website->template ? [
                        'id' => $website->template->id,
                        'name' => $website->template->name,
                        'price' => $website->template->price,
                    ] : null,
                ],
                'reason' => $reason,
                'auth' => [
                    'user' => auth()->user() ? [
                        'id' => auth()->id(),
                        'name' => auth()->user()->name,
                        'email' => auth()->user()->email,
                        'role' => auth()->user()->role,
                    ] : null,
                ]
            ]);
        }

        // 3. Render block-based design or HTML code template
        $isLegacyBlocks = is_array($website->config) && !empty($website->config) && isset($website->config[0]['type']);
        $isNewConfig = is_array($website->config) && isset($website->config['pages']);
        $isHtmlConfig = is_array($website->config) && isset($website->config['html']);

        if ($isHtmlConfig) {
            $html = $website->config['html'];
            $html = $this->ensureRsvpFormIncluded($html, $website);
            return response($html);
        }
        
        if ($isLegacyBlocks || $isNewConfig) {
            return Inertia::render('public/site-viewer', [
                'website' => $website,
                'customBlocks' => \App\Models\CustomBlock::all(),
            ]);
        }

        // 4. Fallback to legacy static templates
        $owner = $website->user;
        if (!$owner || !$owner->hasActiveSubscription('invitation')) {
            return Inertia::render('public/offline', [
                'title' => $website->title,
                'reason' => 'The subscription for this website has expired or is inactive.',
            ]);
        }

        return Inertia::render('public/invitation', [
            'website' => $website,
        ]);
    }

    /**
     * Submit an RSVP response.
     */
    public function rsvp(Request $request, $slug)
    {
        $website = MiniWebsite::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:20',
            'status' => 'nullable|string|max:100',
            'attending' => 'nullable|boolean',
            'guests_count' => 'nullable|integer|min:1',
            'guests' => 'nullable|integer|min:0',
            'email' => 'nullable|email|max:255',
            'message' => 'nullable|string|max:1000',
            'answers' => 'nullable|array',
        ]);

        // Normalize status
        $status = strtolower($validated['status'] ?? ($request->boolean('attending') ? 'yes' : 'no'));
        if ($status === 'attending') $status = 'yes';
        if ($status === 'declined') $status = 'no';

        $guestsCount = isset($validated['guests_count']) 
            ? (int) $validated['guests_count'] 
            : (isset($validated['guests']) ? (int) $validated['guests'] : 1);

        // Collect custom answers
        $answers = $request->input('answers', []);
        if (!is_array($answers)) {
            $answers = [];
        }

        $standardKeys = ['_token', 'name', 'mobile_number', 'status', 'attending', 'guests_count', 'guests', 'email', 'message', 'answers'];
        foreach ($request->except($standardKeys) as $k => $v) {
            if ($v !== null && (is_string($v) || is_array($v) || is_numeric($v))) {
                $answers[$k] = $v;
            }
        }

        $rsvp = $website->rsvps()->create([
            'name' => $validated['name'],
            'mobile_number' => $validated['mobile_number'] ?? null,
            'email' => $validated['email'] ?? null,
            'status' => $status,
            'guests_count' => $guestsCount > 0 ? $guestsCount : 1,
            'message' => $validated['message'] ?? null,
            'answers' => !empty($answers) ? $answers : null,
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'RSVP submitted successfully! Thank you.',
                'rsvp' => $rsvp,
            ]);
        }

        return redirect()->back()->with('status', 'RSVP submitted successfully!');
    }

    /**
     * Submit a contact form.
     */
    public function contact(Request $request, $slug)
    {
        $website = MiniWebsite::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $website->contactSubmissions()->create($validated);

        return redirect()->back()->with('status', 'Message sent successfully!');
    }

    /**
     * Ensure the RSVP form is dynamically included or removed based on template config.
     * developed by dinesh tawade
     */
    private function ensureRsvpFormIncluded(string $html, MiniWebsite $website): string
    {
        // Strip any existing embedded RSVP block to prevent duplication
        $html = preg_replace('/<!-- Invitify Premium RSVP Section -->.*?<\/section>/s', '', $html);
        $html = preg_replace('/<section[^>]*id=["\']invitify-rsvp-section["\'].*?<\/section>/s', '', $html);

        // Fetch RSVP configuration
        $rsvpConfig = null;
        if (is_array($website->config) && isset($website->config['rsvp'])) {
            $rsvpConfig = $website->config['rsvp'];
        } elseif ($website->template && is_array($website->template->config) && isset($website->template->config['rsvp'])) {
            $rsvpConfig = $website->template->config['rsvp'];
        }

        // Check if RSVP is disabled explicitly
        if ($rsvpConfig !== null && isset($rsvpConfig['enabled']) && !$rsvpConfig['enabled']) {
            return $html;
        }

        $badge = !empty($rsvpConfig['badge']) ? e($rsvpConfig['badge']) : 'WEDDING RSVP';
        $heading = !empty($rsvpConfig['heading']) ? e($rsvpConfig['heading']) : 'Will You Attend?';
        $subheading = !empty($rsvpConfig['subheading']) ? e($rsvpConfig['subheading']) : 'Please confirm your presence so we can reserve your seat and celebrate our special day together!';

        $slug = e($website->slug);
        $rsvpAction = url("/mini-website/{$slug}/rsvp");

        // Build dynamic questions
        $questions = !empty($rsvpConfig['questions']) && is_array($rsvpConfig['questions']) 
            ? $rsvpConfig['questions'] 
            : [
                [
                    'id' => 'q_name',
                    'key' => 'name',
                    'label' => 'Guest Name',
                    'type' => 'text',
                    'required' => true,
                    'placeholder' => 'Enter your full name',
                    'is_system' => true,
                ],
                [
                    'id' => 'q_mobile',
                    'key' => 'mobile_number',
                    'label' => 'Mobile Number',
                    'type' => 'text',
                    'required' => true,
                    'placeholder' => 'Enter 10-digit mobile number',
                    'is_system' => true,
                ],
                [
                    'id' => 'q_status',
                    'key' => 'status',
                    'label' => 'Attendance Status',
                    'type' => 'options',
                    'required' => true,
                    'display_style' => 'cards',
                    'options' => [
                        ['label' => 'Yes', 'value' => 'yes', 'icon' => '🎉', 'subtext' => 'Attending'],
                        ['label' => 'Maybe', 'value' => 'maybe', 'icon' => '🤔', 'subtext' => 'Not sure yet'],
                        ['label' => 'No', 'value' => 'no', 'icon' => '💌', 'subtext' => "Can't make it"],
                    ],
                    'is_system' => true,
                ],
                [
                    'id' => 'q_guests',
                    'key' => 'guests_count',
                    'label' => 'Number of Guests (Including you)',
                    'type' => 'options',
                    'required' => false,
                    'display_style' => 'list',
                    'options' => [
                        ['label' => '1 Person', 'value' => '1', 'icon' => '👤', 'subtext' => 'Solo guest'],
                        ['label' => '2 People', 'value' => '2', 'icon' => '👥', 'subtext' => 'Couple'],
                        ['label' => '3 People', 'value' => '3', 'icon' => '👨‍👩‍👧', 'subtext' => 'Family'],
                        ['label' => '4 People', 'value' => '4', 'icon' => '👨‍👩‍👧‍👦', 'subtext' => 'Family'],
                        ['label' => '5+ People', 'value' => '5', 'icon' => '🎉', 'subtext' => 'Group'],
                    ],
                    'is_system' => true,
                ],
                [
                    'id' => 'q_message',
                    'key' => 'message',
                    'label' => 'Message for the Couple',
                    'type' => 'textarea',
                    'required' => false,
                    'placeholder' => 'Warm wishes or blessings for the couple...',
                    'is_system' => true,
                ],
            ];

        $renderedQuestions = '';
        foreach ($questions as $idx => $q) {
            $qLabel = e($q['label'] ?? 'Question');
            $qKey = e($q['key'] ?? ('field_' . $idx));
            $qType = $q['type'] ?? 'text';
            $isRequired = !empty($q['required']);
            $placeholder = e($q['placeholder'] ?? '');
            $displayStyle = $q['display_style'] ?? 'cards';

            $reqMarker = $isRequired ? '<span style="color: #e11d48; font-size: 13px; margin-left: 2px;">*</span>' : '';
            $reqAttr = $isRequired ? 'required' : '';

            $isSystem = !empty($q['is_system']);
            $inputName = ($isSystem && in_array($qKey, ['name', 'mobile_number', 'status', 'guests_count', 'message'])) 
                ? $qKey 
                : "answers[{$qKey}]";

            if ($qType === 'text') {
                $renderedQuestions .= <<<HTML
                <div style="margin-bottom: 18px;">
                    <label class="rsvp-label" style="display: flex; justify-content: space-between; font-family: inherit; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: inherit; opacity: 0.88; margin-bottom: 7px;">
                        <span>{$qLabel} {$reqMarker}</span>
                    </label>
                    <input 
                        type="text" 
                        name="{$inputName}" 
                        class="rsvp-input-field"
                        {$reqAttr} 
                        placeholder="{$placeholder}" 
                        style="box-sizing: border-box; width: 100%; height: 48px; padding: 0 16px; border: 1.5px solid rgba(0,0,0,0.12); border-radius: 14px; font-family: inherit; font-size: 14px; font-weight: 500; background: rgba(255,255,255,0.75); color: inherit; outline: none; transition: all 0.2s ease;"
                    />
                </div>
HTML;
            } elseif ($qType === 'textarea') {
                $renderedQuestions .= <<<HTML
                <div style="margin-bottom: 18px;">
                    <label class="rsvp-label" style="display: flex; justify-content: space-between; font-family: inherit; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: inherit; opacity: 0.88; margin-bottom: 7px;">
                        <span>{$qLabel} {$reqMarker}</span>
                    </label>
                    <textarea 
                        name="{$inputName}" 
                        class="rsvp-input-field"
                        rows="3" 
                        {$reqAttr} 
                        placeholder="{$placeholder}" 
                        style="box-sizing: border-box; width: 100%; padding: 14px 16px; border: 1.5px solid rgba(0,0,0,0.12); border-radius: 14px; font-family: inherit; font-size: 14px; font-weight: 500; background: rgba(255,255,255,0.75); color: inherit; outline: none; transition: all 0.2s ease; resize: vertical; min-height: 80px;"
                    ></textarea>
                </div>
HTML;
            } elseif ($qType === 'options') {
                $options = is_array($q['options'] ?? null) ? $q['options'] : [];
                $groupClass = 'rsvp-grp-' . ($q['id'] ?? $idx);

                if ($displayStyle === 'cards') {
                    // Cards Grid
                    $cardsHtml = '';
                    foreach ($options as $optIdx => $opt) {
                        $optLabel = e(is_array($opt) ? ($opt['label'] ?? '') : (string)$opt);
                        $optValue = e(is_array($opt) ? ($opt['value'] ?? $optLabel) : (string)$opt);
                        $optIcon = is_array($opt) && !empty($opt['icon']) ? e($opt['icon']) : '';
                        $optSubtext = is_array($opt) && !empty($opt['subtext']) ? e($opt['subtext']) : '';
                        $isFirst = ($optIdx === 0);
                        $checkedAttr = $isFirst ? 'checked' : '';

                        $cardsHtml .= <<<HTML
                        <label class="rsvp-option-card {$groupClass} {$checkedAttr}" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 10px; border: 1.5px solid rgba(0,0,0,0.12); border-radius: 14px; background: rgba(255,255,255,0.7); transition: all 0.2s ease; text-align: center; box-shadow: none; opacity: 0.85; font-family: inherit;">
                            <input type="radio" name="{$inputName}" value="{$optValue}" {$checkedAttr} style="display: none;" onchange="handleRsvpCardSelect(this, '{$groupClass}', '{$inputName}')" />
                            {$optIcon}
                            <span class="rsvp-opt-title" style="font-size: 13px; font-weight: 700; color: inherit; font-family: inherit; margin-top: 2px;">{$optLabel}</span>
                            <span class="rsvp-opt-sub" style="font-size: 10px; font-weight: 500; opacity: 0.7; font-family: inherit;">{$optSubtext}</span>
                        </label>
HTML;
                    }

                    $renderedQuestions .= <<<HTML
                    <div style="margin-bottom: 18px;">
                        <label class="rsvp-label" style="display: flex; justify-content: space-between; font-family: inherit; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: inherit; opacity: 0.88; margin-bottom: 9px;">
                            <span>{$qLabel} {$reqMarker}</span>
                        </label>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(95px, 1fr)); gap: 10px;">
                            {$cardsHtml}
                        </div>
                    </div>
HTML;
                } else {
                    // Vertical List
                    $listHtml = '';
                    foreach ($options as $optIdx => $opt) {
                        $optLabel = e(is_array($opt) ? ($opt['label'] ?? '') : (string)$opt);
                        $optValue = e(is_array($opt) ? ($opt['value'] ?? $optLabel) : (string)$opt);
                        $optIcon = is_array($opt) && !empty($opt['icon']) ? e($opt['icon']) : '';
                        $optSubtext = is_array($opt) && !empty($opt['subtext']) ? e($opt['subtext']) : '';
                        $isFirst = ($optIdx === 0);
                        $checkedAttr = $isFirst ? 'checked' : '';

                        $listHtml .= <<<HTML
                        <label class="rsvp-list-card {$groupClass} {$checkedAttr}" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1.5px solid rgba(0,0,0,0.12); border-radius: 12px; background: rgba(255,255,255,0.7); transition: all 0.2s ease; font-family: inherit;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                {$optIcon}
                                <div>
                                    <div class="rsvp-opt-title" style="font-size: 13px; font-weight: 700; color: inherit; font-family: inherit;">{$optLabel}</div>
                                    <div class="rsvp-opt-sub" style="font-size: 10px; font-weight: 500; opacity: 0.7; font-family: inherit;">{$optSubtext}</div>
                                </div>
                            </div>
                            <div class="rsvp-radio-circle" style="width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.25); background: transparent; display: flex; align-items: center; justify-content: center;"></div>
                            <input type="radio" name="{$inputName}" value="{$optValue}" {$checkedAttr} style="display: none;" onchange="handleRsvpListSelect(this, '{$groupClass}', '{$inputName}')" />
                        </label>
HTML;
                    }

                    $renderedQuestions .= <<<HTML
                    <div style="margin-bottom: 18px;">
                        <label class="rsvp-label" style="display: flex; justify-content: space-between; font-family: inherit; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: inherit; opacity: 0.88; margin-bottom: 9px;">
                            <span>{$qLabel} {$reqMarker}</span>
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            {$listHtml}
                        </div>
                    </div>
HTML;
                }
            }
        }

        $badgeHtml = !empty($badge) ? <<<HTML
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 16px; background: rgba(212, 175, 55, 0.12); color: #9b7824; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; font-family: inherit;">
            <span>✨</span> <span>{$badge}</span> <span>✨</span>
        </div>
HTML : '';

        $subheadingHtml = !empty($subheading) ? <<<HTML
        <p class="rsvp-subheading" style="margin: 10px auto 0; font-family: inherit; font-size: 13px; color: inherit; opacity: 0.75; line-height: 1.6; max-width: 420px;">
            {$subheading}
        </p>
HTML : '';

        $rsvpSnippet = <<<HTML
<!-- Invitify Premium RSVP Section -->
<!-- developed by dinesh tawade -->
<section id="invitify-rsvp-section" style="box-sizing: border-box; width: 100%; padding: 70px 16px 90px; background: transparent; font-family: inherit; color: inherit; position: relative;">
    
    <!-- Canvas Confetti Library -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>

    <div class="invitify-rsvp-card" style="box-sizing: border-box; max-width: 520px; margin: 0 auto; background: rgba(255, 255, 255, 0.90); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border-radius: 28px; padding: 40px 32px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.28); position: relative; overflow: hidden; font-family: inherit; color: inherit;">
        
        <!-- Luxury Shimmer Border at Top -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #c59b27 0%, #f4d068 50%, #b38719 100%);"></div>
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            {$badgeHtml}
            <h2 class="rsvp-heading" style="margin: 0; font-family: inherit; font-size: 28px; font-weight: 700; color: inherit; letter-spacing: -0.3px;">
                {$heading}
            </h2>
            {$subheadingHtml}
        </div>

        <!-- Success Celebration Card (Hidden by default) -->
        <div id="rsvpSuccessCard" style="display: none; text-align: center; padding: 30px 10px; animation: fadeInScale 0.5s ease-out;">
            <div style="width: 72px; height: 72px; margin: 0 auto 16px; background: #ecfdf5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 34px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3); border: 2px solid #a7f3d0;">
                🎉
            </div>
            <h3 style="margin: 0 0 8px; font-size: 22px; font-weight: 800; color: #065f46;">RSVP Confirmed!</h3>
            <p style="margin: 0 0 20px; font-size: 14px; color: #047857; line-height: 1.5;">
                Thank you so much! We are thrilled and look forward to celebrating with you.
            </p>
            <button 
                type="button" 
                onclick="document.getElementById('rsvpSuccessCard').style.display='none'; document.getElementById('invitifyRsvpForm').style.display='flex';"
                style="padding: 10px 22px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; color: #166534; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;"
            >
                Submit another response
            </button>
        </div>

        <form id="invitifyRsvpForm" action="{$rsvpAction}" method="POST" style="display: flex; flex-direction: column;">
            
            {$renderedQuestions}

            <!-- Submit Button -->
            <button 
                type="submit" 
                id="rsvpSubmitBtn" 
                style="box-sizing: border-box; width: 100%; height: 50px; margin-top: 10px; border: none; border-radius: 14px; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #ffffff; font-family: inherit; font-size: 15px; font-weight: 800; letter-spacing: 0.8px; cursor: pointer; box-shadow: 0 10px 25px -5px rgba(184,134,11,0.4); transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; text-transform: uppercase;"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 14px 28px -4px rgba(184,134,11,0.48)';"
                onmouseout="this.style.transform='none'; this.style.boxShadow='0 10px 25px -5px rgba(184,134,11,0.4)';"
            >
                Confirm RSVP
            </button>

            <!-- Inline Error / Status Message Container -->
            <div id="rsvpFeedbackMsg" style="display: none; margin-top: 14px; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; text-align: center;"></div>

        </form>
    </div>
</section>

<style>
@keyframes fadeInScale {
    0% { opacity: 0; transform: scale(0.92); }
    100% { opacity: 1; transform: scale(1); }
}
</style>

<script>
function handleRsvpCardSelect(radio, groupClass, name) {
    var cards = document.querySelectorAll('.' + groupClass);
    cards.forEach(function(card) {
        card.style.border = '1.5px solid rgba(0,0,0,0.12)';
        card.style.background = 'rgba(255,255,255,0.7)';
        card.style.boxShadow = 'none';
        card.style.opacity = '0.85';
        card.classList.remove('is-selected');
    });
    var parent = radio.closest('.' + groupClass);
    if (parent) {
        parent.style.border = '2px solid #10b981';
        parent.style.background = 'rgba(236,253,245,0.9)';
        parent.style.boxShadow = '0 4px 12px rgba(16,185,129,0.15)';
        parent.style.opacity = '1';
        parent.classList.add('is-selected');
    }
}

function handleRsvpListSelect(radio, groupClass, name) {
    var items = document.querySelectorAll('.' + groupClass);
    items.forEach(function(item) {
        item.style.border = '1.5px solid rgba(0,0,0,0.12)';
        item.style.background = 'rgba(255,255,255,0.7)';
        item.classList.remove('is-selected');
        var circle = item.querySelector('.rsvp-radio-circle');
        if (circle) {
            circle.style.borderColor = 'rgba(0,0,0,0.25)';
            circle.style.background = 'transparent';
            circle.innerHTML = '';
        }
    });
    var parent = radio.closest('.' + groupClass);
    if (parent) {
        parent.style.border = '2px solid #10b981';
        parent.style.background = 'rgba(236,253,245,0.9)';
        parent.classList.add('is-selected');
        var circle = parent.querySelector('.rsvp-radio-circle');
        if (circle) {
            circle.style.borderColor = '#10b981';
            circle.style.background = '#10b981';
            circle.innerHTML = '<div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>';
        }
    }
}

// Auto-adapt RSVP font style and background from website code
function adaptRsvpTheme() {
    try {
        var section = document.getElementById('invitify-rsvp-section');
        if (!section) return;
        var body = document.body;
        if (!body) return;
        var bodyStyle = window.getComputedStyle(body);

        // Inherit fonts
        var headingElem = document.querySelector('h1, h2:not(.rsvp-heading)');
        var headingFont = headingElem ? window.getComputedStyle(headingElem).fontFamily : bodyStyle.fontFamily;
        if (headingFont) {
            section.querySelectorAll('.rsvp-heading').forEach(function(el){ el.style.fontFamily = headingFont; });
        }
        if (bodyStyle.fontFamily) {
            section.style.fontFamily = bodyStyle.fontFamily;
        }

        // Detect background color
        var bodyBg = bodyStyle.backgroundColor;
        var card = section.querySelector('.invitify-rsvp-card');
        if (!card) return;

        var rgb = bodyBg.match(/\\d+/g);
        var isDark = false;
        if (rgb && rgb.length >= 3) {
            var lum = (0.299 * parseInt(rgb[0]) + 0.587 * parseInt(rgb[1]) + 0.114 * parseInt(rgb[2]));
            if (lum < 130) isDark = true;
        }

        if (isDark) {
            card.style.background = 'rgba(22, 24, 32, 0.88)';
            card.style.borderColor = 'rgba(255, 255, 255, 0.14)';
            card.style.color = '#f9fafb';
            card.style.boxShadow = '0 25px 60px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)';
            section.querySelectorAll('.rsvp-heading').forEach(function(el){ el.style.color = '#ffffff'; });
            section.querySelectorAll('.rsvp-subheading').forEach(function(el){ el.style.color = 'rgba(255, 255, 255, 0.7)'; });
            section.querySelectorAll('.rsvp-label').forEach(function(el){ el.style.color = 'rgba(255, 255, 255, 0.85)'; });
            section.querySelectorAll('.rsvp-input-field').forEach(function(el){
                el.style.background = 'rgba(255, 255, 255, 0.08)';
                el.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                el.style.color = '#ffffff';
            });
            section.querySelectorAll('.rsvp-option-card, .rsvp-list-card').forEach(function(el){
                if (!el.classList.contains('is-selected')) {
                    el.style.background = 'rgba(255, 255, 255, 0.06)';
                    el.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }
            });
        }
    } catch(e) {}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', adaptRsvpTheme);
} else {
    adaptRsvpTheme();
}

function fireCelebrationConfetti() {
    if (typeof confetti === 'function') {
        var count = 200;
        var defaults = { origin: { y: 0.7 } };
        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, { particleCount: Math.floor(count * particleRatio) }));
        }
        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#d4af37', '#ffd700', '#f59e0b'] });
        fire(0.2, { spread: 60, colors: ['#10b981', '#34d399', '#059669'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#e11d48', '#ec4899', '#f43f5e'] });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize default selected cards/lists
    var checkedRadios = document.querySelectorAll('#invitifyRsvpForm input[type="radio"]:checked');
    checkedRadios.forEach(function(r) {
        r.dispatchEvent(new Event('change'));
    });

    var form = document.getElementById('invitifyRsvpForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = document.getElementById('rsvpSubmitBtn');
        var feedback = document.getElementById('rsvpFeedbackMsg');
        var successCard = document.getElementById('rsvpSuccessCard');
        var originalBtnText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = 'Sending RSVP...';
        feedback.style.display = 'none';

        var formData = new FormData(form);

        fetch('{$rsvpAction}', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(function(res) {
            return res.json().then(function(data) {
                if (!res.ok) {
                    throw new Error(data.message || 'Error submitting RSVP.');
                }
                return data;
            });
        })
        .then(function(data) {
            fireCelebrationConfetti();

            if (successCard) {
                form.style.display = 'none';
                successCard.style.display = 'block';
            } else {
                feedback.style.display = 'block';
                feedback.style.background = '#ecfdf5';
                feedback.style.color = '#047857';
                feedback.style.border = '1px solid #a7f3d0';
                feedback.innerHTML = '🎉 Thank you! Your RSVP response has been recorded.';
            }
            form.reset();
            btn.disabled = false;
            btn.innerHTML = originalBtnText;
        })
        .catch(function(err) {
            feedback.style.display = 'block';
            feedback.style.background = '#fff1f2';
            feedback.style.color = '#be123c';
            feedback.style.border = '1px solid #fecdd3';
            feedback.innerHTML = err.message || 'Failed to submit RSVP. Please try again.';
            btn.disabled = false;
            btn.innerHTML = originalBtnText;
        });
    });
});
</script>
HTML;

        // Inject before </body> if present, or append
        if (str_contains($html, '</body>')) {
            return str_replace('</body>', $rsvpSnippet . '</body>', $html);
        }

        return $html . $rsvpSnippet;
    }
}
