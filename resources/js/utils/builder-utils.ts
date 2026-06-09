export interface ElementConfig {
    id: string;
    type: 'text' | 'image' | 'icon' | 'divider' | 'link';
    content?: string;
    url?: string;
    iconType?: string;
    x: number; // percentage
    y: number; // percentage
    w: number; // percentage
    h: number; // percentage
    fontSize?: number;
    fontStyle?: string;
    textColor?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
    isItalic?: boolean;
}

export interface PageConfig {
    id: string;
    bg_gradient: string;
    elements: ElementConfig[];
}

export interface InvitationConfig {
    aspectRatio: 'standard' | 'square' | 'landscape' | 'mobile';
    pages: PageConfig[];
}

export const defaultPositions = {
    header: { x: 10, y: 5, w: 80, h: 12 },
    hosts: { x: 10, y: 20, w: 80, h: 6 },
    couple: { x: 10, y: 28, w: 80, h: 18 },
    datetime: { x: 10, y: 50, w: 80, h: 10 },
    venue: { x: 10, y: 64, w: 80, h: 12 },
    image: { x: 20, y: 78, w: 60, h: 18 },
};

/**
 * Normalizes old template config layouts to the new multi-page, multi-element layout structure.
 */
export function normalizeConfig(config: any, bg_gradient_default: string = 'from-stone-100 to-rose-50 text-neutral-800'): InvitationConfig {
    if (!config) {
        return createEmptyConfig(bg_gradient_default);
    }

    // If it's already in the new format
    if (config.pages && Array.isArray(config.pages)) {
        return {
            aspectRatio: config.aspectRatio || 'standard',
            pages: config.pages.map((p: any) => ({
                id: p.id || `page-${Math.random().toString(36).substr(2, 9)}`,
                bg_gradient: p.bg_gradient || bg_gradient_default,
                elements: (p.elements || []).map((e: any) => ({
                    id: e.id || `elem-${Math.random().toString(36).substr(2, 9)}`,
                    type: e.type,
                    content: e.content,
                    url: e.url,
                    iconType: e.iconType,
                    x: typeof e.x === 'number' ? e.x : 0,
                    y: typeof e.y === 'number' ? e.y : 0,
                    w: typeof e.w === 'number' ? e.w : 50,
                    h: typeof e.h === 'number' ? e.h : 10,
                    fontSize: e.fontSize,
                    fontStyle: e.fontStyle,
                    textColor: e.textColor,
                    color: e.color,
                    textAlign: e.textAlign,
                    fontWeight: e.fontWeight,
                    isItalic: e.isItalic,
                }))
            }))
        };
    }

    // Convert old single-page configuration layout to new layout
    const positions = config.positions || defaultPositions;
    const font = config.font_style || 'playfair';
    const textColor = config.text_color || '#1f2937';
    const borderColor = config.border_color || '#e4e4e7';

    const elements: ElementConfig[] = [];

    // 1. Icon Element
    elements.push({
        id: 'elem-icon',
        type: 'icon',
        iconType: config.icon_type || 'ring',
        color: borderColor,
        x: (positions.header?.x || 10) + (positions.header?.w || 80) / 2 - 5,
        y: positions.header?.y || 5,
        w: 10,
        h: 6
    });

    // 2. Title Element
    elements.push({
        id: 'elem-title',
        type: 'text',
        content: config.title || 'THE WEDDING OF',
        x: positions.header?.x || 10,
        y: (positions.header?.y || 5) + 6,
        w: positions.header?.w || 80,
        h: 6,
        fontSize: 14,
        fontStyle: font,
        textColor: textColor,
        textAlign: 'center',
        fontWeight: 'bold',
        isItalic: false
    });

    // 3. Hosts Element
    if (config.hosts) {
        elements.push({
            id: 'elem-hosts',
            type: 'text',
            content: config.hosts || 'Together with their families',
            x: positions.hosts?.x || 10,
            y: positions.hosts?.y || 20,
            w: positions.hosts?.w || 80,
            h: positions.hosts?.h || 6,
            fontSize: 10,
            fontStyle: font,
            textColor: textColor,
            textAlign: 'center',
            isItalic: true
        });
    }

    // 4. Guest of Honor / Couple Element
    elements.push({
        id: 'elem-couple',
        type: 'text',
        content: config.guest_of_honor || 'Couple Names',
        x: positions.couple?.x || 10,
        y: positions.couple?.y || 28,
        w: positions.couple?.w || 80,
        h: positions.couple?.h || 18,
        fontSize: 22,
        fontStyle: font,
        textColor: textColor,
        textAlign: 'center',
        fontWeight: 'bold',
    });

    // 5. Date & Time Element
    elements.push({
        id: 'elem-datetime',
        type: 'text',
        content: `${config.date || 'July 15, 2026'} • ${config.time || '6:00 PM'}`,
        x: positions.datetime?.x || 10,
        y: positions.datetime?.y || 50,
        w: positions.datetime?.w || 80,
        h: positions.datetime?.h || 10,
        fontSize: 12,
        fontStyle: font,
        textColor: textColor,
        textAlign: 'center',
        fontWeight: 'bold'
    });

    // 6. Venue Element
    elements.push({
        id: 'elem-venue',
        type: 'text',
        content: config.venue || 'Venue Address',
        x: positions.venue?.x || 10,
        y: positions.venue?.y || 64,
        w: positions.venue?.w || 80,
        h: positions.venue?.h || 12,
        fontSize: 11,
        fontStyle: font,
        textColor: textColor,
        textAlign: 'center',
        isItalic: true
    });

    // 7. Image Element
    if (config.image_url) {
        elements.push({
            id: 'elem-image',
            type: 'image',
            url: config.image_url,
            x: positions.image?.x || 20,
            y: positions.image?.y || 78,
            w: positions.image?.w || 60,
            h: positions.image?.h || 18
        });
    }

    return {
        aspectRatio: 'standard',
        pages: [
            {
                id: 'page-1',
                bg_gradient: bg_gradient_default,
                elements
            }
        ]
    };
}

export function createEmptyConfig(bg_gradient_default: string): InvitationConfig {
    return {
        aspectRatio: 'standard',
        pages: [
            {
                id: 'page-1',
                bg_gradient: bg_gradient_default,
                elements: []
            }
        ]
    };
}

export const ASPECT_RATIOS = {
    standard: { label: 'Standard (3:4.2)', class: 'aspect-[3/4.2]' },
    square: { label: 'Square (1:1)', class: 'aspect-square' },
    landscape: { label: 'Landscape (16:9)', class: 'aspect-video' },
    mobile: { label: 'Mobile (9:16)', class: 'aspect-[9/16]' },
};
