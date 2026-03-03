import { Bell, Menu, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface TopbarProps {
    onOpenSidebar: () => void;
}

export function DashboardTopbar({ onOpenSidebar }: TopbarProps) {
    const location = useLocation();

    // Breadcrumb logic based on pathname
    const getBreadcrumbs = () => {
        const paths = location.pathname.split("/").filter(p => p !== "");
        const breadcrumbs = [
            { label: "Beranda", href: "/" }
        ];

        if (paths.includes("dashboard")) {
            breadcrumbs.push({ label: "Dashboard", href: "/dashboard" });

            if (paths.includes("campaigns")) {
                breadcrumbs.push({ label: "Kampanye Saya", href: "/dashboard/campaigns" });
            } else if (paths.includes("profile")) {
                breadcrumbs.push({ label: "Profil", href: "/dashboard/profile" });
            } else if (paths.includes("reports")) {
                breadcrumbs.push({ label: "Laporan", href: "/dashboard/reports" });
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="sticky top-20 z-20 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-10">
            {/* Left: Mobile Toggle + Breadcrumb */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenSidebar}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-900 lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="hidden sm:flex flex-col">
                    <div className="flex items-center gap-2">
                        {breadcrumbs.map((bc, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Link
                                    to={bc.href || "#"}
                                    className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${i === breadcrumbs.length - 1 ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {bc.label}
                                </Link>
                                {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Actions + User */}
            <div className="flex items-center gap-3 sm:gap-6">
                <Link to="/create-campaign" className="hidden md:block">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 px-6 gap-2 font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
                        <Plus className="h-5 w-5" /> Buat Kampanye
                    </Button>
                </Link>

                <div className="flex items-center gap-4 border-l border-slate-100 pl-4 sm:pl-6 ml-1 sm:ml-0">
                    <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Informasi Pengguna</p>
                            <p className="text-sm font-black text-slate-900">nama</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop"
                                className="h-11 w-11 rounded-2xl border-2 border-white shadow-md group-hover:shadow-lg transition-all"
                                alt="User Avatar"
                            />
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
