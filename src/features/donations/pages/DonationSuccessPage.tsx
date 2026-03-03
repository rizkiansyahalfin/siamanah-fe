import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export function DonationSuccessPage() {
    const [searchParams] = useSearchParams();
    const isGuest = searchParams.get("guest") === "true";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[32px] p-8 sm:p-10 shadow-card text-center space-y-8">
                <div className="flex justify-center">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-black text-slate-900">Donasi Berhasil!</h1>
                    <p className="text-slate-500 leading-relaxed">
                        Terima kasih atas kebaikan Anda. Semoga bantuan ini bermanfaat bagi mereka yang membutuhkan.
                    </p>
                </div>

                {isGuest && (
                    <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 text-left border border-blue-100 italic">
                        <p>
                            <strong>Catatan:</strong> Karena Anda berdonasi sebagai tamu, donasi ini tidak akan muncul di dashboard profil. Simpan bukti transfer Anda jika diperlukan.
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Button asChild className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold gap-2">
                        <Link to="/explore">
                            <Search className="h-4 w-4" /> Cari Campaign Lain
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 rounded-xl border-slate-200 font-bold gap-2 text-slate-600">
                        <Link to="/">
                            <Home className="h-4 w-4" /> Beranda
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
