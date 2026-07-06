import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    Phone, Mail, Globe, MapPin, Share2, Download, 
    Facebook, Instagram, Youtube, Linkedin, Twitter, 
    Star, MessageSquare, AlertCircle, CheckCircle
} from 'lucide-react';

interface Feedback {
    id: number;
    r_name: string;
    r_email: string;
    r_contact: string | null;
    r_star: number;
    r_msg: string | null;
    created_at: string;
}

interface BusinessCard {
    id: number;
    company_name: string;
    slug: string;
    theme_css: string;
    logo_path: string | null;
    personal_details: any;
    social_links: any;
    youtube_videos: any;
    payment_details: any;
    qr_codes: any;
    services: any;
    ecommerce_products: any;
    gallery: any;
    status: string;
    payment_status: string;
}

interface PageProps {
    card: BusinessCard;
    feedbacks: Feedback[];
}

const IconWrapper = ({ name }: { name: string }) => {
    const icons: Record<string, React.ReactNode> = {
        phone: (
            <svg viewBox="0 0 512 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                <path d="M493.4 376.6l-68.5-68.5c-15.2-15.2-39.8-15.2-55 0l-37.2 37.2c-50-25.2-90.8-66-116-116l37.2-37.2c15.2-15.2 15.2-39.8 0-55L185.4 18.6c-15.2-15.2-39.8-15.2-55 0L71 78c-12.7 12.7-18.7 30.6-16.1 48.4C71.3 246.3 169.7 413.7 385.6 457.1c17.8 3.6 35.7-2.4 48.4-15.1l59.4-59.4c15.2-15.2 15.2-39.8 0-56z"/>
            </svg>
        ),
        whatsapp: (
            <svg viewBox="0 0 448 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.2 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
        ),
        'map-marker': (
            <svg viewBox="0 0 384 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
            </svg>
        ),
        envelope: (
            <svg viewBox="0 0 512 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/>
            </svg>
        ),
        globe: (
            <svg viewBox="0 0 496 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                <path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-64c-28.7-4-68.6-8-116.5-8-11.2 73.8-32.3 133-56.2 172.6C395.7 321 441 262.3 476.7 192zm-58.3 128c-35.7 70.3-81 129-172.7 164.6 23.9-39.6 45-98.8 56.2-172.6 47.9 0 87.8 4 116.5 8zM18 192c35.7 70.3 81 129 172.7 164.6-23.9-39.6-45-98.8-56.2-172.6-47.9 0-87.8-4-116.5-8zm58.3 128c28.7 4 68.6 8 116.5 8 11.2-73.8 32.3-133 56.2-172.6C100.3 191 55 249.7 19.3 320zM248 504c39.8 0 74-62.7 88.5-152h-177c14.5 89.3 48.7 152 88.5 152z"/>
            </svg>
        ),
        facebook: (
            <svg viewBox="0 0 320 512" style={{ width: '14px', height: '14px', fill: 'currentColor' }}>
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
            </svg>
        ),
        instagram: (
            <svg viewBox="0 0 448 512" style={{ width: '14px', height: '14px', fill: 'currentColor' }}>
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8c14.8 0 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM402.5 344.2c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
        ),
        linkedin: (
            <svg viewBox="0 0 448 512" style={{ width: '14px', height: '14px', fill: 'currentColor' }}>
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
            </svg>
        ),
        twitter: (
            <svg viewBox="0 0 512 512" style={{ width: '14px', height: '14px', fill: 'currentColor' }}>
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.39 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
            </svg>
        ),
        youtube: (
            <svg viewBox="0 0 576 512" style={{ width: '14px', height: '14px', fill: 'currentColor' }}>
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
            </svg>
        ),
        pinterest: (
            <svg viewBox="0 0 496 512" style={{ width: '14px', height: '14px', fill: 'currentColor' }}>
                <path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.9C57.4 437.4 0 353.4 0 256 0 119 111 8 248 8s248 111 248 248z"/>
            </svg>
        ),
        download: (
            <svg viewBox="0 0 512 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1C77.5 213.5 86.4 192 104.3 192H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h144v48c0 13.3 10.7 24 24 24h128c13.3 0 24-10.7 24-24v-48h144c13.3 0 24 10.7 24 24zm-136 72c0-13.3-10.7-24-24-24s-24 10.7-24 24 10.7 24 24 24 24-10.7 24-24zm72 0c0-13.3-10.7-24-24-24s-24 10.7-24 24 10.7 24 24 24 24-10.7 24-24z"/>
            </svg>
        ),
        share: (
            <svg viewBox="0 0 448 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                <path d="M352 320c-22.608 0-43.306 9.319-58.377 24.341l-114.1-65.2c2.278-7.794 3.477-16.033 3.477-24.57 0-8.537-1.199-16.777-3.477-24.57l114.1-65.2C308.694 180.086 329.392 189 352 189c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 8.537 1.199 16.777 3.477 24.57l-114.1 65.2C130.306 170.914 109.608 162 86 162c-53.019 0-96 42.981-96 96s42.981 96 96 96c23.608 0 44.306-8.914 59.377-23.571l114.1 65.2c-2.278 7.794-3.477 16.033-3.477 24.57 0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z"/>
            </svg>
        ),
        rupee: (
            <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>₹</span>
        )
    };

    return (
        <span 
            className="inline-flex items-center justify-center" 
            style={{ 
                fontStyle: 'normal', 
                lineHeight: 1, 
                verticalAlign: 'middle', 
                width: '100%', 
                height: '100%',
            }}
        >
            {icons[name] || null}
        </span>
    );
};

