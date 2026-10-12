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
            'status' => 'nullable|string|in:yes,no,maybe,attending,declined',
            'attending' => 'nullable|boolean',
            'guests_count' => 'nullable|integer|min:1',
            'guests' => 'nullable|integer|min:0',
            'email' => 'nullable|email|max:255',
            'message' => 'nullable|string|max:1000',
        ]);

        // Normalize status
        $status = strtolower($validated['status'] ?? ($request->boolean('attending') ? 'yes' : 'no'));
        if ($status === 'attending') $status = 'yes';
        if ($status === 'declined') $status = 'no';

        $guestsCount = isset($validated['guests_count']) 
            ? (int) $validated['guests_count'] 
            : (isset($validated['guests']) ? (int) $validated['guests'] : 1);

        $rsvp = $website->rsvps()->create([
            'name' => $validated['name'],
            'mobile_number' => $validated['mobile_number'] ?? null,
            'email' => $validated['email'] ?? null,
            'status' => $status,
            'guests_count' => $guestsCount > 0 ? $guestsCount : 1,
            'message' => $validated['message'] ?? null,
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
     * Ensure the RSVP form is included at the bottom of the HTML website.
     * Invitify wedding mini website RSVP fields:
     * 1. Guest Name
     * 2. Mobile Number
     * 3. Attendance Status (Yes, No, Maybe)
     * 4. Number of Guests
     * 5. Message for the Couple
     */
    private function ensureRsvpFormIncluded(string $html, MiniWebsite $website): string
    {
        // If RSVP section already present, return as is
        if (str_contains($html, 'id="invitify-rsvp-section"') || str_contains($html, 'name="mobile_number"')) {
            return $html;
        }

        $slug = e($website->slug);
        $rsvpAction = url("/mini-website/{$slug}/rsvp");
        $websiteTitle = e($website->title);

        $rsvpSnippet = <<<HTML
<!-- Invitify Premium RSVP Section -->
<!-- developed by dinesh tawade -->
<section id="invitify-rsvp-section" style="box-sizing: border-box; width: 100%; padding: 70px 16px; background: radial-gradient(circle at 50% 0%, #fffdf9 0%, #f7f3ec 60%, #eee6d9 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2c2723; position: relative;">
    
    <!-- Canvas Confetti Library -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>

    <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 28px; padding: 40px 32px; box-shadow: 0 25px 60px -15px rgba(184, 134, 11, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.28); position: relative; overflow: hidden;">
        
        <!-- Luxury Shimmer Border at Top -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #c59b27 0%, #f4d068 50%, #b38719 100%);"></div>
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 16px; background: #fbf6ec; color: #9b7824; border: 1px solid #ebd9aa; border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(155, 120, 36, 0.06);">
                <span>✨</span> <span>WEDDING RSVP</span> <span>✨</span>
            </div>
            <h2 style="margin: 0; font-size: 28px; font-weight: 800; color: #1a1612; letter-spacing: -0.5px; font-family: inherit;">
                Will You Attend?
            </h2>
            <p style="margin: 10px auto 0; font-size: 13px; color: #786f66; line-height: 1.6; max-width: 400px;">
                Please confirm your presence so we can reserve your seat and celebrate our special day together!
            </p>
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
                style="padding: 9px 20px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; color: #166534; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;"
            >
                Submit another response
            </button>
        </div>

        <form id="invitifyRsvpForm" action="{$rsvpAction}" method="POST" style="display: flex; flex-direction: column; gap: 20px;">
            
            <!-- 1. Guest Name -->
            <div>
                <label for="rsvp_name" style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #473e35; margin-bottom: 7px;">
                    <span>Guest Name</span>
                    <span style="color: #e11d48; font-size: 12px;">*</span>
                </label>
                <div style="position: relative;">
                    <input 
                        type="text" 
                        id="rsvp_name" 
                        name="name" 
                        required 
                        placeholder="Enter your full name" 
                        style="box-sizing: border-box; width: 100%; height: 48px; padding: 0 16px; border: 1.5px solid #e7ded2; border-radius: 14px; font-size: 14px; font-weight: 500; background: #faf8f5; color: #1e1b18; outline: none; transition: all 0.2s ease;"
                        onfocus="this.style.borderColor='#d4af37'; this.style.backgroundColor='#ffffff'; this.style.boxShadow='0 0 0 3px rgba(212,175,55,0.15)';" 
                        onblur="this.style.borderColor='#e7ded2'; this.style.backgroundColor='#faf8f5'; this.style.boxShadow='none';"
                    />
                </div>
            </div>

            <!-- 2. Mobile Number -->
            <div>
                <label for="rsvp_mobile" style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #473e35; margin-bottom: 7px;">
                    <span>Mobile Number</span>
                    <span style="color: #e11d48; font-size: 12px;">*</span>
                </label>
                <div style="position: relative;">
                    <input 
                        type="tel" 
                        id="rsvp_mobile" 
                        name="mobile_number" 
                        required 
                        maxlength="15"
                        placeholder="Enter 10-digit mobile number" 
                        style="box-sizing: border-box; width: 100%; height: 48px; padding: 0 16px; border: 1.5px solid #e7ded2; border-radius: 14px; font-size: 14px; font-weight: 500; background: #faf8f5; color: #1e1b18; outline: none; transition: all 0.2s ease;"
                        onfocus="this.style.borderColor='#d4af37'; this.style.backgroundColor='#ffffff'; this.style.boxShadow='0 0 0 3px rgba(212,175,55,0.15)';" 
                        onblur="this.style.borderColor='#e7ded2'; this.style.backgroundColor='#faf8f5'; this.style.boxShadow='none';"
                        oninput="this.value = this.value.replace(/[^0-9+]/g, '')"
                    />
                </div>
            </div>

            <!-- 3. Attendance Status (Interactive Cards) -->
            <div>
                <label style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #473e35; margin-bottom: 9px;">
                    <span>Attendance Status</span>
                    <span style="color: #e11d48; font-size: 12px;">*</span>
                </label>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    
                    <label id="statusLabelYes" class="rsvp-status-card" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 8px; border: 2px solid #10b981; border-radius: 14px; background: #ecfdf5; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(16,185,129,0.12);">
                        <input type="radio" name="status" value="yes" checked style="display: none;" onchange="handleRsvpStatusChange(this.value)" />
                        <span style="font-size: 20px; margin-bottom: 4px;">🎉</span>
                        <span style="font-size: 13px; font-weight: 800; color: #065f46;">Yes</span>
                        <span style="font-size: 10px; font-weight: 600; color: #059669; opacity: 0.9;">Attending</span>
                    </label>

                    <label id="statusLabelMaybe" class="rsvp-status-card" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 8px; border: 1.5px solid #e7ded2; border-radius: 14px; background: #faf8f5; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.85;">
                        <input type="radio" name="status" value="maybe" style="display: none;" onchange="handleRsvpStatusChange(this.value)" />
                        <span style="font-size: 20px; margin-bottom: 4px;">🤔</span>
                        <span style="font-size: 13px; font-weight: 800; color: #473e35;">Maybe</span>
                        <span style="font-size: 10px; font-weight: 600; color: #786f66;">Not sure yet</span>
                    </label>

                    <label id="statusLabelNo" class="rsvp-status-card" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 8px; border: 1.5px solid #e7ded2; border-radius: 14px; background: #faf8f5; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.85;">
                        <input type="radio" name="status" value="no" style="display: none;" onchange="handleRsvpStatusChange(this.value)" />
                        <span style="font-size: 20px; margin-bottom: 4px;">💌</span>
                        <span style="font-size: 13px; font-weight: 800; color: #473e35;">No</span>
                        <span style="font-size: 10px; font-weight: 600; color: #786f66;">Can't make it</span>
                    </label>

                </div>
            </div>

            <!-- 4. Number of Guests (Dynamic) -->
            <div id="rsvpGuestsCountWrapper" style="transition: all 0.3s ease;">
                <label for="rsvp_guests" style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #473e35; margin-bottom: 7px;">
                    Number of Guests (Including you)
                </label>
                <div style="position: relative;">
                    <select 
                        id="rsvp_guests" 
                        name="guests_count" 
                        style="box-sizing: border-box; width: 100%; height: 48px; padding: 0 16px; border: 1.5px solid #e7ded2; border-radius: 14px; font-size: 14px; font-weight: 600; background: #faf8f5; color: #1e1b18; outline: none; transition: all 0.2s ease; cursor: pointer;"
                        onfocus="this.style.borderColor='#d4af37'; this.style.backgroundColor='#ffffff'; this.style.boxShadow='0 0 0 3px rgba(212,175,55,0.15)';" 
                        onblur="this.style.borderColor='#e7ded2'; this.style.backgroundColor='#faf8f5'; this.style.boxShadow='none';"
                    >
                        <option value="1">👤 1 Person</option>
                        <option value="2">👥 2 People</option>
                        <option value="3">👨‍👩‍👧 3 People</option>
                        <option value="4">👨‍👩‍👧‍👦 4 People</option>
                        <option value="5">🎉 5+ People</option>
                    </select>
                </div>
            </div>

            <!-- 5. Message for the Couple -->
            <div>
                <label for="rsvp_message" style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #473e35; margin-bottom: 7px;">
                    Message for the Couple
                </label>
                <textarea 
                    id="rsvp_message" 
                    name="message" 
                    rows="3" 
                    placeholder="Warm wishes or blessings for the couple..." 
                    style="box-sizing: border-box; width: 100%; padding: 14px 16px; border: 1.5px solid #e7ded2; border-radius: 14px; font-size: 14px; font-weight: 500; background: #faf8f5; color: #1e1b18; outline: none; transition: all 0.2s ease; resize: vertical; min-height: 85px;"
                    onfocus="this.style.borderColor='#d4af37'; this.style.backgroundColor='#ffffff'; this.style.boxShadow='0 0 0 3px rgba(212,175,55,0.15)';" 
                    onblur="this.style.borderColor='#e7ded2'; this.style.backgroundColor='#faf8f5'; this.style.boxShadow='none';"
                ></textarea>
            </div>

            <!-- Submit Button -->
            <button 
                type="submit" 
                id="rsvpSubmitBtn" 
                style="box-sizing: border-box; width: 100%; height: 50px; margin-top: 6px; border: none; border-radius: 14px; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #ffffff; font-size: 15px; font-weight: 800; letter-spacing: 0.8px; cursor: pointer; box-shadow: 0 10px 25px -5px rgba(184,134,11,0.4); transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; text-transform: uppercase;"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 14px 28px -4px rgba(184,134,11,0.48)';"
                onmouseout="this.style.transform='none'; this.style.boxShadow='0 10px 25px -5px rgba(184,134,11,0.4)';"
            >
                Confirm RSVP
            </button>

            <!-- Inline Error / Status Message Container -->
            <div id="rsvpFeedbackMsg" style="display: none; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; text-align: center;"></div>

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
function handleRsvpStatusChange(val) {
    var wrapper = document.getElementById('rsvpGuestsCountWrapper');
    var labelYes = document.getElementById('statusLabelYes');
    var labelMaybe = document.getElementById('statusLabelMaybe');
    var labelNo = document.getElementById('statusLabelNo');

    // Reset all cards
    [labelYes, labelMaybe, labelNo].forEach(function(l) {
        if (!l) return;
        l.style.border = '1.5px solid #e7ded2';
        l.style.background = '#faf8f5';
        l.style.boxShadow = 'none';
        l.style.opacity = '0.85';
    });

    if (val === 'yes' && labelYes) {
        labelYes.style.border = '2px solid #10b981';
        labelYes.style.background = '#ecfdf5';
        labelYes.style.boxShadow = '0 4px 12px rgba(16,185,129,0.15)';
        labelYes.style.opacity = '1';
        if (wrapper) wrapper.style.display = 'block';
    } else if (val === 'maybe' && labelMaybe) {
        labelMaybe.style.border = '2px solid #f59e0b';
        labelMaybe.style.background = '#fffbeb';
        labelMaybe.style.boxShadow = '0 4px 12px rgba(245,158,11,0.15)';
        labelMaybe.style.opacity = '1';
        if (wrapper) wrapper.style.display = 'block';
    } else if (val === 'no' && labelNo) {
        labelNo.style.border = '2px solid #f43f5e';
        labelNo.style.background = '#fff1f2';
        labelNo.style.boxShadow = '0 4px 12px rgba(244,63,94,0.15)';
        labelNo.style.opacity = '1';
        if (wrapper) wrapper.style.display = 'none';
    }
}

function fireCelebrationConfetti() {
    if (typeof confetti === 'function') {
        // Multi-burst celebration
        var count = 200;
        var defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
            colors: ['#d4af37', '#ffd700', '#f59e0b']
        });
        fire(0.2, {
            spread: 60,
            colors: ['#10b981', '#34d399', '#059669']
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            colors: ['#e11d48', '#ec4899', '#f43f5e']
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
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
            // Trigger Confetti Celebration!
            fireCelebrationConfetti();

            // Show celebratory success card
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
            handleRsvpStatusChange('yes');
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
