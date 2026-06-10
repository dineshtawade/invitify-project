import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/theinvitify-removebg-preview.png"
            alt="Invitify Logo"
            {...props}
        />
    );
}