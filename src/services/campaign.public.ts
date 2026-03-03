import { api } from "@/lib/axios";

export interface CampaignListParams {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    category?: string;
    status?: string;
    fundraiserId?: string;
}

export interface Campaign {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    category: {
        id: string;
        name: string;
    };
    targetAmount: number;
    currentAmount: number;
    endDate: string;
    status: string;
    imageUrl: string;
    fundraiser: {
        id: string;
        fullName: string;
        avatarUrl?: string;
    };
    _count?: {
        donations: number;
    };
    updates?: CampaignUpdate[];
}

export interface CampaignUpdate {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

export interface CampaignListResponse {
    data: Campaign[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Fetch public campaigns with filters
 */
export const getPublicCampaigns = async (params: CampaignListParams = {}): Promise<CampaignListResponse> => {
    const response = await api.get("/api/v1/campaigns", { params });
    return response.data.data;
};

/**
 * Fetch a single public campaign detail by ID or Slug
 */
export const getPublicCampaignDetail = async (identifier: string): Promise<Campaign> => {
    const response = await api.get(`/api/v1/campaigns/${identifier}`);
    return response.data.data.campaign || response.data.data;
};

/**
 * Fetch campaigns for a specific fundraiser
 */
export const getFundraiserCampaigns = async (fundraiserId: string, params: CampaignListParams = {}): Promise<CampaignListResponse> => {
    const response = await api.get("/api/v1/campaigns", { 
        params: { ...params, fundraiserId } 
    });
    return response.data.data;
};

/**
 * Fetch pending campaigns (Admin)
 */
export const getPendingCampaigns = async (params: CampaignListParams = {}): Promise<CampaignListResponse> => {
    const response = await api.get("/api/v1/campaigns", { 
        params: { ...params, status: "PENDING_REVIEW" } 
    });
    return response.data.data;
};

/**
 * Fetch campaign stats (Admin/Overview)
 */
export const getCampaignStats = async (): Promise<any> => {
    const response = await api.get("/api/v1/campaigns/stats");
    return response.data.data;
};

/**
 * Approve Campaign (Admin)
 */
export const approveCampaignAPI = async (id: string): Promise<any> => {
    const response = await api.patch(`/api/v1/campaigns/${id}/approve`);
    return response.data;
};

/**
 * Reject Campaign (Admin)
 */
export const rejectCampaignAPI = async (id: string, reason: string): Promise<any> => {
    const response = await api.patch(`/api/v1/campaigns/${id}/reject`, { reason });
    return response.data;
};
