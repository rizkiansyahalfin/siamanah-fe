import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown, AlertCircle } from "lucide-react";

export function RecipientDashboardPage() {
    const plans = [
        {
            name: "Basic",
            price: "Rp 99.000",
            icon: Star,
            iconColor: "text-white bg-blue-500",
            limit: "2 campaign",
            features: [
                "Buat hingga 2 campaign",
                "Dashboard sederhana",
                "Email support",
                "Laporan dasar",
                "Durasi campaign 30 hari"
            ],
            buttonText: "Berlangganan Basic",
            buttonStyle: "bg-[#0092B0] hover:bg-[#007A94]"
        },
        {
            name: "Pro",
            price: "Rp 299.000",
            icon: Zap,
            iconColor: "text-white bg-purple-500",
            limit: "10 campaign",
            popular: true,
            features: [
                "Buat hingga 10 campaign",
                "Dashboard advanced",
                "Priority support",
                "Laporan lengkap & analytics",
                "Durasi campaign 60 hari",
                "Custom branding",
                "Widget embed"
            ],
            buttonText: "Berlangganan Pro",
            buttonStyle: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        },
        {
            name: "Premium",
            price: "Rp 599.000",
            icon: Crown,
            iconColor: "text-white bg-orange-500",
            limit: "Unlimited",
            features: [
                "Unlimited campaign",
                "Dashboard enterprise",
                "24/7 dedicated support",
                "Advanced analytics & insights",
                "Durasi campaign unlimited",
                "Custom branding & domain",
                "API access",
                "Dedicated account manager",
                "Marketing support"
            ],
            buttonText: "Berlangganan Premium",
            buttonStyle: "bg-blue-600 hover:bg-blue-700"
        }
    ];

    const comparisonFeatures = [
        { feature: "Jumlah Campaign", basic: "2", pro: "10", premium: "Unlimited" },
        { feature: "Durasi Campaign", basic: "30 hari", pro: "60 hari", premium: "Unlimited" },
        { feature: "Admin Review", basic: "Standard", pro: "Prioritas", premium: "Instan" },
        { feature: "Laporan Analytics", basic: "Dasar", pro: "Lengkap", premium: "Enterprise" },
        { feature: "Custom Branding", basic: "-", pro: "Ya", premium: "Ya" },
        { feature: "Dedicated Support", basic: "-", pro: "-", premium: "Ya" },
    ];

    return (
        <div className="bg-[#FDFCFD] min-h-screen pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Untuk Campaign Creator</span>
                <h1 className="text-[44px] font-bold text-slate-900">Pilih Paket Berlangganan</h1>
                <p className="text-slate-500 max-w-2xl mx-auto">Untuk membuat campaign, Anda perlu berlangganan terlebih dahulu. Pilih paket yang sesuai dengan kebutuhan Anda.</p>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-6 py-3 inline-flex items-center gap-2 text-sm font-bold text-yellow-700">
                    <AlertCircle className="h-4 w-4" />
                    Penting: Campaign hanya bisa dibuat setelah berlangganan
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {plans.map((plan, i) => (
                    <div key={i} className={`relative bg-white rounded-[40px] p-10 border transition-all duration-300 flex flex-col h-full ${plan.popular ? 'border-purple-400 shadow-xl scale-105 z-10' : 'border-slate-100 shadow-soft hover:shadow-card'}`}>
                        {plan.popular && (
                            <div className="absolute -top-4 right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-black uppercase py-1.5 px-6 rounded-full tracking-widest shadow-lg">
                                Paling Populer
                            </div>
                        )}

                        <div className="space-y-6 mb-8">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${plan.iconColor}`}>
                                <plan.icon className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                                    <span className="text-sm text-slate-400 font-medium">/bulan</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] rounded-2xl p-6 mb-8">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Batas Campaign</p>
                            <p className="text-2xl font-black text-slate-900">{plan.limit}</p>
                        </div>

                        <div className="space-y-4 mb-10 flex-grow">
                            {plan.features.map((feature, j) => (
                                <div key={j} className="flex gap-3 text-sm font-medium text-slate-600">
                                    <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                        <Check className="h-3 w-3 text-green-500" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <Button className={`w-full py-6 rounded-2xl font-bold text-white transition-all shadow-lg ${plan.buttonStyle}`}>
                            {plan.buttonText}
                        </Button>
                    </div>
                ))}
            </div>

            {/* Comparison Table */}
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-soft overflow-hidden">
                    <div className="p-10 border-b border-slate-50 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Perbandingan Fitur Detail</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-6 text-left text-sm font-bold text-slate-400">Fitur</th>
                                    <th className="px-10 py-6 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">Basic</th>
                                    <th className="px-10 py-6 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">Pro</th>
                                    <th className="px-10 py-6 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">Premium</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {comparisonFeatures.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-10 py-6 text-sm font-bold text-slate-700">{row.feature}</td>
                                        <td className="px-10 py-6 text-center text-sm font-medium text-slate-600">{row.basic}</td>
                                        <td className="px-10 py-6 text-center text-sm font-medium text-slate-600">{row.pro}</td>
                                        <td className={`px-10 py-6 text-center text-sm font-bold transition-all ${row.premium === 'Unlimited' || row.premium === 'Ya' || row.premium === 'Instan' ? 'text-green-500' : 'text-slate-600'}`}>
                                            {row.premium}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
