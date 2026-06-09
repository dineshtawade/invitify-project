export interface Block {
    id: string;
    type: string;
    title?: string;
    subtitle?: string;
    content?: string;
    bg_color?: string;
    cta_text?: string;
    cta_link?: string;
    align?: string;
    images?: string[];
    video_url?: string;
    links?: { label: string; url: string; icon: string }[];
    features?: { title: string; desc: string; icon: string }[];
    items?: any[];
    form_type?: string;

    // --- Advanced Features ---
    font_family?: string;
    grid_columns?: string; // e.g. "1", "2", "3", "4"
    media_width?: string; // Percentage or exact px
    media_height?: string; // Percentage or exact px
    object_fit?: 'cover' | 'contain' | 'fill';
    autoplay?: boolean; // For sliders/videos
    show_arrows?: boolean; // For sliders
}

export const getNewBlockDefaults = (type: string, isInvitation = false): Block => {
    const newBlock: Block = {
        id: `block_${type}_${Math.random().toString(36).substr(2, 9)}`,
        type
    };

    if (type === 'hero') {
        newBlock.title = 'Welcome Message';
        newBlock.subtitle = 'Introduce your brand or event.';
        newBlock.bg_color = 'from-amber-100 via-orange-50 to-amber-200';
        newBlock.cta_text = 'Learn More';
        newBlock.cta_link = '#';
    } else if (type === 'text') {
        newBlock.title = 'Section Heading';
        newBlock.content = 'Write your description here.';
        newBlock.align = 'center';
        newBlock.bg_color = 'bg-white';
    } else if (type === 'swiper') {
        newBlock.title = 'Photo Slideshow';
        newBlock.images = [
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
        ];
    } else if (type === 'video') {
        newBlock.title = 'Video Showcase';
        newBlock.video_url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    } else if (type === 'links') {
        newBlock.title = 'Important Links';
        newBlock.links = [
            { label: 'Google Maps Location', url: 'https://maps.google.com', icon: 'map-pin' },
        ];
    } else if (type === 'icons_grid') {
        newBlock.title = 'Key Features';
        newBlock.features = [
            { icon: 'sparkles', title: 'Premium Design', desc: 'Crafted with rich visuals.' },
            { icon: 'globe', title: 'Global Hosting', desc: 'Fast, secure networks.' }
        ];
    } else if (type === 'form') {
        newBlock.title = isInvitation ? 'RSVP Response' : 'Contact Us';
        newBlock.form_type = isInvitation ? 'rsvp' : 'contact';
    } else if (type === 'faq') {
        newBlock.title = 'Frequently Asked Questions';
        newBlock.items = [
            { question: 'What services do you offer?', answer: 'We offer a variety of professional services tailored to your needs.' },
            { question: 'How can I get started?', answer: 'Simply reach out through our contact page and we will guide you through the process.' },
        ];
    } else if (type === 'testimonials') {
        newBlock.title = 'What Our Clients Say';
        newBlock.items = [
            { name: 'John Doe', role: 'CEO, TechCorp', quote: 'Excellent service and outstanding results!', rating: 5 },
            { name: 'Jane Smith', role: 'Founder, DesignCo', quote: 'Professional team that delivers on every promise.', rating: 5 },
        ];
    }

    return newBlock;
};
