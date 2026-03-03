import React from "react";
import authBg from "@/assets/Warga-Palestina.png";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div
            className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: `url(${authBg})` }}
        >
            {/* Dark Overlay with Blur */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Content Container */}
            <div className="relative z-10 w-full flex justify-center">
                {children}
            </div>
        </div>
    );
}


