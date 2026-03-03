import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, User } from "lucide-react";

interface GuestDonationFormProps {
    formData: {
        name: string;
        email: string;
        phone: string;
    };
    onChange: (field: string, value: string) => void;
}

export function GuestDonationForm({ formData, onChange }: GuestDonationFormProps) {
    return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Informasi Tamu</h3>
            <p className="text-xs text-slate-500 italic">Lengkapi data diri untuk melanjutkan sebagai tamu.</p>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="guestName" className="text-sm font-semibold text-slate-700">Nama Lengkap *</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            id="guestName"
                            type="text"
                            required
                            placeholder="Masukkan nama lengkap"
                            value={formData.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="guestEmail" className="text-sm font-semibold text-slate-700">Alamat Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="guestEmail"
                                type="email"
                                required
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={(e) => onChange("email", e.target.value)}
                                className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="guestPhone" className="text-sm font-semibold text-slate-700">No. Handphone *</Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="guestPhone"
                                type="tel"
                                required
                                placeholder="08123456789"
                                value={formData.phone}
                                onChange={(e) => onChange("phone", e.target.value)}
                                className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
