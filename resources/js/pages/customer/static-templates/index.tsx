import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FileText, Loader2, Sparkles, Wand2, Paintbrush, ChevronRight, Zap, CheckCircle2, Crown, Gem, Check, Info, Search, Eye, X, Smartphone, Tablet, Laptop, CreditCard, Calendar, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
    },
    {
        title: 'Digital Card Templates',
        href: '/customer/static-templates',
    },
];

interface Template {
    id: number;
    name: string;
    css_file: string;
    thumbnail: string;
}

interface Plan {
    id: number;
    name: string;
    duration_months: number;
    price: number;
    description: string | null;
}

interface PageProps {
    templates: Template[];
    plans?: Plan[];
    razorpayKeyId?: string;
}

export default function StaticTemplatesBrowse({ templates = [], plans = [], razorpayKeyId = '' }: PageProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Preview Modal State
    const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null);
    const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

    // Purchase flow: step 1 = plan selection, step 2 = card name, null = closed
    const [purchaseTemplate, setPurchaseTemplate] = useState<Template | null>(null);
    const [purchaseStep, setPurchaseStep] = useState<'plan' | 'details'>('plan');
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [companyName, setCompanyName] = useState('');
    const [slug, setSlug] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [payError, setPayError] = useState('');

    const generateSlug = (val: string) =>
        val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

    const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCompanyName(val);
        setSlug(generateSlug(val));
    };

    const openPurchaseModal = (template: Template) => {
        setPurchaseTemplate(template);
        setPurchaseStep('plan');
        setSelectedPlan(plans.length > 0 ? plans[0] : null);
        setCompanyName('');
        setSlug('');
        setPayError('');
    };

    const closePurchaseModal = () => {
        setPurchaseTemplate(null);
        setSelectedPlan(null);
        setIsPaying(false);
        setPayError('');
    };

    const handleProceedToDetails = () => {
        if (!selectedPlan) { setPayError('Please select a plan.'); return; }
        setPayError('');
        setPurchaseStep('details');
    };

    const handlePayNow = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!purchaseTemplate || !selectedPlan) return;
        setIsPaying(true);
        setPayError('');

        try {
            const res = await axios.post('/customer/business-cards/draft-create', {
                template_id: purchaseTemplate.id,
                plan_id: selectedPlan.id,
                company_name: companyName,
                slug: slug,
            });
            const data = res.data;

            closePurchaseModal();
            window.location.href = data.redirect;
        } catch (err: any) {
            setPayError(err.message || 'Something went wrong. Please try again.');
            setIsPaying(false);
        }
    };

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Full card preview — converted from preview_page.php (all sections with dummy data)
    const getPreviewHtml = (themeCss: string) => {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                    <link rel="stylesheet" href="/css/business-cards/${themeCss}">
                    <style>
                        * { box-sizing: border-box; }
                        body {
                            margin: 0;
                            padding: 0 0 80px 0;
                            display: flex;
                            justify-content: center;
                            min-height: 100vh;
                        }
                        .preview-wrapper {
                            width: 100%;
                            max-width: 420px;
                            min-height: 100vh;
                        }
                        .card, .card2 {
                            width: 100% !important;
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                        }
                        input, textarea, select {
                            display: block;
                            width: 100%;
                            margin: 6px auto;
                            padding: 10px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            font-size: 13px;
                        }
                        input[type=submit] {
                            cursor: pointer;
                            width: auto;
                            margin: 8px auto;
                            display: block;
                        }
                        input[type=radio] { width: auto; display: inline; margin: 0 4px 0 0; }
                        .share_box { display: block !important; }
                        .card2 iframe {
                            margin: 8px auto;
                            position: relative;
                            border-radius: 5px;
                            width: 100%;
                            min-height: 220px;
                            display: block;
                        }
                    </style>
                </head>
                <body>
                    <div class="preview-wrapper">

                        <!-- ===== HERO CARD ===== -->
                        <div class="card" id="home">
                            <div class="card_content">
                                <img src="/theinvitify-removebg-preview.png" alt="Logo" style="max-height:80px; border-radius:8px; object-fit:contain;">
                            </div>
                            <div class="card_content2">
                                <h2>Demo Enterprises</h2>
                                <p>John Doe</p>
                                <p>Managing Director</p>
                            </div>

                            <!-- Quick Action Buttons -->
                            <div class="dis_flex">
                                <a href="#"><div class="link_btn"><i class="fa fa-phone"></i> Call</div></a>
                                <a href="#"><div class="link_btn"><i class="fa fa-whatsapp"></i> WhatsApp</div></a>
                                <a href="#"><div class="link_btn"><i class="fa fa-map-marker"></i> Direction</div></a>
                                <a href="#"><div class="link_btn"><i class="fa fa-envelope"></i> Mail</div></a>
                                <a href="#"><div class="link_btn"><i class="fa fa-globe"></i> Website</div></a>
                            </div>

                            <!-- Contact Details -->
                            <div class="contact_details">
                                <div class="contact_d"><i class="fa fa-phone"></i><p>+91 9876543210</p></div>
                                <div class="contact_d"><i class="fa fa-phone"></i><p>+91 9123456780</p></div>
                                <div class="contact_d"><i class="fa fa-envelope"></i><p>john.doe@company.com</p></div>
                                <div class="contact_d"><i class="fa fa-map-marker"></i><p>Tech Park, Mumbai, India</p></div>
                            </div>

                            <!-- WhatsApp Share Input -->
                            <div class="dis_flex">
                                <div class="share_wtsp">
                                    <form>
                                        <input type="text" name="phone" placeholder="WhatsApp Number with Country code" value="+91">
                                        <div class="wtsp_share_btn"><i class="fa fa-whatsapp"></i> Share</div>
                                    </form>
                                </div>
                            </div>

                            <!-- Save to Contacts & Share -->
                            <div class="dis_flex">
                                <div class="big_btns">Save to Contacts <i class="fa fa-download"></i></div>
                                <div class="big_btns">Share <i class="fa fa-share-alt"></i></div>
                            </div>

                            <!-- Share Box (always visible in preview) -->
                            <div class="share_box">
                                <div class="close">&times;</div>
                                <p>Share My Digital Card</p>
                                <a href="#"><div class="shar_btns"><i class="fa fa-whatsapp"></i><p>WhatsApp</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-comment"></i><p>SMS</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-facebook"></i><p>Facebook</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-twitter"></i><p>Twitter</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-instagram"></i><p>Instagram</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-linkedin"></i><p>Linkedin</p></div></a>
                            </div>

                            <!-- Social Media Icons -->
                            <div class="dis_flex">
                                <a href="#"><div class="social_med"><i class="fa fa-facebook"></i></div></a>
                                <a href="#"><div class="social_med"><i class="fa fa-youtube"></i></div></a>
                                <a href="#"><div class="social_med"><i class="fa fa-twitter"></i></div></a>
                                <a href="#"><div class="social_med"><i class="fa fa-instagram"></i></div></a>
                            </div>
                        </div>

                        <!-- ===== QR CODE ===== -->
                        <div class="card2" id="qr_section">
                            <h3>Scan QR Code to go to Visiting Card</h3>
                            <img
                                src="https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=https://invitify.in/demo-enterprises"
                                alt="QR Code"
                                id="qr_code_d"
                                style="display:block;margin:10px auto;"
                            >
                        </div>

                        <!-- ===== ABOUT US ===== -->
                        <div class="card2" id="about_us">
                            <h3>About Us</h3>
                            <p>Est. 2015</p>
                            <p>We are a leading provider of innovative digital solutions, helping small businesses design modern portfolios and engage customers globally. Our team delivers high-quality services with a commitment to excellence.</p>
                        </div>

                        <!-- ===== SHOP ONLINE ===== -->
                        <div class="card2" id="shop_online">
                            <h3>Shop Online</h3>
                            <h3>From Our Store</h3>
                            <div class="order_box">
                                <h2>Premium Package</h2>
                                <p><del><i class="fa fa-rupee"></i>2999</del></p>
                                <h4>1999 <i class="fa fa-rupee"></i></h4>
                                <a href="#"><div class="btn_buy">Enquiry</div></a>
                            </div>
                            <div class="order_box">
                                <h2>Starter Pack</h2>
                                <p><del><i class="fa fa-rupee"></i>1499</del></p>
                                <h4>999 <i class="fa fa-rupee"></i></h4>
                                <a href="#"><div class="btn_buy">Enquiry</div></a>
                            </div>
                        </div>

                        <!-- ===== YOUTUBE VIDEOS ===== -->
                        <div class="card2" id="youtube_video">
                            <h3>Youtube Videos</h3>
                            <iframe
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                frameborder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>

                        <!-- ===== PRODUCTS & SERVICES ===== -->
                        <div class="card2" id="product_services">
                            <h3>Products &amp; Services</h3>
                            <div class="product_s">
                                <p>Web Design</p>
                                <div class="d_dis">
                                    <p>Professional website design tailored to your brand.</p>
                                    <br><br>
                                    <a href="#"><div class="btn_buy">Enquiry Now</div></a>
                                </div>
                            </div>
                            <div class="product_s">
                                <p>Digital Marketing</p>
                                <div class="d_dis">
                                    <p>Grow your business with result-driven digital campaigns.</p>
                                    <br><br>
                                    <a href="#"><div class="btn_buy">Enquiry Now</div></a>
                                </div>
                            </div>
                            <div class="product_s">
                                <p>Mobile App Development</p>
                                <div class="d_dis">
                                    <p>Custom mobile apps for Android &amp; iOS platforms.</p>
                                    <br><br>
                                    <a href="#"><div class="btn_buy">Enquiry Now</div></a>
                                </div>
                            </div>
                        </div>

                        <!-- ===== IMAGE GALLERY ===== -->
                        <div class="card2" id="gallery">
                            <h3>Image Gallery</h3>
                            <div class="img_gall">
                                <img src="https://picsum.photos/seed/gall1/300/200" alt="Gallery Image" style="width:100%;border-radius:6px;margin-bottom:8px;">
                            </div>
                            <div class="img_gall">
                                <img src="https://picsum.photos/seed/gall2/300/200" alt="Gallery Image" style="width:100%;border-radius:6px;margin-bottom:8px;">
                            </div>
                        </div>

                        <!-- ===== PAYMENT INFO ===== -->
                        <div class="card2" id="payment">
                            <h3>Payment Info</h3>
                            <h2>Paytm</h2><p>+91 9876543210</p>
                            <h2>Google Pay</h2><p>+91 9876543210</p>
                            <h2>PhonePe</h2><p>+91 9876543210</p>
                            <h3>Bank Account Details</h3>
                            <h2>Name:</h2><p>Demo Enterprises</p>
                            <h2>Account Number:</h2><p>1234 5678 9012</p>
                            <h2>IFSC Code:</h2><p>DEMO0001234</p>
                            <h2>BANK Name:</h2><p>State Bank of India</p>
                            <h3>GST Number</h3>
                            <h2>GST No:</h2><p>22AAAAA0000A1Z5</p>
                        </div>

                        <!-- ===== FEEDBACK ===== -->
                        <div class="card2" id="feedback">
                            <h3>Feedback</h3>
                            <form id="feedback_form">
                                <p class="select_star">Select Star</p>
                                <div class="rating">
                                    <label><input type="radio" name="r_star" value="1"><span class="icon">★</span></label>
                                    <label><input type="radio" name="r_star" value="2"><span class="icon">★</span><span class="icon">★</span></label>
                                    <label><input type="radio" name="r_star" value="3"><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span></label>
                                    <label><input type="radio" name="r_star" value="4"><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span></label>
                                    <label><input type="radio" name="r_star" value="5" checked><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span></label>
                                </div>
                                <input type="text" name="r_name" placeholder="Your name">
                                <input type="email" name="r_email" placeholder="Your email id">
                                <input type="number" name="r_contact" placeholder="Your contact">
                                <textarea name="r_msg" placeholder="Your feedback"></textarea>
                                <input type="submit" value="Submit Feedback">
                                <p class="note">Note: for privecy and security reasons we do not show your contact details.</p>
                            </form>
                        </div>

                        <!-- ===== LOCATION / MAP ===== -->
                        <div class="card2" id="address" style="text-align:center;">
                            <h3>Location Address</h3>
                            <span style="font-size:13px;text-align:center;color:#3f51b5;">
                                Showing result:
                                <a href="https://www.google.com/maps/search/Mumbai+India" target="_blank" style="color:#3f51b5;">
                                    Tech Park, Mumbai, India <i class="fa fa-external-link"></i>
                                </a>
                            </span>
                            <br>
                            <iframe
                                width="100%"
                                height="260"
                                frameborder="0"
                                scrolling="no"
                                marginheight="0"
                                marginwidth="0"
                                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Mumbai,India&t=&z=14&ie=UTF8&iwloc=B&output=embed">
                            </iframe>
                        </div>

                        <!-- ===== CONTACT US ===== -->
                        <div class="card2" id="enquery">
                            <form>
                                <h3>Contact Us</h3>
                                <input type="text" name="c_name" placeholder="Enter Your Name">
                                <input type="text" name="c_contact" maxlength="13" placeholder="Enter Your Mobile No">
                                <input type="email" name="c_email" placeholder="Enter Your Email Address">
                                <textarea name="c_msg" placeholder="Enter your Message or Query"></textarea>
                                <input type="submit" value="Send!">
                            </form>
                            <br>
                            <div style="background:linear-gradient(45deg,black,black);color:white;padding:20px;border-radius:2px;margin:11px auto;font-size:9px;text-align:center;cursor:pointer;">
                                Create Your Card
                            </div>
                        </div>

                        <br><br><br><br>

                        <!-- ===== BOTTOM STICKY NAVIGATION MENU ===== -->
                        <div class="menu_bottom">
                            <div class="menu_container">
                                <div class="menu_item" onclick="document.getElementById('home').scrollIntoView()"><i class="fa fa-home"></i> Home</div>
                                <div class="menu_item" onclick="document.getElementById('about_us').scrollIntoView()"><i class="fa fa-briefcase"></i>About Us</div>
                                <div class="menu_item" onclick="document.getElementById('product_services').scrollIntoView()"><i class="fa fa-ticket"></i>Product &amp; Services</div>
                                <div class="menu_item" onclick="document.getElementById('shop_online').scrollIntoView()"><i class="fa fa-archive"></i>Shop</div>
                                <div class="menu_item" onclick="document.getElementById('gallery').scrollIntoView()"><i class="fa fa-image"></i>Gallery</div>
                                <div class="menu_item" onclick="document.getElementById('youtube_video').scrollIntoView()"><i class="fa fa-video-camera"></i>Youtube Videos</div>
                                <div class="menu_item" onclick="document.getElementById('payment').scrollIntoView()"><i class="fa fa-money"></i>Payment</div>
                                <div class="menu_item" onclick="document.getElementById('enquery').scrollIntoView()"><i class="fa fa-comment"></i>Enquery</div>
                            </div>
                        </div>

                    </div>
                </body>
            </html>
        `;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Digital Card Themes</title>
            </Head>

            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold font-serif tracking-tight text-[#3e3832] flex items-center gap-2">
                            Digital Business Card Themes <Sparkles className="size-6 text-[#d3c0a3]" />
                        </h1>
                        <p className="text-sm text-[#706557]">
                            Select from our premium designs, customize layouts, and connect instantly.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#706557]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search themes (e.g. Template 12)..."
                            className="w-full rounded-xl border border-[#ebd9c1] bg-[#fdfbf7] pl-10 pr-4 py-2.5 text-sm text-[#3e3832] placeholder:text-[#706557]/60 focus:border-[#3d5644] focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Templates Grid */}
                {filteredTemplates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#ebd9c1] bg-[#fdfbf7]">
                        <p className="text-[#706557] text-sm">No templates match your search query.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filteredTemplates.map((temp) => (
                            <div
                                key={temp.id}
                                className="group bg-[#fdfbf7] border border-[#ebd9c1] rounded-2xl p-3 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#d3c0a3]"
                            >
                                {/* Mobile Phone Screen Mockup Container */}
                                <div className="relative w-full aspect-[9/18] bg-[#1a1a1a] rounded-[24px] overflow-hidden border-[4px] border-[#1a1a1a] shadow-lg flex flex-col p-1 transition-all">
                                    {/* Inner screen area */}
                                    <div className="relative w-full h-full bg-white rounded-[18px] overflow-hidden">
                                        {/* Phone Camera Notch */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1a1a1a] rounded-b-xl z-10 flex justify-center items-center">
                                            <div className="w-2 h-2 rounded-full bg-black shadow-inner"></div>
                                        </div>

                                        {/* Template Preview Image */}
                                        <img
                                            src={temp.thumbnail}
                                            alt={temp.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/business-cards/template1.png';
                                            }}
                                        />

                                        {/* <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-[1px]">
                                            <div className="w-full text-center py-2.5 bg-[#3d5644] text-white text-[10px] font-bold font-serif uppercase tracking-widest cursor-pointer shadow-lg" onClick={() => setPreviewingTemplate(temp)}>
                                                Live Preview
                                            </div>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="mt-4 px-1 text-center">
                                    <span className="font-bold font-serif text-md text-[#3e3832] block mb-4 truncate">
                                        {temp.name}
                                    </span>

                                    <button
                                        onClick={() => openPurchaseModal(temp)}
                                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#ebd9c1] hover:bg-[#e0ccb2] text-[#4a4238] border border-[#d3c0a3] rounded text-[11px] font-bold font-serif tracking-wide shadow-sm transition-colors uppercase"
                                    >
                                        <CreditCard className="size-3.5" /> Purchase / Use
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Modal - close button in header also has a "Choose this Template" CTA */}
            {previewingTemplate && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl h-[90vh] bg-[#fdfbf7] rounded-2xl border border-[#ebd9c1] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-[#ebd9c1] flex items-center justify-between text-[#706557] bg-[#fdfbf7]">
                            <div>
                                <h3 className="font-bold font-serif text-[#3e3832] text-md">{previewingTemplate.name}</h3>
                                <p className="text-[11px] uppercase tracking-widest font-bold">Live CSS preview</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex gap-1 border border-[#ebd9c1] rounded-lg p-0.5">
                                    <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-[#3d5644] text-[#fdfbf7]' : 'hover:bg-[#ebd9c1]/30 hover:text-[#3e3832]'}`} title="Mobile"><Smartphone className="size-4" /></button>
                                    <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded ${previewMode === 'tablet' ? 'bg-[#3d5644] text-[#fdfbf7]' : 'hover:bg-[#ebd9c1]/30 hover:text-[#3e3832]'}`} title="Tablet"><Tablet className="size-4" /></button>
                                    <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-[#3d5644] text-[#fdfbf7]' : 'hover:bg-[#ebd9c1]/30 hover:text-[#3e3832]'}`} title="Desktop"><Laptop className="size-4" /></button>
                                </div>

                                <button
                                    onClick={() => { setPreviewingTemplate(null); openPurchaseModal(previewingTemplate); }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ebd9c1] hover:bg-[#e0ccb2] text-[#4a4238] border border-[#d3c0a3] rounded-lg text-xs font-bold font-serif tracking-wide shadow-sm transition-colors uppercase"
                                >
                                    <CreditCard className="size-3.5" /> Choose this Template
                                </button>

                                <button onClick={() => setPreviewingTemplate(null)} className="p-1 text-[#706557] hover:text-[#3e3832] rounded-lg hover:bg-[#ebd9c1]/50 transition-colors">
                                    <X className="size-5" />
                                </button>
                            </div>
                        </div>

                        {/* Device Frame */}
                        <div className="flex-1 w-full flex items-center justify-center p-6 overflow-hidden bg-[#ebd9c1]/20">
                            <div className={`shadow-2xl flex flex-col transition-all duration-300 relative shrink-0 ${previewMode === 'mobile' ? 'w-[375px] aspect-[9/19.5] max-h-full bg-[#1a1a1a] border-[6px] border-[#1a1a1a] rounded-[44px] p-2'
                                : previewMode === 'tablet' ? 'w-[768px] aspect-[3/4] max-h-full bg-[#1a1a1a] border-[8px] border-[#1a1a1a] rounded-[32px] p-2'
                                    : 'w-full h-full bg-white rounded-xl shadow-none'
                                }`}>
                                {/* Device Notch */}
                                {previewMode !== 'desktop' && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-20 flex justify-center items-center">
                                        <div className="size-2 bg-black/80 shadow-inner rounded-full"></div>
                                    </div>
                                )}

                                {/* Screen Area */}
                                <div className={`w-full h-full bg-white overflow-hidden relative ${previewMode === 'mobile' ? 'rounded-[34px]'
                                    : previewMode === 'tablet' ? 'rounded-[22px]'
                                        : 'rounded-xl border border-[#ebd9c1]'
                                    }`}>
                                    <iframe
                                        title="Template Viewport"
                                        srcDoc={getPreviewHtml(previewingTemplate.css_file)}
                                        className="w-full h-full border-0 select-none overflow-y-auto bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== PURCHASE MODAL ===== */}
            {purchaseTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl bg-[#fdfbf7] rounded-2xl shadow-2xl border border-[#ebd9c1] overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebd9c1]">
                            <div className="flex items-center gap-3">
                                {purchaseStep === 'details' && (
                                    <button onClick={() => setPurchaseStep('plan')} className="p-1 hover:bg-[#ebd9c1]/50 rounded-lg transition-colors text-[#706557]">
                                        <ArrowLeft className="size-4" />
                                    </button>
                                )}
                                <div>
                                    <h2 className="text-lg font-bold font-serif text-[#3e3832]">
                                        {purchaseStep === 'plan' ? 'Choose a Subscription Plan' : 'Your Card Details'}
                                    </h2>
                                    <p className="text-xs text-[#706557] font-bold tracking-wider uppercase">{purchaseTemplate.name} — {purchaseTemplate.css_file}</p>
                                </div>
                            </div>
                            <button onClick={closePurchaseModal} className="p-1.5 hover:bg-[#ebd9c1]/50 rounded-lg text-[#706557]">
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Step 1: Plan Selection */}
                        {purchaseStep === 'plan' && (
                            <div className="p-6 flex flex-col gap-5">
                                {plans.length === 0 ? (
                                    <div className="text-center py-10 text-[#706557]">
                                        <CreditCard className="size-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-sm">No subscription plans available. Please contact the admin.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {plans.map(plan => (
                                                <button
                                                    key={plan.id}
                                                    onClick={() => setSelectedPlan(plan)}
                                                    className={`relative flex flex-col gap-2 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${selectedPlan?.id === plan.id
                                                        ? 'border-[#3d5644] bg-[#3d5644]/5 shadow-md'
                                                        : 'border-[#ebd9c1] hover:border-[#d3c0a3]'
                                                        }`}
                                                >
                                                    {selectedPlan?.id === plan.id && (
                                                        <span className="absolute top-3 right-3">
                                                            <CheckCircle2 className="size-4 text-[#3d5644]" />
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-2 text-[#706557]">
                                                        <Calendar className="size-4" />
                                                        <span className="text-xs font-semibold uppercase tracking-widest">
                                                            {plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <div className="text-2xl font-black text-[#3e3832] font-serif">
                                                        ₹{plan.price.toLocaleString('en-IN')}
                                                        <span className="text-xs font-bold font-sans text-[#706557] ml-1">/{plan.duration_months}mo</span>
                                                    </div>
                                                    <p className="font-bold text-sm text-[#4a4238] font-serif">{plan.name}</p>
                                                    {plan.description && (
                                                        <p className="text-xs text-[#706557] leading-relaxed">{plan.description}</p>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Trust badges */}
                                        <div className="flex items-center justify-center gap-6 py-2 text-[#706557]">
                                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"><ShieldCheck className="size-3.5 text-[#3d5644]" /> Secure Payment</span>
                                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"><CreditCard className="size-3.5 text-[#3d5644]" /> Razorpay</span>
                                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"><CheckCircle2 className="size-3.5 text-[#d3c0a3]" /> Instant Access</span>
                                        </div>

                                        {payError && <p className="text-red-500 text-xs text-center font-bold">{payError}</p>}

                                        <div className="flex gap-3 justify-end">
                                            <button onClick={closePurchaseModal} className="px-4 py-2 rounded-xl border border-[#ebd9c1] text-sm font-bold text-[#706557] hover:bg-[#ebd9c1]/30 transition-colors uppercase tracking-widest">Cancel</button>
                                            <button
                                                onClick={handleProceedToDetails}
                                                disabled={!selectedPlan}
                                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3d5644] hover:bg-[#2d4033] text-white text-sm font-bold font-serif shadow-sm disabled:opacity-50 transition-colors tracking-wide uppercase"
                                            >
                                                Next <ArrowRight className="size-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Step 2: Card Details + Pay */}
                        {purchaseStep === 'details' && (
                            <form onSubmit={handlePayNow} className="p-6 flex flex-col gap-5">

                                {/* Selected Plan Summary */}
                                {selectedPlan && (
                                    <div className="flex items-center justify-between rounded-xl bg-[#ebd9c1]/20 border border-[#ebd9c1] px-4 py-3">
                                        <div>
                                            <p className="text-xs font-bold text-[#3e3832] uppercase tracking-widest">{selectedPlan.name}</p>
                                            <p className="text-[11px] text-[#706557] font-bold">{selectedPlan.duration_months} months</p>
                                        </div>
                                        <span className="text-xl font-black text-[#3d5644] font-serif">₹{selectedPlan.price.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                {/* Company Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#706557]">Company / Business Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={companyName}
                                        onChange={handleCompanyNameChange}
                                        placeholder="e.g. Acme Corporation"
                                        className="w-full rounded-xl border border-[#ebd9c1] bg-white px-3 py-2.5 text-sm text-[#3e3832] focus:border-[#3d5644] focus:outline-none placeholder:text-[#706557]/50 transition-colors"
                                    />
                                </div>

                                {/* Slug */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#706557]">Card URL</label>
                                    <div className="flex items-center rounded-xl border border-[#ebd9c1] bg-white overflow-hidden transition-colors focus-within:border-[#3d5644]">
                                        <span className="px-3 py-2.5 text-[11px] font-mono bg-[#fdfbf7] text-[#706557] border-r border-[#ebd9c1]">/card/</span>
                                        <input
                                            type="text"
                                            required
                                            value={slug}
                                            onChange={e => setSlug(generateSlug(e.target.value))}
                                            placeholder="acme-corporation"
                                            className="w-full bg-transparent px-3 py-2.5 text-sm text-[#3e3832] focus:outline-none placeholder:text-[#706557]/50"
                                        />
                                    </div>
                                </div>

                                {payError && <p className="text-red-500 text-xs text-center bg-red-50 rounded-lg py-2 px-3 font-bold">{payError}</p>}

                                <div className="flex gap-3 justify-end">
                                    <button type="button" onClick={closePurchaseModal} className="px-4 py-2 rounded-xl border border-[#ebd9c1] text-[#706557] text-sm font-bold uppercase tracking-widest hover:bg-[#ebd9c1]/30 transition-colors">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={isPaying}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3d5644] hover:bg-[#2d4033] text-white text-sm font-bold font-serif shadow-sm disabled:opacity-70 transition-colors uppercase tracking-wide"
                                    >
                                        {isPaying ? <><Loader2 className="size-4 animate-spin" /> Creating...</> : <><ArrowRight className="size-4" /> Create & Preview</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
