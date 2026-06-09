<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Super Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
            'is_approved' => true,
        ]);

        // Reseller (Approved)
        User::factory()->create([
            'name' => 'Approved Reseller',
            'email' => 'reseller_approved@example.com',
            'password' => bcrypt('password'),
            'role' => 'reseller',
            'is_approved' => true,
        ]);

        // Reseller (Pending Approval)
        User::factory()->create([
            'name' => 'Pending Reseller',
            'email' => 'reseller_pending@example.com',
            'password' => bcrypt('password'),
            'role' => 'reseller',
            'is_approved' => false,
        ]);

        // Referral Partner (Approved)
        User::factory()->create([
            'name' => 'Approved Partner',
            'email' => 'referral_approved@example.com',
            'password' => bcrypt('password'),
            'role' => 'referral_partner',
            'is_approved' => true,
        ]);

        // Referral Partner (Pending Approval)
        User::factory()->create([
            'name' => 'Pending Partner',
            'email' => 'referral_pending@example.com',
            'password' => bcrypt('password'),
            'role' => 'referral_partner',
            'is_approved' => false,
        ]);

        // Customer
        $customer = User::factory()->create([
            'name' => 'Customer',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'is_approved' => true,
        ]);

        // Seed Subscription for Customer
        \App\Models\Subscription::create([
            'user_id' => $customer->id,
            'plan_type' => 'unlimited_bundle',
            'price' => 999.00,
            'starts_at' => now(),
            'expires_at' => now()->addDays(30),
            'is_active' => true,
        ]);

        // Seed Invitation Mini Website
        $invSite = \App\Models\MiniWebsite::create([
            'user_id' => $customer->id,
            'type' => 'invitation',
            'title' => 'Aarav & Priya Wedding Ceremony',
            'slug' => 'aarav-priya-wedding',
            'theme' => 'cozy',
            'is_published' => true,
            'config' => [
                'event_name' => 'Wedding Celebration',
                'couple_name' => 'Aarav & Priya',
                'date' => 'December 18, 2026',
                'time' => '5:00 PM',
                'countdown_target' => '2026-12-18T17:00',
                'venue' => 'The Grand Ballroom, Juhu Beach Hotel, Mumbai',
                'intro' => 'With hearts filled with joy, we invite you to share our wedding celebration.',
                'rsvp_heading' => 'Please RSVP by November 30',
            ]
        ]);

        // Seed RSVPs
        \App\Models\Rsvp::create([
            'mini_website_id' => $invSite->id,
            'name' => 'Vikram Malhotra',
            'email' => 'vikram@example.com',
            'guests_count' => 2,
            'status' => 'attending',
            'message' => 'Congratulations! Looking forward to the grand day!',
        ]);

        \App\Models\Rsvp::create([
            'mini_website_id' => $invSite->id,
            'name' => 'Neha Sen',
            'email' => 'neha@example.com',
            'guests_count' => 1,
            'status' => 'attending',
            'message' => 'So happy for you guys, see you there!',
        ]);

        \App\Models\Rsvp::create([
            'mini_website_id' => $invSite->id,
            'name' => 'Sanjay Dutt',
            'email' => 'sanjay@example.com',
            'guests_count' => 0,
            'status' => 'declined',
            'message' => 'Best wishes, unfortunately I will be out of town.',
        ]);

        // Seed Business Mini Website
        $bizSite = \App\Models\MiniWebsite::create([
            'user_id' => $customer->id,
            'type' => 'business',
            'title' => 'Apex Digital Solutions',
            'slug' => 'apex-digital',
            'theme' => 'royal',
            'is_published' => true,
            'config' => [
                'home' => [
                    'hero_title' => 'Premium Digital Architecture & Development',
                    'hero_subtitle' => 'We design and engineer enterprise-grade React, Laravel, and Cloud infrastructures.',
                    'cta_text' => 'Start Your Project',
                ],
                'about' => [
                    'title' => 'About Our Agency',
                    'description' => 'Apex Digital is a full-service software development agency. We partner with founders and companies to bring premium digital products to life.',
                    'vision' => 'To accelerate business transformations through design and clean, scalable code.',
                ],
                'services' => [
                    'title' => 'Expert Services We Offer',
                    'list' => [
                        ['title' => 'Enterprise Web Applications', 'description' => 'Clean codebases built with Laravel, Node, React, and TypeScript.'],
                        ['title' => 'UI/UX Visual Design', 'description' => 'Bespoke high-end designs, brand assets, and interactive interfaces.'],
                        ['title' => 'Cloud Devops & Hosting', 'description' => 'Fast, scalable, secure deployment setups on AWS and GCP.'],
                    ]
                ],
                'contact' => [
                    'phone' => '+91 22 9876 5432',
                    'email' => 'contact@apex-digital.com',
                    'address' => 'Floor 12, Apex Towers, Bandra Kurla Complex, Mumbai',
                ]
            ]
        ]);

        // Seed Business Messages
        \App\Models\ContactSubmission::create([
            'mini_website_id' => $bizSite->id,
            'name' => 'Karan Johar',
            'email' => 'karan@dharma.com',
            'subject' => 'Web application redesign project request',
            'message' => 'Hello team, we are looking for a complete modern rebuild of our media management web applications. Let us schedule a call.',
        ]);

        // Templates
        \App\Models\Template::create([
            'name' => 'Wedding Elegance',
            'category' => 'wedding',
            'price' => 999.00,
            'bg_gradient' => 'from-stone-100 to-rose-50 text-neutral-800',
            'default_config' => [
                'title' => 'The Wedding of',
                'hosts' => 'Together with their families',
                'guest_of_honor' => 'Alexander & Sophia',
                'date' => 'September 18, 2026',
                'time' => '5:00 PM',
                'venue' => 'The Crystal Ballroom, 456 Grande Avenue, Los Angeles, CA',
                'font_style' => 'playfair',
                'layout_style' => 'card-classic',
                'image_url' => 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
                'text_color' => '#1f2937',
                'border_color' => '#fecdd3',
                'image_size' => 'medium',
                'image_position' => 'bg',
                'icon_type' => 'ring',
                'language' => 'en',
            ]
        ]);

        \App\Models\Template::create([
            'name' => 'Royal Palace Wedding',
            'category' => 'wedding',
            'price' => 1499.00,
            'bg_gradient' => 'from-amber-50 to-orange-100 text-amber-900',
            'default_config' => [
                'title' => 'शुभ विवाह',
                'hosts' => 'सपरिवार स्नेह निमंत्रण',
                'guest_of_honor' => 'Ranveer & Deepika',
                'date' => '22 नवंबर, 2026',
                'time' => 'शाम 6:00 बजे से',
                'venue' => 'राजमहल प्रांगण, जयपुर, राजस्थान',
                'font_style' => 'cinzel',
                'layout_style' => 'minimalist-arch',
                'image_url' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop',
                'text_color' => '#78350f',
                'border_color' => '#fde68a',
                'image_size' => 'large',
                'image_position' => 'top',
                'icon_type' => 'ring',
                'language' => 'hi',
            ]
        ]);

        \App\Models\Template::create([
            'name' => 'Neon Birthday Bash',
            'category' => 'birthday',
            'price' => 499.00,
            'bg_gradient' => 'from-zinc-950 to-neutral-900 text-purple-400',
            'default_config' => [
                'title' => 'BIRTHDAY PARTY',
                'hosts' => 'Join us in celebrating',
                'guest_of_honor' => "Jordan's 25th Birthday",
                'date' => 'October 31, 2026',
                'time' => '9:00 PM',
                'venue' => 'Club Retro, 12 Neon Boulevard, Seattle, WA',
                'font_style' => 'montserrat',
                'layout_style' => 'photo-bg',
                'image_url' => 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
                'text_color' => '#c084fc',
                'border_color' => '#581c87',
                'image_size' => 'cover',
                'image_position' => 'bg',
                'icon_type' => 'balloon',
                'language' => 'en',
            ]
        ]);

        \App\Models\Template::create([
            'name' => 'Kids Superhero Birthday',
            'category' => 'birthday',
            'price' => 299.00,
            'bg_gradient' => 'from-blue-100 to-red-100 text-blue-800',
            'default_config' => [
                'title' => 'KIDS BIRTHDAY',
                'hosts' => 'Calling all super-kids to',
                'guest_of_honor' => "Aarav's 5th Birthday",
                'date' => 'August 14, 2026',
                'time' => '4:00 PM',
                'venue' => 'Fun Zone Arcade, 10 Main Street, Mumbai',
                'font_style' => 'montserrat',
                'layout_style' => 'split-hero',
                'image_url' => 'https://images.unsplash.com/photo-1561525140-c2a4cc68e4bd?q=80&w=600&auto=format&fit=crop',
                'text_color' => '#1e40af',
                'border_color' => '#fecaca',
                'image_size' => 'medium',
                'image_position' => 'right',
                'icon_type' => 'cake',
                'language' => 'en',
            ]
        ]);

        \App\Models\Template::create([
            'name' => 'Summer Pool Party',
            'category' => 'party',
            'price' => 399.00,
            'bg_gradient' => 'from-cyan-100 to-teal-50 text-cyan-800',
            'default_config' => [
                'title' => 'SUMMER SPLASH',
                'hosts' => "You're invited to the annual",
                'guest_of_honor' => 'Pool & Cocktail Party',
                'date' => 'July 12, 2026',
                'time' => '2:00 PM',
                'venue' => 'The Oasis Resort Pool, 78 Sunshine Way, Miami, FL',
                'font_style' => 'vibes',
                'layout_style' => 'card-classic',
                'image_url' => 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop',
                'text_color' => '#06b6d4',
                'border_color' => '#99f6e4',
                'image_size' => 'small',
                'image_position' => 'bottom',
                'icon_type' => 'sparkle',
                'language' => 'en',
            ]
        ]);

        \App\Models\Template::create([
            'name' => 'Silver Jubilee Anniversary',
            'category' => 'anniversary',
            'price' => 799.00,
            'bg_gradient' => 'from-slate-100 to-zinc-200 text-neutral-800',
            'default_config' => [
                'title' => 'वैवाहिक वर्षगाँठ',
                'hosts' => 'सनेह मिलन एवं प्रीतिभोज',
                'guest_of_honor' => 'Ramesh & Sunita',
                'date' => '15 दिसंबर, 2026',
                'time' => 'सायं 7:00 बजे से',
                'venue' => 'भव्य एमराल्ड बैंक्वेट, रिंग रोड, दिल्ली',
                'font_style' => 'playfair',
                'layout_style' => 'minimalist-arch',
                'image_url' => 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop',
                'text_color' => '#1f2937',
                'border_color' => '#e4e4e7',
                'image_size' => 'large',
                'image_position' => 'top',
                'icon_type' => 'heart',
                'language' => 'hi',
            ]
        ]);

        \App\Models\Template::create([
            'name' => 'Sweet Baby Arrival',
            'category' => 'baby_shower',
            'price' => 499.00,
            'bg_gradient' => 'from-pink-100 to-blue-100 text-neutral-850',
            'default_config' => [
                'title' => 'BABY SHOWER',
                'hosts' => 'Help us welcome the little one',
                'guest_of_honor' => "Priya's Baby Shower",
                'date' => 'September 5, 2026',
                'time' => '3:00 PM',
                'venue' => 'The Golden Petal Cafe, Bandra West, Mumbai',
                'font_style' => 'vibes',
                'layout_style' => 'split-hero',
                'image_url' => 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop',
                'text_color' => '#27272a',
                'border_color' => '#fbcfe8',
                'image_size' => 'medium',
                'image_position' => 'left',
                'icon_type' => 'baby',
                'language' => 'en',
            ]
        ]);

        \App\Models\Template::create([
            'name' => 'Custom Draggable Elegance',
            'category' => 'wedding',
            'price' => 1299.00,
            'bg_gradient' => 'from-stone-100 to-rose-50 text-neutral-800',
            'default_config' => [
                'title' => 'The Wedding Invitation',
                'hosts' => 'Together with their families',
                'guest_of_honor' => 'Vikram & Anjali',
                'date' => 'December 25, 2026',
                'time' => '7:00 PM',
                'venue' => 'Taj Palace Hotel, Colaba, Mumbai',
                'font_style' => 'playfair',
                'layout_style' => 'drag-custom',
                'image_url' => 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
                'text_color' => '#1f2937',
                'border_color' => '#fecdd3',
                'image_size' => 'medium',
                'image_position' => 'bg',
                'icon_type' => 'ring',
                'language' => 'en',
                'positions' => [
                    'header' => ['x' => 10, 'y' => 6, 'w' => 80, 'h' => 12],
                    'hosts' => ['x' => 10, 'y' => 22, 'w' => 80, 'h' => 6],
                    'couple' => ['x' => 10, 'y' => 30, 'w' => 80, 'h' => 16],
                    'datetime' => ['x' => 10, 'y' => 50, 'w' => 80, 'h' => 10],
                    'venue' => ['x' => 10, 'y' => 64, 'w' => 80, 'h' => 12],
                    'image' => ['x' => 20, 'y' => 78, 'w' => 60, 'h' => 18],
                ]
            ]
        ]);
    }
}
