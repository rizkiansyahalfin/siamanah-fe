import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    className?: string;
}

export function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
    return (
        <div
            className={cn(
                "w-full max-w-sm rounded-[28px] bg-white/25 backdrop-blur-xl border border-white/35 shadow-xl p-6 md:p-8 text-center",
                className
            )}
        >
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-1">{title}</h1>
                {subtitle && <p className="text-sm text-gray-600 font-medium">{subtitle}</p>}
            </div>
            <div className="text-left">{children}</div>
        </div>
    );
}


