import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicCampaigns, type Campaign,  } from "@/services/campaign.public";

interface SimilarCampaignsProps {
  currentCampaignId: string;
  category?: string;
}

export function SimilarCampaigns({ currentCampaignId, category }: SimilarCampaignsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["similar-campaigns", category],
    queryFn: () =>
      getPublicCampaigns({ category, status: "ACTIVE", limit: 4 }),
    enabled: true,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const calculateProgress = (current: number = 0, target: number = 0) => {
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Filter out current campaign
  const similar = (data?.data || []).filter(
    (c: Campaign) => c.id !== currentCampaignId
  ).slice(0, 3);

  if (isLoading) {
    return (
      <div className="pt-12 border-t">
        <h3 className="text-2xl font-bold mb-6">Campaign Serupa</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[24px] bg-slate-100 animate-pulse h-72"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!similar.length) return null;

  return (
    <div className="pt-12 border-t space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">Campaign Serupa</h3>
        <Link to="/explore">
          <Button
            variant="ghost"
            className="text-green-600 font-bold hover:text-green-700 hover:bg-green-50 gap-1"
          >
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {similar.map((campaign: Campaign) => {
          const progress = calculateProgress(
            Number(campaign.currentAmount),
            Number(campaign.targetAmount)
          );

          return (
            <Link
              key={campaign.id}
              to={`/campaign/${campaign.slug || campaign.id}`}
              className="group block bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={
                    campaign.imageUrl ||
                    "https://images.unsplash.com/photo-1542601906970-30f9a2e68099?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white">
                    {(campaign.category as unknown as { name?: string })?.name || (campaign.category as unknown as string) || "Kategori"}
                </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Indonesia
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                  {campaign.title}
                </h4>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span className="text-green-600 font-bold">
                      {formatCurrency(Number(campaign.currentAmount))}
                    </span>
                    <span>{progress}%</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}