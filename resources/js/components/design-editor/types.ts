export interface Block {
    [key: string]: any;
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
    font_size?: string;
    font_color?: string;
    font_weight?: string;
    font_style?: string;
    padding_y?: string;
    margin_y?: string;
    is_hidden?: boolean;
    grid_columns?: string; // e.g. "1", "2", "3", "4"
    media_width?: string; // Percentage or exact px
    media_height?: string; // Percentage or exact px
    object_fit?: 'cover' | 'contain' | 'fill';
    autoplay?: boolean; // For sliders/videos
    show_arrows?: boolean; // For sliders

    // --- Specific Block Type Features ---
    event_date?: string; // Countdown target date/time
    map_embed_url?: string; // Google Map iframe src
    map_link?: string; // Clickable map URL
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
    } else if (type === 'countdown') {
        newBlock.title = 'Event Begins In';
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        newBlock.event_date = futureDate.toISOString().slice(0, 16); // e.g. "2026-06-18T12:00"
        newBlock.bg_color = 'from-neutral-900 to-neutral-800 text-white';
    } else if (type === 'map') {
        newBlock.title = 'Location Venue Map';
        newBlock.map_link = 'https://maps.google.com';
        newBlock.map_embed_url = '';
    } else if (type === 'timeline') {
        newBlock.title = 'Event Schedule';
        newBlock.items = [
            { time: '10:00 AM', title: 'Welcoming Guests', desc: 'Guests arrive and receive refreshers.' },
            { time: '11:30 AM', title: 'Main Ceremony', desc: 'The holy rituals and vows.' },
            { time: '01:00 PM', title: 'Grand Lunch Feast', desc: 'Delicious food served at the main hall.' }
        ];
    } else if (type === 'advanced_section') {
        newBlock.bg_type = 'color';
        newBlock.bg_color = '#ffffff';
        newBlock.bg_gradient = 'from-indigo-500 via-purple-500 to-pink-500';
        newBlock.bg_image = '';
        newBlock.bg_overlay_color = '#000000';
        newBlock.bg_overlay_opacity = '0.4';
        
        newBlock.section_width = 'max-w-4xl';
        newBlock.section_height = 'auto';
        newBlock.padding_top = 'py-12';
        newBlock.padding_bottom = '';
        newBlock.padding_left = 'px-6';
        newBlock.padding_right = '';
        newBlock.margin_top = 'my-4';
        newBlock.margin_bottom = '';
        newBlock.border_color = '#e5e7eb';
        newBlock.border_width = 'border-0';
        newBlock.border_style = 'solid';
        newBlock.border_radius = 'rounded-2xl';
        newBlock.box_shadow = 'shadow-md';
        
        newBlock.header_text = 'Fully Customizable Section';
        newBlock.header_tag = 'h2';
        newBlock.header_font_family = 'Outfit';
        newBlock.header_font_size = 'text-3xl';
        newBlock.header_font_weight = 'font-bold';
        newBlock.header_color = '#111827';
        newBlock.header_align = 'center';
        
        newBlock.desc_text = 'This section block provides absolute visual design controls over every element including background, typography, button, custom animation, responsive displays, and custom CSS injections. Customize it to fit your brand identity.';
        newBlock.desc_font_family = 'Inter';
        newBlock.desc_font_size = 'text-sm';
        newBlock.desc_font_weight = 'font-normal';
        newBlock.desc_color = '#4b5563';
        newBlock.desc_line_height = 'leading-relaxed';
        newBlock.desc_align = 'center';
        
        newBlock.btn_text = 'Get Started Now';
        newBlock.btn_url = '#';
        newBlock.btn_bg_color = '#2563eb';
        newBlock.btn_text_color = '#ffffff';
        newBlock.btn_hover_effect = 'scale';
        newBlock.btn_border_color = '';
        newBlock.btn_border_width = 'border-0';
        newBlock.btn_border_radius = 'rounded-full';
        newBlock.btn_font_size = 'text-xs';
        newBlock.btn_padding_x = 'px-6';
        newBlock.btn_padding_y = 'py-2.5';
        newBlock.btn_icon = 'arrow-right';
        
        newBlock.image_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
        newBlock.image_alt = 'Advanced design illustration';
        newBlock.image_size = 'medium';
        newBlock.image_radius = 'rounded-xl';
        
        newBlock.content_align = 'flex-col items-center';
        newBlock.animation_type = 'slide-up';
        
        newBlock.visibility_desktop = true;
        newBlock.visibility_tablet = true;
        newBlock.visibility_mobile = true;
        
        newBlock.custom_class = '';
        newBlock.custom_id = `sec_${Math.random().toString(36).substring(2, 9)}`;
        newBlock.custom_css = '';
        newBlock.z_index = 'z-0';
        newBlock.positioning = 'relative';
    }

    return newBlock;
};
