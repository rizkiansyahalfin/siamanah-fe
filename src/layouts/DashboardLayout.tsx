import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardTopbar } from "./components/DashboardTopbar";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Toaster richColors position="top-right" />
            <Navbar />
            <div className="flex-grow relative">
                {/* Desktop Sidebar */}
            <DashboardSidebar variant="desktop" />

            {/* Mobile Sidebar (Drawer) */}
            <DashboardSidebar
                variant="mobile"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="lg:pl-[280px] flex flex-col min-h-screen">
                <DashboardTopbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-grow px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Footer Section in Dashboard */}
                <footer className="px-4 sm:px-6 lg:px-10 py-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <p>© 2024 Platform CrowdFund. Hak Cipta Dilindungi.</p>
                    <div className="flex gap-4">
                        <span>Butuh bantuan?</span>
                        <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">Hubungi Dukungan</a>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    );
}
