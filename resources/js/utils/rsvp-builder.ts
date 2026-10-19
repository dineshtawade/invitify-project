// developed by dinesh tawade

export interface RsvpOption {
    label: string;
    value: string;
    icon?: string;
    subtext?: string;
}

export interface RsvpQuestion {
    id: string;
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'options';
    required: boolean;
    placeholder?: string;
    display_style?: 'cards' | 'list';
    options?: RsvpOption[];
    is_system?: boolean;
}

export interface RsvpConfig {
    enabled: boolean;
    heading?: string;
    subheading?: string;
    badge?: string;
    questions: RsvpQuestion[];
}

export const DEFAULT_RSVP_QUESTIONS: RsvpQuestion[] = [
    {
        id: 'q_name',
        key: 'name',
        label: 'Guest Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name',
        is_system: true,
    },
    {
        id: 'q_mobile',
        key: 'mobile_number',
        label: 'Mobile Number',
        type: 'text',
        required: true,
        placeholder: 'Enter 10-digit mobile number',
        is_system: true,
    },
    {
        id: 'q_status',
        key: 'status',
        label: 'Attendance Status',
        type: 'options',
        required: true,
        display_style: 'cards',
        options: [
            { label: 'Yes', value: 'yes', icon: '🎉', subtext: 'Attending' },
            { label: 'Maybe', value: 'maybe', icon: '🤔', subtext: 'Not sure yet' },
            { label: 'No', value: 'no', icon: '💌', subtext: "Can't make it" },
        ],
        is_system: true,
    },
    {
        id: 'q_guests',
        key: 'guests_count',
        label: 'Number of Guests (Including you)',
        type: 'options',
        required: false,
        display_style: 'list',
        options: [
            { label: '1 Person', value: '1', icon: '👤', subtext: 'Solo guest' },
            { label: '2 People', value: '2', icon: '👥', subtext: 'Couple' },
            { label: '3 People', value: '3', icon: '👨‍👩‍👧', subtext: 'Family' },
            { label: '4 People', value: '4', icon: '👨‍👩‍👧‍👦', subtext: 'Family' },
            { label: '5+ People', value: '5', icon: '🎉', subtext: 'Group' },
        ],
        is_system: true,
    },
    {
        id: 'q_message',
        key: 'message',
        label: 'Message for the Couple',
        type: 'textarea',
        required: false,
        placeholder: 'Warm wishes or blessings for the couple...',
        is_system: true,
    },
];

export const DEFAULT_RSVP_CONFIG: RsvpConfig = {
    enabled: true,
    heading: 'Will You Attend?',
    subheading: 'Please confirm your presence so we can reserve your seat and celebrate our special day together!',
    badge: 'WEDDING RSVP',
    questions: DEFAULT_RSVP_QUESTIONS,
};

export function normalizeRsvpConfig(rawRsvp: any): RsvpConfig {
    if (!rawRsvp || typeof rawRsvp !== 'object') {
        return { ...DEFAULT_RSVP_CONFIG };
    }

    const enabled = rawRsvp.enabled !== false;
    const heading = rawRsvp.heading || DEFAULT_RSVP_CONFIG.heading;
    const subheading = rawRsvp.subheading || DEFAULT_RSVP_CONFIG.subheading;
    const badge = rawRsvp.badge || DEFAULT_RSVP_CONFIG.badge;

    let questions: RsvpQuestion[] = [];
    if (Array.isArray(rawRsvp.questions) && rawRsvp.questions.length > 0) {
        questions = rawRsvp.questions.map((q: any, idx: number) => ({
            id: q.id || `q_${idx}_${Date.now()}`,
            key: q.key || `custom_${idx}`,
            label: q.label || `Question ${idx + 1}`,
            type: q.type === 'options' || q.type === 'textarea' ? q.type : 'text',
            required: Boolean(q.required),
            placeholder: q.placeholder || '',
            display_style: q.display_style === 'list' ? 'list' : 'cards',
            options: Array.isArray(q.options)
                ? q.options.map((opt: any) => ({
                      label: typeof opt === 'string' ? opt : opt.label || '',
                      value: typeof opt === 'string' ? opt : opt.value || opt.label || '',
                      icon: typeof opt === 'object' ? opt.icon || '' : '',
                      subtext: typeof opt === 'object' ? opt.subtext || '' : '',
                  }))
                : [],
            is_system: Boolean(q.is_system),
        }));
    } else {
        questions = [...DEFAULT_RSVP_QUESTIONS];
    }

    return {
        enabled,
        heading,
        subheading,
        badge,
        questions,
    };
}

