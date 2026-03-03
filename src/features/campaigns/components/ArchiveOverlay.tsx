import { CheckCircle2, Share2, Calendar, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArchiveOverlayProps {
  campaign: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    updatedAt?: string;
    completedAt?: string;
    _count?: { donations?: number };
    slug?: string;
    id: string;
  };
  onShare?: () => void;
}

export function ArchiveOverlay({ campaign, onShare }: ArchiveOverlayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const completionDate = campaign.completedAt || campaign.updatedAt;
  const formattedDate = completionDate
    ? new Date(completionDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const progress = Math.min(
    Math.round(
      (Number(campaign.currentAmount) / Number(campaign.targetAmount)) * 100
    ),
    100
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        url: window.location.href,
      });
    } else if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link campaign berhasil disalin!");
    }
  };

  return (
    <>
      {/* Subtle banner at top of page */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white py-4 px-6 rounded-[24px] mb-8 shadow-lg shadow-green-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-black text-lg leading-tight">Campaign Selesai 🎉</p>
              <p className="text-white/80 text-sm">
                Berhasil diselesaikan pada {formattedDate}
              </p>
            </div>
          </div>
          <Button
            onClick={handleShare}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl gap-2 font-bold"
          >
            <Share2 className="h-4 w-4" /> Bagikan
          </Button>
        </div>
      </div>

      {/* Final Statistics Card */}
      <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-[32px] p-8 border border-green-100 shadow-xl mb-8">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" /> Statistik Akhir Campaign
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
            <p className="text-3xl font-black text-green-600">
              {formatCurrency(Number(campaign.currentAmount))}
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">Total Terkumpul</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
            <p className="text-3xl font-black text-slate-900">
              {campaign._count?.donations || 0}
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">
              <Users className="h-4 w-4 inline mr-1" />Total Donatur
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
            <p className="text-3xl font-black text-emerald-600">{progress}%</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Dari Target</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm font-bold text-slate-600">
            <span>Progress Akhir</span>
            <span>{progress}% dari {formatCurrency(Number(campaign.targetAmount))}</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-slate-500 text-sm">
          <Calendar className="h-4 w-4" />
          <span>Diselesaikan pada <strong className="text-slate-700">{formattedDate}</strong></span>
        </div>
      </div>
    </>
  );
}