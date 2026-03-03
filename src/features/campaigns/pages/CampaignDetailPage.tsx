import { Button } from "@/components/ui/button";
import {
  Share2,
  Flag,
  MapPin,
  CheckCircle2,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getPublicCampaignDetail } from "@/services/campaign.public";
import { StickyDonateButton } from "../components/StickyDonateButton";
import { ArchiveOverlay } from "../components/ArchiveOverlay";
import { SimilarCampaigns } from "../components/SimilarCampaigns";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import {
  getBaseUrl,
  getBreadcrumbSchema,
  getCampaignSchema,
  toAbsUrl
} from "@/utils/schemaHelper";
import { Skeleton } from "@/components/ui/skeleton";

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: campaign,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["campaign-detail", id],
    queryFn: () => getPublicCampaignDetail(id!),
    enabled: !!id,
  });

  // ── Meta tags for SEO (including archived campaigns) ──────────────────────
  useEffect(() => {
    if (!campaign) return;

    const isArchived =
      (campaign as { status?: string }).status === "ARCHIVED" ||
      (campaign as { status?: string }).status === "COMPLETED";

    document.title = isArchived
      ? `[Selesai] ${campaign.title} | Platform Donasi`
      : `${campaign.title} | Platform Donasi`;

    // og:title
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
    const campaignSlugOrId = campaign.slug || campaign.id;
    const campaignUrl = `${baseUrl}/campaign/${campaignSlugOrId}`;
    const absImageUrl = campaign.imageUrl ? toAbsUrl(baseUrl, campaign.imageUrl) : "";

    setMeta("og:title", campaign.title);
    setMeta(
      "og:description",
      campaign.shortDescription || "Lihat campaign penggalangan dana ini."
    );
    if (absImageUrl) {
      setMeta("og:image", absImageUrl);
    } else {
      setMeta("og:image", "");
    }
    setMeta("og:url", campaignUrl);
    setMeta("og:type", "website");

    if (isArchived) {
      setMeta("robots", "noindex, follow");
    }

    return () => {
      document.title = "Platform Donasi";
    };
  }, [campaign]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const calculateProgress = (current: number = 0, target: number = 0) => {
    const c = Number(current);
    const t = Number(target);
    if (!t) return 0;
    return Math.min(Math.round((c / t) * 100), 100);
  };

  const scrollToDonationSection = () => {
    const mobileEl = document.getElementById("donation-section-mobile");
    const desktopEl = document.getElementById("donation-section-desktop");
    // Use mobile card if it exists and is visible (not hidden by CSS)
    const el = (mobileEl && mobileEl.offsetParent !== null) ? mobileEl : desktopEl;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link campaign berhasil disalin!"))
        .catch(() => { });
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen pt-10 pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white rounded-[24px] sm:rounded-[40px] p-5 sm:p-8 lg:p-12 shadow-soft border border-slate-100 relative">
            {/* Image Skeleton */}
            <div className="w-full lg:w-[45%] space-y-4">
              <Skeleton className="w-full h-[300px] lg:h-[500px] rounded-[32px]" />
            </div>
            
            {/* Content Skeleton */}
            <div className="w-full lg:w-[55%] flex flex-col justify-between">
              <div className="space-y-6">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-full h-12 rounded-2xl" />
                <Skeleton className="w-full h-12 rounded-2xl" />
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="w-48 h-5 rounded-md" />
                    <Skeleton className="w-32 h-4 rounded-md" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mt-8">
                <div className="flex justify-between items-end">
                  <Skeleton className="w-48 h-10 rounded-md" />
                  <Skeleton className="w-24 h-10 rounded-md" />
                </div>
                <Skeleton className="w-full h-3 rounded-full" />
                <Skeleton className="w-full h-16 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError || !campaign) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-32">
        <div className="bg-red-50 rounded-[24px] sm:rounded-[40px] p-8 sm:p-16 text-center space-y-6 border border-red-100 max-w-2xl mx-auto shadow-xl shadow-red-100/50">
          <AlertCircle className="h-12 w-12 sm:h-20 sm:w-20 text-red-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl sm:text-3xl font-bold text-red-900">
              Campaign Tidak Ditemukan
            </h3>
            <p className="text-red-700 text-lg">
              {(error as Error)?.message ||
                "Kami tidak dapat menemukan campaign yang Anda cari atau terjadi kesalahan pada server."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => refetch()}
              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-12 py-6 h-auto font-bold shadow-lg shadow-red-200"
            >
              Coba Lagi
            </Button>
            <Link to="/explore">
              <Button
                variant="outline"
                className="rounded-2xl px-12 py-6 h-auto font-bold border-red-200 text-red-700 hover:bg-red-100"
              >
                Jelajahi Campaign Lain
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derived state
  const isArchived =
    (campaign as { status?: string }).status === "ARCHIVED" ||
    (campaign as { status?: string }).status === "COMPLETED";

  const progress = calculateProgress(
    Number(campaign.currentAmount),
    Number(campaign.targetAmount)
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  const baseUrl = getBaseUrl();
  const campaignSlugOrId = campaign.slug || campaign.id;
  const campaignUrl = `${baseUrl}/campaign/${campaignSlugOrId}`;

  const breadcrumbItems = [
    { name: "Beranda", url: "/" },
    { name: "Explore", url: "/explore" },
    { name: campaign.title, url: `/campaign/${campaignSlugOrId}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(baseUrl, breadcrumbItems);
  const campaignSchema = getCampaignSchema(baseUrl, campaign, campaignUrl);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(campaignSchema) }}
      />

      {/* Archive Banner + Final Stats (only when archived) */}
      {isArchived && (
        <ArchiveOverlay campaign={campaign} onShare={handleShare} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100 uppercase tracking-wider">
                {(campaign.category as unknown as { name?: string })?.name || (campaign.category as unknown as string) || "Kategori"}
              </span>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Campaign Terverifikasi
              </span>
              {isArchived && (
                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 uppercase tracking-wider">
                  ✓ Selesai
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              {campaign.title}
            </h1>

            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                {campaign.fundraiser?.avatarUrl ? (
                  <img
                    src={campaign.fundraiser.avatarUrl}
                    className="h-8 w-8 rounded-full border border-slate-100"
                    alt={campaign.fundraiser.fullName}
                    loading="lazy"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                    {campaign.fundraiser?.fullName?.charAt(0) || "F"}
                  </div>
                )}
                <span className="font-medium text-slate-900">
                  Oleh {campaign.fundraiser?.fullName || "Fundraiser"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Indonesia
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="relative rounded-[32px] overflow-hidden aspect-video shadow-2xl">
            <OptimizedImage
              src={
                campaign.imageUrl ||
                "https://images.unsplash.com/photo-1542601906970-30f9a2e68099?q=80&w=1332&auto=format&fit=crop"
              }
              alt={campaign.title}
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
              sizes="(min-width: 1024px) 66vw, 100vw"
            />
            {/* Grayscale overlay for archived campaigns */}
            {isArchived && (
              <div className="absolute inset-0 bg-slate-900/10 backdrop-grayscale-[20%]" />
            )}
          </div>

          {/* ── MOBILE DONATION SUMMARY (visible on mobile only) ───────── */}
          <div 
            id="donation-section-mobile"
            className="lg:hidden bg-white rounded-[24px] p-5 border border-slate-100 shadow-xl space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatCurrency(campaign.currentAmount)}
                </span>
                <span className="text-sm font-bold text-slate-900">{progress}%</span>
              </div>
              <p className="text-slate-400 text-xs font-medium">
                terkumpul dari target {formatCurrency(campaign.targetAmount)}
              </p>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {!isArchived && (
              <Link
                to={`/donation/checkout/${campaign.id}`}
                className="block w-full"
              >
                <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-base font-bold shadow-lg shadow-green-200 transition-all active:scale-[0.98]">
                  Donasi Sekarang
                </Button>
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b flex gap-8">
            {[
              { label: "Cerita", id: "story" },
              {
                label: `Update (${campaign.updates?.length || 0})`,
                id: "updates",
              },
              { label: "Donatur", id: "donors" },
            ].map((tab, i) => (
              <button
                key={tab.id}
                className={`pb-4 text-sm font-bold transition-colors relative ${i === 0
                  ? "text-green-600"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab.label}
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-green-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Story Content */}
          <div className="prose prose-slate max-w-none">
            <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
              {campaign.shortDescription}
            </div>

            <div className="bg-green-50 rounded-3xl p-8 border border-green-100 my-8">
              <h4 className="flex items-center gap-2 text-green-700 font-bold mb-4">
                <CheckCircle2 className="h-5 w-5" /> Keamanan Donasi
              </h4>
              <p className="text-green-800/80">
                Setiap donasi Anda dijamin keamanannya dan akan disalurkan
                sepenuhnya kepada penerima manfaat melalui sistem transparansi
                kami.
              </p>
            </div>
          </div>

          {/* Latest Updates */}
          {campaign.updates && campaign.updates.length > 0 && (
            <div className="space-y-8 pt-12 border-t">
              <h3 className="text-2xl font-bold">Update Terbaru</h3>
              <div className="space-y-12">
                {campaign.updates.map((update) => (
                  <div
                    key={update.id}
                    className="relative pl-8 border-l-2 border-slate-100"
                  >
                    <div className="absolute top-0 -left-[11px] h-5 w-5 rounded-full bg-green-500 border-4 border-white" />
                    <p className="text-xs font-bold text-green-600 uppercase mb-2">
                      {new Date(update.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h4 className="text-lg font-bold mb-4">{update.title}</h4>
                    <p className="text-slate-600 mb-6 whitespace-pre-line">
                      {update.content}
                    </p>
                    {update.imageUrl && (
                      <OptimizedImage
                        src={update.imageUrl}
                        alt={update.title}
                        wrapperClassName="w-full h-64 rounded-2xl"
                        className="w-full h-full object-cover rounded-2xl"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <SimilarCampaigns
            currentCampaignId={campaign.id}
            category={
              (campaign.category as unknown as { id?: string })?.id ||
              (campaign.category as unknown as { name?: string })?.name ||
              (campaign.category as unknown as string)
            }
          />
        </div>

        {/* ── SIDEBAR (desktop only) ─────────────────────────────────── */}
        <div className="hidden lg:block space-y-8">
          <div
            id="donation-section-desktop"
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl sticky top-24"
          >
            <div className="space-y-6">
              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    {formatCurrency(campaign.currentAmount)}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  terkumpul dari target {formatCurrency(campaign.targetAmount)}
                </p>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <p className="text-slate-900">{progress}%</p>
                  <p className="text-slate-400">
                    {campaign._count?.donations || 0} donasi
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {isArchived ? (
                  /* Archived: no donate button, only share */
                  <div className="space-y-3">
                    <div className="w-full h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-sm">
                      Campaign Telah Selesai
                    </div>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full h-14 rounded-2xl gap-2 font-bold text-slate-600 border-slate-200"
                    >
                      <Share2 className="h-5 w-5" /> Bagikan Campaign
                    </Button>
                  </div>
                ) : (
                  /* Active: normal donate + share */
                  <>
                    <Link
                      to={`/donation/checkout/${campaign.id}`}
                      className="block w-full"
                    >
                      <Button className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-green-200 transition-all active:scale-[0.98]">
                        Donasi Sekarang
                      </Button>
                    </Link>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full h-14 rounded-2xl gap-2 font-bold text-slate-600 border-slate-200"
                    >
                      <Share2 className="h-5 w-5" /> Bagikan
                    </Button>
                  </>
                )}
              </div>

              {/* Social icons */}
              <div className="flex justify-center gap-6 pt-4">
                <Facebook className="h-6 w-6 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-slate-300 hover:text-sky-500 cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-slate-300 hover:text-pink-600 cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t space-y-4">
              <div className="flex gap-3 items-center text-slate-500 text-xs font-medium">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-slate-900 font-bold">Proteksi Donasi</p>
                  <p>
                    Kami menjamin donasi Anda akan sampai ke pihak penerima.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Report card */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 text-center space-y-4">
            <Flag className="h-6 w-6 text-slate-300 mx-auto" />
            <p className="text-xs font-medium text-slate-400">
              Campaign id: {campaign.slug || campaign.id}
            </p>
            <p className="text-xs font-bold text-slate-500 hover:text-red-500 cursor-pointer underline underline-offset-4">
              Laporkan campaign ini
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA - mobile only (hidden on >=768px, not shown for archived) */}
      {!isArchived && (
        <StickyDonateButton
          collected={Number(campaign.currentAmount) || 0}
          target={Number(campaign.targetAmount) || 0}
          onClick={scrollToDonationSection}
        />
      )}
    </div>
  );
}

// ── Icon helpers ─────────────────────────────────────────────────────────────

function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Twitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}