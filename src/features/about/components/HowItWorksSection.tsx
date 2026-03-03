import { UserPlus, Share2, Wallet } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            icon: UserPlus,
            title: "Buat Campaign",
            description: "Daftar dan buat campaign Anda dengan cerita yang jujur dan menyentuh hati.",
            color: "blue",
            bg: "bg-blue-100",
            text: "text-blue-600"
        },
        {
            icon: Share2,
            title: "Bagikan",
            description: "Gunakan kemudahan fitur share kami untuk menjangkau lebih banyak donatur.",
            color: "green",
            bg: "bg-green-100",
            text: "text-green-600"
        },
        {
            icon: Wallet,
            title: "Terima Donasi",
            description: "Terima dukungan dari para donatur dan cairkan dana untuk kebutuhan Anda.",
            color: "amber",
            bg: "bg-amber-100",
            text: "text-amber-600"
        }
    ];

    return (
        <section className="py-16 sm:py-24 bg-slate-50 relative">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 px-4">
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight">Cara Kerja Platform</h2>
                    <p className="text-slate-500 text-lg">Hanya butuh 3 langkah mudah untuk memulai misi kebaikan Anda bersama kami.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto relative px-4">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-0 -translate-y-8"></div>
                    
                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center">
                            <div className={`${step.bg} h-24 w-24 rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-slate-200 border-4 border-white group hover:scale-110 transition-transform duration-300`}>
                                <step.icon className={`h-10 w-10 ${step.text}`} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">{step.description}</p>
                            
                            <div className="mt-6 flex items-center justify-center h-8 w-8 rounded-full bg-white border border-slate-200 text-slate-400 font-bold text-sm">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
