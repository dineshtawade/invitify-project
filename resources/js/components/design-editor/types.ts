export interface Block {
    id: string;
    type: 'text' | 'image' | 'icon' | 'video' | 'button' | 'link' | 'map' | 'carousel' | 'background';
    
    // Positioning (Percentages 0-100)
    x: number;
    y: number;
    w?: number;
    h?: number;
    
    // Content
    content?: string;
    src?: string; // Image or Video URL
    url?: string; // External Link URL
    actionType?: 'url' | 'page'; // For buttons/links
    targetPageId?: string; // Internal page to navigate to
    iconName?: string;
    images?: string[]; // Multiple images for carousel
    
    // Styling
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    textShadow?: string;
    bgColor?: string;
    borderRadius?: number;
    opacity?: number;
    zIndex?: number;

    // Animations & Effects
    animationType?: 'none' | 'fade-in' | 'slide-up' | 'slide-right' | 'zoom-in' | 'bounce';
    celebrationType?: 'none' | 'confetti';
}

export interface PageConfig {
    id: string;
    name: string;
    blocks: Block[];
}

export interface WebsiteConfig {
    pages: PageConfig[];
}

export const getNewElementDefaults = (type: string): Block => {
    const base = {
        id: `el_${Math.random().toString(36).substr(2, 9)}`,
        type: type as Block['type'],
        x: 10, // Default 10% from left
        y: 10, // Default 10% from top
        zIndex: 1,
    };

    switch (type) {
        case 'text':
            return {
                ...base,
                content: 'Click to select and edit in properties',
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1f2937',
                fontFamily: "'Inter', sans-serif"
            };
        case 'image':
            return {
                ...base,
                src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
                w: 200,
                h: 200,
                borderRadius: 8
            };
        case 'icon':
            return {
                ...base,
                iconName: 'Star',
                color: '#ec4899',
                fontSize: 48 // Icon size
            };
        case 'video':
            return {
                ...base,
                src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                w: 300,
                h: 200,
                borderRadius: 12
            };
        case 'button':
            return {
                ...base,
                content: 'Click Here',
                actionType: 'url',
                url: '#',
                bgColor: '#2563eb',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 'bold',
                borderRadius: 9999, // fully rounded
                w: 150,
                h: 48
            };
        case 'link':
            return {
                ...base,
                content: 'Learn More',
                actionType: 'url',
                url: '#',
                color: '#2563eb',
                fontSize: 16,
                fontWeight: 'normal',
                textShadow: 'none'
            };
        case 'map':
            return {
                ...base,
                src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.114827184854!2d77.20239255!3d28.6138954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd3d63b08e21%3A0x889a7146a48d4c!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1683226466904!5m2!1sen!2sin',
                w: 300,
                h: 200,
                borderRadius: 12
            };
        case 'carousel':
            return {
                ...base,
                images: [
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80'
                ],
                w: 300,
                h: 200,
                borderRadius: 12
            };
        case 'background':
            return {
                ...base,
                content: 'Canvas Background',
                bgColor: 'linear-gradient(to bottom right, #ff7e5f, #feb47b)',
            };
        default:
            return { ...base, type: 'text', content: 'Unknown' };
    }
};
