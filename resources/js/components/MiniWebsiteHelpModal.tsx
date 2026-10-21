// developed by dinesh tawade
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
    HelpCircle, Copy, Check, BookOpen, Code2, Sparkles, 
    Clock, Music, MapPin, Heart, Layers, CheckCircle2 
} from 'lucide-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function MiniWebsiteHelpModal({ open, onOpenChange }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'placeholders' | 'rsvp' | 'snippets' | 'starter'>('overview');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const placeholders = [
        { key: '{{bride_name}}', desc: "दुल्हन का नाम (Bride's Name)", example: 'Priya Sharma' },
        { key: '{{groom_name}}', desc: "दूल्हे का नाम (Groom's Name)", example: 'Rahul Verma' },
        { key: '{{couple_names}}', desc: 'दोनों के नाम (Combined Couple Names)', example: 'Rahul & Priya' },
        { key: '{{wedding_date}}', desc: 'शादी / कार्यक्रम की तारीख (Event Date)', example: '25 December 2026' },
        { key: '{{wedding_time}}', desc: 'समय या मुहुर्त (Event Time)', example: '07:00 PM onwards' },
        { key: '{{venue_name}}', desc: 'हॉल / रिसॉर्ट / वेन्यू का नाम (Venue Name)', example: 'The Grand Palace Resort' },
        { key: '{{venue_address}}', desc: 'वेन्यू का पूरा पता (Venue Address)', example: 'Near Lake View, Udaipur, Rajasthan' },
        { key: '{{map_url}}', desc: 'गूगल मैप्स लोकेशन लिंक (Google Maps Directions Link)', example: 'https://maps.google.com/?q=...' },
        { key: '{{hero_image}}', desc: 'मेन कवर फोटो URL (Hero Banner Image)', example: 'https://images.unsplash.com/...' },
        { key: '{{story}}', desc: 'कपल की लव स्टोरी या विवरण (Story / Message)', example: 'Two hearts, one love story...' },
        { key: '{{rsvp_phone}}', desc: 'संपर्क / RSVP मोबाइल नंबर (Contact Phone)', example: '+91 9876543210' },
    ];

    const musicSnippet = `<!-- Background Music Player Snippet -->
<div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
    <button id="musicToggleBtn" onclick="toggleAudio()" style="width: 48px; height: 48px; border-radius: 50%; background: #ffffff; border: 1.5px solid #d4af37; box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer;">
        🎵
    </button>
    <audio id="bgAudio" loop src="https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-flute-and-piano-634.mp3"></audio>
</div>
<script>
var audio = document.getElementById('bgAudio');
var btn = document.getElementById('musicToggleBtn');
function toggleAudio() {
    if (audio.paused) {
        audio.play();
        btn.innerHTML = '⏸️';
    } else {
        audio.pause();
        btn.innerHTML = '🎵';
    }
}
</script>`;

    const countdownSnippet = `<!-- Countdown Timer Snippet -->
<div style="display: flex; justify-content: center; gap: 15px; margin: 40px auto; flex-wrap: wrap;">
    <div style="min-width: 75px; padding: 15px 12px; background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border-radius: 14px; text-align: center; border: 1px solid rgba(212,175,55,0.3);">
        <span id="cdDays" style="font-size: 28px; font-weight: 800; display: block; color: #1e1b18;">00</span>
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #887e74;">Days</span>
    </div>
    <div style="min-width: 75px; padding: 15px 12px; background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border-radius: 14px; text-align: center; border: 1px solid rgba(212,175,55,0.3);">
        <span id="cdHours" style="font-size: 28px; font-weight: 800; display: block; color: #1e1b18;">00</span>
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #887e74;">Hours</span>
    </div>
    <div style="min-width: 75px; padding: 15px 12px; background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border-radius: 14px; text-align: center; border: 1px solid rgba(212,175,55,0.3);">
        <span id="cdMins" style="font-size: 28px; font-weight: 800; display: block; color: #1e1b18;">00</span>
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #887e74;">Mins</span>
    </div>
    <div style="min-width: 75px; padding: 15px 12px; background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border-radius: 14px; text-align: center; border: 1px solid rgba(212,175,55,0.3);">
        <span id="cdSecs" style="font-size: 28px; font-weight: 800; display: block; color: #1e1b18;">00</span>
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #887e74;">Secs</span>
    </div>
</div>
<script>
var targetDate = new Date("{{wedding_date}}").getTime() || (Date.now() + 30*24*60*60*1000);
setInterval(function() {
    var now = new Date().getTime();
    var diff = targetDate - now;
    if (diff > 0) {
        document.getElementById("cdDays").innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById("cdHours").innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById("cdMins").innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("cdSecs").innerText = Math.floor((diff % (1000 * 60)) / 1000);
    }
}, 1000);
</script>`;

    const starterTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{bride_name}} & {{groom_name}} - Wedding Invitation</title>
    <!-- Google Luxury Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { 
            font-family: 'Montserrat', sans-serif; 
            background: #faf7f2; 
            color: #38302a; 
            overflow-x: hidden; 
            line-height: 1.6;
        }
        h1, h2, h3 { font-family: 'Cormorant Garamond', serif; }
        
        .hero {
            min-height: 90vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 60px 20px;
            background: radial-gradient(circle at 50% 30%, #fffbf5 0%, #f4ede1 100%);
            position: relative;
        }
        .hero-badge {
            display: inline-block;
            font-size: 11px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #9a7620;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .hero h1 {
            font-size: clamp(48px, 9vw, 84px);
            font-weight: 400;
            color: #231c16;
            line-height: 1.1;
        }
        .hero h1 span {
            display: block;
            font-size: 32px;
            font-style: italic;
            margin: 10px 0;
            color: #b58d2a;
        }
        .hero-date {
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 2px;
            margin: 25px 0 35px;
            color: #5a4e44;
        }
        .btn-gold {
            display: inline-block;
            padding: 14px 34px;
            background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            text-decoration: none;
            border-radius: 999px;
            box-shadow: 0 10px 25px -5px rgba(184,134,11,0.4);
            transition: all 0.3s ease;
        }
        .btn-gold:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 28px -4px rgba(184,134,11,0.5);
        }
        
        .section {
            max-width: 900px;
            margin: 0 auto;
            padding: 80px 20px;
            text-align: center;
        }
        .section-tag {
            font-size: 10px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #b58d2a;
            font-weight: 700;
            margin-bottom: 12px;
        }
        .section h2 {
            font-size: clamp(36px, 6vw, 52px);
            font-weight: 500;
            margin-bottom: 20px;
            color: #231c16;
        }
        .venue-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 40px 25px;
            box-shadow: 0 15px 40px -10px rgba(0,0,0,0.06);
            border: 1px solid #ebd9aa;
            margin-top: 30px;
        }
        .venue-card h3 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .venue-card p {
            color: #685c52;
            font-size: 15px;
            max-width: 500px;
            margin: 0 auto 25px;
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <section class="hero">
        <div>
            <div class="hero-badge">Wedding Celebration</div>
            <h1>
                {{bride_name}}
                <span>&amp;</span>
                {{groom_name}}
            </h1>
            <div class="hero-date">{{wedding_date}} &bull; {{wedding_time}}</div>
            <a href="#invitify-rsvp-section" class="btn-gold">RSVP Now</a>
        </div>
    </section>

    <!-- Venue Details Section -->
    <section class="section">
        <div class="section-tag">Location &amp; Muhurat</div>
        <h2>Join Us in Celebration</h2>
        <div class="venue-card">
            <h3>{{venue_name}}</h3>
            <p>{{venue_address}}</p>
            <a href="{{map_url}}" target="_blank" class="btn-gold" style="font-size: 12px; padding: 12px 28px;">
                View on Google Maps
            </a>
        </div>
    </section>

    <!-- RSVP Section is automatically attached here with matching fonts and background! -->
</body>
</html>`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <DialogHeader className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40">
                    <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                            <BookOpen className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                How to Create Mini Website Templates
                            </DialogTitle>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                मिनी वेबसाइट टेम्पलेट बनाने, प्लेसहोल्डर्स और RSVP फॉर्म जोड़ने की संपूर्ण गाइड
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Sub Navigation Tabs */}
                <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 overflow-x-auto">
                    {[
                        { id: 'overview', label: '1. Overview & Rules', icon: BookOpen },
                        { id: 'placeholders', label: '2. Dynamic Variables', icon: Code2 },
                        { id: 'rsvp', label: '3. RSVP Form Guide', icon: Sparkles },
                        { id: 'snippets', label: '4. Music & Timer Snippets', icon: Clock },
                        { id: 'starter', label: '5. Starter Template', icon: Layers },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-white dark:bg-neutral-800 text-pink-600 dark:text-pink-400 shadow-xs border border-neutral-200/80 dark:border-neutral-700'
                                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                                }`}
                            >
                                <Icon className="size-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Modal Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-neutral-700 dark:text-neutral-300">
                    
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50 text-pink-950 dark:text-pink-200">
                                <h3 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                                    <Sparkles className="size-4 text-pink-600" />
                                    Mini Website क्या है?
                                </h3>
                                <p className="text-xs leading-relaxed">
                                    Mini Website एक सिंगल पेज मोबाइल-फ्रेंडली डिजिटल इनविटेशन होती है जिसमें दूल्हा-दुल्हन का नाम, वेन्यू, गूगल मैप्स, शादी का मुहुर्त, बैकग्राउंड म्यूजिक, काउंटडाउन टाइमर और गेस्ट के लिए <strong>RSVP कन्फर्मेशन फॉर्म</strong> शामिल होता है।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-pink-600">जरूरी नियम (Essential Rules)</h4>
                                    <ul className="text-xs space-y-2 list-disc list-inside text-neutral-600 dark:text-neutral-400">
                                        <li>हमेशा <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code> लगाएं।</li>
                                        <li>Google Fonts (जैसे <em>Cormorant Garamond, Montserrat, Playfair</em>) CDN लिंक हेड में लगाएं।</li>
                                        <li><code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">box-sizing: border-box;</code> और <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">scroll-behavior: smooth;</code> रखें।</li>
                                        <li>इमेजेस को <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">max-width: 100%</code> दें ताकि मोबाइल पर ओवरफ्लो न हो।</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600">RSVP और स्टाइलिंग (Automatic Styling)</h4>
                                    <ul className="text-xs space-y-2 list-disc list-inside text-neutral-600 dark:text-neutral-400">
                                        <li>RSVP फॉर्म का <strong>बैकग्राउंड और फॉन्ट स्टाइल</strong> आपकी वेबसाइट के कोड (Body & Headings) से अपने आप मैच हो जाता है।</li>
                                        <li>अगर वेबसाइट में डार्क बैकग्राउंड है, तो RSVP फॉर्म ऑटोमैटिकली डार्क ग्लास कार्ड में बदल जाता है।</li>
                                        <li>RSVP फॉर्म को आप RSVP Tab से किसी भी वेबसाइट में <strong>ON या OFF</strong> कर सकते हैं।</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: PLACEHOLDERS */}
                    {activeTab === 'placeholders' && (
                        <div className="space-y-4">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                जब भी कोई कस्टमर अपनी शादी की वेबसाइट बनाएगा, नीचे दिए गए प्लेसहोल्डर्स अपने आप कस्टमर के असली डेटा से बदल जाएंगे। किसी भी वेरिएबल को कॉपी करने के लिए उस पर क्लिक करें:
                            </p>

                            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-neutral-50 dark:bg-neutral-950/60 font-bold uppercase text-[10px] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                                        <tr>
                                            <th className="p-3">Variable Code</th>
                                            <th className="p-3">विवरण (Description)</th>
                                            <th className="p-3">उदाहरण (Sample Data)</th>
                                            <th className="p-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-mono">
                                        {placeholders.map((p) => {
                                            const isCopied = copiedKey === p.key;
                                            return (
                                                <tr key={p.key} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                                    <td className="p-3 text-pink-600 dark:text-pink-400 font-bold">{p.key}</td>
                                                    <td className="p-3 font-sans text-neutral-700 dark:text-neutral-300">{p.desc}</td>
                                                    <td className="p-3 text-neutral-500 dark:text-neutral-400">{p.example}</td>
                                                    <td className="p-3 text-right">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleCopy(p.key, p.key)}
                                                            className="h-7 text-xs px-2.5 hover:bg-pink-100 dark:hover:bg-pink-950/50 text-pink-600"
                                                        >
                                                            {isCopied ? <Check className="size-3 text-emerald-600 mr-1" /> : <Copy className="size-3 mr-1" />}
                                                            {isCopied ? 'Copied' : 'Copy'}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: RSVP GUIDE */}
                    {activeTab === 'rsvp' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200 space-y-1.5">
                                <h3 className="font-bold text-sm flex items-center gap-1.5">
                                    <CheckCircle2 className="size-4 text-emerald-600" />
                                    Dynamic RSVP Form Kaise Kaam Karta Hai?
                                </h3>
                                <p className="text-xs leading-relaxed">
                                    RSVP Form कस्टमर को यह जानने में मदद करता है कि कौन-से मेहमान शादी में आ रहे हैं, कितने लोग आएंगे और उनका क्या मैसेज है।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">1. Enable / Disable Checkbox</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        RSVP Tab में मुख्य चेकबॉक्स है। अगर आप इसे अनचेक कर देते हैं, तो उस वेबसाइट में RSVP फॉर्म नहीं दिखेगा।
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">2. Answer Field Types</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        Admin हर सवाल के लिए <strong>Text Box</strong> (Single line), <strong>Textarea</strong> (Multi line), या <strong>Options</strong> चुन सकता है।
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">3. Cards vs List Format</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        ऑप्शंस को <strong>Cards Style</strong> (विजुअल ग्रिड टाइल्स और इमोजी के साथ) या <strong>List Style</strong> (रेडियो लिस्ट) में प्रदर्शित किया जा सकता है।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: SNIPPETS */}
                    {activeTab === 'snippets' && (
                        <div className="space-y-5">
                            {/* Music Snippet */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800 dark:text-neutral-200">
                                        <Music className="size-4 text-pink-600" />
                                        <span>Background Music Floating Button</span>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCopy(musicSnippet, 'music')}
                                        className="h-7 text-xs px-2.5"
                                    >
                                        {copiedKey === 'music' ? <Check className="size-3 text-emerald-600 mr-1" /> : <Copy className="size-3 mr-1" />}
                                        {copiedKey === 'music' ? 'Copied' : 'Copy Snippet'}
                                    </Button>
                                </div>
                                <pre className="p-3.5 bg-neutral-900 text-neutral-100 rounded-xl text-xs overflow-x-auto font-mono">
                                    {musicSnippet}
                                </pre>
                            </div>

                            {/* Countdown Snippet */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800 dark:text-neutral-200">
                                        <Clock className="size-4 text-pink-600" />
                                        <span>Live Wedding Countdown Timer</span>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCopy(countdownSnippet, 'timer')}
                                        className="h-7 text-xs px-2.5"
                                    >
                                        {copiedKey === 'timer' ? <Check className="size-3 text-emerald-600 mr-1" /> : <Copy className="size-3 mr-1" />}
                                        {copiedKey === 'timer' ? 'Copied' : 'Copy Snippet'}
                                    </Button>
                                </div>
                                <pre className="p-3.5 bg-neutral-900 text-neutral-100 rounded-xl text-xs overflow-x-auto font-mono">
                                    {countdownSnippet}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: STARTER TEMPLATE */}
                    {activeTab === 'starter' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-neutral-500">
                                    इस रेडीमेड टेम्पलेट कोड को कॉपी करके सीधे HTML कोड एडिटर में पेस्ट कर सकते हैं:
                                </p>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleCopy(starterTemplate, 'starter')}
                                    className="bg-pink-600 hover:bg-pink-700 text-white h-8 text-xs font-bold"
                                >
                                    {copiedKey === 'starter' ? <Check className="size-3.5 mr-1 text-emerald-200" /> : <Copy className="size-3.5 mr-1" />}
                                    {copiedKey === 'starter' ? 'Copied Starter Code!' : 'Copy Complete Template'}
                                </Button>
                            </div>
                            <pre className="p-4 bg-neutral-950 text-neutral-200 rounded-xl text-xs overflow-x-auto font-mono max-h-[380px] border border-neutral-800">
                                {starterTemplate}
                            </pre>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}
