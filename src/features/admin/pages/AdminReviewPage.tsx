import {
    LayoutDashboard,
    Clock,
    CheckCircle,
    Users,
    TrendingUp,
    Heart,
    FileText,
    BarChart3,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCampaignStats, getPendingCampaigns, approveCampaignAPI, rejectCampaignAPI } from "@/services/campaign.public";
import type { Campaign } from "@/services/campaign.public";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminReviewPage() {
    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ["campaign-stats"],
        queryFn: getCampaignStats
    });

    const { data: pendingData, isLoading: isLoadingPending } = useQuery({
        queryKey: ["pending-campaigns"],
        queryFn: () => getPendingCampaigns()
    });

    const formatCurrency = (value: number) => {
        if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `Rp ${(value / 1e3).toFixed(1)}K`;
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    const queryClient = useQueryClient();

    const approveMutation = useMutation({
        mutationFn: approveCampaignAPI,
        onSuccess: () => {
            toast.success("Campaign berhasil disetujui!");
            queryClient.invalidateQueries({ queryKey: ["pending-campaigns"] });
            queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal menyetujui campaign");
        }
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string, reason: string }) => rejectCampaignAPI(id, reason),
        onSuccess: () => {
            toast.success("Campaign ditolak.");
            queryClient.invalidateQueries({ queryKey: ["pending-campaigns"] });
            queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Gagal menolak campaign");
        }
    });

    const handleApprove = (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menyetujui campaign ini?")) {
            approveMutation.mutate(id);
        }
    };

    const handleReject = (id: string) => {
        const reason = window.prompt("Alasan penolakan (minimal 5 karakter):");
        if (reason && reason.trim().length >= 5) {
            rejectMutation.mutate({ id, reason });
        } else if (reason !== null) {
            toast.error("Alasan penolakan minimal 5 karakter");
        }
    };

    const stats = [
        { label: "Total Campaign", value: statsData?.campaigns.total || 0, icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-50", growth: "", growthColor: "text-green-500" },
        { label: "Menunggu Review", value: pendingData?.meta.total || 0, icon: Clock, color: "text-orange-500", bg: "bg-orange-50", growth: "", growthColor: "text-green-500" },
        { label: "Campaign Aktif", value: statsData?.campaigns.active || 0, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", growth: "", growthColor: "text-green-500" },
        { label: "Total Users", value: "Realtime API", icon: Users, color: "text-purple-500", bg: "bg-purple-50", growth: "", growthColor: "text-green-500" },
        { label: "Dana Tersalur", value: formatCurrency(statsData?.donations.totalAmount || 0), icon: Heart, color: "text-blue-500", bg: "bg-blue-50", growth: "", growthColor: "text-green-500" },
        { label: "Total Donatur", value: statsData?.donations.totalDonors || 0, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50", growth: "", growthColor: "text-green-500" },
    ];

    const quickActions = [
        { title: "Review Campaign", description: "Tinjau campaign yang menunggu persetujuan", icon: FileText, color: "bg-orange-500", count: pendingData?.meta.total || 0 },
        { title: "Kelola Users", description: "Manajemen pengguna dan subscription", icon: Users, color: "bg-purple-500", count: 124 },
        { title: "Laporan", description: "Lihat laporan dan analytics", icon: BarChart3, color: "bg-blue-500" },
    ];

    const activities = [
        { title: "Campaign baru diajukan", organization: "Yayasan Pendidikan", time: "5 menit lalu", color: "bg-yellow-400" },
        { title: "Campaign disetujui", organization: "LSM Peduli Anak", time: "1 jam lalu", color: "bg-green-500" },
        { title: "User baru berlangganan", organization: "Budi Santoso (Pro Plan)", time: "2 jam lalu", color: "bg-slate-400" },
    ];

    return (
        <div className="bg-[#F8FAFC] min-h-screen">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white pt-10 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto space-y-2">
                    <h1 className="text-2xl sm:text-[32px] font-bold">Admin Dashboard</h1>
                    <p className="text-white/80 font-medium text-sm sm:text-base">Selamat datang kembali! Kelola platform dengan mudah dari sini.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-12 space-y-8 sm:space-y-12 pb-20">
                {/* Stats Grid */}
                {isLoadingStats || isLoadingPending ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-40 sm:h-48 rounded-[24px] sm:rounded-[32px]" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-soft flex flex-col justify-between group hover:shadow-card transition-all duration-300">
                                <div className="flex justify-between items-start mb-4 sm:mb-6">
                                    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stat.bg}`}>
                                        <stat.icon className={`h-5 w-5 sm:h-7 sm:w-7 ${stat.color}`} />
                                    </div>
                                    {stat.growth && (
                                        <div className={`px-3 py-1 rounded-full bg-green-50 text-[10px] font-black ${stat.growthColor}`}>
                                            {stat.growth}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-xl sm:text-[32px] font-black text-slate-900 truncate">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {quickActions.map((action, i) => (
                            <div key={i} className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-soft flex items-center gap-4 sm:gap-6 group hover:shadow-card transition-all duration-300 cursor-pointer">
                                <div className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white flex-shrink-0 ${action.color}`}>
                                    <action.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                                {action.count !== undefined && action.count > 0 && (
                                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[10px] font-black">
                                        {action.count}
                                    </div>
                                )}
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{action.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-400 font-medium line-clamp-2">{action.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900">Aktivitas Terbaru</h2>
                    <div className="bg-white rounded-[28px] sm:rounded-[40px] border border-slate-100 shadow-soft p-6 sm:p-10 overflow-hidden">
                        <div className="space-y-8 sm:space-y-10 relative">
                            {/* Connection line */}
                            <div className="absolute left-[3px] top-2 bottom-2 w-0.5 bg-slate-50"></div>

                            {activities.map((activity, i) => (
                                <div key={i} className="relative pl-8 sm:pl-10 flex flex-col gap-1 group">
                                    <div className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ring-4 ring-white z-10 ${activity.color}`}></div>
                                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{activity.title}</h4>
                                    <p className="text-xs font-medium text-slate-500">{activity.organization}</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.time}</p>
                                    {i < activities.length - 1 && <div className="h-px bg-slate-50 w-full mt-4 sm:mt-6"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Review Campaigns Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900">Review Campaign (Pending)</h2>
                    {isLoadingPending ? (
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            {[1, 2].map((i) => (
                                <Skeleton key={i} className="h-48 rounded-[24px] sm:rounded-[32px]" />
                            ))}
                        </div>
                    ) : pendingData?.data && pendingData.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            {pendingData.data.map((campaign: Campaign) => (
                                <div key={campaign.id} className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-soft flex flex-col md:flex-row gap-4 sm:gap-6 hover:shadow-card transition-all duration-300">
                                    <div className="w-full md:w-48 h-40 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                                        {campaign.imageUrl ? (
                                            <img src={campaign.imageUrl.startsWith("http") ? campaign.imageUrl : `${import.meta.env.VITE_API_URL || ""}/${campaign.imageUrl}`} alt={campaign.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div className="min-w-0">
                                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{campaign.title}</h3>
                                                <p className="text-sm font-medium text-slate-500">{campaign.fundraiser?.fullName}</p>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold w-fit flex-shrink-0">
                                                Menunggu Review
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2">{campaign.description || campaign.shortDescription}</p>
                                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> Target: {formatCurrency(campaign.targetAmount)}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> End Date: {new Date(campaign.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-row md:flex-col gap-3 justify-center md:border-l border-slate-100 md:pl-6 pt-3 md:pt-0 border-t md:border-t-0">
                                        <button 
                                            onClick={() => handleApprove(campaign.id)}
                                            disabled={approveMutation.isPending || rejectMutation.isPending}
                                            className="px-5 sm:px-6 py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 active:scale-95 transition-all w-full flex items-center justify-center gap-2 min-h-[44px] text-sm">
                                            <CheckCircle className="w-4 h-4" />
                                            {approveMutation.isPending ? "Menyetujui..." : "Approve"}
                                        </button>
                                        <button 
                                            onClick={() => handleReject(campaign.id)}
                                            disabled={approveMutation.isPending || rejectMutation.isPending}
                                            className="px-5 sm:px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 active:scale-95 transition-all w-full flex items-center justify-center gap-2 min-h-[44px] text-sm">
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-soft flex flex-col items-center justify-center text-center">
                            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Semua Aman!</h3>
                            <p className="text-slate-500">Tidak ada campaign yang sedang menunggu persetujuan saai ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
