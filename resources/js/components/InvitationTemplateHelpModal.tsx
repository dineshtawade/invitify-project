// developed by dinesh tawade
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
    HelpCircle, BookOpen, Layers, Type, Image as ImageIcon, 
    Sparkles, Video, Flame, MapPin, Copy, Check, CheckCircle2,
    Palette, AspectRatio, ShieldAlert, Sliders, ExternalLink
} from 'lucide-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InvitationTemplateHelpModal({ open, onOpenChange }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'layers' | 'assets' | 'interactive' | 'pricing'>('overview');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const gradientPresets = [
        { name: 'Romantic Blush', value: 'from-stone-100 to-rose-50 text-neutral-800' },
        { name: 'Classic Gold', value: 'from-amber-100 via-yellow-50 to-amber-200 text-neutral-800' },
        { name: 'Sunset Glow', value: 'from-amber-50 to-orange-100 text-amber-900' },
        { name: 'Neon Dreams (Dark)', value: 'from-zinc-950 to-neutral-900 text-purple-400' },
        { name: 'Summer Splash', value: 'from-cyan-100 to-teal-50 text-cyan-800' },
    ];

    const luxuryFonts = [
        { name: 'Playfair Display', category: 'Royal Serif', bestFor: 'Couples Names, Titles & Headings' },
        { name: 'Great Vibes', category: 'Calligraphy Cursive', bestFor: 'Save the Date, Wedding, Blessings' },
        { name: 'Cormorant Garamond', category: 'Fine Luxury Serif', bestFor: 'Royal Indian Weddings, Elegant Titles' },
        { name: 'Cinzel', category: 'Classic Roman', bestFor: 'Monograms, Reception, Date & Time' },
        { name: 'Montserrat', category: 'Modern Clean Sans', bestFor: 'Venue Address, Programme Details, Body Text' },
        { name: 'Alex Brush', category: 'Soft Script', bestFor: 'Sub-headings, Invitations, Blessings' },
        { name: 'Outfit', category: 'Geometric Sans', bestFor: 'Modern Minimalist Cards, Time, Contact' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <DialogHeader className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40">
                    <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <BookOpen className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                Invitation Template Creator Guide
                            </DialogTitle>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                कार्ड और वीडियो इनविटेशन टेम्पलेट बनाने, लेयर्स, फॉन्ट्स और एसेट्स मैनेज करने की संपूर्ण गाइड
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Sub Navigation Tabs */}
                <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 overflow-x-auto">
                    {[
                        { id: 'overview', label: '1. Types & Canvas Ratios', icon: BookOpen },
                        { id: 'layers', label: '2. Layers & Typography', icon: Layers },
                        { id: 'assets', label: '3. Graphics & Asset Library', icon: ImageIcon },
                        { id: 'interactive', label: '4. Maps, Pins & Dividers', icon: MapPin },
                        { id: 'pricing', label: '5. Pricing & Trending', icon: Flame },
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
                                        ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-neutral-200/80 dark:border-neutral-700'
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
                    
                    {/* TAB 1: OVERVIEW & RATIOS */}
                    {activeTab === 'overview' && (
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200">
                                <h3 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                                    <Sparkles className="size-4 text-indigo-600" />
                                    Invitation Templates Kaise Kaam Karte Hain?
                                </h3>
                                <p className="text-xs leading-relaxed">
                                    यहाँ आप दो प्रकार के टेम्पलेट्स बना सकते हैं: <strong>Image Card Templates</strong> (ड्रैग-एंड-ड्रॉप कैनवास, मल्टीपल पेजेस, कस्टम फॉन्ट्स) और <strong>Video Templates</strong> (म्यूजिक और वीडियो क्लिप्स के साथ)।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2.5">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600">Canvas Aspect Ratios (आकार और अनुपात)</h4>
                                    <ul className="text-xs space-y-2 text-neutral-600 dark:text-neutral-400">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-neutral-800 dark:text-neutral-200">Standard (5:7):</span>
                                            पारंपरिक वर्टिकल शादी के कार्ड (सबसे लोकप्रिय)
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-neutral-800 dark:text-neutral-200">Square (1:1):</span>
                                            Instagram पोस्ट और WhatsApp DP इनविटेशन
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-neutral-800 dark:text-neutral-200">Mobile Story (9:16):</span>
                                            WhatsApp Status और Instagram Story के लिए बेस्ट
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-neutral-800 dark:text-neutral-200">Landscape (16:9):</span>
                                            हॉरिजोंटल वीडियो और डिजिटल स्क्रीन
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-neutral-800 dark:text-neutral-200">Custom Dimensions:</span>
                                            अपनी इच्छानुसार चौड़ाई और ऊंचाई (Width x Height) पिक्सेल में सेट करें
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2.5">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600">Multi-Page Invitations (मल्टी-पेज कार्ड)</h4>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        आप एक ही टेम्पलेट में एक से अधिक पेजेस जोड़ सकते हैं:
                                    </p>
                                    <ul className="text-xs space-y-1.5 list-disc list-inside text-neutral-600 dark:text-neutral-400">
                                        <li><strong>Page 1:</strong> मुख्य कवर पेज (Dulha-Dulhan ka naam & Tarikh)</li>
                                        <li><strong>Page 2:</strong> हल्दी और मेहंदी कार्यक्रम विवरण</li>
                                        <li><strong>Page 3:</strong> बारात, फेरे और रिसेप्शन टाइमिंग</li>
                                        <li><strong>Page 4:</strong> वेन्यू लोकेशन, गूगल मैप्स और RSVP फोन</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: LAYERS & TYPOGRAPHY */}
                    {activeTab === 'layers' && (
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 text-purple-950 dark:text-purple-200 space-y-1">
                                <h3 className="font-bold text-sm flex items-center gap-1.5">
                                    <Layers className="size-4 text-purple-600" />
                                    Layer Management & Z-Index Depth
                                </h3>
                                <p className="text-xs leading-relaxed">
                                    कैनवास पर हर टेक्स्ट, इमेज और आइकन एक अलग लेयर होता है। लेयर्स पैनल से आप किसी भी एलिमेंट को आगे (Front), पीछे (Back), लॉक (Lock) या हाइड (Hide) कर सकते हैं।
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                    प्रीमियम गूगल फॉन्ट्स और उनका उपयोग:
                                </h4>
                                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-neutral-50 dark:bg-neutral-950/60 font-bold uppercase text-[10px] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                                            <tr>
                                                <th className="p-3">Font Name</th>
                                                <th className="p-3">Category</th>
                                                <th className="p-3">Recommended Use (किस चीज़ के लिए सही है)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                            {luxuryFonts.map((f) => (
                                                <tr key={f.name} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                                    <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{f.name}</td>
                                                    <td className="p-3 text-neutral-500 dark:text-neutral-400">{f.category}</td>
                                                    <td className="p-3 text-neutral-700 dark:text-neutral-300">{f.bestFor}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: ASSETS & GRAPHICS */}
                    {activeTab === 'assets' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200 space-y-1">
                                <h3 className="font-bold text-sm flex items-center gap-1.5">
                                    <ImageIcon className="size-4 text-amber-600" />
                                    Saved Assets Library (एसेट लाइब्रेरी)
                                </h3>
                                <p className="text-xs leading-relaxed">
                                    ट्रांसपेरेंट PNG ग्राफिक्स, बॉर्डर्स, गणेश जी के आर्टवर्क और फ्लोरल फ्रेम्स अपलोड करें। सभी एसेट्स बिना डुप्लीकेट हुए लाइब्रेरी में सुरक्षित रहते हैं और कभी भी री-यूज़ किए जा सकते हैं।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1.5">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">1. Floral Borders & Frames</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        कार्ड के किनारों पर लगाने के लिए गोल्डन और फ्लोरल फ्रेम्स जोड़ें। Opacity और Z-Index से बैकग्राउंड में सेट करें।
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1.5">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">2. Religious & Wedding Icons</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        श्री गणेश, कलश, मंडप, सिंदूर, शादी के छल्ले और डव बर्ड्स के PNG ग्राफिक्स अपलोड करें।
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1.5">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">3. Couple Photo Placeholders</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        इमेज बॉक्स जोड़ें और बॉर्डर-रेडियस सेट करके सर्कल या राउंडेड फोटो फ्रेम बनाएं जिसे कस्टमर बदल सके।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: INTERACTIVE ELEMENTS */}
                    {activeTab === 'interactive' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-blue-950 dark:text-blue-200 space-y-1">
                                <h3 className="font-bold text-sm flex items-center gap-1.5">
                                    <MapPin className="size-4 text-blue-600" />
                                    Interactive Location Pins & Action Buttons
                                </h3>
                                <p className="text-xs leading-relaxed">
                                    डिजिटल कार्ड में आप गूगल मैप्स डायरेक्शन बटन, कॉल / WhatsApp RSVP लिंक और वेबसाइट लिंक जोड़ सकते हैं।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600">गूगल मैप्स लोकेशन पिन (Google Maps Pin)</h4>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        कार्ड पर <strong>Pins Tab</strong> से एक लोकेशन पिन या बटन जोड़ें। जब भी गेस्ट इस पर क्लिक करेगा, सीधे फोन में गूगल मैप्स खुल जाएगा और नेविगेशन शुरू हो जाएगा।
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600">कस्टम कैटेगरी मैनेजमेंट (Inline Categories)</h4>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        एडिटर के फुटर में कैटेगरी ड्रॉपडाउन में <strong>+ Add New Category</strong> दिया गया है। बिना किसी दूसरे पेज पर जाए आप तुरंत नई कैटेगरी बना सकते हैं।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: PRICING & TRENDING */}
                    {activeTab === 'pricing' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-200 space-y-1">
                                <h3 className="font-bold text-sm flex items-center gap-1.5">
                                    <Flame className="size-4 text-amber-500 fill-amber-500" />
                                    Pricing, Trending & Clone Workflow
                                </h3>
                                <p className="text-xs leading-relaxed">
                                    टेम्पलेट्स को सही कीमत, होमपेज पर फीचर्ड और रीसेलर्स के लिए उपलब्ध कराने की जानकारी।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1.5">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">Standard Price vs Reseller</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        <strong>Price (₹):</strong> रिटेल कस्टमर के लिए कीमत। <br />
                                        <strong>Reseller Price:</strong> आपके एफिलिएट और रीसेलर्स के लिए डिस्काउंटेड रेट।
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1.5">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">Trending Badge 🔥</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        जिस भी टेम्पलेट पर <strong>Trending</strong> चेकबॉक्स चालू होगा, वह होमपेज पर "Trending Templates" सेक्शन में सबसे ऊपर दिखेगा।
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1.5">
                                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">Clone & Save As (डुप्लीकेट)</h4>
                                    <p className="text-[11px] text-neutral-500 leading-normal">
                                        एक तैयार कार्ड के अलग-अलग कलर वैरिएंट्स बनाने के लिए <strong>Clone & Save As</strong> बटन दबाएं। तुरंत नया टेम्पलेट कॉपी बन जाएगा।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}
