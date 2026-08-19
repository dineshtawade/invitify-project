import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import axios from 'axios';
import {
    ChevronLeft, ChevronRight, Save, Upload, Trash2, Plus,
    Smartphone, Tablet, Laptop, Check, AlertCircle, FileText,
    Layers, User, Share2, CreditCard, ShoppingBag, ShoppingCart, Image as ImageIcon, Eye, ExternalLink, Download
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/customer/dashboard',
    },
    {
        title: 'Digital Business Cards',
        href: '/customer/business-cards',
    },
    {
        title: 'Card Designer',
        href: '#',
    },
];

interface Template {
    id: number;
    name: string;
    css_file: string;
    thumbnail: string;
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
    card: BusinessCard | null;
    templates: Template[];
    razorpayKeyId?: string;
}

const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.85): Promise<File> => {
    return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Scale down if dimensions exceed max limits
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file);
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // For PNGs, keep image/png to preserve transparent backgrounds
                // For other images (JPG/WEBP), convert to image/jpeg for excellent compression
                const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: outputType,
                                lastModified: Date.now(),
                            });
                            // Only use compressed version if it is actually smaller
                            if (compressedFile.size < file.size) {
                                resolve(compressedFile);
                            } else {
                                resolve(file);
                            }
                        } else {
                            resolve(file);
                        }
                    },
                    outputType,
                    quality
                );
            };
            img.onerror = () => resolve(file);
            img.src = event.target?.result as string;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });
};

