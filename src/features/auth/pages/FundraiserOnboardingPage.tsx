import { useState } from "react";
import { useCurrentUser, useVerifyFundraiser } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, UserCheck, CreditCard, Mail, Phone, FileText } from "lucide-react";
import { toast } from "sonner";

export default function FundraiserOnboardingPage() {
    const { data: user } = useCurrentUser();
    const verifyMutation = useVerifyFundraiser();
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    
    const [formData, setFormData] = useState({
        phone: user?.phone || "",
        email: user?.email || "",
        ktpNumber: "",
        bankAccountNumber: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!agreed) {
            toast.error("Anda harus menyetujui Syarat dan Ketentuan");
            return;
        }

        if (!formData.phone || !formData.email || !formData.ktpNumber || !formData.bankAccountNumber) {
            toast.error("Semua data wajib diisi");
            return;
        }

        verifyMutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Selamat! Akun Anda telah diverifikasi sebagai Fundraiser.");
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Terjadi kesalahan saat verifikasi.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
                        <ShieldCheck className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Menjadi Fundraiser</h1>
                    <p className="text-slate-500 mt-2 font-medium">Verifikasi akun Anda untuk mulai menggalang dana</p>
                </div>

                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    {/* Stepper */}
                    <div className="flex border-b border-slate-50">
                        <div className={`flex-1 p-4 text-center text-sm font-bold ${step === 1 ? 'text-blue-600 bg-blue-50/50' : 'text-slate-400'}`}>
                            1. Syarat & Ketentuan
                        </div>
                        <div className={`flex-1 p-4 text-center text-sm font-bold ${step === 2 ? 'text-blue-600 bg-blue-50/50' : 'text-slate-400'}`}>
                            2. Data Verifikasi
                        </div>
                    </div>

                    <div className="p-8">
                        {step === 1 ? (
                            <div className="space-y-6">
                                <div className="prose prose-slate max-h-60 overflow-y-auto p-4 bg-slate-50 rounded-xl text-sm border border-slate-100">
                                    <h3 className="font-bold">Syarat & Ketentuan Menjadi Fundraiser</h3>
                                    <p>Sebagai Fundraiser di platform kami, Anda setuju untuk:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Memberikan informasi yang jujur dan akurat dalam setiap kampanye.</li>
                                        <li>Menggunakan dana yang terkumpul sesuai dengan tujuan yang dinyatakan.</li>
                                        <li>Memberikan update berkala kepada para donatur mengenai penggunaan dana.</li>
                                        <li>Menanggung tanggung jawab penuh atas konten dan pelaksanaan kampanye.</li>
                                        <li>Mematuhi semua regulasi hukum yang berlaku di Indonesia terkait penggalangan dana masyarakat.</li>
                                    </ul>
                                </div>
                                
                                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <Checkbox 
                                        id="terms" 
                                        checked={agreed} 
                                        onCheckedChange={(checked) => setAgreed(checked as boolean)}
                                        className="mt-1 border-blue-200 data-[state=checked]:bg-blue-600"
                                    />
                                    <Label htmlFor="terms" className="text-sm font-medium text-slate-700 leading-snug cursor-pointer">
                                        Saya telah membaca dan menyetujui seluruh Syarat dan Ketentuan untuk menjadi Fundraiser.
                                    </Label>
                                </div>

                                <Button 
                                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition-all text-base"
                                    onClick={() => step === 1 && agreed ? setStep(2) : toast.error("Silakan setujui S&K terlebih dahulu")}
                                    disabled={!agreed}
                                >
                                    Lanjutkan ke Data Verifikasi
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-bold text-slate-700 flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-slate-400" /> Email Akun
                                        </Label>
                                        <Input 
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="contoh@email.com"
                                            className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-medium"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="font-bold text-slate-700 flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-slate-400" /> Nomor Handphone (WA)
                                        </Label>
                                        <Input 
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="0812xxxxxxxx"
                                            className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-medium"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ktpNumber" className="font-bold text-slate-700 flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-slate-400" /> Nomor KTP (NIK)
                                        </Label>
                                        <Input 
                                            id="ktpNumber"
                                            name="ktpNumber"
                                            value={formData.ktpNumber}
                                            onChange={handleInputChange}
                                            placeholder="16 digit NIK sesuai KTP"
                                            className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-medium"
                                            maxLength={16}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bankAccountNumber" className="font-bold text-slate-700 flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-slate-400" /> Nomor Rekening Bank
                                        </Label>
                                        <Input 
                                            id="bankAccountNumber"
                                            name="bankAccountNumber"
                                            value={formData.bankAccountNumber}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: BCA 1234567890"
                                            className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        className="flex-1 h-12 rounded-xl font-bold border-slate-200 text-slate-600"
                                        onClick={() => setStep(1)}
                                    >
                                        Kembali
                                    </Button>
                                    <Button 
                                        type="submit"
                                        className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
                                        disabled={verifyMutation.isPending}
                                    >
                                        {verifyMutation.isPending ? "Memproses..." : "Selesaikan Verifikasi"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                    <UserCheck className="h-4 w-4" />
                    <span>Data Anda aman dan terenkripsi sesuai standar keamanan</span>
                </div>
            </div>
        </div>
    );
}
