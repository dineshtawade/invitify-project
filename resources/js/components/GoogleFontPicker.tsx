// developed by dinesh tawade
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Search,
    Sparkles,
    Check,
    Type,
    ChevronDown,
    SlidersHorizontal,
    X,
    Loader2,
    Heart,
} from 'lucide-react';
import {
    GoogleFontItem,
    CURATED_WEDDING_FONTS,
    fetchGoogleFonts,
    loadGoogleFont,
    loadGoogleFonts,
    getFontFamilyName,
    getFontFamilyCss,
    LEGACY_FONT_MAP,
} from '@/utils/font-utils';

interface GoogleFontPickerProps {
    value?: string;
    sampleText?: string;
    onChange: (fontFamily: string) => void;
    className?: string;
}

type CategoryFilter = 'all' | 'wedding' | 'handwriting' | 'serif' | 'sans-serif' | 'display';

export default function GoogleFontPicker({
    value = 'playfair',
    sampleText = 'The Wedding of Sarah & Alex',
    onChange,
    className = '',
}: GoogleFontPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [fonts, setFonts] = useState<GoogleFontItem[]>(CURATED_WEDDING_FONTS);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('wedding');
    const [customPreviewText, setCustomPreviewText] = useState(sampleText);
    const [previewSize, setPreviewSize] = useState<'sm' | 'md' | 'lg'>('md');
    const [displayLimit, setDisplayLimit] = useState(36);

    const activeFamilyName = useMemo(() => getFontFamilyName(value), [value]);
    const activeFontCss = useMemo(() => getFontFamilyCss(value), [value]);

    // Preload current font
    useEffect(() => {
        loadGoogleFont(value);
    }, [value]);

    // Fetch Google Fonts library when modal opens
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        setIsLoading(true);

        fetchGoogleFonts()
            .then((list) => {
                if (isMounted && list && list.length > 0) {
                    setFonts(list);
                }
            })
            .catch((err) => {
                console.error('Failed to load Google Fonts list', err);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    // Filter fonts based on search and category
    const filteredFonts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return fonts.filter((font) => {
            // Category check
            if (selectedCategory === 'wedding') {
                if (!font.isPopularWedding) return false;
            } else if (selectedCategory !== 'all') {
                if (font.category !== selectedCategory) return false;
            }

            // Search query
            if (query) {
                return font.family.toLowerCase().includes(query);
            }

            return true;
        });
    }, [fonts, search, selectedCategory]);

    const visibleFonts = useMemo(() => {
        return filteredFonts.slice(0, displayLimit);
    }, [filteredFonts, displayLimit]);

    // Preload visible fonts in DOM so previews render instantly
    useEffect(() => {
        if (!isOpen) return;
        const familiesToLoad = visibleFonts.map((f) => f.family);
        loadGoogleFonts(familiesToLoad);
    }, [isOpen, visibleFonts]);

    const handleSelectFont = (fontFamily: string) => {
        loadGoogleFont(fontFamily);
        onChange(fontFamily);
        setIsOpen(false);
    };

    const previewFontSizeClass = {
        sm: 'text-base sm:text-lg',
        md: 'text-xl sm:text-2xl',
        lg: 'text-2xl sm:text-3xl',
    }[previewSize];

    return (
        <div className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => {
                    setCustomPreviewText(sampleText || 'The Wedding of Sarah & Alex');
                    setDisplayLimit(36);
                    setIsOpen(true);
                }}
                className="flex items-center justify-between w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-indigo-500 dark:hover:border-indigo-500 text-left transition-all shadow-2xs group focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                    <Type className="size-3.5 text-indigo-600 shrink-0" />
                    <span
                        className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                        style={{ fontFamily: activeFontCss }}
                    >
                        {activeFamilyName}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-neutral-400 group-hover:text-indigo-600">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-medium">
                        Fonts
                    </span>
                    <ChevronDown className="size-3.5" />
                </div>
            </button>

            {/* Google Fonts Modal Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl">
                    {/* Header */}
                    <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="size-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                                    <Sparkles className="size-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                        Google Fonts Library
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                            {fonts.length > 100 ? `${fonts.length} Fonts` : '1,950+ Fonts'}
                                        </span>
                                    </DialogTitle>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        Pick luxury wedding script, elegant serifs, or modern typography from Google Fonts
                                    </p>
                                </div>
                            </div>

                            {/* Active Font Pill */}
                            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto shadow-2xs">
                                <span className="text-[10px] uppercase font-bold text-neutral-400">Current:</span>
                                <span
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400"
                                    style={{ fontFamily: activeFontCss }}
                                >
                                    {activeFamilyName}
                                </span>
                            </div>
                        </div>

                        {/* Search & Category Filter Toolbar */}
                        <div className="mt-3.5 space-y-2.5">
                            {/* Search bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
                                <Input
                                    type="text"
                                    placeholder="Search by font name (e.g. Playfair, Dancing Script, Cinzel, Allura, Roboto)..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setDisplayLimit(36);
                                    }}
                                    className="pl-9 pr-8 h-9 text-xs sm:text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 rounded-xl"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>

                            {/* Category Filter Chips */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                                {[
                                    { id: 'wedding', label: '✨ Wedding & Script', count: fonts.filter(f => f.isPopularWedding).length },
                                    { id: 'all', label: 'All Google Fonts', count: fonts.length },
                                    { id: 'handwriting', label: 'Calligraphy & Cursive' },
                                    { id: 'serif', label: 'Serif (Classic & Regal)' },
                                    { id: 'sans-serif', label: 'Sans Serif (Modern)' },
                                    { id: 'display', label: 'Display (Decorative)' },
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory(cat.id as CategoryFilter);
                                            setDisplayLimit(36);
                                        }}
                                        className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                                            selectedCategory === cat.id
                                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        {cat.label}
                                        {cat.count !== undefined && (
                                            <span className="text-[10px] opacity-70">({cat.count})</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Sample Text Preview Bar */}
                        <div className="mt-2.5 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0">
                                    Preview:
                                </span>
                                <input
                                    type="text"
                                    value={customPreviewText}
                                    onChange={(e) => setCustomPreviewText(e.target.value)}
                                    placeholder="Type custom text to preview..."
                                    className="h-7 px-2.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200"
                                />
                            </div>

                            {/* Quick text buttons + Size Toggle */}
                            <div className="flex items-center justify-between sm:justify-end gap-2">
                                <div className="flex items-center gap-1">
                                    {[
                                        'The Wedding Of',
                                        'Save The Date',
                                        'Rahul & Priya',
                                    ].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setCustomPreviewText(preset)}
                                            className="px-2 py-0.5 text-[10px] rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium transition-colors"
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5 bg-neutral-100 dark:bg-neutral-800">
                                    {(['sm', 'md', 'lg'] as const).map((sz) => (
                                        <button
                                            key={sz}
                                            type="button"
                                            onClick={() => setPreviewSize(sz)}
                                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase transition-all ${
                                                previewSize === sz
                                                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                                                    : 'text-neutral-500 hover:text-neutral-800'
                                            }`}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Scrollable Font Cards List */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                        {isLoading && fonts.length <= CURATED_WEDDING_FONTS.length && (
                            <div className="flex items-center justify-center gap-2 py-3 text-xs text-neutral-500">
                                <Loader2 className="size-4 animate-spin text-indigo-600" />
                                <span>Loading Google Fonts library...</span>
                            </div>
                        )}

                        {filteredFonts.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    No Google fonts found matching "{search}"
                                </p>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Try searching another font name or change category
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearch('');
                                        setSelectedCategory('all');
                                    }}
                                    className="mt-3 text-xs"
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {visibleFonts.map((font) => {
                                    const isSelected = activeFamilyName.toLowerCase() === font.family.toLowerCase();
                                    const fontCss = `'${font.family}', ${
                                        font.category === 'handwriting' ? 'cursive' : font.category === 'serif' ? 'serif' : 'sans-serif'
                                    }`;

                                    return (
                                        <div
                                            key={font.family}
                                            onClick={() => handleSelectFont(font.family)}
                                            className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                                                isSelected
                                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                                                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm bg-white dark:bg-neutral-900'
                                            }`}
                                        >
                                            {/* Font Info Header */}
                                            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                                                        {font.family}
                                                    </span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 capitalize shrink-0 font-medium">
                                                        {font.category}
                                                    </span>
                                                    {font.isPopularWedding && (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center gap-1 font-semibold border border-amber-200 dark:border-amber-800 shrink-0">
                                                            <Sparkles className="size-2.5" /> Wedding
                                                        </span>
                                                    )}
                                                </div>

                                                {isSelected ? (
                                                    <span className="flex size-6 items-center justify-center rounded-full bg-indigo-600 text-white shrink-0 shadow-xs">
                                                        <Check className="size-3.5 stroke-[3]" />
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-indigo-600 transition-colors shrink-0">
                                                        Select
                                                    </span>
                                                )}
                                            </div>

                                            {/* Live Rendered Sample */}
                                            <div className="py-3.5 min-h-[64px] flex items-center">
                                                <p
                                                    className={`${previewFontSizeClass} text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 break-words`}
                                                    style={{ fontFamily: fontCss }}
                                                >
                                                    {customPreviewText || font.family}
                                                </p>
                                            </div>

                                            {/* Card Footer Subtext */}
                                            <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400">
                                                <span>Google Font</span>
                                                <span className="group-hover:translate-x-0.5 transition-transform font-medium group-hover:text-indigo-600">
                                                    Apply to element →
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Load More Button */}
                        {visibleFonts.length < filteredFonts.length && (
                            <div className="pt-3 pb-2 text-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDisplayLimit((prev) => prev + 48)}
                                    className="text-xs font-semibold px-6 rounded-xl border-neutral-300 dark:border-neutral-700"
                                >
                                    Load More Google Fonts ({filteredFonts.length - visibleFonts.length} remaining)
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 sm:p-4 px-4 sm:px-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0 flex items-center justify-between text-xs">
                        <span className="text-neutral-500">
                            Showing <strong className="text-neutral-800 dark:text-neutral-200">{visibleFonts.length}</strong> of{' '}
                            <strong className="text-neutral-800 dark:text-neutral-200">{filteredFonts.length}</strong> fonts
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="h-8 text-xs text-neutral-500"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
