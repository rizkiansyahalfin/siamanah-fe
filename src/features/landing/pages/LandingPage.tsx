import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, TrendingUp, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPublicCampaigns } from "@/services/campaign.public";
import { CampaignCard } from "@/features/campaigns/components/CampaignCard";
import { Skeleton } from "@/components/ui/skeleton";

import { getBaseUrl, toAbsUrl, getWebsiteSchema } from "@/utils/schemaHelper";
import { useEffect } from "react";

export function LandingPage() {
    const baseUrl = getBaseUrl();
    const websiteSchema = getWebsiteSchema(baseUrl);

    // ── SEO Meta Tags ──────────────────────────────────────────────────────────
    useEffect(() => {
        document.title = "Beranda | Platform Donasi";

        const setMeta = (property: string, content: string) => {
            let el = document.querySelector<HTMLMetaElement>(
                `meta[property='${property}'], meta[name='${property}']`
            );
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(
                    property.startsWith("og:") ? "property" : "name",
                    property
                );
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        const baseUrl = getBaseUrl();
        const pageUrl = `${baseUrl}/`;
        const description = "Platform penggalangan dana terpercaya untuk mewujudkan mimpi dan membantu sesama. Mulai campaign Anda sekarang.";
        const absImageUrl = toAbsUrl(baseUrl, "/og-image.jpg"); // Fallback or landing image

        setMeta("description", description);
        setMeta("og:title", "Platform Donasi - Bersama Kita Bisa");
        setMeta("og:description", description);
        setMeta("og:url", pageUrl);
        setMeta("og:image", absImageUrl);
        setMeta("og:type", "website");

        // Inject Schema JSON-LD
        let schemaScript = document.querySelector<HTMLScriptElement>('#website-schema-jsonld');
        if (!schemaScript) {
            schemaScript = document.createElement("script");
            schemaScript.id = "website-schema-jsonld";
            schemaScript.type = "application/ld+json";
            document.head.appendChild(schemaScript);
        }
        schemaScript.textContent = JSON.stringify(websiteSchema);

        return () => {
            // Optional: reset on unmount
            if (schemaScript) schemaScript.remove();
        };
    }, []);

    const { data: campaignsData, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["featured-campaigns"],
        queryFn: () => getPublicCampaigns({ page: 1, limit: 3 }),
    });

    const campaigns = campaignsData?.data || [];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-green-50 to-white py-16 sm:py-20 lg:py-32 overflow-hidden">
                <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
                    <div className="space-y-6 sm:space-y-8">
                        <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium text-green-600">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Start your journey today
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
                            Empowering <span className="text-green-600">Dreams</span> Through Community Support.
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-lg">
                            A transparent ecosystem for creators and donors. Launch your mission or support a cause you believe in with confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                            <Link to="/create-campaign">
                                <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-12 text-base sm:text-lg">
                                    Start a Campaign
                                </Button>
                            </Link>
                            <Link to="/explore">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50 rounded-full px-8 h-12 text-base sm:text-lg">
                                    Donate Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-50"></div>
                        <div className="rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop"
                                alt="Community Support"
                                className="w-full h-[350px] lg:h-[500px] object-cover"
                            />
                            <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-6 bg-black/60 backdrop-blur-md rounded-2xl text-white">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm font-medium opacity-80">Latest Success</p>
                                        <h3 className="text-lg sm:text-xl font-bold">Solar Energy for Schools</h3>
                                    </div>
                                    <div className="bg-green-500 text-xs font-bold px-3 py-1 rounded-full uppercase">Funded</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900 py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-2xl sm:text-4xl font-bold text-white">$42.8M</p>
                            <p className="text-[10px] sm:text-sm text-slate-400 uppercase tracking-wider">Total Raised</p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-2xl sm:text-4xl font-bold text-white">12,400+</p>
                            <p className="text-[10px] sm:text-sm text-slate-400 uppercase tracking-wider">Campaigns</p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-2xl sm:text-4xl font-bold text-white">850k+</p>
                            <p className="text-[10px] sm:text-sm text-slate-400 uppercase tracking-wider">Global Donors</p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-2xl sm:text-4xl font-bold text-white">98%</p>
                            <p className="text-[10px] sm:text-sm text-slate-400 uppercase tracking-wider">Success Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 sm:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900">A Platform Built on Trust</h2>
                        <p className="text-slate-600 text-base sm:text-lg">
                            Whether you are giving or receiving, we ensure a transparent process every step of the way.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border group hover:border-green-300 transition-colors">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-600 transition-colors">
                                <Heart className="text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">For Donors</h3>
                            <ul className="space-y-3 sm:space-y-4 text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">
                                <li className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                                    <p><b>Free Sign Up:</b> Create your profile and track your impact instantly.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                                    <p><b>Verified:</b> All campaigns are vetted for legitimacy by our team.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                                    <p><b>Direct Impact:</b> Your contributions reach causes with minimal fees.</p>
                                </li>
                            </ul>
                            <Link to="/explore">
                                <Button variant="outline" className="w-full rounded-xl">Explore Causes</Button>
                            </Link>
                        </div>

                        <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-800 group hover:border-green-500 transition-colors text-white">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 bg-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                                <TrendingUp className="text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">For Recipients</h3>
                            <ul className="space-y-3 sm:space-y-4 text-slate-300 mb-6 sm:mb-8 text-sm sm:text-base">
                                <li className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                                    <p><b>Free Sign Up:</b> Start your campaign in minutes for free.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                                    <p><b>Expert Admin Review:</b> Get your campaign verified for maximum impact.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                                    <p><b>Direct Engagement:</b> Engage with your donors through updates and messages.</p>
                                </li>
                            </ul>
                            <Link to="/create-campaign">
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Campaigns</h2>
                            <p className="text-slate-600 text-sm sm:text-base">Explore causes that need your immediate support.</p>
                        </div>
                        <Link to="/explore" className="text-green-600 font-bold flex items-center gap-1 hover:underline text-sm sm:text-base">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="rounded-[40px] h-[450px] sm:h-[550px]" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="bg-red-50 rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center space-y-6 border border-red-100 max-w-2xl mx-auto shadow-xl shadow-red-100/50">
                            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto" />
                            <h3 className="text-xl sm:text-2xl font-bold text-red-900">Gagal Memuat Campaign</h3>
                            <p className="text-red-700 text-sm sm:text-base">{(error as Error)?.message || "Terjadi kesalahan."}</p>
                            <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-8 sm:px-12 py-4 sm:py-6 h-auto font-bold shadow-lg shadow-red-200">
                                Coba Lagi
                            </Button>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-16 sm:py-20 bg-slate-50 rounded-[28px] sm:rounded-[40px] border border-dashed border-slate-200">
                            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Belum ada campaign aktif</h3>
                            <p className="text-slate-500 mt-2 text-sm sm:text-base">Jadilah orang pertama yang memulai kebaikan hari ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {campaigns.map((campaign) => (
                                <CampaignCard key={campaign.id} campaign={campaign} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}
