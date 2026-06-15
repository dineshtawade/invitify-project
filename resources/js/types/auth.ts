export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_approved: boolean;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    reseller_details?: {
        business_name: string;
        mobile_number: string;
        email: string;
        gst_number: string;
        business_address?: string;
    } | null;
    referral_details?: {
        city: string;
        email: string;
        phone_number: string;
        social_media?: Array<{
            platform: string;
            username: string;
            followers: number;
        }>;
    } | null;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
