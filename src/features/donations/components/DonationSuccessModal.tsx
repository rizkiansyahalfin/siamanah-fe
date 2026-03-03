import { useEffect, useState } from "react";
import { Check, Copy, Share2, X, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DonationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        campaignTitle: string;
        campaignId: string | number;
        campaignImage: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
        createdAt: string;
        message?: string;
    };
}

export function DonationSuccessModal({ isOpen, onClose, data }: DonationSuccessModalProps) {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(data.transactionId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    "relative bg-white w-full max-w-[420px] max-h-[88vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300",
                    "sm:max-w-[480px]"
                )}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
                >
                    <X className="h-5 w-5 text-slate-400" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-6 pt-12 pb-8 flex flex-col items-center">
                        {/* Header Success Section */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-green-100 rounded-full blur-2xl opacity-60 scale-150 animate-pulse" />
                            <div className="relative h-20 w-20 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                                <div className="h-14 w-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
                                    <Check className="h-8 w-8 text-white stroke-[3px]" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">Donasi Berhasil!</h2>
                        <p className="text-center text-slate-500 text-sm leading-relaxed px-4">
                            Terima kasih, Orang Baik! Kontribusi Anda sangat berarti bagi mereka yang membutuhkan.
                        </p>

                        {/* Campaign Detail Card */}
                        <div className="w-full mt-8 bg-slate-50 rounded-[24px] p-5 border border-slate-100">
                            <div className="flex gap-4 mb-6">
                                <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={data.campaignImage || "https://images.unsplash.com/photo-1542601906970-30f9a2e68099?q=80&w=1332&auto=format&fit=crop"}
                                        alt="Campaign"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                                        Kampanye
                                    </p>
                                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                                        {data.campaignTitle}
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Jumlah Donasi</p>
                                    <p className="text-lg font-black text-slate-900">{formatCurrency(data.amount)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Metode Pembayaran</p>
                                    <div className="flex items-center gap-2 h-8 px-3 rounded-full bg-white border border-slate-100 w-fit">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <span className="text-[10px] font-black text-slate-700 uppercase">{data.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center">
                                        <div className="h-1.5 w-1.5 bg-current rounded-full" />
                                    </div>
                                    <span className="text-[10px] font-medium">Waktu Transaksi</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-600">{data.createdAt}</p>
                            </div>
                        </div>

                        {/* Transaction ID Section */}
                        <div className="w-full mt-4 bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">ID Transaksi</p>
                                <p className="text-xs font-bold text-slate-700 font-mono">{data.transactionId}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className={cn(
                                    "h-8 rounded-full text-[10px] font-black gap-2 transition-all",
                                    isCopied ? "bg-green-50 text-green-600 border-green-200" : "bg-white text-blue-600 border-blue-100 hover:bg-blue-50"
                                )}
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="h-3 w-3" />
                                        SALIN BERHASIL
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3" />
                                        SALIN
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Messages Kebaikan (Optional) */}
                        {data.message && (
                            <div className="w-full mt-4 flex">
                                <div className="w-1.5 bg-blue-500 rounded-full mr-3" />
                                <div className="flex-1 bg-blue-50/50 rounded-2xl p-5 relative overflow-hidden">
                                    <Quote className="absolute -top-2 -right-2 h-16 w-16 text-blue-500/5 rotate-12" />
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1 rounded-md bg-blue-100">
                                            <Quote className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Pesan Kebaikan</p>
                                    </div>
                                    <p className="text-sm italic text-slate-600 leading-relaxed font-medium">
                                        "{data.message}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-2xl font-bold bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    >
                        Selesai
                    </Button>
                    <Button
                        className="flex-1 h-12 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 gap-2"
                    >
                        <Share2 className="h-4 w-4" />
                        Bagikan Kebaikan
                    </Button>
                </div>
            </div>
        </div>
    );
}
