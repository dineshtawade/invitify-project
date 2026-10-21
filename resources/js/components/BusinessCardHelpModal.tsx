// developed by dinesh tawade
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
    HelpCircle, BookOpen, Layers, CheckCircle2, 
    CreditCard, Smartphone, ShieldCheck, Sparkles, 
    AlertCircle, User, Share2, ShoppingBag, ShoppingCart, 
    Image as ImageIcon, Eye, ExternalLink, QrCode, Laptop, Tablet
} from 'lucide-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BusinessCardHelpModal({ open, onOpenChange }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'mandatory' | 'review_pay' | 'mobile' | 'features'>('overview');

    const stepsList = [
        {
            num: 1,
            title: 'Choose Theme Template',
            desc: 'अपने ब्रांड और बिज़नेस के लिए मनपसंद डिज़ाइन टेम्पलेट चुनें।',
            icon: Layers,
            req: 'Required (*)',
        },
        {
            num: 2,
            title: 'Company & Personal Details',
            desc: 'कंपनी का नाम, लोगो, नाम, पद, कॉलिंग नंबर, व्हाट्सएप, ईमेल, एड्रेस और अबाउट अस।',
            icon: User,
            req: 'Required (*)',
        },
        {
            num: 3,
            title: 'Social Profile Links',
            desc: 'फेसबुक और इंस्टाग्राम प्रोफाइल लिंक (Mandatory) + लिंक्डइन, पिंटरेस्ट, ट्विटर, गूगल रिव्यू।',
            icon: Share2,
            req: 'Required (*)',
        },
        {
            num: 4,
            title: 'Payment Options & UPI',
            desc: 'कम से कम 1 UPI नंबर (Paytm/GPay/PhonePe) और बैंक अकाउंट डिटेल्स (Bank Name, Holder, Acc No, IFSC)।',
            icon: CreditCard,
            req: 'Required (*)',
        },
        {
            num: 5,
            title: 'Products & Services',
            desc: 'कम से कम 1 सर्विस या प्रोडक्ट का नाम और फोटो जोड़ें।',
            icon: ShoppingBag,
            req: 'Required (*)',
        },
        {
            num: 6,
            title: 'Store Products (Order Cart)',
            desc: 'कम से कम 1 स्टोर प्रोडक्ट नाम और सेलिंग प्राइस (₹) के साथ जोड़ें ताकि कस्टमर्स ऑनलाइन ऑर्डर दे सकें।',
            icon: ShoppingCart,
            req: 'Required (*)',
        },
        {
            num: 7,
            title: 'Photo Gallery & YouTube',
            desc: 'कम से कम 1 फोटो अपलोड करें या 1 यूट्यूब वीडियो लिंक डालें।',
            icon: ImageIcon,
            req: 'Required (*)',
        },
        {
            num: 8,
            title: 'Review, Plan & Checkout',
            desc: '6-महीने या 1-साल का प्लान चुनें, अकाउंट बनाएं और ऑनलाइन पेमेंट करके कार्ड एक्टिवेट करें।',
            icon: Eye,
            req: 'Final Step',
        },
    ];

    const mandatoryChecklist = [
        { step: 'Step 1', name: 'Theme Template Selection', rule: 'कम से कम 1 टेम्पलेट सिलेक्ट होना चाहिए' },
        { step: 'Step 2', name: 'Company / Business Name', rule: 'कंपनी या दुकान का नाम अनिवार्य है' },
        { step: 'Step 2', name: 'First Name & Last Name', rule: 'यूज़र का पूरा नाम' },
        { step: 'Step 2', name: 'Designation / Position', rule: 'पद (Founder, Manager, etc.)' },
        { step: 'Step 2', name: 'Primary Calling Phone', rule: '10-अंकों का कॉलिंग नंबर' },
        { step: 'Step 2', name: 'WhatsApp Number', rule: '1-टैप व्हाट्सएप चैट के लिए' },
        { step: 'Step 2', name: 'Email Address', rule: 'वैलिड ईमेल फॉर्मेट (user@example.com)' },
        { step: 'Step 2', name: 'Full Address', rule: 'दुकान/ऑफिस का पूरा पता' },
        { step: 'Step 2', name: 'About Us / Description', rule: 'बिज़नेस के बारे में संक्षिप्त विवरण' },
        { step: 'Step 3', name: 'Facebook Profile Link', rule: 'फेसबुक प्रोफाइल/पेज URL' },
        { step: 'Step 3', name: 'Instagram Profile Link', rule: 'इंस्टाग्राम प्रोफाइल URL' },
        { step: 'Step 4', name: 'At least 1 UPI Number', rule: 'Paytm, Google Pay, या PhonePe में से कोई 1 नंबर' },
        { step: 'Step 4', name: 'Bank Details', rule: 'Bank Name, Account Holder Name, Account Number, IFSC Code' },
        { step: 'Step 5', name: 'At least 1 Service Item', rule: 'कम से कम 1 सर्विस का नाम' },
        { step: 'Step 6', name: 'At least 1 Store Product', rule: 'कम से कम 1 प्रोडक्ट का नाम और सेलिंग प्राइस (₹)' },
        { step: 'Step 7', name: 'Gallery Image or YouTube Link', rule: 'कम से कम 1 फोटो या 1 यूट्यूब वीडियो लिंक' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white border-slate-200 shadow-2xl rounded-2xl">
                {/* Header */}
                <DialogHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <BookOpen className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                                Digital Visiting Card — User Guide (यूज़र गाइड)
                            </DialogTitle>
                            <p className="text-xs text-slate-500 mt-0.5">
                                विज़िटिंग कार्ड बनाने, सभी 8 स्टेप्स, "Review & Pay" बटन और मोबाइल फीचर्स की पूरी जानकारी
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Sub Navigation Tabs */}
                <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 border-b border-slate-100 bg-slate-50/50 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {[
                        { id: 'overview', label: '1. All 8 Steps', icon: Layers },
                        { id: 'mandatory', label: '2. Mandatory Fields (*)', icon: AlertCircle },
                        { id: 'review_pay', label: '3. "Review & Pay" Rule', icon: CreditCard },
                        { id: 'mobile', label: '4. Mobile & Preview View', icon: Smartphone },
                        { id: 'features', label: '5. Plans & Card Features', icon: Sparkles },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Icon className="size-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50/60 border border-blue-200/60 p-4 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                                <Sparkles className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block text-sm mb-0.5">आसान 8-स्टेप्स में आपका स्मार्ट विज़िटिंग कार्ड तैयार करें</span>
                                    कोई भी नया यूज़र बिना लॉगिन किए डायरेक्ट कार्ड डिज़ाइन करना शुरू कर सकता है। कार्ड का ड्राफ्ट ऑटो-सेव होता रहता है।
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {stepsList.map((st) => {
                                    const Icon = st.icon;
                                    return (
                                        <div key={st.num} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-6 rounded-lg bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                                                        {st.num}
                                                    </span>
                                                    <h4 className="text-xs font-bold text-slate-800">{st.title}</h4>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                    st.req.includes('*') ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}>
                                                    {st.req}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 pl-8">{st.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: MANDATORY FIELDS */}
                    {activeTab === 'mandatory' && (
                        <div className="space-y-4">
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                                <AlertCircle className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block text-sm mb-0.5">अनिवार्य फ़ील्ड्स (Mandatory Fields Rule)</span>
                                    जब तक आप नीचे दी गई सभी 16 आवश्यक जानकारियां नहीं भरते, तब तक "Review & Pay" बटन हिडन रहेगा।
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                                        <tr>
                                            <th className="px-4 py-2.5">Step</th>
                                            <th className="px-4 py-2.5">Field Name</th>
                                            <th className="px-4 py-2.5">Validation Requirement</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {mandatoryChecklist.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-2 font-bold text-slate-500 whitespace-nowrap">{item.step}</td>
                                                <td className="px-4 py-2 font-bold text-slate-900 flex items-center gap-1.5">
                                                    <span className="text-red-500">*</span> {item.name}
                                                </td>
                                                <td className="px-4 py-2 text-slate-600">{item.rule}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: REVIEW & PAY RULE */}
                    {activeTab === 'review_pay' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-5 text-emerald-600" />
                                    <h4 className="text-sm font-bold text-emerald-950">"Review & Pay" बटन कब दिखाई देगा?</h4>
                                </div>
                                <p className="text-xs text-emerald-800 leading-relaxed">
                                    आपके अनुरोध के अनुसार, टॉप हेडर में <strong>"Review & Pay"</strong> बटन तभी शो होगा जब Step 1 से Step 7 तक की सभी अनिवार्य जानकारी (Mandatory details) पूरी तरह भर दी गई हों।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                                    <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                                        <div className="size-2 rounded-full bg-red-500 animate-pulse"></div> Details Incomplete
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        यदि कोई भी अनिवार्य फ़ील्ड खाली है, तो हेडर में सिर्फ <strong>"Save Draft"</strong> दिखेगा। "Review & Pay" बटन पूरी तरह से छिपा रहेगा।
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                                        <div className="size-2 rounded-full bg-emerald-500"></div> All Details Completed
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        जैसे ही सभी अनिवार्य फ़ील्ड्स पूरे होते हैं, सुंदर <strong>एमराल्ड ग्रीन "Review & Pay"</strong> बटन दिखाई देगा। इस पर क्लिक करके आप सीधे अंतिम स्टेप (Step 8) पर पहुंचकर पेमेंट कर सकते हैं।
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <ShieldCheck className="size-4 text-blue-600" /> डायरेक्ट स्टेप जंप प्रोटेक्शन (Direct Jump Barrier)
                                </h5>
                                <p className="text-xs text-slate-600">
                                    यदि कोई यूज़र बीच के स्टेप्स भरे बिना सीधे Step 8 टैब पर क्लिक करता है, तो सिस्टम स्वतः छूटे हुए स्टेप पर रोककर लाल रंग के अलर्ट बॉक्स में मिसिंग फ़ील्ड्स की लिस्ट दिखाएगा।
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: MOBILE & PREVIEW */}
                    {activeTab === 'mobile' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="size-5 text-blue-600" />
                                    <h4 className="text-sm font-bold text-slate-900">मोबाइल स्क्रीन पर लाइव कार्ड देखना (Live Card View)</h4>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Step 8 में मोबाइल यूज़र्स के लिए खास <strong>Segmented Switcher Tab</strong> दिया गया है:
                                </p>

                                <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-around gap-2 text-xs font-bold text-slate-700">
                                    <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                                        <CreditCard className="size-3.5 text-blue-600" /> Plan & Payment
                                    </span>
                                    <span>या</span>
                                    <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                                        <Eye className="size-3.5 text-emerald-600" /> Live Card Preview
                                    </span>
                                </div>

                                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                                    <li><strong>Plan & Payment</strong>: प्लान सिलेक्ट करने, अकाउंट बनाने और पेमेंट करने के लिए।</li>
                                    <li><strong>Live Card Preview</strong>: अपने कार्ड का लाइव स्मार्टफोन व्यू देखने के लिए (जिसमें ऊपर <em>[ ← Back to Payment ]</em> बटन भी मिलता है)।</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <Laptop className="size-4 text-slate-700" /> लैपटॉप और डेस्कटॉप व्यू (Side-by-Side)
                                </h4>
                                <p className="text-xs text-slate-600">
                                    बड़ी स्क्रीन (लैपटॉप/कंप्यूटर) पर बायीं तरफ एडिटिंग फॉर्म और दायीं तरफ लाइव स्मार्टफोन फ्रेम दोनों हमेशा साथ-साथ दिखाई देते हैं।
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: PLANS & CARD FEATURES */}
                    {activeTab === 'features' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl border-2 border-slate-200 bg-white space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Standard Plan</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900">₹499</span>
                                        <span className="text-xs text-slate-500">/ 6 Months</span>
                                    </div>
                                    <p className="text-xs text-slate-600">6 महीने की वैधता, सभी फीचर्स, QR कोड और vCard सपोर्ट शामिल।</p>
                                </div>

                                <div className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/30 space-y-2 relative">
                                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                        Best Value
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Annual Plan</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900">₹899</span>
                                        <span className="text-xs text-slate-500">/ 1 Year (12 Months)</span>
                                    </div>
                                    <p className="text-xs text-slate-600">1 साल की वैधता, अनलिमिटेड शेयरिंग और लीड जनरेशन सपोर्ट।</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">पेमेंट के बाद कार्ड पर क्या-क्या एक्टिव होगा?</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-emerald-500 flex-shrink-0" />
                                        <span>यूनिक लाइव कार्ड लिंक (e.g. /card/your-name)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <QrCode className="size-3.5 text-emerald-500 flex-shrink-0" />
                                        <span>स्कैन करने योग्य डायनामिक QR कोड</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-emerald-500 flex-shrink-0" />
                                        <span>1-टैप .vcf vCard फोन कांटेक्ट डाउनलोड</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-emerald-500 flex-shrink-0" />
                                        <span>डायरेक्ट कॉल, व्हाट्सएप और गूगल मैप्स</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-emerald-500 flex-shrink-0" />
                                        <span>प्रोडक्ट कैटलॉग और ऑनलाइन ऑर्डर कार्ट</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-emerald-500 flex-shrink-0" />
                                        <span>UPI व बैंक अकाउंट पेमेंट डिटेल्स</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3.5 sm:px-6 sm:py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Invitify • Smart Digital Business Cards</span>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95"
                    >
                        Got It (समझ गया)
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
