import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

export function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Toaster richColors position="top-right" />
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