/**
 * Remove any existing RSVP section from HTML
 */
export function stripRsvpSection(html: string): string {
    let clean = html || '';
    clean = clean.replace(/<!-- Invitify Premium RSVP Section -->[\s\S]*?<\/section>/gi, '');
    clean = clean.replace(/<section[^>]*id=["']invitify-rsvp-section["'][\s\S]*?<\/section>/gi, '');
    return clean;
}

/**
 * Generate just the RSVP HTML section snippet with website font & background inheritance
 */
export function generateRsvpSectionSnippet(rsvpConfig?: RsvpConfig): string {
    const config = normalizeRsvpConfig(rsvpConfig);
    if (!config.enabled) return '';

    // Build the dynamic questions HTML
    const questionsHtml = config.questions.map((q, qIndex) => {
        const inputName = q.is_system && (q.key === 'name' || q.key === 'mobile_number' || q.key === 'status' || q.key === 'guests_count' || q.key === 'message')
            ? q.key
            : `answers[${q.key}]`;

        const requiredMarker = q.required ? '<span style="color: #e11d48; font-size: 13px; margin-left: 2px;">*</span>' : '';

        if (q.type === 'text') {
            return `
            <div style="margin-bottom: 18px;">
                <label class="rsvp-label" style="display: flex; justify-content: space-between; font-family: inherit; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: inherit; opacity: 0.88; margin-bottom: 7px;">
                    <span>${escapeHtml(q.label)} ${requiredMarker}</span>
                </label>
                <input 
                    type="text" 
                    name="${inputName}" 
                    class="rsvp-input-field"
                    ${q.required ? 'required' : ''} 
                    placeholder="${escapeHtml(q.placeholder || 'Enter ' + q.label)}" 
                    style="box-sizing: border-box; width: 100%; height: 48px; padding: 0 16px; border: 1.5px solid rgba(0,0,0,0.12); border-radius: 14px; font-family: inherit; font-size: 14px; font-weight: 500; background: rgba(255,255,255,0.75); color: inherit; outline: none; transition: all 0.2s ease;"
                />
            </div>`;
        }

        if (q.type === 'textarea') {
            return `
            <div style="margin-bottom: 18px;">
                <label class="rsvp-label" style="display: flex; justify-content: space-between; font-family: inherit; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: inherit; opacity: 0.88; margin-bottom: 7px;">
                    <span>${escapeHtml(q.label)} ${requiredMarker}</span>
                </label>
                <textarea 
                    name="${inputName}" 
                    class="rsvp-input-field"
                    rows="3" 
                    ${q.required ? 'required' : ''} 
                    placeholder="${escapeHtml(q.placeholder || 'Your response...')}" 
                    style="box-sizing: border-box; width: 100%; padding: 14px 16px; border: 1.5px solid rgba(0,0,0,0.12); border-radius: 14px; font-family: inherit; font-size: 14px; font-weight: 500; background: rgba(255,255,255,0.75); color: inherit; outline: none; transition: all 0.2s ease; resize: vertical; min-height: 80px;"
                ></textarea>
            </div>`;
        }

        if (q.type === 'options') {
            const options = q.options || [];
            const isCards = q.display_style !== 'list';
            const groupClass = `rsvp-group-${q.id || qIndex}`;

            if (isCards) {
                const cardsHtml = options.map((opt, optIdx) => {
                    const isFirst = optIdx === 0;
                    return `
                    <label class="rsvp-option-card ${groupClass} ${isFirst ? 'is-selected' : ''}" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 10px; border: ${isFirst ? '2px solid #10b981' : '1.5px solid rgba(0,0,0,0.12)'}; border-radius: 14px; background: ${isFirst ? 'rgba(236,253,245,0.9)' : 'rgba(255,255,255,0.7)'}; transition: all 0.2s ease; text-align: center; box-shadow: ${isFirst ? '0 4px 12px rgba(16,185,129,0.15)' : 'none'}; opacity: ${isFirst ? '1' : '0.85'}; font-family: inherit;">
                        <input type="radio" name="${inputName}" value="${escapeHtml(opt.value)}" ${isFirst ? 'checked' : ''} style="display: none;" onchange="handleRsvpCardSelect(this, '${groupClass}')" />
                        ${opt.icon ? `<span style="font-size: 20px; margin-bottom: 4px;">${opt.icon}</span>` : ''}
                        <span class="rsvp-opt-title" style="font-size: 13px; font-weight: 700; color: inherit; font-family: inherit;">${escapeHtml(opt.label)}</span>
                        ${opt.subtext ? `<span class="rsvp-opt-sub" style="font-size: 10px; font-weight: 500; opacity: 0.7; margin-top: 2px; font-family: inherit;">${escapeHtml(opt.subtext)}</span>` : ''}
                    </label>`;
                }).join('');

                return `
                <div style="margin-bottom: 18px;">
                    <label class="rsvp-label" style="display: flex; justify-content: space-between; font-family: inherit; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: inherit; opacity: 0.88; margin-bottom: 9px;">
                        <span>${escapeHtml(q.label)} ${requiredMarker}</span>
                        <span style="font-size: 10px; font-weight: 700; color: #b8860b; text-transform: uppercase;">Cards Style</span>
                    </label>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(95px, 1fr)); gap: 10px;">
                        ${cardsHtml}
                    </div>
                </div>`;
            } else {
                // List Style
                const listHtml = options.map((opt, optIdx) => {
                    const isFirst = optIdx === 0;
                    return `
                    <label class="rsvp-list-card ${groupClass} ${isFirst ? 'is-selected' : ''}" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: ${isFirst ? '2px solid #10b981' : '1.5px solid rgba(0,0,0,0.12)'}; border-radius: 12px; background: ${isFirst ? 'rgba(236,253,245,0.9)' : 'rgba(255,255,255,0.7)'}; transition: all 0.2s ease; font-family: inherit;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            ${opt.icon ? `<span style="font-size: 16px;">${opt.icon}</span>` : ''}
                            <div>
                                <div class="rsvp-opt-title" style="font-size: 13px; font-weight: 700; color: inherit; font-family: inherit;">${escapeHtml(opt.label)}</div>
                                ${opt.subtext ? `<div class="rsvp-opt-sub" style="font-size: 10px; font-weight: 500; opacity: 0.7; font-family: inherit;">${escapeHtml(opt.subtext)}</div>` : ''}
                            </div>
                        </div>
                        <div class="rsvp-radio-circle" style="width: 18px; height: 18px; border-radius: 50%; border: 2px solid ${isFirst ? '#10b981' : 'rgba(0,0,0,0.25)'}; background: ${isFirst ? '#10b981' : 'transparent'}; display: flex; align-items: center; justify-content: center;">
                            ${isFirst ? '<div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>' : ''}
                        </div>
                        <input type="radio" name="${inputName}" value="${escapeHtml(opt.value)}" ${isFirst ? 'checked' : ''} style="display: none;" onchange="handleRsvpListSelect(this, '${groupClass}')" />
                    </label>`;
                }).join('');

                return `
                <div style="margin-bottom: 18px;">
                    <label class="rsvp-label" style="display: flex; justify-content: space-between; font-family: inherit; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: inherit; opacity: 0.88; margin-bottom: 9px;">
                        <span>${escapeHtml(q.label)} ${requiredMarker}</span>
                        <span style="font-size: 10px; font-weight: 700; color: #6366f1; text-transform: uppercase;">List Style</span>
                    </label>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${listHtml}
                    </div>
                </div>`;
            }
        }

        return '';
    }).join('\n');

    return `
<!-- Invitify Premium RSVP Section -->
<!-- developed by dinesh tawade -->
<section id="invitify-rsvp-section" style="box-sizing: border-box; width: 100%; padding: 70px 16px 90px; background: transparent; font-family: inherit; color: inherit; position: relative;">
    <div class="invitify-rsvp-card" style="box-sizing: border-box; max-width: 520px; margin: 0 auto; background: rgba(255, 255, 255, 0.90); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border-radius: 28px; padding: 38px 28px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.28); position: relative; overflow: hidden; font-family: inherit; color: inherit;">
        
        <!-- Gold Luxury Accent Bar -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #c59b27 0%, #f4d068 50%, #b38719 100%);"></div>
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 26px;">
            ${config.badge ? `
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; background: rgba(212, 175, 55, 0.12); color: #9b7824; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 999px; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; font-family: inherit;">
                <span>✨</span> <span>${escapeHtml(config.badge)}</span> <span>✨</span>
            </div>` : ''}
            <h2 class="rsvp-heading" style="margin: 0; font-family: inherit; font-size: 28px; font-weight: 700; color: inherit; letter-spacing: -0.3px;">
                ${escapeHtml(config.heading || 'Will You Attend?')}
            </h2>
            ${config.subheading ? `
            <p class="rsvp-subheading" style="margin: 8px auto 0; font-family: inherit; font-size: 13px; color: inherit; opacity: 0.75; line-height: 1.5; max-width: 420px;">
                ${escapeHtml(config.subheading)}
            </p>` : ''}
        </div>

        <form id="invitifyRsvpForm" onsubmit="event.preventDefault(); alert('In template preview: RSVP form is functional and fully interactive!'); return false;" style="display: flex; flex-direction: column;">
            ${questionsHtml}

            <!-- Submit Button -->
            <button 
                type="submit" 
                style="box-sizing: border-box; width: 100%; height: 50px; margin-top: 10px; border: none; border-radius: 14px; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #ffffff; font-family: inherit; font-size: 14px; font-weight: 800; letter-spacing: 1px; cursor: pointer; box-shadow: 0 10px 25px -5px rgba(184,134,11,0.4); transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; text-transform: uppercase;"
            >
                Confirm RSVP
            </button>
        </form>
    </div>
</section>

<script>
function handleRsvpCardSelect(radio, groupClass) {
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

function handleRsvpListSelect(radio, groupClass) {
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
window.adaptRsvpTheme = adaptRsvpTheme;
</script>
`;
}

/**
 * Generate preview HTML with dynamic RSVP form injected or removed
 */
export function generateRsvpPreviewHtml(baseHtml: string, rsvpConfig?: RsvpConfig): string {
    let html = baseHtml || '<div style="padding:40px;text-align:center;font-family:sans-serif;color:#888;">Preview website will appear here</div>';

    // Strip any existing invitify-rsvp-section
    html = stripRsvpSection(html);

    const config = normalizeRsvpConfig(rsvpConfig);

    // If RSVP is disabled, return clean HTML without RSVP
    if (!config.enabled) {
        return html;
    }

    const rsvpSnippet = generateRsvpSectionSnippet(config);

    // Append RSVP section before closing body or at the end
    if (html.includes('</body>')) {
        return html.replace('</body>', `${rsvpSnippet}\n</body>`);
    }

    return `${html}\n${rsvpSnippet}`;
}

function escapeHtml(str: string): string {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
