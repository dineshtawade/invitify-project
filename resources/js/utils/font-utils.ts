// developed by dinesh tawade
export const GOOGLE_FONTS_API_KEY = 'AIzaSyCax7_ByTHjC6n8W84MoV3O3brPFZlJwgM';

export interface GoogleFontItem {
    family: string;
    category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
    variants?: string[];
    isPopularWedding?: boolean;
}

// Legacy shorthand font keys mapped to proper Google Font names and CSS
export const LEGACY_FONT_MAP: Record<string, { family: string; css: string; label: string; category: GoogleFontItem['category'] }> = {
    playfair: { family: 'Playfair Display', css: "'Playfair Display', serif", label: 'Playfair Display (Serif)', category: 'serif' },
    vibes: { family: 'Great Vibes', css: "'Great Vibes', cursive", label: 'Great Vibes (Calligraphy)', category: 'handwriting' },
    montserrat: { family: 'Montserrat', css: "'Montserrat', sans-serif", label: 'Montserrat (Modern)', category: 'sans-serif' },
    cinzel: { family: 'Cinzel', css: "'Cinzel', serif", label: 'Cinzel (Classic)', category: 'serif' },
    dancing: { family: 'Dancing Script', css: "'Dancing Script', cursive", label: 'Dancing Script (Cursive)', category: 'handwriting' },
    alex: { family: 'Alex Brush', css: "'Alex Brush', cursive", label: 'Alex Brush (Elegant Calligraphy)', category: 'handwriting' },
    outfit: { family: 'Outfit', css: "'Outfit', sans-serif", label: 'Outfit (Geometric Sans)', category: 'sans-serif' },
    parisienne: { family: 'Parisienne', css: "'Parisienne', cursive", label: 'Parisienne (Romantic Cursive)', category: 'handwriting' },
    cormorant: { family: 'Cormorant Garamond', css: "'Cormorant Garamond', serif", label: 'Cormorant Garamond (Fine Serif)', category: 'serif' },
    pinyon: { family: 'Pinyon Script', css: "'Pinyon Script', cursive", label: 'Pinyon Script (Traditional Script)', category: 'handwriting' },
    lora: { family: 'Lora', css: "'Lora', serif", label: 'Lora (Elegant Serif)', category: 'serif' },
    merriweather: { family: 'Merriweather', css: "'Merriweather', serif", label: 'Merriweather (Classic Serif)', category: 'serif' },
    poppins: { family: 'Poppins', css: "'Poppins', sans-serif", label: 'Poppins (Modern Sans)', category: 'sans-serif' },
    pacifico: { family: 'Pacifico', css: "'Pacifico', cursive", label: 'Pacifico (Fun Cursive)', category: 'handwriting' },
    sacramento: { family: 'Sacramento', css: "'Sacramento', cursive", label: 'Sacramento (Delicate Script)', category: 'handwriting' },
};