export default function BusinessCardEdit({ card, templates = [], razorpayKeyId = '' }: PageProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [csrfToken, setCsrfToken] = useState('');

    // State matching our Eloquent model fields
    const [cardState, setCardState] = useState<Partial<BusinessCard>>({
        id: card?.id,
        company_name: card?.company_name || '',
        slug: card?.slug || '',
        theme_css: card?.theme_css || 'card_css1.css',
        logo_path: card?.logo_path || null,
        personal_details: card?.personal_details || {
            first_name: '', last_name: '', designation: '', phone_1: '', phone_2: '',
            whatsapp: '', address: '', email: '', website: '', location_map: '', est_date: '', about_us: ''
        },
        social_links: card?.social_links || {
            facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', pinterest: '', map_review: ''
        },
        youtube_videos: card?.youtube_videos || ['', '', '', '', ''],
        payment_details: card?.payment_details || {
            paytm_number: '', gpay_number: '', phonepe_number: '', bank_name: '', holder_name: '', account_number: '', ifsc: '', gst: ''
        },
        qr_codes: card?.qr_codes || { paytm_qr_path: '', gpay_qr_path: '', phonepe_qr_path: '' },
        services: card?.services || [],
        ecommerce_products: card?.ecommerce_products || [],
        gallery: card?.gallery || [],
        status: card?.status || 'active',
        payment_status: card?.payment_status || 'Created',
    });

    useEffect(() => {
        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        if (tokenMeta) {
            setCsrfToken(tokenMeta.getAttribute('content') || '');
        }
    }, []);

    useEffect(() => {
        document.title = `Design Card - ${cardState.company_name || ''}`;
    }, [cardState.company_name]);

    // Step configuration
    const steps = [
        { id: 1, label: 'Select Theme', icon: Layers },
        { id: 2, label: 'Company Details', icon: User },
        { id: 3, label: 'Social Links', icon: Share2 },
        { id: 4, label: 'Payment Options', icon: CreditCard },
        { id: 5, label: 'Products & Services', icon: ShoppingBag },
        { id: 6, label: 'Order Page', icon: ShoppingCart },
        { id: 7, label: 'Image Gallery', icon: ImageIcon },
        { id: 8, label: 'Preview Card', icon: Eye },
    ];

    // Autosave function using axios
    const saveDraft = async (targetStep?: number) => {
        if (!cardState.id) return;
        setIsSaving(true);
        setSaveMessage('');
        try {
            const response = await axios.put(`/customer/business-cards/${cardState.id}`, cardState);
            if (response.data.success) {
                setSaveMessage('Draft saved successfully!');
                if (targetStep) {
                    setCurrentStep(targetStep);
                }
            }
        } catch (error) {
            console.error('Error saving draft', error);
            setSaveMessage('Failed to save draft.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const handlePayment = async () => {
        if (!cardState.id) return;
        setIsSaving(true); // Using isSaving to block buttons
        setSaveMessage('Initiating payment...');
        try {
            // First save any unsaved changes
            await axios.put(`/customer/business-cards/${cardState.id}`, cardState);

            // 1. Create order
            const orderRes = await fetch(`/customer/business-cards/${cardState.id}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken }
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed.');

            const verifyPayment = async (payload: object) => {
                const res = await fetch(`/customer/business-cards/${cardState.id}/verify-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Payment verification failed.');
                setSaveMessage('Payment Successful!');
                window.location.reload(); // Reload to reflect paid status
            };

            if (orderData.mock) {
                await verifyPayment({ mock: true });
                return;
            }

            // 2. Open Razorpay checkout
            const RazorpayConstructor = (window as any).Razorpay;
            if (!RazorpayConstructor) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
                    document.head.appendChild(script);
                });
            }

            const rzp = new (window as any).Razorpay({
                key: orderData.key_id || razorpayKeyId,
                amount: orderData.amount,
                currency: 'INR',
                name: 'Invitify Digital Card',
                description: `Business Card Payment`,
                order_id: orderData.order_id,
                handler: async (response: any) => {
                    setSaveMessage('Verifying payment...');
                    await verifyPayment({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        mock: false,
                    });
                },
                theme: { color: '#2563eb' },
                modal: { ondismiss: () => { setIsSaving(false); setSaveMessage(''); } },
            });
            rzp.open();
        } catch (err: any) {
            setSaveMessage(err.message || 'Payment failed.');
            setIsSaving(false);
        }
    };

    // Generic Input Change Handlers
    const updatePersonalDetails = (field: string, value: string) => {
        setCardState(prev => ({
            ...prev,
            personal_details: {
                ...prev.personal_details,
                [field]: value
            }
        }));
    };

    const updateSocialLinks = (field: string, value: string) => {
        setCardState(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [field]: value
            }
        }));
    };

    const updatePaymentDetails = (field: string, value: string) => {
        setCardState(prev => ({
            ...prev,
            payment_details: {
                ...prev.payment_details,
                [field]: value
            }
        }));
    };

    const updateYoutubeVideo = (index: number, value: string) => {
        setCardState(prev => {
            const videos = [...(prev.youtube_videos || ['', '', '', '', ''])];
            videos[index] = value;
            return { ...prev, youtube_videos: videos };
        });
    };

    // Helper for file uploading via /media/upload route
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (path: string) => void) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        let fileToUpload = files[0];

        try {
            setIsSaving(true);

            // Compress the image before uploading
            if (fileToUpload.type.startsWith('image/')) {
                fileToUpload = await compressImage(fileToUpload);
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);

            const response = await axios.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken
                }
            });
            callback(response.data.url);
        } catch (error) {
            alert('Upload failed. Maximum size is 50MB and allowed extensions include JPG, PNG, WEBP, GIF.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Dynamic Lists Actions (Services, Products, Gallery)
    const addService = () => {
        if ((cardState.services || []).length >= 10) return;
        setCardState(prev => ({
            ...prev,
            services: [...(prev.services || []), { name: '', image_path: '' }]
        }));
    };

    const updateService = (index: number, key: 'name' | 'image_path', value: string) => {
        setCardState(prev => {
            const list = [...(prev.services || [])];
            list[index] = { ...list[index], [key]: value };
            return { ...prev, services: list };
        });
    };

    const removeService = (index: number) => {
        setCardState(prev => ({
            ...prev,
            services: (prev.services || []).filter((_: any, i: number) => i !== index)
        }));
    };

    const addProduct = () => {
        if ((cardState.ecommerce_products || []).length >= 20) return;
        setCardState(prev => ({
            ...prev,
            ecommerce_products: [...(prev.ecommerce_products || []), { name: '', mrp: '', price: '', image_path: '' }]
        }));
    };

    const updateProduct = (index: number, key: 'name' | 'mrp' | 'price' | 'image_path', value: string) => {
        setCardState(prev => {
            const list = [...(prev.ecommerce_products || [])];
            list[index] = { ...list[index], [key]: value };
            return { ...prev, ecommerce_products: list };
        });
    };

    const removeProduct = (index: number) => {
        setCardState(prev => ({
            ...prev,
            ecommerce_products: (prev.ecommerce_products || []).filter((_: any, i: number) => i !== index)
        }));
    };

    const addGalleryImage = (url: string) => {
        if ((cardState.gallery || []).length >= 10) return;
        setCardState(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), url]
        }));
    };

    const removeGalleryImage = (index: number) => {
        setCardState(prev => ({
            ...prev,
            gallery: (prev.gallery || []).filter((_: any, i: number) => i !== index)
        }));
    };

    // Live Device Iframe Content Generation
    const getPreviewHtml = () => {
        const cssFile = cardState.theme_css || 'card_css1.css';
        const personal = cardState.personal_details || {};
        const social = cardState.social_links || {};
        const payments = cardState.payment_details || {};
        const qrs = cardState.qr_codes || {};
        const servicesList = cardState.services || [];
        const productsList = cardState.ecommerce_products || [];
        const galleryList = cardState.gallery || [];
        const logo = cardState.logo_path || '/theinvitify-removebg-preview.png';
        const title = personal.designation || '';
        const company = cardState.company_name || '';
        const name = `${personal.first_name || ''} ${personal.last_name || ''}`;

        let servicesHtml = '';
        if (servicesList.length > 0) {
            servicesHtml = `<div class="card2" id="product_services"><h3>Products & Services</h3>`;
            servicesList.forEach((s: any) => {
                if (s.name || s.image_path) {
                    servicesHtml += `
                        <div class="product_s">
                            <p>${s.name || ''}</p>
                            ${s.image_path ? `<img src="${s.image_path}" alt="Service Image">` : ''}
                            <div class="d_dis">
                                <a href="#" onclick="event.preventDefault()"><div class='btn_buy'>Enquiry Now</div></a>
                            </div>
                        </div>`;
                }
            });
            servicesHtml += `</div>`;
        }

        let productsHtml = '';
        if (productsList.length > 0) {
            productsHtml = `<div class="card2" id="shop_online"><h3>Shop Online</h3><h3>From Our Store</h3>`;
            productsList.forEach((p: any) => {
                if (p.name || p.price) {
                    productsHtml += `
                        <div class="order_box">
                            ${p.image_path ? `<img src="${p.image_path}" alt="Product">` : ''}
                            <h2>${p.name || ''}</h2>
                            ${p.mrp ? `<p><del><i class="fa fa-rupee"></i>${p.mrp}</del></p>` : ''}
                            <h4>${p.price || ''} <i class="fa fa-rupee"></i></h4>
                            <div class='btn_buy'>Enquiry</div>
                        </div>`;
                }
            });
            productsHtml += `</div>`;
        }

        let youtubeHtml = '';
        const videos = (cardState.youtube_videos || []).filter(Boolean);
        if (videos.length > 0) {
            youtubeHtml = `<div class="card2" id="youtube_video"><h3>Youtube Videos</h3>`;
            videos.forEach((v: string) => {
                let embed = v.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/');
                youtubeHtml += `<iframe src="${embed}" frameborder="0" allowfullscreen style="width:100%; height:200px; margin-bottom:10px; border-radius:8px;"></iframe>`;
            });
            youtubeHtml += `</div>`;
        }

        let galleryHtml = '';
        if (galleryList.length > 0) {
            galleryHtml = `<div class="card2" id="gallery"><h3>Image Gallery</h3>`;
            galleryList.forEach((img: string) => {
                galleryHtml += `<div class="img_gall"><img src="${img}" alt="Gallery Image" style="width:100%; border-radius:8px; margin-bottom:10px;"></div>`;
            });
            galleryHtml += `</div>`;
        }

        let paymentHtml = '';
        if (payments.paytm_number || payments.gpay_number || payments.phonepe_number || payments.account_number) {
            paymentHtml = `<div class="card2" id="payment"><h3>Payment Info</h3>`;
            if (payments.paytm_number) paymentHtml += `<h2>Paytm</h2><p>${payments.paytm_number}</p>`;
            if (payments.gpay_number) paymentHtml += `<h2>Google Pay</h2><p>${payments.gpay_number}</p>`;
            if (payments.phonepe_number) paymentHtml += `<h2>PhonePe</h2><p>${payments.phonepe_number}</p>`;
            if (payments.account_number) {
                paymentHtml += `
                    <h3>Bank Account Details</h3>
                    <h2>Name:</h2><p>${payments.holder_name || ''}</p>
                    <h2>Account Number:</h2><p>${payments.account_number || ''}</p>
                    <h2>IFSC Code:</h2><p>${payments.ifsc || ''}</p>
                    <h2>BANK Name:</h2><p>${payments.bank_name || ''}</p>`;
            }
            if (qrs.paytm_qr_path) paymentHtml += `<img src="${qrs.paytm_qr_path}" alt="Paytm QR" style="max-width:150px; display:block; margin: 10px auto;">`;
            if (qrs.gpay_qr_path) paymentHtml += `<img src="${qrs.gpay_qr_path}" alt="GPay QR" style="max-width:150px; display:block; margin: 10px auto;">`;
            if (qrs.phonepe_qr_path) paymentHtml += `<img src="${qrs.phonepe_qr_path}" alt="PhonePe QR" style="max-width:150px; display:block; margin: 10px auto;">`;
            paymentHtml += `</div>`;
        }

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="/css/business-cards/awesome.min.css">
                    <link rel="stylesheet" href="/css/business-cards/${cssFile}">
                    <style>
                        body { 
                            margin: 0; 
                            padding: 10px; 
                            background: #111; 
                            color: #fff;
                            display: flex;
                            justify-content: center;
                            box-sizing: border-box;
                        }
                        .preview-wrapper {
                            width: 100%;
                            max-width: 480px;
                            background: #1e1e1e;
                            min-height: 100vh;
                            box-sizing: border-box;
                        }
                        .card2, .card {
                            width: 100% !important;
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                            margin: 10px auto !important;
                        }
                    </style>
                </head>
                <body>
                    <div class="preview-wrapper">
                        <div class="card" id="home">
                            <div class="card_content">
                                <img src="${logo}" alt="Logo" style="max-height:100px; border-radius:8px;">
                            </div>
                            <div class="card_content2">
                                <h2>${company || 'Company Name'}</h2>
                                <p>${name || 'Full Name'}</p>
                                <p>${title || 'Designation'}</p>
                            </div>
                            <div class="dis_flex" style="flex-wrap: wrap;">
                                ${personal.phone_1 ? `<a href="#"><div class="link_btn"><i class="fa fa-phone" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; margin-right: 4px; vertical-align: middle;"><svg viewBox="0 0 512 512" style="width: 10px; height: 10px; fill: currentColor;"><path d="M493.4 376.6l-68.5-68.5c-15.2-15.2-39.8-15.2-55 0l-37.2 37.2c-50-25.2-90.8-66-116-116l37.2-37.2c15.2-15.2 15.2-39.8 0-55L185.4 18.6c-15.2-15.2-39.8-15.2-55 0L71 78c-12.7 12.7-18.7 30.6-16.1 48.4C71.3 246.3 169.7 413.7 385.6 457.1c17.8 3.6 35.7-2.4 48.4-15.1l59.4-59.4c15.2-15.2 15.2-39.8 0-56z"/></svg></i> Call</div></a>` : ''}
                                ${personal.whatsapp ? `<a href="#"><div class="link_btn"><i class="fa fa-whatsapp" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; margin-right: 4px; vertical-align: middle;"><svg viewBox="0 0 448 512" style="width: 10px; height: 10px; fill: currentColor;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.2 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></i> WhatsApp</div></a>` : ''}
                                ${personal.email ? `<a href="#"><div class="link_btn"><i class="fa fa-envelope" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; margin-right: 4px; vertical-align: middle;"><svg viewBox="0 0 512 512" style="width: 10px; height: 10px; fill: currentColor;"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg></i> Mail</div></a>` : ''}
                                ${personal.website ? `<a href="#"><div class="link_btn"><i class="fa fa-globe" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; margin-right: 4px; vertical-align: middle;"><svg viewBox="0 0 496 512" style="width: 10px; height: 10px; fill: currentColor;"><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-64c-28.7-4-68.6-8-116.5-8-11.2 73.8-32.3 133-56.2 172.6C395.7 321 441 262.3 476.7 192zm-58.3 128c-35.7 70.3-81 129-172.7 164.6 23.9-39.6 45-98.8 56.2-172.6 47.9 0 87.8 4 116.5 8zM18 192c35.7 70.3 81 129 172.7 164.6-23.9-39.6-45-98.8-56.2-172.6-47.9 0-87.8-4-116.5-8zm58.3 128c28.7 4 68.6 8 116.5 8 11.2-73.8 32.3-133 56.2-172.6C100.3 191 55 249.7 19.3 320zM248 504c39.8 0 74-62.7 88.5-152h-177c14.5 89.3 48.7 152 88.5 152z"/></svg></i> Website</div></a>` : ''}
                            </div>
                            <div class="contact_details">
                                ${personal.phone_1 ? `<div class="contact_d"><i class="fa fa-phone" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center;"><svg viewBox="0 0 512 512" style="width: 14px; height: 14px; fill: currentColor;"><path d="M493.4 376.6l-68.5-68.5c-15.2-15.2-39.8-15.2-55 0l-37.2 37.2c-50-25.2-90.8-66-116-116l37.2-37.2c15.2-15.2 15.2-39.8 0-55L185.4 18.6c-15.2-15.2-39.8-15.2-55 0L71 78c-12.7 12.7-18.7 30.6-16.1 48.4C71.3 246.3 169.7 413.7 385.6 457.1c17.8 3.6 35.7-2.4 48.4-15.1l59.4-59.4c15.2-15.2 15.2-39.8 0-56z"/></svg></i><p>${personal.phone_1}</p></div>` : ''}
                                ${personal.email ? `<div class="contact_d"><i class="fa fa-envelope" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center;"><svg viewBox="0 0 512 512" style="width: 14px; height: 14px; fill: currentColor;"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg></i><p>${personal.email}</p></div>` : ''}
                                ${personal.address ? `<div class="contact_d"><i class="fa fa-map-marker" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center;"><svg viewBox="0 0 384 512" style="width: 14px; height: 14px; fill: currentColor;"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg></i><p>${personal.address}</p></div>` : ''}
                            </div>
                            <div class="dis_flex">
                                ${social.facebook ? `<a href="#"><div class="social_med"><i class="fa fa-facebook" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center;"><svg viewBox="0 0 320 512" style="width: 12px; height: 12px; fill: currentColor;"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg></i></div></a>` : ''}
                                ${social.instagram ? `<a href="#"><div class="social_med"><i class="fa fa-instagram" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center;"><svg viewBox="0 0 448 512" style="width: 12px; height: 12px; fill: currentColor;"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8c14.8 0 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM402.5 344.2c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></i></div></a>` : ''}
                                ${social.linkedin ? `<a href="#"><div class="social_med"><i class="fa fa-linkedin" style="font-style: normal; display: inline-flex; align-items: center; justify-content: center;"><svg viewBox="0 0 448 512" style="width: 12px; height: 12px; fill: currentColor;"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg></i></div></a>` : ''}
                            </div>
                        </div>

                        <div class="card2" id="about_us">
                            <h3>About Us</h3>
                            <p>${personal.est_date ? `Est. Since: ${personal.est_date}` : ''}</p>
                            <p>${personal.about_us || 'Your business introduction will appear here...'}</p>
                        </div>

                        ${servicesHtml}
                        ${productsHtml}
                        ${youtubeHtml}
                        ${galleryHtml}
                        ${paymentHtml}
                    </div>
                    <script>
                        window.addEventListener('DOMContentLoaded', () => {
                            const cssUrl = "/css/business-cards/${cssFile}";
                            fetch(cssUrl)
                                .then(res => res.text())
                                .then(cssText => {
                                    const applyFallback = (selector) => {
                                        const escapedSelector = selector === '.card' ? '\\\\.card' : '\\\\.card2';
                                        const regex = new RegExp(escapedSelector + '\\\\s*\\\\{([^}]+)\\\\\}', 'g');
                                        let match;
                                        while ((match = regex.exec(cssText)) !== null) {
                                            const declarations = match[1];
                                            const colorMatches = declarations.matchAll(/background(?:-color)?:\\s*(#[0-9a-fA-F]{3,8}|rgba?\\([^)]+\\)|[a-zA-Z]+)(?![^;]*url)/g);
                                            for (const colorMatch of colorMatches) {
                                                const color = colorMatch[1];
                                                const elements = document.querySelectorAll(selector);
                                                elements.forEach(el => {
                                                    el.style.backgroundColor = color;
                                                });
                                            }
                                        }
                                    };
                                    applyFallback('.card');
                                    applyFallback('.card2');
                                })
                                .catch(err => console.error('Fallback background load failed:', err));
                        });
                    </script>
                </body>
            </html>
        `;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>


            <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-y-auto lg:overflow-hidden bg-slate-50">
                {/* Left Side Editing Wizard */}
                <div className={`${currentStep === 8 ? 'w-full lg:w-1/2' : 'w-full'} flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-white h-auto lg:h-full min-h-[80vh] transition-all duration-500 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10`}>
                    {/* Header */}
                    <div className="p-4 sm:px-8 sm:py-4 border-b border-slate-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="w-full sm:w-auto">
                            <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight truncate">{cardState.company_name || 'New Design'}</h2>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold whitespace-nowrap">Step {currentStep} of {steps.length}</span>
                                <span className="truncate">{steps[currentStep - 1].label}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {isSaving && <span className="text-xs font-medium text-slate-400 animate-pulse flex items-center gap-1 whitespace-nowrap"><div className="size-1.5 bg-slate-400 rounded-full animate-bounce"></div> Saving...</span>}
                            {saveMessage && <span className="text-xs text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">{saveMessage}</span>}

                            {cardState.payment_status === 'Pending' && (
                                <button
                                    onClick={handlePayment}
                                    disabled={isSaving}
                                    className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                                >
                                    <CreditCard className="size-3.5 sm:size-4" /> Publish & Pay
                                </button>
                            )}

                            <button
                                onClick={() => saveDraft()}
                                disabled={isSaving}
                                className="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-slate-700 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                            >
                                <Save className="size-3.5 sm:size-4 text-slate-500" /> Save Draft
                            </button>
                        </div>
                    </div>

                    {/* Progress Selector */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {steps.map((st) => {
                                const IconComponent = st.icon;
                                const isActive = currentStep === st.id;
                                const isCompleted = currentStep > st.id;
                                return (
                                    <button
                                        key={st.id}
                                        onClick={() => saveDraft(st.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 border ${isActive
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-md font-semibold'
                                            : isCompleted
                                                ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-medium'
                                                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium'
                                            }`}
                                    >
                                        <IconComponent className={`size-4 ${isActive ? 'text-white' : isCompleted ? 'text-blue-500' : 'text-slate-400'}`} />
                                        {st.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                        {/* STEP 1: IDENTITY & THEME */}
                        {currentStep === 1 && (
                            <div className="space-y-6 max-w-7xl mx-auto">
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-slate-800">Choose a Theme</h3>
                                        <p className="text-sm">Select a design template for your business card. You can preview it on the right.</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-4">
                                        {templates.map((temp) => {
                                            const isSelected = cardState.theme_css === temp.css_file;
                                            return (
                                                <button
                                                    key={temp.id}
                                                    onClick={() => setCardState(prev => ({ ...prev, theme_css: temp.css_file }))}
                                                    className={`group flex flex-col items-center rounded-2xl text-center p-2.5 transition-all duration-300 relative ${isSelected
                                                        ? 'bg-slate-50 shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-2 ring-slate-800 ring-offset-2 scale-[1.02]'
                                                        : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute -top-3 -right-3 bg-slate-900 text-white p-1.5 rounded-full shadow-md z-20">
                                                            <Check className="size-4" />
                                                        </div>
                                                    )}
                                                    {/* Mini Phone mockup wrapper */}
                                                    <div className="w-full px-2 sm:px-4 py-1">
                                                        <div className={`relative w-full mx-auto aspect-[9/18.5] bg-black rounded-[20px] overflow-hidden border-[5px] shadow-md flex flex-col mb-2 transition-all duration-300 ${isSelected ? 'border-black ring-4 ring-blue-500/30' : 'border-neutral-900 group-hover:border-black group-hover:shadow-lg group-hover:-translate-y-1'}`}>
                                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[35%] h-3 bg-black rounded-b-xl z-10 flex justify-center items-center">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800/80 shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
                                                            </div>
                                                            <img
                                                                src={temp.thumbnail}
                                                                alt={temp.name}
                                                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/images/business-cards/template1.png';
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className={`text-[13px] font-bold truncate w-full transition-colors duration-300 ${isSelected ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{temp.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: COMPANY & PERSONAL DETAILS */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-1000">Company / Business Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={cardState.company_name}
                                        onChange={(e) => setCardState(prev => ({ ...prev, company_name: e.target.value }))}
                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-20 rounded-xl border border-neutral-200  flex items-center justify-center overflow-hidden bg-neutral-50  relative">
                                        {cardState.logo_path ? (
                                            <img src={cardState.logo_path} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-[10px] text-neutral-450">LOGO</span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm">
                                            <Upload className="size-3.5" /> Upload Logo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileUpload(e, (url) => setCardState(prev => ({ ...prev, logo_path: url })))}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">First Name</label>
                                        <input
                                            type="text"
                                            value={cardState.personal_details?.first_name || ''}
                                            onChange={(e) => updatePersonalDetails('first_name', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Last Name</label>
                                        <input
                                            type="text"
                                            value={cardState.personal_details?.last_name || ''}
                                            onChange={(e) => updatePersonalDetails('last_name', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Designation / Position</label>
                                        <input
                                            type="text"
                                            value={cardState.personal_details?.designation || ''}
                                            onChange={(e) => updatePersonalDetails('designation', e.target.value)}
                                            placeholder="e.g. Director, Manager"
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Est. Start Date</label>
                                        <input
                                            type="text"
                                            value={cardState.personal_details?.est_date || ''}
                                            onChange={(e) => updatePersonalDetails('est_date', e.target.value)}
                                            placeholder="e.g. 2018 or 15-May-2020"
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Primary Phone</label>
                                        <input
                                            type="text"
                                            value={cardState.personal_details?.phone_1 || ''}
                                            onChange={(e) => updatePersonalDetails('phone_1', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">WhatsApp No</label>
                                        <input
                                            type="text"
                                            value={cardState.personal_details?.whatsapp || ''}
                                            onChange={(e) => updatePersonalDetails('whatsapp', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Alternate Phone</label>
                                        <input
                                            type="text"
                                            value={cardState.personal_details?.phone_2 || ''}
                                            onChange={(e) => updatePersonalDetails('phone_2', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Email Address</label>
                                        <input
                                            type="email"
                                            value={cardState.personal_details?.email || ''}
                                            onChange={(e) => updatePersonalDetails('email', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-1000">Website Address</label>
                                    <input
                                        type="text"
                                        value={cardState.personal_details?.website || ''}
                                        onChange={(e) => updatePersonalDetails('website', e.target.value)}
                                        placeholder="e.g. www.mycompany.com"
                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-1000">Google Map Link / Location</label>
                                    <input
                                        type="text"
                                        value={cardState.personal_details?.location_map || ''}
                                        onChange={(e) => updatePersonalDetails('location_map', e.target.value)}
                                        placeholder="Google Maps Embed or Link URL"
                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-1000">Full Address</label>
                                    <textarea
                                        value={cardState.personal_details?.address || ''}
                                        onChange={(e) => updatePersonalDetails('address', e.target.value)}
                                        rows={2}
                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-1000">About Us / Description</label>
                                    <textarea
                                        value={cardState.personal_details?.about_us || ''}
                                        onChange={(e) => updatePersonalDetails('about_us', e.target.value)}
                                        rows={3}
                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SOCIAL MEDIA & YOUTUBE EMBEDS */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-neutral-700 ">Social Profile Links</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Facebook Link</label>
                                        <input
                                            type="text"
                                            value={cardState.social_links?.facebook || ''}
                                            onChange={(e) => updateSocialLinks('facebook', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Instagram Link</label>
                                        <input
                                            type="text"
                                            value={cardState.social_links?.instagram || ''}
                                            onChange={(e) => updateSocialLinks('instagram', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">LinkedIn Link</label>
                                        <input
                                            type="text"
                                            value={cardState.social_links?.linkedin || ''}
                                            onChange={(e) => updateSocialLinks('linkedin', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Pinterest Link</label>
                                        <input
                                            type="text"
                                            value={cardState.social_links?.pinterest || ''}
                                            onChange={(e) => updateSocialLinks('pinterest', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Twitter Link</label>
                                        <input
                                            type="text"
                                            value={cardState.social_links?.twitter || ''}
                                            onChange={(e) => updateSocialLinks('twitter', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Google Map Review Link</label>
                                        <input
                                            type="text"
                                            value={cardState.social_links?.map_review || ''}
                                            onChange={(e) => updateSocialLinks('map_review', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: BANK ACCOUNT & PAYMENTS QR CODES */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-neutral-700 ">UPI Numbers</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Paytm No</label>
                                        <input
                                            type="text"
                                            value={cardState.payment_details?.paytm_number || ''}
                                            onChange={(e) => updatePaymentDetails('paytm_number', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Google Pay No</label>
                                        <input
                                            type="text"
                                            value={cardState.payment_details?.gpay_number || ''}
                                            onChange={(e) => updatePaymentDetails('gpay_number', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">PhonePe No</label>
                                        <input
                                            type="text"
                                            value={cardState.payment_details?.phonepe_number || ''}
                                            onChange={(e) => updatePaymentDetails('phonepe_number', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-neutral-700  pt-3 border-t border-neutral-100 ">Bank Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Bank Name</label>
                                        <input
                                            type="text"
                                            value={cardState.payment_details?.bank_name || ''}
                                            onChange={(e) => updatePaymentDetails('bank_name', e.target.value)}
                                            placeholder="e.g. HDFC Bank"
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Account Holder Name</label>
                                        <input
                                            type="text"
                                            value={cardState.payment_details?.holder_name || ''}
                                            onChange={(e) => updatePaymentDetails('holder_name', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Account Number</label>
                                        <input
                                            type="text"
                                            value={cardState.payment_details?.account_number || ''}
                                            onChange={(e) => updatePaymentDetails('account_number', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Bank IFSC Code</label>
                                        <input
                                            type="text"
                                            value={cardState.payment_details?.ifsc || ''}
                                            onChange={(e) => updatePaymentDetails('ifsc', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-1000">GST / Account Type</label>
                                    <input
                                        type="text"
                                        value={cardState.payment_details?.gst || ''}
                                        onChange={(e) => updatePaymentDetails('gst', e.target.value)}
                                        placeholder="GST Number"
                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                    />
                                </div>

                                <h3 className="text-sm font-bold text-neutral-700  pt-3 border-t border-neutral-100 ">QR Code Image Uploads</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">Paytm QR</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, (url) => setCardState(prev => ({
                                                ...prev,
                                                qr_codes: { ...prev.qr_codes, paytm_qr_path: url }
                                            })))}
                                            className="mt-1 text-xs block w-full text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 hover:file:bg-neutral-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">GPay QR</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, (url) => setCardState(prev => ({
                                                ...prev,
                                                qr_codes: { ...prev.qr_codes, gpay_qr_path: url }
                                            })))}
                                            className="mt-1 text-xs block w-full text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 hover:file:bg-neutral-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-1000">PhonePe QR</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, (url) => setCardState(prev => ({
                                                ...prev,
                                                qr_codes: { ...prev.qr_codes, phonepe_qr_path: url }
                                            })))}
                                            className="mt-1 text-xs block w-full text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 hover:file:bg-neutral-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: PRODUCTS & SERVICES LIST */}
                        {currentStep === 5 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-neutral-700 ">Products & Services ({cardState.services?.length || 0}/10)</h3>
                                    <button
                                        type="button"
                                        onClick={addService}
                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold"
                                    >
                                        <Plus className="size-3.5" /> Add Item
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(cardState.services || []).map((service: any, index: number) => (
                                        <div key={index} className="p-4 border border-neutral-200  rounded-xl space-y-3 bg-neutral-50  relative">
                                            <button
                                                type="button"
                                                onClick={() => removeService(index)}
                                                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 :bg-red-950/30 rounded"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>

                                            <div className="grid grid-cols-2 gap-3 items-center">
                                                <div>
                                                    <label className="block text-xs font-bold text-neutral-1000">Service Name</label>
                                                    <input
                                                        type="text"
                                                        value={service.name || ''}
                                                        onChange={(e) => updateService(index, 'name', e.target.value)}
                                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-neutral-1000">Image</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileUpload(e, (url) => updateService(index, 'image_path', url))}
                                                        className="mt-1 text-xs block w-full text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 hover:file:bg-neutral-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 6: ECOMMERCE PRODUCTS */}
                        {currentStep === 6 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-neutral-700 ">Ecommerce Store Products ({cardState.ecommerce_products?.length || 0}/20)</h3>
                                    <button
                                        type="button"
                                        onClick={addProduct}
                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold"
                                    >
                                        <Plus className="size-3.5" /> Add Product
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(cardState.ecommerce_products || []).map((prod: any, index: number) => (
                                        <div key={index} className="p-4 border border-neutral-200  rounded-xl space-y-3 bg-neutral-50  relative">
                                            <button
                                                type="button"
                                                onClick={() => removeProduct(index)}
                                                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 :bg-red-950/30 rounded"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-neutral-1000">Product Name</label>
                                                    <input
                                                        type="text"
                                                        value={prod.name || ''}
                                                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-neutral-1000">Image</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileUpload(e, (url) => updateProduct(index, 'image_path', url))}
                                                        className="mt-1 text-xs block w-full text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 hover:file:bg-neutral-200"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-neutral-1000">MRP (Original Price)</label>
                                                    <input
                                                        type="number"
                                                        value={prod.mrp || ''}
                                                        onChange={(e) => updateProduct(index, 'mrp', e.target.value)}
                                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-neutral-1000">Selling Price</label>
                                                    <input
                                                        type="number"
                                                        value={prod.price || ''}
                                                        onChange={(e) => updateProduct(index, 'price', e.target.value)}
                                                        className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 7: IMAGE GALLERY */}
                        {currentStep === 7 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-neutral-700 ">Photo Gallery ({cardState.gallery?.length || 0}/10)</h3>
                                    <label className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-sm">
                                        <Plus className="size-3.5" /> Upload Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, (url) => addGalleryImage(url))}
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {(cardState.gallery || []).map((imgUrl: string, index: number) => (
                                        <div key={index} className="group relative aspect-square border border-neutral-200  rounded-xl overflow-hidden bg-neutral-100">
                                            <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-700 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-sm font-bold text-neutral-700  pt-5 border-t border-neutral-100 ">YouTube Video Links (Up to 5)</h3>
                                {[0, 1, 2, 3, 4].map((idx) => (
                                    <div key={idx}>
                                        <label className="block text-xs font-bold text-neutral-1000">Video Link {idx + 1}</label>
                                        <input
                                            type="text"
                                            value={cardState.youtube_videos?.[idx] || ''}
                                            onChange={(e) => {
                                                const newVideos = [...(cardState.youtube_videos || ['', '', '', '', ''])];
                                                newVideos[idx] = e.target.value;
                                                setCardState(prev => ({ ...prev, youtube_videos: newVideos }));
                                            }}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="mt-1 w-full rounded-lg border border-neutral-200  bg-white  p-2 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* STEP 8: PREVIEW CARD */}
                        {currentStep === 8 && (
                            <div className="space-y-6 text-center py-6">
                                <div className="inline-flex items-center justify-center size-16 rounded-full bg-emerald-100  text-emerald-600  mb-2">
                                    <Check className="size-8" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-neutral-900 ">Smart Business Card Active!</h2>
                                    <p className="text-sm text-neutral-500 max-w-sm mx-auto">Your premium digital vCard is live and ready to be shared with customers, clients, and partners.</p>
                                </div>

                                <div className="max-w-md mx-auto border border-neutral-200  rounded-2xl p-6 bg-neutral-50  space-y-4">
                                    <div className="flex flex-col items-center justify-center">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/card/' + cardState.slug)}`}
                                            alt="Scan QR Code"
                                            className="size-36 border border-neutral-200  rounded-xl bg-white p-2"
                                        />
                                        <p className="text-[10px] text-neutral-450 mt-2">Scan with phone camera to view</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-1000 text-left">Live vCard URL Link</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={`${window.location.origin}/card/${cardState.slug}`}
                                                className="w-full text-xs font-mono select-all bg-white  border border-neutral-200  rounded-lg px-3 py-2 text-neutral-600  focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/card/${cardState.slug}`);
                                                    setSaveMessage('Copied link to clipboard!');
                                                    setTimeout(() => setSaveMessage(''), 2000);
                                                }}
                                                className="px-3 py-2 border border-neutral-200  rounded-lg bg-white  hover:bg-neutral-100 :bg-neutral-800 text-xs font-bold text-neutral-600 "
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 justify-center pt-2">
                                        <a
                                            href={`/card/${cardState.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 bg-[#009ef7] hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-[#009ef7]/20"
                                        >
                                            <ExternalLink className="size-4" /> View Live Card
                                        </a>
                                        <a
                                            href={`/card/${cardState.slug}/vcard`}
                                            className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200  :bg-neutral-750 text-neutral-700  px-4 py-2.5 rounded-xl text-xs font-semibold"
                                        >
                                            <Download className="size-4" /> Download vCard
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step Navigation Actions */}
                    <div className="px-8 py-5 border-t border-slate-200 flex items-center justify-between bg-white z-20 sticky bottom-0">
                        <button
                            type="button"
                            disabled={currentStep === 1}
                            onClick={() => saveDraft(currentStep - 1)}
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                            <ChevronLeft className="size-5" /> Back
                        </button>

                        {currentStep < steps.length ? (
                            <button
                                type="button"
                                onClick={() => saveDraft(currentStep + 1)}
                                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                            >
                                Next Step <ChevronRight className="size-5" />
                            </button>
                        ) : (
                            <Link
                                href="/customer/business-cards"
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                            >
                                Finish & Exit <Check className="size-5" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Side Responsive Live Preview Device Mockup */}
                <div className={`${currentStep === 8 ? 'w-full lg:w-1/2 flex' : 'hidden'} bg-neutral-950 flex-col items-center justify-between p-6 relative transition-all duration-300 min-h-[100vh] lg:min-h-0`}>
                    <div className="w-full flex items-center justify-between border-b border-neutral-900 pb-3 text-neutral-400 mb-6">
                        <span className="text-xs font-bold tracking-wider">Live Preview Viewport</span>
                        <div className="flex gap-1.5 border border-neutral-800 rounded-lg p-0.5">
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-neutral-850 text-white' : 'hover:text-white'}`}
                                title="Mobile Preview"
                            >
                                <Smartphone className="size-4" />
                            </button>
                            <button
                                onClick={() => setPreviewMode('tablet')}
                                className={`p-1.5 rounded ${previewMode === 'tablet' ? 'bg-neutral-850 text-white' : 'hover:text-white'}`}
                                title="Tablet Preview"
                            >
                                <Tablet className="size-4" />
                            </button>
                            <button
                                onClick={() => setPreviewMode('desktop')}
                                className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-neutral-850 text-white' : 'hover:text-white'}`}
                                title="Desktop Preview"
                            >
                                <Laptop className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Frame Mockup Container */}
                    <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                        <div
                            className={`h-full border border-neutral-900 bg-neutral-900 shadow-2xl flex flex-col transition-all duration-300 relative ${previewMode === 'mobile'
                                ? 'w-[390px] max-h-[800px] rounded-[40px] p-3'
                                : previewMode === 'tablet'
                                    ? 'w-[768px] rounded-2xl'
                                    : 'w-full rounded-xl'
                                }`}
                        >
                            {previewMode === 'mobile' && (
                                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20 flex items-center justify-center">
                                    <div className="size-2 bg-neutral-800 rounded-full mr-2"></div>
                                </div>
                            )}

                            <iframe
                                title="Digital Card Viewport"
                                srcDoc={getPreviewHtml()}
                                className="w-full h-full rounded-2xl bg-white select-none border-0 overflow-y-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
