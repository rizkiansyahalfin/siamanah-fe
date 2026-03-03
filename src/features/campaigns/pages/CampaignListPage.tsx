import { Button } from "@/components/ui/button";
import { Search, ChevronDown, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicCampaigns } from "@/services/campaign.public";
import { CampaignCard } from "@/features/campaigns/components/CampaignCard";
import { Skeleton } from "@/components/ui/skeleton";

import { getBaseUrl, toAbsUrl, getBreadcrumbSchema } from "@/utils/schemaHelper";
import { useLocation, useSearchParams } from "react-router-dom";

export function CampaignListPage() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const baseUrl = getBaseUrl();
    
    const breadcrumbItems = [
        { name: "Beranda", url: "/" },
        { name: "Jelajahi", url: "/explore" }
    ];
    const breadcrumbSchema = getBreadcrumbSchema(baseUrl, breadcrumbItems);

    // ── SEO Meta Tags ──────────────────────────────────────────────────────────
    useEffect(() => {
        document.title = "Jelajahi Campaign | Platform Donasi";

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
        const pageUrl = `${baseUrl}${location.pathname}`;
        const description = "Temukan berbagai campaign penggalangan dana terpercaya. Bantu mereka yang membutuhkan dan buat perubahan hari ini.";
        const absImageUrl = toAbsUrl(baseUrl, "/og-image-explore.jpg"); 

        setMeta("description", description);
        setMeta("og:title", "Jelajahi Campaign - Platform Donasi");
        setMeta("og:description", description);
        setMeta("og:url", pageUrl);
        setMeta("og:image", absImageUrl);
        setMeta("og:type", "website");

        // Inject Schema JSON-LD
        let schemaScript = document.querySelector<HTMLScriptElement>('#breadcrumb-schema-jsonld');
        if (!schemaScript) {
            schemaScript = document.createElement("script");
            schemaScript.id = "breadcrumb-schema-jsonld";
            schemaScript.type = "application/ld+json";
            document.head.appendChild(schemaScript);
        }
        schemaScript.textContent = JSON.stringify(breadcrumbSchema);

        return () => {
            if (schemaScript) schemaScript.remove();
        };
    }, [location.pathname, breadcrumbSchema]);

    const categories = ["Semua Kategori", "Kesehatan", "Pendidikan", "Sosial", "Lingkungan", "Bencana Alam"];
    const sorts = [
        { label: "Terbaru", value: "newest" },
        { label: "Paling Populer", value: "popular" },
        { label: "Segera Berakhir", value: "ending_soon" }
    ];

    const initialSearch = searchParams.get("search") || "";
    const [search, setSearch] = useState(initialSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
    const [category, setCategory] = useState("Semua Kategori");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const limit = 6;

    // Listen to query param changes (e.g. from navbar)
    useEffect(() => {
        const querySearch = searchParams.get("search") || "";
        if (querySearch !== search) {
            setSearch(querySearch);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.get("search")]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            if (search) {
                searchParams.set("search", search);
                setSearchParams(searchParams);
            } else {
                searchParams.delete("search");
                setSearchParams(searchParams);
            }
        }, 500);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // Reset to page 1 when filters change (except sort, as it's frontend only now)
    // We intentionally ignore the react-hooks/exhaustive-deps warning here 
    // because we deliberately want to reset page to 1 ONLY when search/category change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [debouncedSearch, category]);

    const { data: campaignsData, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["campaigns", { debouncedSearch, category, page }],
        queryFn: () => getPublicCampaigns({
            page,
            limit,
            search: debouncedSearch,
            category: category === "Semua Kategori" ? undefined : category,
        }),
    });

    const campaigns = useMemo(() => campaignsData?.data || [], [campaignsData]);
    const meta = campaignsData?.meta;

    // Frontend Sorting
    const sortedCampaigns = useMemo(() => {
        const items = [...campaigns];
        if (!items.length) return [];

        switch (sort) {
            case "popular":
                return items.sort((a, b) => (b._count?.donations || 0) - (a._count?.donations || 0));
            case "ending_soon":
                return items.sort((a, b) => {
                    const dateA = new Date(a.endDate).getTime();
                    const dateB = new Date(b.endDate).getTime();
                    return dateA - dateB;
                });
            case "newest":
            default:
                // Assuming backend returns newest first by default
                return items;
        }
    }, [campaigns, sort]);

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-20">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-6 sm:pb-8 text-center md:text-left">
                <h1 className="text-2xl sm:text-[32px] md:text-[40px] font-bold text-slate-900 mb-2">Jelajahi Campaign</h1>
                <p className="text-slate-500 text-sm sm:text-lg">Temukan campaign yang ingin Anda bantu dan buat perbedaan hari ini</p>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-10">
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-soft">
                    <div className="flex flex-col space-y-4 sm:space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari campaign berdasarkan judul atau deskripsi..."
                                className="w-full bg-[#F1F5F9] border-none rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-12 sm:pl-14 pr-4 sm:pr-6 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base text-slate-600 placeholder:text-slate-400"
                            />
                        </div>

                        {/* Dropdowns Row */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-4 sm:gap-6">
                            <div className="flex-grow w-full sm:w-auto sm:max-w-[280px]">
                                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 px-1">Kategori</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full appearance-none bg-[#F1F5F9] border-none rounded-xl py-3 px-4 pr-10 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-h-[44px]"
                                    >
                                        {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex-grow w-full sm:w-auto sm:max-w-[280px]">
                                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 px-1">Urutkan</label>
                                <div className="relative">
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="w-full appearance-none bg-[#F1F5F9] border-none rounded-xl py-3 px-4 pr-10 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-h-[44px]"
                                    >
                                        {sorts.map((s, i) => <option key={i} value={s.value}>{s.label}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="sm:ml-auto bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-100 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 sm:min-w-[140px]">
                                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest sm:mb-1">Ditemukan</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl sm:text-2xl font-black text-blue-600">{meta?.total || 0}</span>
                                    <span className="text-[10px] font-bold text-blue-400">campaign</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="rounded-[40px] h-[550px]" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 rounded-[24px] sm:rounded-[40px] p-8 sm:p-16 text-center space-y-6 border border-red-100 max-w-2xl mx-auto shadow-xl shadow-red-100/50">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-red-900">Gagal Memuat Data</h3>
                            <p className="text-red-700">{(error as Error)?.message || "Terjadi kesalahan saat mengambil daftar campaign."}</p>
                        </div>
                        <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-12 py-6 h-auto font-bold shadow-lg shadow-red-200">
                            Coba Lagi
                        </Button>
                    </div>
                ) : sortedCampaigns.length === 0 ? (
                    <div className="text-center py-16 sm:py-32 bg-white rounded-[24px] sm:rounded-[40px] border border-dashed border-slate-200">
                        <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Tidak Ditemukan</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Kami tidak dapat menemukan campaign yang sesuai dengan pencarian atau filter Anda.</p>
                        <Button
                            variant="link"
                            onClick={() => { setSearch(""); setCategory("Semua Kategori"); }}
                            className="text-blue-600 font-bold mt-4"
                        >
                            Reset Filter
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                            {sortedCampaigns.map((campaign) => (
                                <CampaignCard key={campaign.id} campaign={campaign} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="rounded-xl h-12 w-12 p-0 border-slate-200"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div className="flex items-center gap-2">
                                    {[...Array(meta.totalPages)].map((_, i) => {
                                        // On mobile, show max 5 page buttons to prevent overflow
                                        const totalPages = meta.totalPages;
                                        const showOnMobile = totalPages <= 5 || i === 0 || i === totalPages - 1 || Math.abs(i + 1 - page) <= 1;
                                        return (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${!showOnMobile ? 'hidden sm:inline-flex' : ''} ${page === i + 1
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-500 hover:bg-slate-100"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                                    disabled={page === meta.totalPages}
                                    className="rounded-xl h-12 w-12 p-0 border-slate-200"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
