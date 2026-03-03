import { Button } from "@/components/ui/button";
import { LayoutDashboard, Megaphone, User, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DashboardSidebar() {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Megaphone, label: "My Campaigns", href: "/dashboard/campaigns" },
        { icon: User, label: "Profil", href: "/dashboard/profile" },
    ];

    return (
        <aside className="w-64 bg-white border-r hidden md:flex flex-col p-6 space-y-8 h-full">
            <div className="flex items-center gap-3 px-2">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop" className="h-10 w-10 rounded-full border-2 border-green-500" alt="Avatar" />
                <div>
                    <p className="text-sm font-bold text-slate-900">EcoForest Pro</p>
                </div>
            </div>

            <nav className="flex-grow space-y-2">
                {menuItems.map((item, i) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={i}
                            to={item.href}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive ? "bg-green-50 text-green-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm font-bold">{item.label}</span>
                            {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-8 border-t">
                <Button variant="outline" className="w-full text-slate-500 border-slate-200">Sign Out</Button>
            </div>
        </aside>
    );
}
