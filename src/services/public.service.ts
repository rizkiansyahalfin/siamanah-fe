import { api } from "@/lib/axios";

export interface AboutStats {
    totalCampaigns: number;
    totalDonation: number;
    totalDonors: number;
}

export interface AboutResponse {
    vision: string;
    mission: string;
    stats: AboutStats;
}

/**
 * Fetch public about information and stats
 */
export const getAboutInfo = async (): Promise<AboutResponse> => {
    try {
        const response = await api.get("/api/v1/public/about");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching about info:", error);
        // Fallback static data if API fails
        return {
            vision: "Menjadi platform fundraising paling transparan dan berdampak di Indonesia.",
            mission: "Memberdayakan komunitas melalui teknologi filantropi yang aman dan transparan.",
            stats: {
                totalCampaigns: 0,
                totalDonation: 0,
                totalDonors: 0
            }
        };
    }
};
