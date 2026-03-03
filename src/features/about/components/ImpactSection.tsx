import { Users, TrendingUp, Heart } from "lucide-react";
import type { AboutStats } from "@/services/public.service";

interface ImpactSectionProps {
    stats?: AboutStats | null;
    isLoading: boolean;
}

export function ImpactSection({ stats, isLoading }: ImpactSectionProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value || 0);
    };

    const impactStats = [
        {
            icon: TrendingUp,
            label: "Total Campaign",
            value: stats?.totalCampaigns.toString() || "0",
            suffix: "+",
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            icon: Heart,
            label: "Total Donasi",
            value: formatCurrency(stats?.totalDonation || 0),
            suffix: "",
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            icon: Users,
            label: "Total Donor",
            value: stats?.totalDonors.toString() || "0",
            suffix: "+",
            color: "text-purple-600",
            bg: "bg-purple-100"
        }
    ];

    return (
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="bg-slate-900 rounded-[28px] sm:rounded-[50px] p-6 sm:p-12 md:p-20 relative overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-full bg-green-600/10 skew-x-12 -translate-x-1/2"></div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                        {impactStats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center text-center text-white">
                                <div className={`${stat.bg} h-16 w-16 rounded-2xl flex items-center justify-center mb-6`}>
                                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                                <p className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 tracking-tight">
                                    {isLoading ? "..." : stat.value}
                                    <span className="text-blue-400">{stat.suffix}</span>
                                </p>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 mt-12 sm:mt-20 pt-10 sm:pt-16 border-t border-white/10 text-center">
                        <p className="text-base sm:text-xl text-slate-300 italic font-medium max-w-2xl mx-auto">
                            "Setiap rupiah yang Anda berikan adalah napas bagi kehidupan lainnya."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
