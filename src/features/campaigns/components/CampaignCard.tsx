import { TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Campaign } from "@/services/campaign.public";

interface CampaignCardProps {
    campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value || 0);
    };

    const calculateProgress = (current: number = 0, target: number = 0) => {
        const c = Number(current);
        const t = Number(target);
        if (!t) return 0;
        return Math.min(Math.round((c / t) * 100), 100);
    };

    const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount);
    const isEnded = campaign.endDate ? new Date(campaign.endDate) < new Date() : false;

    return (
        <Link to={`/campaign/${campaign.slug || campaign.id}`} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group h-full">
            <div className="relative h-64 overflow-hidden">
                <OptimizedImage
                    src={campaign.imageUrl || "https://images.unsplash.com/photo-1576091160550-217359f488d5?q=80&w=1470&auto=format&fit=crop"}
                    alt={campaign.title}
                    className="group-hover:scale-105 transition-transform duration-700"
                    wrapperClassName="w-full h-full"
                    sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw"
                />
                <div className="absolute top-5 left-5 flex gap-2">
                    <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white">
                        {typeof campaign.category === 'string' ? campaign.category : (campaign.category as unknown as { name?: string })?.name || "Uncategorized"}
                    </span>
                    {isEnded && (
                        <span className="bg-red-500/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white">
                            Berakhir
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[50px] sm:min-h-[56px]">
                    {campaign.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                    {campaign.shortDescription}
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-50 mt-auto">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-slate-900 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                {formatCurrency(campaign.currentAmount)}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400">
                                terkumpul dari {formatCurrency(campaign.targetAmount)}
                            </p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-lg font-black text-slate-900">{progress}%</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">tercapai</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                            {campaign._count?.donations || 0} donasi
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {isEnded ? 'Berakhir' : 'Aktif'}
                        </div>
                    </div>

                    <Button className="w-full bg-[#0092B0] hover:bg-[#007A94] text-white py-6 rounded-2xl font-bold transition-all shadow-lg shadow-[#0092B0]/20">
                        Donasi Sekarang
                    </Button>
                </div>
            </div>
        </Link>
    );
}
