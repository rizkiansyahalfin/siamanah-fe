import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Users, Heart, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCampaignStats } from "@/services/campaign.public";
import { useCurrentUser } from "@/features/auth/hooks";
import { Link } from "react-router-dom";

export function DashboardOverviewPage() {
    const { data: user } = useCurrentUser();
    const { data: statsData, isLoading } = useQuery({
        queryKey: ["campaign-stats"],
        queryFn: getCampaignStats
    });

    const formatCurrency = (value: number) => {
        if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `Rp ${(value / 1e3).toFixed(1)}K`;
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    const stats = [
        { label: "Active Campaigns", value: statsData?.campaigns.active || 0, icon: LayoutDashboard, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Donations", value: formatCurrency(statsData?.donations.totalAmount || 0), icon: Heart, color: "text-red-600", bg: "bg-red-50" },
        { label: "Total Backers", value: statsData?.donations.totalDonors || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    ];
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-sm sm:text-base text-slate-500">Welcome back, {user?.fullName || "User"}!</p>
                </div>
                <Link to="/create-campaign">
                    <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-full gap-2">
                        <Plus className="h-4 w-4" /> Create New Campaign
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-64 flex items-center justify-center">
                <p className="text-slate-400 font-medium">Analytics chart placeholder</p>
            </div>
        </div>
    );
}
