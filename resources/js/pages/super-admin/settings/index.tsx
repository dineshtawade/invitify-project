import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    Eye, EyeOff, Trash2, CheckCircle2, ShieldAlert, Wallet,
    Layers, Plus, Pencil, Save, Code, Settings, Trash,
    Heading, Type, MousePointerClick, MoveVertical, ArrowUp, ArrowDown,
    Image as ImageIcon, Monitor, Smartphone, Tablet, Video, Play,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline,
    Maximize, Minimize, RotateCw, Palette, Ruler, Square, Circle
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin Dashboard',
        href: '/super-admin/dashboard',
    },
    {
        title: 'Settings',
        href: '/super-admin/settings',
    },
];

interface SettingsData {
    reseller_bank_name: string;
    reseller_account_holder: string;
    reseller_account_number: string;
    reseller_ifsc_code: string;
    reseller_upi_id: string;
    reseller_default_bonus_percentage: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
}

interface CustomBlockField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'color';
    default: string;
}

interface CustomBlock {
    id: number;
    name: string;
    type: string;
    description: string | null;
    fields: CustomBlockField[];
    template_html: string;
    created_at?: string;
}

interface PageProps {
    settings: SettingsData;
    categories: Category[];
    customBlocks: CustomBlock[];
}

export default function SettingsIndex({ settings, categories = [], customBlocks = [] }: PageProps) {
    const [activeTab, setActiveTab] = useState<'config' | 'blocks'>('config');

    // 1. General Config Form
    const { data: configData, setData: setConfigData, post: postConfig, processing: configProcessing, wasSuccessful: configSuccess } = useForm({
        reseller_bank_name: settings.reseller_bank_name || '',
        reseller_account_holder: settings.reseller_account_holder || '',
        reseller_account_number: settings.reseller_account_number || '',
        reseller_ifsc_code: settings.reseller_ifsc_code || '',
        reseller_upi_id: settings.reseller_upi_id || '',
        reseller_default_bonus_percentage: settings.reseller_default_bonus_percentage || '0',
    });

    // 2. Category Form & Modal State
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const { data: categoryData, setData: setCategoryData, post: postCategory, put: putCategory, processing: categoryProcessing, errors: categoryErrors, reset: resetCategory } = useForm({
        name: '',
        slug: '',
    });

    // 3. Custom Block Form & Modal State
    const [isBlockOpen, setIsBlockOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState<CustomBlock | null>(null);
    const { data: blockData, setData: setBlockData, post: postBlock, put: putBlock, processing: blockProcessing, errors: blockErrors, reset: resetBlock } = useForm({
        name: '',
        type: '',
        description: '',
        fields: [] as CustomBlockField[],
        template_html: '',
    });

    const [blockComponents, setBlockComponents] = useState<any[]>([]);
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
    const [uploadingMediaId, setUploadingMediaId] = useState<string | null>(null);
    const [rightTab, setRightTab] = useState<'elements' | 'section'>('elements');
    const [sectionSettings, setSectionSettings] = useState({
        bgType: 'color',
        bgColor: 'bg-white',
        customBgColor: '',
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-purple-650',
        bgImage: '',
        overlayOpacity: 'opacity-50',
        width: 'w-full',
        height: 'h-auto',
        py: 'py-8',
        px: 'px-6',
        my: 'my-4',
        radius: 'rounded-2xl',
        border: 'border-0',
        shadow: 'shadow-md',
        fontFamily: 'font-sans',
        align: 'text-center',
        animation: 'none',
        customClass: '',
        customId: '',
        customCss: '',
        visibility: 'visible',
        zIndex: 'z-0',
        position: 'relative'
    });

    const compileComponentsToHtml = (components: any[], section = sectionSettings) => {
        let containerClasses = [
            section.width,
            section.height,
            section.py,
            section.px,
            section.my,
            section.radius,
            section.border,
            section.shadow,
            section.fontFamily,
            section.align,
            section.zIndex,
            section.position,
            section.customClass
        ];

        let bgStyle = {} as any;
        let inlineBgStyle = '';

        if (section.bgType === 'color') {
            if (section.customBgColor) {
                inlineBgStyle = `background-color: ${section.customBgColor};`;
            } else {
                containerClasses.push(section.bgColor);
            }
        } else if (section.bgType === 'gradient') {
            containerClasses.push(`bg-gradient-to-r ${section.gradientFrom} ${section.gradientTo}`);
        } else if (section.bgType === 'image') {
            containerClasses.push('bg-cover bg-center relative overflow-hidden');
            if (section.bgImage) {
                bgStyle.backgroundImage = `url('${section.bgImage}')`;
            }
        }

        if (section.animation !== 'none') {
            containerClasses.push(`animate-${section.animation}`);
        }

        if (section.visibility === 'hidden-mobile') {
            containerClasses.push('hidden md:block');
        } else if (section.visibility === 'hidden-desktop') {
            containerClasses.push('md:hidden');
        }

        let styleStr = '';
        if (Object.keys(bgStyle).length > 0 || inlineBgStyle) {
            styleStr = ` style="${inlineBgStyle}${Object.keys(bgStyle).length > 0 ? ` background-image: ${bgStyle.backgroundImage};` : ''}"`;
        }

        let html = `<div class="${containerClasses.filter(Boolean).join(' ')}"${styleStr}>\n`;

        if (section.bgType === 'image') {
            html += `  <div class="absolute inset-0 bg-black ${section.overlayOpacity} ${section.radius}"></div>\n`;
            html += `  <div class="relative z-10 flex flex-col gap-4 w-full">\n`;
        } else {
            html += `  <div class="flex flex-col gap-4 w-full">\n`;
        }

        const getElementStyleAndClass = (comp: any) => {
            const styles = [];
            const classes = [];

            if (comp.settings.align) {
                if (comp.type === 'heading' || comp.type === 'text') {
                    classes.push(`text-${comp.settings.align}`);
                }
            }

            if (comp.settings.customColor) {
                styles.push(`color: ${comp.settings.customColor}`);
            }

            if (comp.settings.customSize) {
                styles.push(`font-size: ${comp.settings.customSize}px`);
            }

            if (comp.settings.italic) {
                styles.push(`font-style: italic`);
            }
            if (comp.settings.underline) {
                styles.push(`text-decoration: underline`);
            }
            if (comp.settings.uppercase) {
                styles.push(`text-transform: uppercase`);
            }

            if (comp.settings.customWeight) {
                styles.push(`font-weight: ${comp.settings.customWeight}`);
            }

            if (comp.settings.marginTop) {
                styles.push(`margin-top: ${comp.settings.marginTop}px`);
            }
            if (comp.settings.marginBottom) {
                styles.push(`margin-bottom: ${comp.settings.marginBottom}px`);
            }

            // Custom image/video dimensions
            if (comp.type === 'image' || comp.type === 'video') {
                if (comp.settings.customWidth) {
                    styles.push(`width: ${comp.settings.customWidth}px`);
                }
                if (comp.settings.customHeight) {
                    styles.push(`height: ${comp.settings.customHeight}px`);
                }
            }

            const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
            return { styleAttr, classes };
        };

        components.forEach(comp => {
            if (comp.type === 'heading') {
                const tag = comp.settings.tag || 'h2';
                const size = comp.settings.customSize ? '' : (comp.settings.size || 'text-2xl');
                const weight = comp.settings.customWeight ? '' : (comp.settings.weight || 'font-bold');
                const color = comp.settings.customColor ? '' : (comp.settings.color || 'text-neutral-900');

                const { styleAttr, classes } = getElementStyleAndClass(comp);
                const combinedClasses = [size, weight, ...classes].filter(Boolean).join(' ');

                html += `    <${tag} class="${combinedClasses}"${styleAttr}>${comp.settings.text}</${tag}>\n`;
            } else if (comp.type === 'text') {
                const size = comp.settings.customSize ? '' : (comp.settings.size || 'text-sm');
                const color = comp.settings.customColor ? '' : (comp.settings.color || 'text-neutral-650');
                const weight = comp.settings.customWeight ? '' : (comp.settings.weight || 'font-normal');

                const { styleAttr, classes } = getElementStyleAndClass(comp);
                const combinedClasses = [size, weight, ...classes].filter(Boolean).join(' ');

                html += `    <p class="${combinedClasses}"${styleAttr} whitespace-pre-wrap>${comp.settings.content}</p>\n`;
            } else if (comp.type === 'image') {
                let sizeClass = '';
                if (comp.settings.size === 'small') sizeClass = 'max-w-[150px]';
                else if (comp.settings.size === 'medium') sizeClass = 'max-w-[300px]';
                else if (comp.settings.size === 'large') sizeClass = 'max-w-[450px]';
                else if (comp.settings.size === 'full') sizeClass = 'w-full';
                else sizeClass = 'max-w-[300px]';

                const radius = comp.settings.radius || 'rounded-xl';
                const align = comp.settings.align || 'center';

                const styles = [];
                if (comp.settings.marginTop) styles.push(`margin-top: ${comp.settings.marginTop}px`);
                if (comp.settings.marginBottom) styles.push(`margin-bottom: ${comp.settings.marginBottom}px`);
                if (comp.settings.customWidth) styles.push(`width: ${comp.settings.customWidth}px`);
                if (comp.settings.customHeight) styles.push(`height: ${comp.settings.customHeight}px`);
                const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';

                const alignClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

                html += `    <div class="flex ${alignClass} w-full"${styleAttr}><img src="${comp.settings.url || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205'}" alt="${comp.settings.alt || 'image'}" class="${sizeClass} ${radius} object-cover" /></div>\n`;
            } else if (comp.type === 'video') {
                let sizeClass = '';
                if (comp.settings.size === 'small') sizeClass = 'max-w-[150px]';
                else if (comp.settings.size === 'medium') sizeClass = 'max-w-[300px]';
                else if (comp.settings.size === 'large') sizeClass = 'max-w-[450px]';
                else if (comp.settings.size === 'full') sizeClass = 'w-full';
                else sizeClass = 'max-w-[300px]';

                const radius = comp.settings.radius || 'rounded-xl';
                const align = comp.settings.align || 'center';
                const controls = comp.settings.controls !== false ? 'controls' : '';
                const autoplay = comp.settings.autoplay ? 'autoplay' : '';
                const loop = comp.settings.loop ? 'loop' : '';
                const muted = comp.settings.muted ? 'muted' : '';

                const styles = [];
                if (comp.settings.marginTop) styles.push(`margin-top: ${comp.settings.marginTop}px`);
                if (comp.settings.marginBottom) styles.push(`margin-bottom: ${comp.settings.marginBottom}px`);
                if (comp.settings.customWidth) styles.push(`width: ${comp.settings.customWidth}px`);
                if (comp.settings.customHeight) styles.push(`height: ${comp.settings.customHeight}px`);
                const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';

                const alignClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

                html += `    <div class="flex ${alignClass} w-full"${styleAttr}><video src="${comp.settings.url || 'https://www.w3schools.com/html/mov_bbb.mp4'}" ${controls} ${autoplay} ${loop} ${muted} class="${sizeClass} ${radius} object-cover"></video></div>\n`;
            } else if (comp.type === 'button') {
                let bgClass = comp.settings.bg || 'bg-blue-650';
                let bgStyleInline = '';

                // If custom background color is set, use inline style
                if (comp.settings.customBgColor) {
                    bgStyleInline = `background-color: ${comp.settings.customBgColor};`;
                    bgClass = '';
                }

                const textColor = comp.settings.textColor || 'text-white';
                const customTextColor = comp.settings.customTextColor || '';
                const radius = comp.settings.radius || 'rounded-full';
                const align = comp.settings.align || 'center';
                const paddingX = comp.settings.paddingX || 'px-6';
                const paddingY = comp.settings.paddingY || 'py-2.5';
                const fontSize = comp.settings.fontSize || 'text-xs';

                const styles = [];
                if (comp.settings.marginTop) styles.push(`margin-top: ${comp.settings.marginTop}px`);
                if (comp.settings.marginBottom) styles.push(`margin-bottom: ${comp.settings.marginBottom}px`);
                if (bgStyleInline) styles.push(bgStyleInline);
                if (customTextColor) styles.push(`color: ${customTextColor}`);
                const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';

                const alignClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';
                const combinedClasses = [paddingX, paddingY, fontSize, bgClass, textColor, radius, 'font-bold', 'hover:opacity-90', 'transition-all', 'inline-block'].filter(Boolean).join(' ');

                html += `    <div class="flex ${alignClass} w-full"><a href="${comp.settings.url || '#'}" class="${combinedClasses}"${styleAttr}>${comp.settings.text}</a></div>\n`;
            } else if (comp.type === 'spacer') {
                const height = comp.settings.height || 'h-4';
                html += `    <div class="${height}"></div>\n`;
            }
        });

        if (section.bgType === 'image') {
            html += '  </div>\n';
        }
        html += '</div>\n';
        html += `<!-- COMPONENT_DATA: ${JSON.stringify({ components, section })} -->`;

        if (section.customCss) {
            html += `\n<style>\n${section.customCss}\n</style>`;
        }
        return html;
    };

    const updateBlockComponents = (newComponents: any[], newSection = sectionSettings) => {
        setBlockComponents(newComponents);
        setBlockData('template_html', compileComponentsToHtml(newComponents, newSection));
    };

    const handleUpdateSectionSetting = (key: string, val: string) => {
        const updated = { ...sectionSettings, [key]: val };
        setSectionSettings(updated);
        updateBlockComponents(blockComponents, updated);
    };

    const handleAddComponent = (type: 'heading' | 'text' | 'image' | 'video' | 'button' | 'spacer') => {
        const id = 'c_' + Math.random().toString(36).substring(2, 9);
        let newComp: any = { id, type, settings: {} };
        if (type === 'heading') {
            newComp.settings = { text: 'Heading Text', tag: 'h2', size: 'text-2xl', weight: 'font-bold', color: 'text-neutral-900', align: 'center', customSize: '', customColor: '', italic: false, underline: false, uppercase: false, customWeight: '', marginTop: '0', marginBottom: '16' };
        } else if (type === 'text') {
            newComp.settings = { content: 'Paragraph content goes here...', size: 'text-sm', color: 'text-neutral-650', align: 'center', customSize: '', customColor: '', italic: false, underline: false, uppercase: false, customWeight: '', marginTop: '0', marginBottom: '16' };
        } else if (type === 'image') {
            newComp.settings = { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205', alt: 'image illustration', size: 'medium', radius: 'rounded-xl', align: 'center', marginTop: '0', marginBottom: '16', customWidth: '', customHeight: '' };
        } else if (type === 'video') {
            newComp.settings = { url: '', poster: '', controls: true, autoplay: false, loop: false, muted: false, size: 'medium', radius: 'rounded-xl', align: 'center', marginTop: '0', marginBottom: '16', customWidth: '', customHeight: '' };
        } else if (type === 'button') {
            newComp.settings = { text: 'Click Here', url: '#', bg: 'bg-blue-650', textColor: 'text-white', radius: 'rounded-full', align: 'center', marginTop: '0', marginBottom: '16', paddingX: 'px-6', paddingY: 'py-2.5', fontSize: 'text-xs', customBgColor: '', customTextColor: '' };
        } else if (type === 'spacer') {
            newComp.settings = { height: 'h-4' };
        }

        const newComponents = [...blockComponents, newComp];
        updateBlockComponents(newComponents);
        setSelectedComponentId(id);
    };

    const handleMoveComponent = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blockComponents.length - 1) return;
        const newComponents = [...blockComponents];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newComponents[index];
        newComponents[index] = newComponents[swapIndex];
        newComponents[swapIndex] = temp;
        updateBlockComponents(newComponents);
    };

    const handleRemoveComponent = (id: string) => {
        const newComponents = blockComponents.filter(c => c.id !== id);
        updateBlockComponents(newComponents);
        if (selectedComponentId === id) {
            setSelectedComponentId(newComponents.length > 0 ? newComponents[0].id : null);
        }
    };

    const handleUpdateComponentSetting = (id: string, settingKey: string, val: string) => {
        const newComponents = blockComponents.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    settings: {
                        ...c.settings,
                        [settingKey]: val
                    }
                };
            }
            return c;
        });
        updateBlockComponents(newComponents);
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, compId: string, isVideo = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            alert('File is too large. Maximum size is 50MB.');
            return;
        }

        setUploadingMediaId(compId);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch('/media/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Upload failed');
            }

            const data = await response.json();
            if (data.url) {
                handleUpdateComponentSetting(compId, 'url', data.url);
            }
        } catch (error: any) {
            alert(error.message || 'An error occurred during upload.');
        } finally {
            setUploadingMediaId(null);
            e.target.value = '';
        }
    };

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        postConfig('/super-admin/settings');
    };

    // Category CRUD
    const handleAddCategory = () => {
        setEditingCategory(null);
        resetCategory();
        setCategoryData({ name: '', slug: '' });
        setIsCategoryOpen(true);
    };

    const handleEditCategory = (cat: Category) => {
        setEditingCategory(cat);
        setCategoryData({
            name: cat.name,
            slug: cat.slug,
        });
        setIsCategoryOpen(true);
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            putCategory(`/super-admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsCategoryOpen(false);
                    resetCategory();
                }
            });
        } else {
            postCategory('/super-admin/categories', {
                onSuccess: () => {
                    setIsCategoryOpen(false);
                    resetCategory();
                }
            });
        }
    };

    // Custom Block CRUD
    const handleAddBlock = () => {
        setEditingBlock(null);
        resetBlock();

        const defaultComponents = [
            { id: 'c_title', type: 'heading', settings: { text: '{{title}}', tag: 'h2', size: 'text-3xl', weight: 'font-bold', color: 'text-neutral-900', align: 'center', customSize: '', customColor: '', italic: false, underline: false, uppercase: false, customWeight: '', marginTop: '0', marginBottom: '16' } }
        ];

        const defaultSection = {
            bgType: 'color',
            bgColor: 'bg-white',
            customBgColor: '',
            gradientFrom: 'from-blue-500',
            gradientTo: 'to-purple-650',
            bgImage: '',
            overlayOpacity: 'opacity-50',
            width: 'w-full',
            height: 'h-auto',
            py: 'py-8',
            px: 'px-6',
            my: 'my-4',
            radius: 'rounded-2xl',
            border: 'border-0',
            shadow: 'shadow-md',
            fontFamily: 'font-sans',
            align: 'text-center',
            animation: 'none',
            customClass: '',
            customId: '',
            customCss: '',
            visibility: 'visible',
            zIndex: 'z-0',
            position: 'relative'
        };

        setBlockComponents(defaultComponents);
        setSectionSettings(defaultSection);
        setSelectedComponentId('c_title');

        setBlockData({
            name: '',
            type: '',
            description: '',
            fields: [
                { name: 'title', label: 'Section Title', type: 'text', default: 'Banner Title' }
            ],
            template_html: compileComponentsToHtml(defaultComponents, defaultSection)
        });
        setIsBlockOpen(true);
    };

    const handleEditBlock = (block: CustomBlock) => {
        setEditingBlock(block);

        let initialComponents = [] as any[];
        let initialSection = {
            bgType: 'color',
            bgColor: 'bg-white',
            customBgColor: '',
            gradientFrom: 'from-blue-500',
            gradientTo: 'to-purple-650',
            bgImage: '',
            overlayOpacity: 'opacity-50',
            width: 'w-full',
            height: 'h-auto',
            py: 'py-8',
            px: 'px-6',
            my: 'my-4',
            radius: 'rounded-2xl',
            border: 'border-0',
            shadow: 'shadow-md',
            fontFamily: 'font-sans',
            align: 'text-center',
            animation: 'none',
            customClass: '',
            customId: '',
            customCss: '',
            visibility: 'visible',
            zIndex: 'z-0',
            position: 'relative'
        };

        const html = block.template_html || '';
        const match = html.match(/<!-- COMPONENT_DATA: (.*?) -->/);
        if (match && match[1]) {
            try {
                const parsed = JSON.parse(match[1]);
                if (Array.isArray(parsed)) {
                    initialComponents = parsed;
                } else if (parsed && parsed.components) {
                    initialComponents = parsed.components;
                    if (parsed.section) {
                        initialSection = { ...initialSection, ...parsed.section };
                    }
                }
            } catch (e) {
                console.error("Failed to parse component data", e);
            }
        }

        if (initialComponents.length === 0) {
            initialComponents = [
                { id: 'c_title', type: 'heading', settings: { text: '{{title}}', tag: 'h2', size: 'text-3xl', weight: 'font-bold', color: 'text-neutral-900', align: 'center', customSize: '', customColor: '', italic: false, underline: false, uppercase: false, customWeight: '', marginTop: '0', marginBottom: '16' } }
            ];
        }

        setBlockComponents(initialComponents);
        setSectionSettings(initialSection);
        setSelectedComponentId(initialComponents[0]?.id || null);

        setBlockData({
            name: block.name,
            type: block.type,
            description: block.description || '',
            fields: block.fields || [],
            template_html: block.template_html || '',
        });
        setIsBlockOpen(true);
    };

    const handleBlockFieldChange = (index: number, key: keyof CustomBlockField, value: string) => {
        const newFields = [...blockData.fields];
        newFields[index] = { ...newFields[index], [key]: value };
        setBlockData('fields', newFields);
    };

    const handleAddBlockField = () => {
        setBlockData('fields', [
            ...blockData.fields,
            { name: '', label: '', type: 'text', default: '' }
        ]);
    };

    const handleRemoveBlockField = (index: number) => {
        setBlockData('fields', blockData.fields.filter((_, i) => i !== index));
    };

    const handleBlockSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBlock) {
            putBlock(`/super-admin/custom-blocks/${editingBlock.id}`, {
                onSuccess: () => {
                    setIsBlockOpen(false);
                    resetBlock();
                }
            });
        } else {
            postBlock('/super-admin/custom-blocks', {
                onSuccess: () => {
                    setIsBlockOpen(false);
                    resetBlock();
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-6xl w-full mx-auto">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Website Component Builder
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Design beautiful web page components visually. Create reusable blocks for your website.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-6 mt-2 shrink-0">
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`pb-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'config'
                            ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                            }`}
                    >
                        <Settings className="size-4" /> General Config
                    </button>
                    <button
                        onClick={() => setActiveTab('blocks')}
                        className={`pb-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'blocks'
                            ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                            }`}
                    >
                        <Code className="size-4" /> Component Builder
                    </button>
                </div>

                {/* TAB 1: General Config */}
                {activeTab === 'config' && (
                    <form onSubmit={handleSaveConfig} className="flex flex-col gap-6 max-w-4xl">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col gap-6">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-150 dark:border-neutral-800">
                                <div className="bg-emerald-50 p-2.5 text-emerald-600 rounded-xl dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <Wallet className="size-5" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">Reseller Wallet & Bank Details</h3>
                                    <p className="text-xs text-neutral-400">Manual payment details and wallet bonus configuration</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="reseller_bank_name">Bank Name</Label>
                                    <Input
                                        id="reseller_bank_name"
                                        value={configData.reseller_bank_name}
                                        onChange={(e) => setConfigData('reseller_bank_name', e.target.value)}
                                        placeholder="e.g. HDFC Bank"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="reseller_account_holder">Account Holder Name</Label>
                                    <Input
                                        id="reseller_account_holder"
                                        value={configData.reseller_account_holder}
                                        onChange={(e) => setConfigData('reseller_account_holder', e.target.value)}
                                        placeholder="e.g. Invitify Digital Labs"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="reseller_account_number">Account Number</Label>
                                    <Input
                                        id="reseller_account_number"
                                        value={configData.reseller_account_number}
                                        onChange={(e) => setConfigData('reseller_account_number', e.target.value)}
                                        placeholder="e.g. 50100239402930"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="reseller_ifsc_code">IFSC Code</Label>
                                    <Input
                                        id="reseller_ifsc_code"
                                        value={configData.reseller_ifsc_code}
                                        onChange={(e) => setConfigData('reseller_ifsc_code', e.target.value)}
                                        placeholder="e.g. HDFC0001203"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="reseller_upi_id">UPI ID (Optional)</Label>
                                    <Input
                                        id="reseller_upi_id"
                                        value={configData.reseller_upi_id}
                                        onChange={(e) => setConfigData('reseller_upi_id', e.target.value)}
                                        placeholder="e.g. business@upi"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="reseller_default_bonus_percentage">Default Recharge Bonus (%)</Label>
                                    <Input
                                        id="reseller_default_bonus_percentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={configData.reseller_default_bonus_percentage}
                                        onChange={(e) => setConfigData('reseller_default_bonus_percentage', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {configSuccess && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400 animate-fade-in">
                                ✓ System configuration settings updated successfully.
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={configProcessing} className="bg-blue-650 hover:bg-blue-700 text-white font-semibold shadow-md">
                                <Save className="size-4 mr-2" /> Save configuration
                            </Button>
                        </div>
                    </form>
                )}

                {/* TAB 2: Component Builder */}
                {activeTab === 'blocks' && (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">Website Component Library</h3>
                                <p className="text-xs text-neutral-400 mt-1">Design stunning visual components with full styling control.</p>
                            </div>
                            <Button onClick={handleAddBlock} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                                <Plus className="size-4 mr-1.5" /> Create New Component
                            </Button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {customBlocks.map(block => (
                                <div key={block.id} className="border rounded-2xl p-5 bg-white dark:bg-neutral-900 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-extrabold text-base">{block.name}</h4>
                                            <span className="bg-blue-50 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded-md dark:bg-blue-950/40 dark:text-blue-400">{block.type}</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 leading-relaxed mb-4">{block.description || 'No description provided.'}</p>
                                        <div className="border-t pt-3 mt-3">
                                            <Label className="text-[10px] uppercase font-black text-neutral-400">Component Variables</Label>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {block.fields.map(f => (
                                                    <span key={f.name} className="text-[9px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-semibold dark:bg-neutral-800 dark:text-neutral-350">
                                                        {f.label} ({f.type})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 border-t pt-4 mt-6">
                                        <Button onClick={() => handleEditBlock(block)} variant="outline" size="sm" className="flex-1">
                                            <Pencil className="size-3.5 mr-1" /> Edit Component
                                        </Button>
                                        <Button
                                            onClick={() => { if (confirm('Are you sure you want to delete this component?')) router.delete(`/super-admin/custom-blocks/${block.id}`) }}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            <Trash className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {customBlocks.length === 0 && (
                                <div className="col-span-full rounded-2xl border-2 border-dashed p-12 text-center bg-white/50 dark:bg-neutral-900/30 flex flex-col items-center justify-center">
                                    <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
                                        <Code className="size-8 text-blue-500" />
                                    </div>
                                    <h4 className="font-bold text-xl text-neutral-700 dark:text-neutral-300">No Components Created Yet</h4>
                                    <p className="text-sm text-neutral-400 max-w-sm mt-2 mb-6">Design beautiful, reusable web components with our visual builder.</p>
                                    <Button onClick={handleAddBlock} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
                                        <Plus className="size-4 mr-1.5" /> Create Your First Component
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Custom Block Modal */}
                        <Dialog open={isBlockOpen} onOpenChange={setIsBlockOpen}>
                            <DialogContent className="max-w-[95vw] w-[95vw] h-[92vh] flex flex-col p-0 overflow-hidden bg-[#2c2c2c] border-[#444444] rounded-xl text-neutral-200">
                                <form onSubmit={handleBlockSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
                                    <DialogHeader className="px-6 py-3 bg-[#1e1e1e] border-b border-[#333333] flex items-center justify-between flex-row shrink-0">
                                        <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-[#0d99ff]"></div>
                                            {editingBlock ? `Editing Component: ${editingBlock.name}` : 'Create Visual Component'}
                                        </DialogTitle>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" onClick={() => setIsBlockOpen(false)} className="h-7 text-xs border-[#444444] text-[#b3b3b3] hover:bg-[#333333] hover:text-white rounded px-3">Cancel</Button>
                                            <Button type="submit" disabled={blockProcessing} className="h-7 text-xs bg-[#0d99ff] hover:bg-[#18a0fb] text-white rounded px-4 font-semibold shadow-sm">
                                                <Save className="size-3.5 mr-1" /> {editingBlock ? 'Update Component' : 'Publish Component'}
                                            </Button>
                                        </div>
                                    </DialogHeader>

                                    <div className="flex-1 grid lg:grid-cols-12 overflow-hidden bg-[#121212] select-none min-h-0">
                                        {/* Left Panel - Component Properties */}
                                        <div className="lg:col-span-3 border-r border-[#333333] bg-[#1e1e1e] flex flex-col overflow-y-auto p-4 gap-4 min-h-0">
                                            <div className="flex items-center gap-1.5 pb-2 border-b border-[#333333]">
                                                <span className="text-[10px] font-black uppercase text-[#888888] tracking-wider">Component Properties</span>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="block_name" className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Component Name</Label>
                                                <Input
                                                    id="block_name"
                                                    value={blockData.name}
                                                    onChange={e => setBlockData('name', e.target.value)}
                                                    placeholder="e.g. Hero Banner"
                                                    className="bg-[#2c2c2c] border-[#444444] text-neutral-100 placeholder-neutral-500 rounded focus:ring-1 focus:ring-[#0d99ff] focus:border-[#0d99ff] text-xs h-8"
                                                    required
                                                />
                                                {blockErrors.name && <p className="text-red-400 text-xs">{blockErrors.name}</p>}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="block_type" className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Component ID</Label>
                                                <Input
                                                    id="block_type"
                                                    value={blockData.type}
                                                    onChange={e => setBlockData('type', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                    placeholder="e.g. hero_banner"
                                                    className="bg-[#2c2c2c] border-[#444444] text-neutral-100 placeholder-neutral-500 rounded focus:ring-1 focus:ring-[#0d99ff] focus:border-[#0d99ff] text-xs h-8"
                                                    required
                                                    disabled={!!editingBlock}
                                                />
                                                {blockErrors.type && <p className="text-red-400 text-xs">{blockErrors.type}</p>}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="block_description" className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Description</Label>
                                                <textarea
                                                    id="block_description"
                                                    value={blockData.description}
                                                    onChange={e => setBlockData('description', e.target.value)}
                                                    placeholder="Describe what this component does..."
                                                    rows={2}
                                                    className="flex w-full rounded border border-[#444444] bg-[#2c2c2c] px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d99ff] focus-visible:border-[#0d99ff]"
                                                />
                                            </div>

                                            <div className="border-t border-[#333333] pt-4 mt-2 flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Dynamic Variables</span>
                                                    <button type="button" onClick={handleAddBlockField} className="h-6 text-[10px] font-bold text-[#0d99ff] hover:text-[#18a0fb] flex items-center gap-1 cursor-pointer bg-transparent border-0">
                                                        + Add Variable
                                                    </button>
                                                </div>

                                                <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                                                    {blockData.fields.map((field, idx) => (
                                                        <div key={idx} className="p-3 border border-[#333333] rounded-lg bg-[#2c2c2c] relative flex flex-col gap-2 group hover:border-[#444444] transition-all">
                                                            <div className="flex justify-between items-center border-b border-[#333333] pb-1.5">
                                                                <span className="text-[9px] font-bold text-[#b3b3b3] uppercase">Variable #{idx + 1}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveBlockField(idx)}
                                                                    className="text-red-400 hover:text-red-500 p-0.5 rounded hover:bg-red-550/15 cursor-pointer"
                                                                >
                                                                    <Trash className="size-3" />
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[9px] text-[#888888] font-bold uppercase">Name</span>
                                                                    <Input
                                                                        value={field.name}
                                                                        onChange={e => handleBlockFieldChange(idx, 'name', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                                        placeholder="e.g. title"
                                                                        className="h-7 text-[10px] font-mono bg-[#1e1e1e] border-[#333333]"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[9px] text-[#888888] font-bold uppercase">Label</span>
                                                                    <Input
                                                                        value={field.label}
                                                                        onChange={e => handleBlockFieldChange(idx, 'label', e.target.value)}
                                                                        placeholder="e.g. Title"
                                                                        className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[9px] text-[#888888] font-bold uppercase">Type</span>
                                                                    <select
                                                                        value={field.type}
                                                                        onChange={e => handleBlockFieldChange(idx, 'type', e.target.value as any)}
                                                                        className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1.5 text-neutral-100"
                                                                    >
                                                                        <option value="text">Text</option>
                                                                        <option value="textarea">Textarea</option>
                                                                        <option value="number">Number</option>
                                                                        <option value="color">Color</option>
                                                                    </select>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[9px] text-[#888888] font-bold uppercase">Default Value</span>
                                                                    <Input
                                                                        value={field.default}
                                                                        onChange={e => handleBlockFieldChange(idx, 'default', e.target.value)}
                                                                        placeholder="e.g. Welcome"
                                                                        className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {blockData.fields.length === 0 && (
                                                        <p className="text-xs text-neutral-500 text-center italic py-2">Add dynamic variables to make your component customizable.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Center Panel - Live Preview */}
                                        <div
                                            className="lg:col-span-6 flex flex-col items-center justify-center p-8 overflow-y-auto relative h-full select-none bg-[#121212]"
                                            style={{
                                                backgroundImage: 'radial-gradient(#222 1px, transparent 1px)',
                                                backgroundSize: '16px 16px',
                                            }}
                                        >
                                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#1e1e1e] border border-[#333333] p-1 rounded-md z-20">
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewMode('desktop')}
                                                    className={`p-1.5 rounded cursor-pointer transition-all ${previewMode === 'desktop' ? 'bg-[#0d99ff] text-white' : 'text-neutral-400 hover:text-white'}`}
                                                    title="Desktop View"
                                                >
                                                    <Monitor className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewMode('tablet')}
                                                    className={`p-1.5 rounded cursor-pointer transition-all ${previewMode === 'tablet' ? 'bg-[#0d99ff] text-white' : 'text-neutral-400 hover:text-white'}`}
                                                    title="Tablet View"
                                                >
                                                    <Tablet className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewMode('mobile')}
                                                    className={`p-1.5 rounded cursor-pointer transition-all ${previewMode === 'mobile' ? 'bg-[#0d99ff] text-white' : 'text-neutral-400 hover:text-white'}`}
                                                    title="Mobile View"
                                                >
                                                    <Smartphone className="size-3.5" />
                                                </button>
                                            </div>

                                            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1e1e1e] border border-[#333333] px-2.5 py-1 rounded-md text-[9px] text-[#888888] font-bold uppercase">
                                                <span>Live Preview ({previewMode})</span>
                                            </div>

                                            <div
                                                className={`w-full transition-all duration-300 bg-neutral-900 border border-[#333333] shadow-2xl flex flex-col overflow-hidden relative shrink-0 ${previewMode === 'mobile' ? 'max-w-[390px] rounded-3xl' :
                                                    previewMode === 'tablet' ? 'max-w-[768px] rounded-2xl' : 'max-w-[95%] rounded-xl'
                                                    }`}
                                            >
                                                {previewMode === 'mobile' && (
                                                    <div className="h-9 bg-neutral-900 border-b border-[#222222] flex items-center justify-between px-6 text-[10px] text-[#888888] select-none font-bold">
                                                        <span>9:41</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <span>5G</span>
                                                            <div className="w-4 h-2.5 border rounded-sm border-[#888888]"></div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="p-6 min-h-[220px] flex flex-col justify-center bg-white dark:bg-neutral-950 overflow-x-auto text-neutral-900 dark:text-neutral-100">
                                                    {(() => {
                                                        try {
                                                            let html = blockData.template_html || '';
                                                            blockData.fields.forEach((field) => {
                                                                const val = field.default || '';
                                                                const escapedName = field.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                                                                html = html.replace(new RegExp(`\\{\\{\\s*${escapedName}\\s*\\}\\}`, 'g'), val);
                                                            });
                                                            return <div dangerouslySetInnerHTML={{ __html: html }} />;
                                                        } catch (e) {
                                                            return <span className="text-red-500 text-xs font-mono">Template compilation error</span>;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Panel - Inspector */}
                                        <div className="lg:col-span-3 border-l border-[#333333] bg-[#1e1e1e] flex flex-col overflow-y-auto p-4 gap-4 min-h-0">
                                            <div className="grid grid-cols-2 gap-1 bg-[#2c2c2c] p-1 rounded-md mb-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setRightTab('elements')}
                                                    className={`py-1.5 text-[10px] font-bold rounded cursor-pointer transition-all ${rightTab === 'elements' ? 'bg-[#1e1e1e] text-[#0d99ff]' : 'text-[#888888] hover:text-neutral-300'}`}
                                                >
                                                    Elements
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRightTab('section')}
                                                    className={`py-1.5 text-[10px] font-bold rounded cursor-pointer transition-all ${rightTab === 'section' ? 'bg-[#1e1e1e] text-[#0d99ff]' : 'text-[#888888] hover:text-neutral-300'}`}
                                                >
                                                    Section Style
                                                </button>
                                            </div>

                                            {rightTab === 'elements' ? (
                                                <div className="flex flex-col gap-4">
                                                    <div className="grid gap-2">
                                                        <Label className="text-[9px] text-[#b3b3b3] uppercase font-bold tracking-wider">Add Elements</Label>
                                                        <div className="grid grid-cols-2 gap-1.5">
                                                            <Button type="button" onClick={() => handleAddComponent('heading')} className="bg-[#2c2c2c] border border-[#3c3c3c] hover:bg-[#383838] text-[10px] h-7 px-2 rounded text-white flex items-center justify-start gap-1">
                                                                <Heading className="size-3.5 text-blue-400" /> + Heading
                                                            </Button>
                                                            <Button type="button" onClick={() => handleAddComponent('text')} className="bg-[#2c2c2c] border border-[#3c3c3c] hover:bg-[#383838] text-[10px] h-7 px-2 rounded text-white flex items-center justify-start gap-1">
                                                                <Type className="size-3.5 text-purple-400" /> + Text
                                                            </Button>
                                                            <Button type="button" onClick={() => handleAddComponent('image')} className="bg-[#2c2c2c] border border-[#3c3c3c] hover:bg-[#383838] text-[10px] h-7 px-2 rounded text-white flex items-center justify-start gap-1">
                                                                <ImageIcon className="size-3.5 text-emerald-400" /> + Image
                                                            </Button>
                                                            <Button type="button" onClick={() => handleAddComponent('video')} className="bg-[#2c2c2c] border border-[#3c3c3c] hover:bg-[#383838] text-[10px] h-7 px-2 rounded text-white flex items-center justify-start gap-1">
                                                                <Video className="size-3.5 text-red-400" /> + Video
                                                            </Button>
                                                            <Button type="button" onClick={() => handleAddComponent('button')} className="bg-[#2c2c2c] border border-[#3c3c3c] hover:bg-[#383838] text-[10px] h-7 px-2 rounded text-white flex items-center justify-start gap-1">
                                                                <MousePointerClick className="size-3.5 text-amber-400" /> + Button
                                                            </Button>
                                                            <Button type="button" onClick={() => handleAddComponent('spacer')} className="bg-[#2c2c2c] border border-[#3c3c3c] hover:bg-[#383838] text-[10px] h-7 px-2 rounded text-white flex items-center justify-start gap-1">
                                                                <MoveVertical className="size-3.5 text-rose-400" /> + Spacer
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2 mt-2">
                                                        <Label className="text-[9px] text-[#b3b3b3] uppercase font-bold tracking-wider">Element Tree</Label>
                                                        <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                                                            {blockComponents.map((comp, idx) => {
                                                                const isSelected = selectedComponentId === comp.id;
                                                                return (
                                                                    <div
                                                                        key={comp.id}
                                                                        onClick={() => setSelectedComponentId(comp.id)}
                                                                        className={`p-2 border rounded-lg flex items-center justify-between transition-all cursor-pointer ${isSelected ? 'bg-[#2a2a2a] border-[#0d99ff]' : 'bg-[#1b1b1b] border-[#333333] hover:border-[#444444]'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center gap-1.5">
                                                                            {comp.type === 'heading' && <Heading className="size-3.5 text-blue-400" />}
                                                                            {comp.type === 'text' && <Type className="size-3.5 text-purple-400" />}
                                                                            {comp.type === 'image' && <ImageIcon className="size-3.5 text-emerald-400" />}
                                                                            {comp.type === 'video' && <Video className="size-3.5 text-red-400" />}
                                                                            {comp.type === 'button' && <MousePointerClick className="size-3.5 text-amber-400" />}
                                                                            {comp.type === 'spacer' && <MoveVertical className="size-3.5 text-rose-400" />}
                                                                            <span className="text-[10px] font-bold text-white capitalize">{comp.type}</span>
                                                                        </div>

                                                                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                                            <button type="button" onClick={() => handleMoveComponent(idx, 'up')} disabled={idx === 0} className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-30">
                                                                                <ArrowUp className="size-3" />
                                                                            </button>
                                                                            <button type="button" onClick={() => handleMoveComponent(idx, 'down')} disabled={idx === blockComponents.length - 1} className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-30">
                                                                                <ArrowDown className="size-3" />
                                                                            </button>
                                                                            <button type="button" onClick={() => handleRemoveComponent(comp.id)} className="p-0.5 text-red-400 hover:text-red-500 ml-1">
                                                                                <Trash className="size-3" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            {blockComponents.length === 0 && (
                                                                <span className="text-[10px] text-neutral-500 italic text-center py-4">No elements added yet.</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Selected Element Inspector */}
                                                    {selectedComponentId && (() => {
                                                        const activeComp = blockComponents.find(c => c.id === selectedComponentId);
                                                        if (!activeComp) return null;
                                                        return (
                                                            <div className="border-t border-[#333333] pt-3 mt-1 flex flex-col gap-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider flex items-center gap-2">
                                                                        <Palette className="size-3.5" /> {activeComp.type} Settings
                                                                    </span>
                                                                </div>

                                                                {/* Heading Settings */}
                                                                {activeComp.type === 'heading' && (
                                                                    <div className="flex flex-col gap-2.5">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Text</span>
                                                                            <Input
                                                                                value={activeComp.settings.text}
                                                                                onChange={e => handleUpdateComponentSetting(activeComp.id, 'text', e.target.value)}
                                                                                placeholder="e.g. {{title}}"
                                                                                className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Tag</span>
                                                                                <select
                                                                                    value={activeComp.settings.tag}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'tag', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="h1">H1</option>
                                                                                    <option value="h2">H2</option>
                                                                                    <option value="h3">H3</option>
                                                                                    <option value="h4">H4</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Align</span>
                                                                                <select
                                                                                    value={activeComp.settings.align || 'center'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'align', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="left">Left</option>
                                                                                    <option value="center">Center</option>
                                                                                    <option value="right">Right</option>
                                                                                    <option value="justify">Justify</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Custom Size (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.customSize || ''}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'customSize', e.target.value)}
                                                                                    placeholder="e.g. 28"
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Color</span>
                                                                                <div className="flex gap-1">
                                                                                    <input
                                                                                        type="color"
                                                                                        value={activeComp.settings.customColor || '#000000'}
                                                                                        onChange={e => handleUpdateComponentSetting(activeComp.id, 'customColor', e.target.value)}
                                                                                        className="w-7 h-7 p-0 bg-transparent border-0 cursor-pointer"
                                                                                    />
                                                                                    <Input
                                                                                        value={activeComp.settings.customColor || ''}
                                                                                        onChange={e => handleUpdateComponentSetting(activeComp.id, 'customColor', e.target.value)}
                                                                                        placeholder="#000000"
                                                                                        className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333] flex-1"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Weight</span>
                                                                                <select
                                                                                    value={activeComp.settings.customWeight || ''}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'customWeight', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="">Normal</option>
                                                                                    <option value="300">Light</option>
                                                                                    <option value="400">Regular</option>
                                                                                    <option value="600">Semibold</option>
                                                                                    <option value="700">Bold</option>
                                                                                    <option value="800">Extra Bold</option>
                                                                                    <option value="900">Black</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Styles</span>
                                                                                <div className="flex gap-2">
                                                                                    <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={activeComp.settings.italic || false}
                                                                                            onChange={e => handleUpdateComponentSetting(activeComp.id, 'italic', e.target.checked as any)}
                                                                                            className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                        />
                                                                                        <Italic className="size-3" />
                                                                                    </label>
                                                                                    <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={activeComp.settings.underline || false}
                                                                                            onChange={e => handleUpdateComponentSetting(activeComp.id, 'underline', e.target.checked as any)}
                                                                                            className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                        />
                                                                                        <Underline className="size-3" />
                                                                                    </label>
                                                                                    <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={activeComp.settings.uppercase || false}
                                                                                            onChange={e => handleUpdateComponentSetting(activeComp.id, 'uppercase', e.target.checked as any)}
                                                                                            className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                        />
                                                                                        <Maximize className="size-3" />
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2 border-t border-[#333333] pt-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Top (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginTop || '0'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginTop', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Bottom (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginBottom || '16'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginBottom', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Text Settings */}
                                                                {activeComp.type === 'text' && (
                                                                    <div className="flex flex-col gap-2.5">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Content</span>
                                                                            <textarea
                                                                                value={activeComp.settings.content}
                                                                                onChange={e => handleUpdateComponentSetting(activeComp.id, 'content', e.target.value)}
                                                                                placeholder="e.g. {{desc}}"
                                                                                rows={2}
                                                                                className="flex w-full rounded border border-[#444444] bg-[#2c2c2c] px-3 py-2 text-[10px] text-neutral-100 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d99ff]"
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Align</span>
                                                                                <select
                                                                                    value={activeComp.settings.align || 'center'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'align', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="left">Left</option>
                                                                                    <option value="center">Center</option>
                                                                                    <option value="right">Right</option>
                                                                                    <option value="justify">Justify</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Custom Size (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.customSize || ''}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'customSize', e.target.value)}
                                                                                    placeholder="e.g. 14"
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Color</span>
                                                                                <div className="flex gap-1">
                                                                                    <input
                                                                                        type="color"
                                                                                        value={activeComp.settings.customColor || '#000000'}
                                                                                        onChange={e => handleUpdateComponentSetting(activeComp.id, 'customColor', e.target.value)}
                                                                                        className="w-7 h-7 p-0 bg-transparent border-0 cursor-pointer"
                                                                                    />
                                                                                    <Input
                                                                                        value={activeComp.settings.customColor || ''}
                                                                                        onChange={e => handleUpdateComponentSetting(activeComp.id, 'customColor', e.target.value)}
                                                                                        placeholder="#000000"
                                                                                        className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333] flex-1"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Weight</span>
                                                                                <select
                                                                                    value={activeComp.settings.customWeight || ''}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'customWeight', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="">Normal</option>
                                                                                    <option value="300">Light</option>
                                                                                    <option value="400">Regular</option>
                                                                                    <option value="600">Semibold</option>
                                                                                    <option value="700">Bold</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-4">
                                                                            <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={activeComp.settings.italic || false}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'italic', e.target.checked as any)}
                                                                                    className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                />
                                                                                <Italic className="size-3" />
                                                                            </label>
                                                                            <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={activeComp.settings.underline || false}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'underline', e.target.checked as any)}
                                                                                    className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                />
                                                                                <Underline className="size-3" />
                                                                            </label>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2 border-t border-[#333333] pt-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Top (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginTop || '0'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginTop', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Bottom (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginBottom || '16'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginBottom', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Image Settings */}
                                                                {activeComp.type === 'image' && (
                                                                    <div className="flex flex-col gap-2.5">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Image URL</span>
                                                                            <Input
                                                                                value={activeComp.settings.url}
                                                                                onChange={e => handleUpdateComponentSetting(activeComp.id, 'url', e.target.value)}
                                                                                placeholder="e.g. {{image_url}}"
                                                                                className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Upload</span>
                                                                            <div className="flex items-center gap-2">
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    id="image-file-upload"
                                                                                    className="hidden"
                                                                                    onChange={e => handleMediaUpload(e, activeComp.id, false)}
                                                                                />
                                                                                <label
                                                                                    htmlFor="image-file-upload"
                                                                                    className="flex-1 text-center py-1.5 px-3 bg-[#2c2c2c] border border-[#3c3c3c] hover:bg-[#383838] text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                                                                                >
                                                                                    {uploadingMediaId === activeComp.id ? 'Uploading...' : 'Choose Image'}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Size</span>
                                                                                <select
                                                                                    value={activeComp.settings.size || 'medium'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'size', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="small">Small</option>
                                                                                    <option value="medium">Medium</option>
                                                                                    <option value="large">Large</option>
                                                                                    <option value="full">Full Width</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Radius</span>
                                                                                <select
                                                                                    value={activeComp.settings.radius}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'radius', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="rounded-none">None</option>
                                                                                    <option value="rounded-md">Medium</option>
                                                                                    <option value="rounded-xl">Large</option>
                                                                                    <option value="rounded-3xl">Pill</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Custom Width (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.customWidth || ''}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'customWidth', e.target.value)}
                                                                                    placeholder="e.g. 400"
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Custom Height (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.customHeight || ''}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'customHeight', e.target.value)}
                                                                                    placeholder="e.g. 300"
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Align</span>
                                                                                <select
                                                                                    value={activeComp.settings.align || 'center'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'align', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="left">Left</option>
                                                                                    <option value="center">Center</option>
                                                                                    <option value="right">Right</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2 border-t border-[#333333] pt-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Top (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginTop || '0'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginTop', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Bottom (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginBottom || '16'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginBottom', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Video Settings */}
                                                                {activeComp.type === 'video' && (
                                                                    <div className="flex flex-col gap-2.5">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Video URL</span>
                                                                            <Input
                                                                                value={activeComp.settings.url}
                                                                                onChange={e => handleUpdateComponentSetting(activeComp.id, 'url', e.target.value)}
                                                                                placeholder="e.g. {{video_url}}"
                                                                                className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Upload</span>
                                                                            <div className="flex items-center gap-2">
                                                                                <input
                                                                                    type="file"
                                                                                    accept="video/*"
                                                                                    id="video-file-upload"
                                                                                    className="hidden"
                                                                                    onChange={e => handleMediaUpload(e, activeComp.id, true)}
                                                                                />
                                                                                <label
                                                                                    htmlFor="video-file-upload"
                                                                                    className="flex-1 text-center py-1.5 px-3 bg-[#2c2c2c] border border-[#3c3c3c] hover:bg-[#383838] text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                                                                                >
                                                                                    {uploadingMediaId === activeComp.id ? 'Uploading...' : 'Choose Video'}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-3">
                                                                            <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={activeComp.settings.controls !== false}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'controls', e.target.checked as any)}
                                                                                    className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                />
                                                                                Controls
                                                                            </label>
                                                                            <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={activeComp.settings.autoplay || false}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'autoplay', e.target.checked as any)}
                                                                                    className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                />
                                                                                Autoplay
                                                                            </label>
                                                                            <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={activeComp.settings.loop || false}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'loop', e.target.checked as any)}
                                                                                    className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                />
                                                                                Loop
                                                                            </label>
                                                                            <label className="flex items-center gap-1 text-[10px] text-neutral-400 cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={activeComp.settings.muted || false}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'muted', e.target.checked as any)}
                                                                                    className="size-3.5 rounded border-[#444444] bg-[#2c2c2c]"
                                                                                />
                                                                                Muted
                                                                            </label>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Size</span>
                                                                                <select
                                                                                    value={activeComp.settings.size || 'medium'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'size', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="small">Small</option>
                                                                                    <option value="medium">Medium</option>
                                                                                    <option value="large">Large</option>
                                                                                    <option value="full">Full Width</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Radius</span>
                                                                                <select
                                                                                    value={activeComp.settings.radius}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'radius', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="rounded-none">None</option>
                                                                                    <option value="rounded-md">Medium</option>
                                                                                    <option value="rounded-xl">Large</option>
                                                                                    <option value="rounded-3xl">Pill</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Custom Width (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.customWidth || ''}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'customWidth', e.target.value)}
                                                                                    placeholder="e.g. 400"
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Custom Height (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.customHeight || ''}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'customHeight', e.target.value)}
                                                                                    placeholder="e.g. 300"
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Align</span>
                                                                                <select
                                                                                    value={activeComp.settings.align || 'center'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'align', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="left">Left</option>
                                                                                    <option value="center">Center</option>
                                                                                    <option value="right">Right</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2 border-t border-[#333333] pt-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Top (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginTop || '0'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginTop', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Bottom (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginBottom || '16'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginBottom', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Button Settings - Full Customization */}
                                                                {activeComp.type === 'button' && (
                                                                    <div className="flex flex-col gap-2.5">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Text</span>
                                                                            <Input
                                                                                value={activeComp.settings.text}
                                                                                onChange={e => handleUpdateComponentSetting(activeComp.id, 'text', e.target.value)}
                                                                                placeholder="e.g. {{btn_text}}"
                                                                                className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">URL</span>
                                                                            <Input
                                                                                value={activeComp.settings.url}
                                                                                onChange={e => handleUpdateComponentSetting(activeComp.id, 'url', e.target.value)}
                                                                                placeholder="e.g. {{btn_url}}"
                                                                                className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Bg Color</span>
                                                                                <div className="flex gap-1">
                                                                                    <select
                                                                                        value={activeComp.settings.bg}
                                                                                        onChange={e => handleUpdateComponentSetting(activeComp.id, 'bg', e.target.value)}
                                                                                        className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white flex-1"
                                                                                        disabled={!!activeComp.settings.customBgColor}
                                                                                    >
                                                                                        <option value="bg-blue-650">Blue</option>
                                                                                        <option value="bg-neutral-900">Dark</option>
                                                                                        <option value="bg-emerald-600">Green</option>
                                                                                        <option value="bg-rose-600">Rose</option>
                                                                                        <option value="bg-purple-600">Purple</option>
                                                                                        <option value="bg-amber-600">Amber</option>
                                                                                    </select>
                                                                                    <input
                                                                                        type="color"
                                                                                        value={activeComp.settings.customBgColor || '#2563eb'}
                                                                                        onChange={e => handleUpdateComponentSetting(activeComp.id, 'customBgColor', e.target.value)}
                                                                                        className="w-7 h-7 p-0 bg-transparent border-0 cursor-pointer"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Text Color</span>
                                                                                <div className="flex gap-1">
                                                                                    <select
                                                                                        value={activeComp.settings.textColor}
                                                                                        onChange={e => handleUpdateComponentSetting(activeComp.id, 'textColor', e.target.value)}
                                                                                        className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white flex-1"
                                                                                        disabled={!!activeComp.settings.customTextColor}
                                                                                    >
                                                                                        <option value="text-white">White</option>
                                                                                        <option value="text-neutral-900">Dark</option>
                                                                                        <option value="text-neutral-700">Grey</option>
                                                                                    </select>
                                                                                    <input
                                                                                        type="color"
                                                                                        value={activeComp.settings.customTextColor || '#ffffff'}
                                                                                        onChange={e => handleUpdateComponentSetting(activeComp.id, 'customTextColor', e.target.value)}
                                                                                        className="w-7 h-7 p-0 bg-transparent border-0 cursor-pointer"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Radius</span>
                                                                                <select
                                                                                    value={activeComp.settings.radius}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'radius', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="rounded-none">None</option>
                                                                                    <option value="rounded-md">Medium</option>
                                                                                    <option value="rounded-xl">Large</option>
                                                                                    <option value="rounded-full">Pill</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Font Size</span>
                                                                                <select
                                                                                    value={activeComp.settings.fontSize || 'text-xs'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'fontSize', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="text-xs">XS</option>
                                                                                    <option value="text-sm">Small</option>
                                                                                    <option value="text-base">Base</option>
                                                                                    <option value="text-lg">Large</option>
                                                                                    <option value="text-xl">XL</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Padding X</span>
                                                                                <select
                                                                                    value={activeComp.settings.paddingX || 'px-6'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'paddingX', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="px-2">Tight</option>
                                                                                    <option value="px-4">Normal</option>
                                                                                    <option value="px-6">Comfortable</option>
                                                                                    <option value="px-8">Wide</option>
                                                                                    <option value="px-12">XL</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Padding Y</span>
                                                                                <select
                                                                                    value={activeComp.settings.paddingY || 'py-2.5'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'paddingY', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="py-1">Tight</option>
                                                                                    <option value="py-2">Normal</option>
                                                                                    <option value="py-2.5">Medium</option>
                                                                                    <option value="py-3.5">Large</option>
                                                                                    <option value="py-5">XL</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Align</span>
                                                                                <select
                                                                                    value={activeComp.settings.align || 'center'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'align', e.target.value)}
                                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                                >
                                                                                    <option value="left">Left</option>
                                                                                    <option value="center">Center</option>
                                                                                    <option value="right">Right</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2 border-t border-[#333333] pt-2">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Top (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginTop || '0'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginTop', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Bottom (px)</span>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={activeComp.settings.marginBottom || '16'}
                                                                                    onChange={e => handleUpdateComponentSetting(activeComp.id, 'marginBottom', e.target.value)}
                                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Spacer Settings */}
                                                                {activeComp.type === 'spacer' && (
                                                                    <div className="flex flex-col gap-2">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Height</span>
                                                                            <select
                                                                                value={activeComp.settings.height}
                                                                                onChange={e => handleUpdateComponentSetting(activeComp.id, 'height', e.target.value)}
                                                                                className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                            >
                                                                                <option value="h-2">XS (8px)</option>
                                                                                <option value="h-4">Small (16px)</option>
                                                                                <option value="h-8">Medium (32px)</option>
                                                                                <option value="h-12">Large (48px)</option>
                                                                                <option value="h-16">XL (64px)</option>
                                                                                <option value="h-24">2XL (96px)</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                /* Section Style Panel - Enhanced */
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider flex items-center gap-2">
                                                            <Palette className="size-3.5" /> Background
                                                        </span>

                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Type</span>
                                                            <select
                                                                value={sectionSettings.bgType}
                                                                onChange={e => handleUpdateSectionSetting('bgType', e.target.value)}
                                                                className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1.5 text-neutral-100"
                                                            >
                                                                <option value="color">Solid Color</option>
                                                                <option value="gradient">Gradient</option>
                                                                <option value="image">Background Image</option>
                                                            </select>
                                                        </div>

                                                        {sectionSettings.bgType === 'color' && (
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Color</span>
                                                                <div className="flex gap-2">
                                                                    <select
                                                                        value={sectionSettings.bgColor}
                                                                        onChange={e => handleUpdateSectionSetting('bgColor', e.target.value)}
                                                                        className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1.5 text-neutral-100 flex-1"
                                                                        disabled={!!sectionSettings.customBgColor}
                                                                    >
                                                                        <option value="bg-white">White</option>
                                                                        <option value="bg-neutral-50">Light Gray</option>
                                                                        <option value="bg-neutral-100">Soft Gray</option>
                                                                        <option value="bg-neutral-900">Dark</option>
                                                                        <option value="bg-blue-50">Blue Tint</option>
                                                                        <option value="bg-rose-50">Rose Tint</option>
                                                                        <option value="bg-emerald-50">Green Tint</option>
                                                                    </select>
                                                                    <input
                                                                        type="color"
                                                                        value={sectionSettings.customBgColor || '#ffffff'}
                                                                        onChange={e => handleUpdateSectionSetting('customBgColor', e.target.value)}
                                                                        className="w-8 h-8 p-0 bg-transparent border-0 cursor-pointer rounded"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {sectionSettings.bgType === 'gradient' && (
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[9px] text-[#888888] font-bold uppercase">From</span>
                                                                    <select
                                                                        value={sectionSettings.gradientFrom}
                                                                        onChange={e => handleUpdateSectionSetting('gradientFrom', e.target.value)}
                                                                        className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1.5 text-neutral-100"
                                                                    >
                                                                        <option value="from-blue-500">Blue</option>
                                                                        <option value="from-purple-500">Purple</option>
                                                                        <option value="from-emerald-500">Green</option>
                                                                        <option value="from-rose-500">Rose</option>
                                                                        <option value="from-amber-500">Amber</option>
                                                                        <option value="from-pink-500">Pink</option>
                                                                    </select>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[9px] text-[#888888] font-bold uppercase">To</span>
                                                                    <select
                                                                        value={sectionSettings.gradientTo}
                                                                        onChange={e => handleUpdateSectionSetting('gradientTo', e.target.value)}
                                                                        className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1.5 text-neutral-100"
                                                                    >
                                                                        <option value="to-purple-650">Purple</option>
                                                                        <option value="to-rose-600">Rose</option>
                                                                        <option value="to-teal-500">Teal</option>
                                                                        <option value="to-pink-500">Pink</option>
                                                                        <option value="to-orange-500">Orange</option>
                                                                        <option value="to-indigo-600">Indigo</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {sectionSettings.bgType === 'image' && (
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[9px] text-[#888888] font-bold uppercase">Image URL</span>
                                                                    <Input
                                                                        value={sectionSettings.bgImage}
                                                                        onChange={e => handleUpdateSectionSetting('bgImage', e.target.value)}
                                                                        placeholder="e.g. {{bg_image}}"
                                                                        className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[9px] text-[#888888] font-bold uppercase">Overlay Opacity</span>
                                                                    <select
                                                                        value={sectionSettings.overlayOpacity}
                                                                        onChange={e => handleUpdateSectionSetting('overlayOpacity', e.target.value)}
                                                                        className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1.5 text-neutral-100"
                                                                    >
                                                                        <option value="opacity-0">None</option>
                                                                        <option value="opacity-20">Light</option>
                                                                        <option value="opacity-50">Medium</option>
                                                                        <option value="opacity-75">Dark</option>
                                                                        <option value="opacity-90">Very Dark</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="border-t border-[#333333] pt-3 flex flex-col gap-2.5">
                                                        <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider flex items-center gap-2">
                                                            <Ruler className="size-3.5" /> Layout & Spacing
                                                        </span>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Width</span>
                                                                <select
                                                                    value={sectionSettings.width}
                                                                    onChange={e => handleUpdateSectionSetting('width', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="w-full">Full</option>
                                                                    <option value="max-w-7xl">7XL</option>
                                                                    <option value="max-w-6xl">6XL</option>
                                                                    <option value="max-w-5xl">5XL</option>
                                                                    <option value="max-w-4xl">4XL</option>
                                                                    <option value="max-w-3xl">3XL</option>
                                                                    <option value="max-w-2xl">2XL</option>
                                                                    <option value="max-w-xl">XL</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Min Height</span>
                                                                <select
                                                                    value={sectionSettings.height}
                                                                    onChange={e => handleUpdateSectionSetting('height', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="h-auto">Auto</option>
                                                                    <option value="min-h-[200px]">200px</option>
                                                                    <option value="min-h-[350px]">350px</option>
                                                                    <option value="min-h-[500px]">500px</option>
                                                                    <option value="min-h-[650px]">650px</option>
                                                                    <option value="min-h-[800px]">800px</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Padding Y</span>
                                                                <select
                                                                    value={sectionSettings.py}
                                                                    onChange={e => handleUpdateSectionSetting('py', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="py-1">Tight</option>
                                                                    <option value="py-2">Small</option>
                                                                    <option value="py-4">Normal</option>
                                                                    <option value="py-8">Medium</option>
                                                                    <option value="py-12">Large</option>
                                                                    <option value="py-16">XL</option>
                                                                    <option value="py-24">2XL</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Padding X</span>
                                                                <select
                                                                    value={sectionSettings.px}
                                                                    onChange={e => handleUpdateSectionSetting('px', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="px-2">Tight</option>
                                                                    <option value="px-4">Normal</option>
                                                                    <option value="px-6">Comfortable</option>
                                                                    <option value="px-8">Wide</option>
                                                                    <option value="px-12">XL</option>
                                                                    <option value="px-16">2XL</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Margin Y</span>
                                                                <select
                                                                    value={sectionSettings.my}
                                                                    onChange={e => handleUpdateSectionSetting('my', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="my-0">None</option>
                                                                    <option value="my-1">Tight</option>
                                                                    <option value="my-2">Small</option>
                                                                    <option value="my-4">Normal</option>
                                                                    <option value="my-8">Medium</option>
                                                                    <option value="my-12">Large</option>
                                                                    <option value="my-16">XL</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Radius</span>
                                                                <select
                                                                    value={sectionSettings.radius}
                                                                    onChange={e => handleUpdateSectionSetting('radius', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="rounded-none">None</option>
                                                                    <option value="rounded-sm">Small</option>
                                                                    <option value="rounded-md">Medium</option>
                                                                    <option value="rounded-lg">Large</option>
                                                                    <option value="rounded-xl">XL</option>
                                                                    <option value="rounded-2xl">2XL</option>
                                                                    <option value="rounded-3xl">3XL</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Border</span>
                                                                <select
                                                                    value={sectionSettings.border}
                                                                    onChange={e => handleUpdateSectionSetting('border', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="border-0">None</option>
                                                                    <option value="border border-[#eaeaea] dark:border-[#333333]">Thin</option>
                                                                    <option value="border-2 border-[#dcdcdc] dark:border-[#444444]">Thick</option>
                                                                    <option value="border-4 border-[#dcdcdc] dark:border-[#444444]">Extra Thick</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Shadow</span>
                                                                <select
                                                                    value={sectionSettings.shadow}
                                                                    onChange={e => handleUpdateSectionSetting('shadow', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="shadow-none">None</option>
                                                                    <option value="shadow-sm">Soft</option>
                                                                    <option value="shadow-md">Medium</option>
                                                                    <option value="shadow-lg">Large</option>
                                                                    <option value="shadow-xl">XL</option>
                                                                    <option value="shadow-2xl">2XL</option>
                                                                    <option value="shadow-inner">Inner</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-[#333333] pt-3 flex flex-col gap-2.5">
                                                        <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider flex items-center gap-2">
                                                            <Type className="size-3.5" /> Typography & Animation
                                                        </span>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Font Family</span>
                                                                <select
                                                                    value={sectionSettings.fontFamily}
                                                                    onChange={e => handleUpdateSectionSetting('fontFamily', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="font-sans">Sans</option>
                                                                    <option value="font-serif">Serif</option>
                                                                    <option value="font-mono">Mono</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Text Align</span>
                                                                <select
                                                                    value={sectionSettings.align}
                                                                    onChange={e => handleUpdateSectionSetting('align', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="text-left">Left</option>
                                                                    <option value="text-center">Center</option>
                                                                    <option value="text-right">Right</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Animation</span>
                                                            <select
                                                                value={sectionSettings.animation}
                                                                onChange={e => handleUpdateSectionSetting('animation', e.target.value)}
                                                                className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                            >
                                                                <option value="none">None</option>
                                                                <option value="fade-in">Fade In</option>
                                                                <option value="slide-up">Slide Up</option>
                                                                <option value="slide-down">Slide Down</option>
                                                                <option value="slide-left">Slide Left</option>
                                                                <option value="slide-right">Slide Right</option>
                                                                <option value="scale-up">Scale Up</option>
                                                                <option value="bounce">Bounce</option>
                                                                <option value="pulse">Pulse</option>
                                                                <option value="spin">Spin</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-[#333333] pt-3 flex flex-col gap-2.5">
                                                        <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider flex items-center gap-2">
                                                            <Settings className="size-3.5" /> Advanced
                                                        </span>

                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Custom Class</span>
                                                            <Input
                                                                value={sectionSettings.customClass}
                                                                onChange={e => handleUpdateSectionSetting('customClass', e.target.value)}
                                                                placeholder="e.g. custom-hero"
                                                                className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">CSS ID</span>
                                                            <Input
                                                                value={sectionSettings.customId}
                                                                onChange={e => handleUpdateSectionSetting('customId', e.target.value)}
                                                                placeholder="e.g. hero-section"
                                                                className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Custom CSS</span>
                                                            <textarea
                                                                value={sectionSettings.customCss}
                                                                onChange={e => handleUpdateSectionSetting('customCss', e.target.value)}
                                                                placeholder=".custom-hero { box-shadow: 0 20px 60px rgba(0,0,0,0.1); }"
                                                                rows={2}
                                                                className="flex w-full rounded border border-[#444444] bg-[#2c2c2c] px-3 py-2 text-[10px] font-mono text-neutral-100 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d99ff]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Z-Index</span>
                                                                <select
                                                                    value={sectionSettings.zIndex}
                                                                    onChange={e => handleUpdateSectionSetting('zIndex', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="z-0">Default</option>
                                                                    <option value="z-10">Low</option>
                                                                    <option value="z-20">Medium</option>
                                                                    <option value="z-30">High</option>
                                                                    <option value="z-50">Very High</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Position</span>
                                                                <select
                                                                    value={sectionSettings.position}
                                                                    onChange={e => handleUpdateSectionSetting('position', e.target.value)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                                >
                                                                    <option value="relative">Relative</option>
                                                                    <option value="static">Static</option>
                                                                    <option value="absolute">Absolute</option>
                                                                    <option value="fixed">Fixed</option>
                                                                    <option value="sticky">Sticky</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[9px] text-[#888888] font-bold uppercase">Visibility</span>
                                                            <select
                                                                value={sectionSettings.visibility}
                                                                onChange={e => handleUpdateSectionSetting('visibility', e.target.value)}
                                                                className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1 text-white"
                                                            >
                                                                <option value="visible">Show Everywhere</option>
                                                                <option value="hidden-mobile">Hide on Mobile</option>
                                                                <option value="hidden-desktop">Hide on Desktop</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}