export default function PublicBusinessCard({ card, feedbacks = [] }: PageProps) {
    const [copied, setCopied] = useState(false);
    const [wtspPhone, setWtspPhone] = useState('+91');

    const personal = card.personal_details || {};
    const social = card.social_links || {};
    const payments = card.payment_details || {};
    const qrs = card.qr_codes || {};
    const servicesList = card.services || [];
    const productsList = card.ecommerce_products || [];
    const videosList = (card.youtube_videos || []).filter(Boolean);
    const galleryList = card.gallery || [];

    // Inertia form for feedback
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        r_name: '',
        r_email: '',
        r_contact: '',
        r_star: 5,
        r_msg: ''
    });

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/card/${card.slug}/feedback`, {
            onSuccess: () => reset(),
        });
    };

    const copyCardLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper for converting youtube standard link to embed
    const getYoutubeEmbed = (url: string) => {
        return url
            .replace('youtu.be/', 'www.youtube.com/embed/')
            .replace('watch?v=', 'embed/');
    };

    const cleanWhatsapp = (num: string) => {
        return num.replace(/\D/g, '');
    };

    return (
        <div className="min-h-screen bg-[#111] flex justify-center pb-12">
            <Head title={`${card.company_name} - Digital Business Card`}>
                <meta name="description" content={personal.about_us || `${card.company_name} Digital Card`} />
                <link rel="stylesheet" href="/css/business-cards/awesome.min.css" />
                <link rel="stylesheet" href={`/css/business-cards/${card.theme_css}`} />
                <style>{`
                    .fa::before, .fa-facebook::before, .fa-instagram::before, .fa-linkedin::before, .fa-twitter::before, .fa-youtube::before, .fa-pinterest::before, .fa-phone::before, .fa-whatsapp::before, .fa-envelope::before, .fa-globe::before, .fa-map-marker::before, .fa-download::before, .fa-share-alt::before, .fa-rupee::before {
                        content: "" !important;
                        display: none !important;
                    }
                    .fa {
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                `}</style>
            </Head>

            <div className="w-full max-w-[480px] bg-[#1e1e1e] min-h-screen flex flex-col">
                
                {/* 1. HOME CARD SECTION */}
                <div className="card" id="home">
                    {card.logo_path && (
                        <div className="card_content">
                            <img src={card.logo_path} alt="Company Logo" />
                        </div>
                    )}
                    
                    <div className="card_content2">
                        <h2>{card.company_name}</h2>
                        <p>{personal.first_name} {personal.last_name}</p>
                        <p>{personal.designation}</p>
                    </div>

                    {/* Quick Link Buttons */}
                    <div className="dis_flex" style={{ flexWrap: 'wrap', gap: '8px' }}>
                        {personal.phone_1 && (
                            <a href={`tel:+91${personal.phone_1}`} target="_blank" rel="noreferrer">
                                <div className="link_btn"><i className="fa fa-phone"><IconWrapper name="phone" /></i> Call</div>
                            </a>
                        )}
                        {personal.whatsapp && (
                            <a href={`https://api.whatsapp.com/send?phone=91${cleanWhatsapp(personal.whatsapp)}&text=Hi, ${card.company_name}`} target="_blank" rel="noreferrer">
                                <div className="link_btn"><i className="fa fa-whatsapp"><IconWrapper name="whatsapp" /></i> WhatsApp</div>
                            </a>
                        )}
                        {personal.location_map && (
                            <a href={personal.location_map} target="_blank" rel="noreferrer">
                                <div className="link_btn"><i className="fa fa-map-marker"><IconWrapper name="map-marker" /></i> Direction</div>
                            </a>
                        )}
                        {personal.email && (
                            <a href={`mailto:${personal.email}`} target="_blank" rel="noreferrer">
                                <div className="link_btn"><i className="fa fa-envelope"><IconWrapper name="envelope" /></i> Mail</div>
                            </a>
                        )}
                        {personal.website && (
                            <a href={`https://${personal.website}`} target="_blank" rel="noreferrer">
                                <div className="link_btn"><i className="fa fa-globe"><IconWrapper name="globe" /></i> Website</div>
                            </a>
                        )}
                    </div>

                    {/* Personal / Company contact rows */}
                    <div className="contact_details">
                        {personal.phone_1 && (
                            <div className="contact_d">
                                <i className="fa fa-phone"><IconWrapper name="phone" /></i>
                                <p>{personal.phone_1}</p>
                            </div>
                        )}
                        {personal.phone_2 && (
                            <div className="contact_d">
                                <i className="fa fa-phone"><IconWrapper name="phone" /></i>
                                <p>{personal.phone_2}</p>
                            </div>
                        )}
                        {personal.email && (
                            <div className="contact_d">
                                <i className="fa fa-envelope"><IconWrapper name="envelope" /></i>
                                <p>{personal.email}</p>
                            </div>
                        )}
                        {personal.address && (
                            <div className="contact_d">
                                <i className="fa fa-map-marker"><IconWrapper name="map-marker" /></i>
                                <p>{personal.address}</p>
                            </div>
                        )}
                    </div>

                    {/* WhatsApp Quick Link Share Form */}
                    <div className="dis_flex">
                        <div className="share_wtsp">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    window.open(`https://api.whatsapp.com/send?phone=${cleanWhatsapp(wtspPhone)}&text=${encodeURIComponent(window.location.href)}`, '_blank');
                                }}
                                className="flex w-full"
                            >
                                <input 
                                    type="text" 
                                    value={wtspPhone}
                                    onChange={(e) => setWtspPhone(e.target.value)}
                                    placeholder="WhatsApp Number" 
                                    className="bg-transparent text-white px-2 py-1 flex-1 text-sm border-0 focus:ring-0 outline-none"
                                />
                                <button type="submit" className="wtsp_share_btn bg-green-600 px-3 py-1 flex items-center justify-center text-xs font-bold text-white rounded">
                                    <i className="fa fa-whatsapp mr-1" style={{ width: '12px', height: '12px' }}><IconWrapper name="whatsapp" /></i> Share
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* vCard and Link Share Buttons */}
                    <div className="dis_flex mt-3" style={{ gap: '8px' }}>
                        <a href={`/card/${card.slug}/vcard`} className="flex-1">
                            <div className="big_btns w-full text-center">
                                Save to Contacts <i className="fa fa-download ml-1" style={{ width: '12px', height: '12px' }}><IconWrapper name="download" /></i>
                            </div>
                        </a>
                        
                        <button onClick={copyCardLink} className="big_btns flex-1">
                            {copied ? 'Copied Link!' : 'Share Card'} <i className="fa fa-share-alt ml-1" style={{ width: '12px', height: '12px' }}><IconWrapper name="share" /></i>
                        </button>
                    </div>

                    {/* Social links bar */}
                    <div className="dis_flex mt-4" style={{ flexWrap: 'wrap', gap: '12px' }}>
                        {social.facebook && (
                            <a href={social.facebook} target="_blank" rel="noreferrer">
                                <div className="social_med"><i className="fa fa-facebook"><IconWrapper name="facebook" /></i></div>
                            </a>
                        )}
                        {social.instagram && (
                            <a href={social.instagram} target="_blank" rel="noreferrer">
                                <div className="social_med"><i className="fa fa-instagram"><IconWrapper name="instagram" /></i></div>
                            </a>
                        )}
                        {social.linkedin && (
                            <a href={social.linkedin} target="_blank" rel="noreferrer">
                                <div className="social_med"><i className="fa fa-linkedin"><IconWrapper name="linkedin" /></i></div>
                            </a>
                        )}
                        {social.twitter && (
                            <a href={social.twitter} target="_blank" rel="noreferrer">
                                <div className="social_med"><i className="fa fa-twitter"><IconWrapper name="twitter" /></i></div>
                            </a>
                        )}
                        {social.youtube && (
                            <a href={social.youtube} target="_blank" rel="noreferrer">
                                <div className="social_med"><i className="fa fa-youtube"><IconWrapper name="youtube" /></i></div>
                            </a>
                        )}
                        {social.pinterest && (
                            <a href={social.pinterest} target="_blank" rel="noreferrer">
                                <div className="social_med"><i className="fa fa-pinterest"><IconWrapper name="pinterest" /></i></div>
                            </a>
                        )}
                    </div>
                </div>

                {/* 2. ABOUT US SECTION */}
                <div className="card2" id="about_us">
                    <h3>About Us</h3>
                    {personal.est_date && <p className="text-xs text-neutral-450 italic mt-1">Est. Since {personal.est_date}</p>}
                    <p className="mt-2 text-sm leading-relaxed">{personal.about_us || 'No company details shared yet.'}</p>
                </div>

                {/* 3. PRODUCTS & SERVICES LIST */}
                {servicesList.length > 0 && (
                    <div className="card2" id="product_services">
                        <h3>Products & Services</h3>
                        {servicesList.map((service: any, idx: number) => (
                            <div key={idx} className="product_s">
                                <p>{service.name}</p>
                                {service.image_path && <img src={service.image_path} alt={service.name} />}
                                <div className="d_dis">
                                    {personal.whatsapp && (
                                        <a 
                                            href={`https://api.whatsapp.com/send?phone=91${cleanWhatsapp(personal.whatsapp)}&text=I am interested in service: ${service.name}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                        >
                                            <div className="btn_buy">Enquiry Now</div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. ECOMMERCE STORE */}
                {productsList.length > 0 && (
                    <div className="card2" id="shop_online">
                        <h3>Shop Online</h3>
                        <h3>From Our Store</h3>
                        <div className="space-y-4">
                            {productsList.map((prod: any, idx: number) => (
                                <div key={idx} className="order_box">
                                    {prod.image_path && <img src={prod.image_path} alt={prod.name} />}
                                    <h2>{prod.name}</h2>
                                    {prod.mrp && <p><del><i className="fa fa-rupee"><IconWrapper name="rupee" /></i> {prod.mrp}</del></p>}
                                    <h4>{prod.price} <i className="fa fa-rupee"><IconWrapper name="rupee" /></i></h4>
                                    {personal.whatsapp && (
                                        <a 
                                            href={`https://api.whatsapp.com/send?phone=91${cleanWhatsapp(personal.whatsapp)}&text=I am interested in purchasing Product: ${prod.name}, Price: ${prod.price}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <div className="btn_buy">Enquiry</div>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. YOUTUBE VIDEO EMBEDS */}
                {videosList.length > 0 && (
                    <div className="card2" id="youtube_video">
                        <h3>Youtube Videos</h3>
                        <div className="space-y-3">
                            {videosList.map((vidUrl: string, idx: number) => (
                                <iframe 
                                    key={idx}
                                    src={getYoutubeEmbed(vidUrl)} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    style={{ width: '100%', height: '220px', borderRadius: '8px' }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. PHOTO GALLERY */}
                {galleryList.length > 0 && (
                    <div className="card2" id="gallery">
                        <h3>Image Gallery</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {galleryList.map((imgUrl: string, idx: number) => (
                                <div key={idx} className="img_gall aspect-square rounded-lg overflow-hidden border border-neutral-800">
                                    <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 7. BANK DETAILS & UPI NUMBERS */}
                {(payments.paytm_number || payments.gpay_number || payments.phonepe_number || payments.account_number || qrs.paytm_qr_path || qrs.gpay_qr_path || qrs.phonepe_qr_path) && (
                    <div className="card2" id="payment">
                        <h3>Payment Info</h3>
                        {payments.paytm_number && (<h2>Paytm</h2>)}
                        {payments.paytm_number && (<p>{payments.paytm_number}</p>)}
                        {payments.gpay_number && (<h2>Google Pay</h2>)}
                        {payments.gpay_number && (<p>{payments.gpay_number}</p>)}
                        {payments.phonepe_number && (<h2>PhonePe</h2>)}
                        {payments.phonepe_number && (<p>{payments.phonepe_number}</p>)}

                        {payments.account_number && (
                            <>
                                <h3 className="mt-4 pt-3 border-t border-neutral-800">Bank Account Details</h3>
                                <h2>Name:</h2><p>{payments.holder_name}</p>
                                <h2>Account Number:</h2><p>{payments.account_number}</p>
                                <h2>IFSC Code:</h2><p>{payments.ifsc}</p>
                                <h2>BANK Name:</h2><p>{payments.bank_name}</p>
                            </>
                        )}

                        {payments.gst && (
                            <>
                                <h3 className="mt-3">GST Details</h3>
                                <h2>GST No:</h2><p>{payments.gst}</p>
                            </>
                        )}

                        {/* QRs */}
                        <div className="space-y-4 mt-4">
                            {qrs.paytm_qr_path && (
                                <div className="text-center">
                                    <p className="text-xs text-neutral-450 mb-1">Paytm QR Code</p>
                                    <img src={qrs.paytm_qr_path} alt="Paytm QR" className="mx-auto max-w-[160px] rounded-lg" />
                                </div>
                            )}
                            {qrs.gpay_qr_path && (
                                <div className="text-center">
                                    <p className="text-xs text-neutral-450 mb-1">Google Pay QR Code</p>
                                    <img src={qrs.gpay_qr_path} alt="GPay QR" className="mx-auto max-w-[160px] rounded-lg" />
                                </div>
                            )}
                            {qrs.phonepe_qr_path && (
                                <div className="text-center">
                                    <p className="text-xs text-neutral-450 mb-1">PhonePe QR Code</p>
                                    <img src={qrs.phonepe_qr_path} alt="PhonePe QR" className="mx-auto max-w-[160px] rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 8. FEEDBACK FORM SECTION */}
                <div className="card2" id="feedback">
                    <h3>Review & Feedback</h3>
                    
                    {wasSuccessful && (
                        <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-lg flex items-center gap-2 text-xs">
                            <CheckCircle className="size-4 shrink-0" />
                            <span>Your feedback has been successfully submitted!</span>
                        </div>
                    )}

                    <form onSubmit={handleFeedbackSubmit} className="space-y-3 mt-3">
                        <div className="flex gap-2 items-center justify-center py-2 bg-neutral-900 border border-neutral-800 rounded-lg">
                            <span className="text-xs text-neutral-450 font-semibold">Your Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('r_star', star)}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star className={`size-5 ${star <= data.r_star ? 'text-amber-500 fill-amber-500' : 'text-neutral-600'}`} />
                                </button>
                            ))}
                        </div>

                        <div>
                            <input 
                                type="text"
                                value={data.r_name}
                                onChange={(e) => setData('r_name', e.target.value)}
                                placeholder="Your Full Name *" 
                                required
                                className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none focus:border-neutral-700"
                            />
                            {errors.r_name && <p className="text-[10px] text-red-500 mt-1">{errors.r_name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input 
                                    type="email"
                                    value={data.r_email}
                                    onChange={(e) => setData('r_email', e.target.value)}
                                    placeholder="Your Email *" 
                                    required
                                    className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none focus:border-neutral-700"
                                />
                                {errors.r_email && <p className="text-[10px] text-red-500 mt-1">{errors.r_email}</p>}
                            </div>
                            <div>
                                <input 
                                    type="text"
                                    value={data.r_contact}
                                    onChange={(e) => setData('r_contact', e.target.value)}
                                    placeholder="Contact Number" 
                                    className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none focus:border-neutral-700"
                                />
                                {errors.r_contact && <p className="text-[10px] text-red-500 mt-1">{errors.r_contact}</p>}
                            </div>
                        </div>

                        <div>
                            <textarea 
                                value={data.r_msg}
                                onChange={(e) => setData('r_msg', e.target.value)}
                                placeholder="Write your feedback..." 
                                rows={3}
                                className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none focus:border-neutral-700"
                            />
                            {errors.r_msg && <p className="text-[10px] text-red-500 mt-1">{errors.r_msg}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-xs tracking-wider transition-colors uppercase"
                        >
                            {processing ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>

                    {/* Feedbacks Listing */}
                    <div className="mt-6 pt-4 border-t border-neutral-800 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-450 flex items-center gap-1">
                            <MessageSquare className="size-3.5" /> Recent Reviews ({feedbacks.length})
                        </h4>
                        
                        {feedbacks.length === 0 ? (
                            <p className="text-xs text-neutral-500 italic py-2">No reviews left yet. Be the first to submit!</p>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                {feedbacks.map((fb) => (
                                    <div key={fb.id} className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-lg text-xs">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <div>
                                                <p className="font-bold text-white">{fb.r_name}</p>
                                                <p className="text-[10px] text-neutral-500">{new Date(fb.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`size-3 ${i < fb.r_star ? 'text-amber-500 fill-amber-500' : 'text-neutral-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        {fb.r_msg && <p className="text-neutral-350 leading-relaxed">{fb.r_msg}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer brand */}
                <div className="mt-auto py-8 text-center text-[10px] text-neutral-600 border-t border-neutral-900 bg-black/20">
                    <p>© {new Date().getFullYear()} {card.company_name} | Powered by Invitify</p>
                </div>
            </div>
        </div>
    );
}
