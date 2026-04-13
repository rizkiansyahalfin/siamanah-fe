import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, MoreVertical, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFundraiserCampaigns } from "@/services/campaign.public";
import { useCurrentUser } from "@/features/auth/hooks";

export function MyCampaignsPage() {
    const { data: user } = useCurrentUser();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("SEMUA");
    const [page, setPage] = useState(1);

    const { data: responseData, isLoading, isError } = useQuery({
        queryKey: ["fundraiser-campaigns", user?.id, search, status, page],
        queryFn: () => getFundraiserCampaigns(user?.id as string, {
            search,
            status: status === "SEMUA" ? undefined : status,
            page,
            limit: 6
        }),
        enabled: !!user?.id
    });

    const campaigns = responseData?.data || [];
    const meta = responseData?.meta;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Kampanye Saya</h1>
                    <p className="text-slate-500 font-medium">Kelola dan pantau performa kampanye aktif Anda.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="rounded-2xl h-12 sm:h-14 px-6 gap-2 font-bold text-slate-600 border-slate-200 hover:bg-slate-50">
                        <Filter className="h-5 w-5" /> Filter
                    </Button>
                    <Link to="/create-campaign">
                        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 sm:h-14 px-8 gap-2 font-black shadow-xl shadow-blue-100 transition-all active:scale-[0.98]">
                            <Plus className="h-5 w-5" /> Buat Kampanye Baru
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filter/Search Bar */}
            <div className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-4 sm:pb-0 no-scrollbar">
                    {[
                        { label: "Semua", value: "SEMUA" },
                        { label: "Aktif", value: "ACTIVE" },
                        { label: "Review", value: "PENDING_REVIEW" },
                        { label: "Selesai", value: "FINISHED" }
                    ].map((tab, i) => (
                        <button 
                            key={i} 
                            onClick={() => { setStatus(tab.value); setPage(1); }}
                            className={`whitespace-nowrap text-xs font-black uppercase tracking-widest relative pb-4 transition-colors ${status === tab.value ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {tab.label}
                            {status === tab.value && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></span>}
                        </button>
                    ))}
                </div>
                <div className="relative group w-full sm:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari kampanye..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="h-12 pl-11 pr-4 bg-slate-100/50 border-transparent focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 rounded-2xl text-sm font-medium outline-none transition-all w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full py-20 flex justify-center items-center">
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="col-span-full py-20 flex justify-center items-center flex-col gap-4 text-red-500">
                        <AlertCircle className="h-10 w-10" />
                        <p className="font-bold">Gagal memuat kampanye.</p>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 font-medium bg-white rounded-[32px] border border-slate-100">
                        Belum ada kampanye yang sesuai.
                    </div>
                ) : campaigns.map((campaign) => {
                    const progress = Math.min(Math.round((Number(campaign.currentAmount) / Number(campaign.targetAmount)) * 100), 100);
                    return (
                        <div key={campaign.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img src={campaign.imageUrl || "https://images.unsplash.com/photo-1542601906970-30f9a2e68099?q=80&w=1332&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={campaign.title} />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${campaign.status === "ACTIVE" ? "bg-green-500 text-white" :
                                            campaign.status === "PENDING_REVIEW" ? "bg-orange-500 text-white" :
                                                "bg-blue-600 text-white"
                                        }`}>
                                        {campaign.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow space-y-6">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                            {(typeof campaign.category === 'string' ? campaign.category : campaign.category?.name) || "Uncategorized"}
                                        </p>
                                        <button className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
                                            <MoreVertical className="h-4 w-4 text-slate-400" />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px] leading-tight">
                                        {campaign.title}
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            Terkumpul
                                        </p>
                                        <p className="text-xs font-black text-blue-600">{progress}%</p>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">
                                        {formatCurrency(Number(campaign.currentAmount))}
                                    </p>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? "bg-green-500" : "bg-blue-500"
                                            }`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between group-hover:border-blue-50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                                 {campaign._count?.donations || 0}
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                            Donatur
                                        </p>
                                    </div>
                                    <Link to={`/campaign/${campaign.id}`} className="text-slate-300 hover:text-blue-600 transition-colors">
                                        <ExternalLink className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Create New Card Placeholder */}
                <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group group-hover:border-solid">
                    <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Plus className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Buat Kampanye Baru</h3>
                        <p className="text-sm text-slate-400 font-medium">Mulai inisiatif baru dan raih dukungan komunitas Anda hari ini.</p>
                    </div>
                </div>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Menampilkan <span className="text-slate-900">{campaigns.length}</span> dari <span className="text-slate-900">{meta?.total || 0}</span> kampanye
                </p>
                {meta && meta.totalPages > 1 && (
                    <div className="flex gap-2">
                        {Array.from({ length: meta.totalPages }).map((_, i) => {
                            const p = i + 1;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${p === page ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-slate-500 border border-slate-100 hover:border-blue-200"
                                        }`}>
                                    {p}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