// Curated top wedding & invitation fonts from Google Fonts for instant loading
export const CURATED_WEDDING_FONTS: GoogleFontItem[] = [
    { family: 'Great Vibes', category: 'handwriting', isPopularWedding: true },
    { family: 'Playfair Display', category: 'serif', isPopularWedding: true },
    { family: 'Dancing Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Alex Brush', category: 'handwriting', isPopularWedding: true },
    { family: 'Cinzel', category: 'serif', isPopularWedding: true },
    { family: 'Parisienne', category: 'handwriting', isPopularWedding: true },
    { family: 'Cormorant Garamond', category: 'serif', isPopularWedding: true },
    { family: 'Pinyon Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Allura', category: 'handwriting', isPopularWedding: true },
    { family: 'Montserrat', category: 'sans-serif', isPopularWedding: true },
    { family: 'Tangerine', category: 'handwriting', isPopularWedding: true },
    { family: 'Sacramento', category: 'handwriting', isPopularWedding: true },
    { family: 'Cinzel Decorative', category: 'display', isPopularWedding: true },
    { family: 'Bodoni Moda', category: 'serif', isPopularWedding: true },
    { family: 'Prata', category: 'serif', isPopularWedding: true },
    { family: 'Marck Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Italianno', category: 'handwriting', isPopularWedding: true },
    { family: 'MonteCarlo', category: 'handwriting', isPopularWedding: true },
    { family: 'Petit Formal Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Herr Von Muellerhoff', category: 'handwriting', isPopularWedding: true },
    { family: 'Rochester', category: 'handwriting', isPopularWedding: true },
    { family: 'Ruthie', category: 'handwriting', isPopularWedding: true },
    { family: 'Qwigley', category: 'handwriting', isPopularWedding: true },
    { family: 'Lovers Quarrel', category: 'handwriting', isPopularWedding: true },
    { family: 'Mrs Saint Delafield', category: 'handwriting', isPopularWedding: true },
    { family: 'WindSong', category: 'handwriting', isPopularWedding: true },
    { family: 'Mea Culpa', category: 'handwriting', isPopularWedding: true },
    { family: 'Marcellus', category: 'serif', isPopularWedding: true },
    { family: 'EB Garamond', category: 'serif', isPopularWedding: true },
    { family: 'Castoro Titling', category: 'serif', isPopularWedding: true },
    { family: 'Playball', category: 'display', isPopularWedding: true },
    { family: 'Kaushan Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Caveat', category: 'handwriting', isPopularWedding: true },
    { family: 'Kalam', category: 'handwriting', isPopularWedding: true },
    { family: 'Outfit', category: 'sans-serif', isPopularWedding: true },
    { family: 'Poppins', category: 'sans-serif', isPopularWedding: true },
    { family: 'Inter', category: 'sans-serif', isPopularWedding: true },
    { family: 'Lora', category: 'serif', isPopularWedding: true },
    { family: 'Merriweather', category: 'serif', isPopularWedding: true },
    { family: 'Pacifico', category: 'handwriting', isPopularWedding: true },
    { family: 'Abril Fatface', category: 'display', isPopularWedding: true },
    { family: 'Lobster Two', category: 'display', isPopularWedding: true },
    { family: 'Satisfy', category: 'handwriting', isPopularWedding: true },
    { family: 'Cookie', category: 'handwriting', isPopularWedding: true },
    { family: 'Yellowtail', category: 'handwriting', isPopularWedding: true },
    { family: 'Bad Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Grand Hotel', category: 'handwriting', isPopularWedding: true },
    { family: 'Rouge Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Clicker Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Niconne', category: 'handwriting', isPopularWedding: true },
    { family: 'Mr De Haviland', category: 'handwriting', isPopularWedding: true },
    { family: 'Euphoria Script', category: 'handwriting', isPopularWedding: true },
    { family: 'Playfair Display SC', category: 'serif', isPopularWedding: true },
    { family: 'Cinzel Decorative', category: 'display', isPopularWedding: true },
    { family: 'Cormorant Upright', category: 'serif', isPopularWedding: true },
    { family: 'Cormorant Infant', category: 'serif', isPopularWedding: true },
    { family: 'Cormorant SC', category: 'serif', isPopularWedding: true },
    { family: 'Lavishly Yours', category: 'handwriting', isPopularWedding: true },
    { family: 'Ephesis', category: 'handwriting', isPopularWedding: true },
    { family: 'Cherish', category: 'handwriting', isPopularWedding: true },
    { family: 'Bonheur Royale', category: 'handwriting', isPopularWedding: true },
    { family: 'Fleur De Leah', category: 'handwriting', isPopularWedding: true },
];

const loadedFontsSet = new Set<string>();

/**
 * Dynamically loads a Google Font into document.head via the Google Fonts CSS2 API.
 */
