import { Button } from "@/components/ui/button";
import { LayoutDashboard, Megaphone, User, FileText, LogOut, X, Rocket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface SidebarProps {
    variant: "desktop" | "mobile";
    open?: boolean;
    onClose?: () => void;
}

export function DashboardSidebar({ variant, open, onClose }: SidebarProps) {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Megaphone, label: "Kampanye Saya", href: "/dashboard/campaigns" },
        { icon: User, label: "Profil", href: "/dashboard/profile" },
        { icon: FileText, label: "Laporan", href: "/dashboard/reports" },
    ];

    // Close mobile sidebar on route change
    useEffect(() => {
        if (variant === "mobile" && open && onClose) {
            onClose();
        }
    }, [location.pathname, onClose, variant, open]);

    const SidebarContent = (
        <div className="flex flex-col h-full bg-white border-r border-slate-100">
            {/* Branding Area */}
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <Rocket className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-none">CrowdFund</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Pemasaran</p>
                    </div>
                    {variant === "mobile" && (
                        <button onClick={onClose} className="ml-auto p-2 text-slate-400 hover:text-slate-600 lg:hidden">
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow px-4 space-y-1.5">
                {menuItems.map((item, i) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={i}
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                ? "bg-blue-50 text-blue-600 shadow-sm"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <item.icon className={`h-5 w-5 transition-colors ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                            <span className={`text-sm tracking-wide ${isActive ? "font-bold" : "font-semibold"}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 pt-8 border-t border-slate-50">
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-3 px-4 py-6 rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group"
                >
                    <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-500" />
                    <span className="text-sm font-bold">Keluar</span>
                </Button>
            </div>
        </div>
    );

    if (variant === "mobile") {
        return (
            <>
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    onClick={onClose}
                />

                {/* Drawer */}
                <aside className={`fixed top-20 left-0 bottom-0 w-[280px] z-50 transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"
                    }`}>
                    {SidebarContent}
                </aside>
            </>
        );
    }

    // Desktop
    return (
        <aside className="fixed top-20 left-0 bottom-0 w-[280px] hidden lg:block z-30">
            {SidebarContent}
        </aside>
    );
}
