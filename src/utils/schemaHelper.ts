import type { Campaign } from "@/services/campaign.public";

/**
 * Get current window origin or fallback
 */
export const getBaseUrl = (): string => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return "";
};

/**
 * Convert relative path/url to absolute URL
 */
export const toAbsUrl = (baseUrl: string, pathOrUrl?: string): string => {
    if (!pathOrUrl) return "";
    if (pathOrUrl.startsWith("http")) return pathOrUrl;

    const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${baseUrl}${cleanPath}`;
};

/**
 * Generate BreadcrumbList Schema
 */
export const getBreadcrumbSchema = (baseUrl: string, items: { name: string; url: string }[]) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": toAbsUrl(baseUrl, item.url)
        }))
    };
};

/**
 * Generate Campaign (CreativeWork) Schema
 */
export const getCampaignSchema = (baseUrl: string, campaign: Campaign, pageUrl: string) => {
    const absImageUrl = campaign.imageUrl ? toAbsUrl(baseUrl, campaign.imageUrl) : "";
    const absPageUrl = toAbsUrl(baseUrl, pageUrl);

    // Filter out undefined properties
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${absPageUrl}#webpage`,
        "url": absPageUrl,
        "name": campaign.title,
        "description": campaign.shortDescription || "",
        "about": {
            "@type": "CreativeWork",
            "name": campaign.title,
            "description": campaign.shortDescription,
            "genre": campaign.category,
            "author": {
                "@type": "Person",
                "name": campaign.fundraiser?.fullName || "Fundraising Platform"
            },
            "provider": {
                "@type": "Organization",
                "name": "Fundraising Platform",
                "logo": toAbsUrl(baseUrl, "/vite.svg")
            }
        }
    };

    if (absImageUrl) {
        (schema.about as Record<string, unknown>).image = absImageUrl;
    }

    return schema;
};

/**
 * Generate WebSite Schema
 */
export const getWebsiteSchema = (baseUrl: string) => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": baseUrl,
        "name": "Platform Donasi",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/explore?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
};

/**
 * Convert object to JSON-LD string
 */
export const toJsonLdString = (obj: unknown): string => {
    return JSON.stringify(obj, null, 0);
};