export function loadGoogleFont(fontName?: string): void {
    if (!fontName || typeof document === 'undefined') return;

    const family = getFontFamilyName(fontName);
    if (!family || loadedFontsSet.has(family)) return;
    loadedFontsSet.add(family);

    const safeId = `gfont-${family.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    if (document.getElementById(safeId)) return;

    // Ensure preconnect to fonts.googleapis.com and fonts.gstatic.com
    if (!document.getElementById('gfonts-preconnect-api')) {
        const link1 = document.createElement('link');
        link1.id = 'gfonts-preconnect-api';
        link1.rel = 'preconnect';
        link1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(link1);

        const link2 = document.createElement('link');
        link2.id = 'gfonts-preconnect-static';
        link2.rel = 'preconnect';
        link2.href = 'https://fonts.gstatic.com';
        link2.crossOrigin = 'anonymous';
        document.head.appendChild(link2);
    }

    const fontLink = document.createElement('link');
    fontLink.id = safeId;
    fontLink.rel = 'stylesheet';
    // Load common weights & italics
    fontLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&display=swap`;
    document.head.appendChild(fontLink);
}

/**
 * Batch load multiple Google fonts
 */
export function loadGoogleFonts(fontNames: (string | undefined)[]): void {
    fontNames.forEach((f) => {
        if (f) loadGoogleFont(f);
    });
}

/**
 * Returns the clean font family name (e.g. "Great Vibes", "Playfair Display")
 */
export function getFontFamilyName(fontStyle?: string): string {
    if (!fontStyle) return 'Playfair Display';

    const normalized = fontStyle.toLowerCase().trim();
    if (LEGACY_FONT_MAP[normalized]) {
        return LEGACY_FONT_MAP[normalized].family;
    }

    // Clean quotes or commas
    return fontStyle.replace(/['"]/g, '').split(',')[0].trim();
}

/**
 * Returns the CSS font-family property string
 * e.g. "'Great Vibes', cursive", "'Playfair Display', serif"
 */
export function getFontFamilyCss(fontStyle?: string): string {
    if (!fontStyle) return "'Playfair Display', serif";

    const normalized = fontStyle.toLowerCase().trim();
    if (LEGACY_FONT_MAP[normalized]) {
        return LEGACY_FONT_MAP[normalized].css;
    }

    // If it already has quotes and fallback (e.g. "'Roboto', sans-serif")
    if (fontStyle.includes(',')) {
        return fontStyle;
    }

    const clean = fontStyle.replace(/['"]/g, '').trim();

    // Check if it matches any curated font category for a better fallback
    const matched = CURATED_WEDDING_FONTS.find(f => f.family.toLowerCase() === clean.toLowerCase());
    const fallback = matched?.category === 'handwriting' 
        ? 'cursive' 
        : matched?.category === 'serif' 
            ? 'serif' 
            : 'sans-serif';

    return `'${clean}', ${fallback}`;
}

const STORAGE_CACHE_KEY = 'invitify_google_fonts_list_v2';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Fetches the full Google Fonts library using the developer API key.
 * Caches in localStorage for instant access.
 */
export async function fetchGoogleFonts(): Promise<GoogleFontItem[]> {
    if (typeof window === 'undefined') return CURATED_WEDDING_FONTS;

    try {
        const cached = localStorage.getItem(STORAGE_CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_EXPIRY_MS && Array.isArray(parsed.fonts)) {
                return parsed.fonts;
            }
        }
    } catch (e) {
        // localStorage error, ignore
    }

    try {
        const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`);
        if (!res.ok) {
            console.warn('Google Fonts API returned status', res.status);
            return CURATED_WEDDING_FONTS;
        }

        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
            const weddingFamilySet = new Set(CURATED_WEDDING_FONTS.map(f => f.family.toLowerCase()));
            
            const fonts: GoogleFontItem[] = data.items.map((item: any) => ({
                family: item.family,
                category: (item.category || 'sans-serif') as GoogleFontItem['category'],
                variants: item.variants || [],
                isPopularWedding: weddingFamilySet.has((item.family || '').toLowerCase()),
            }));

            // Save to cache
            try {
                localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    fonts,
                }));
            } catch (e) {
                // Ignore storage quota
            }

            return fonts;
        }
    } catch (error) {
        console.error('Failed to fetch Google Fonts API', error);
    }

    return CURATED_WEDDING_FONTS;
}
