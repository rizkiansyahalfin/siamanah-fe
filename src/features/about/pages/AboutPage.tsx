import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Rocket, Zap, ArrowRight } from "lucide-react";
import { getAboutInfo, type AboutResponse } from "@/services/public.service";
import { VisionMissionSection } from "../components/VisionMissionSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { ImpactSection } from "../components/ImpactSection";

export function AboutPage() {
    const [aboutData, setAboutData] = useState<AboutResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const data = await getAboutInfo();
                setAboutData(data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAbout();
    }, []);

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 sm:py-24 lg:py-32 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center rounded-full border bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-blue-600 mb-8 animate-fade-in">
                        <Rocket className="h-4 w-4 mr-2" />
                        Platform Filantropi Terpercaya
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
                        Menghubungkan <span className="text-blue-600">Kebaikan</span> <br />
                        dengan <span className="text-green-600">Perubahan</span>.
                    </h1>
                    <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                        SIAmanah.id adalah ekosistem fundraising modern yang mengedepankan transparansi, 
                        keamanan, dan dampak nyata bagi setiap misi sosial Anda.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/create-campaign">
                            <Button size="lg" className="w-full sm:w-auto bg-[#1A60C0] hover:bg-blue-700 text-white rounded-full px-8 sm:px-10 h-12 sm:h-14 text-base sm:text-lg font-bold shadow-xl shadow-blue-200">
                                Mulai Galang Dana
                            </Button>
                        </Link>
                        <Link to="/explore">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-slate-200 hover:border-blue-600 text-slate-600 hover:text-blue-600 rounded-full px-8 sm:px-10 h-12 sm:h-14 text-base sm:text-lg font-bold">
                                Donasi Sekarang
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-400 rounded-full blur-[120px]"></div>
                </div>
            </section>

            {/* Vision & Mission */}
            <VisionMissionSection vision={aboutData?.vision} mission={aboutData?.mission} />

            {/* How It Works */}
            <HowItWorksSection />

            {/* Impact Stats */}
            <ImpactSection stats={aboutData?.stats} isLoading={isLoading} />

            {/* CTA Section */}
            <section className="py-16 sm:py-24 bg-slate-900 overflow-hidden relative">
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-8">Siap membuat dampak hari ini?</h2>
                    <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-12">
                        Ribuan orang telah terbantu melalui platform kami. Giliran Anda untuk memulai misi kebaikan.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Shield className="h-6 w-6 text-green-400" />
                            </div>
                            <span className="font-medium">100% Aman & Terverifikasi</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Zap className="h-6 w-6 text-blue-400" />
                            </div>
                            <span className="font-medium">Pencairan Dana Cepat</span>
                        </div>
                    </div>
                    <Link to="/create-campaign" className="mt-16 inline-block">
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-12 h-14 text-lg font-black group transition-all">
                            Daftar Sekarang <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
                
                {/* Visual Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 -skew-x-12 translate-x-1/4"></div>
            </section>
        </div>
    );
}
