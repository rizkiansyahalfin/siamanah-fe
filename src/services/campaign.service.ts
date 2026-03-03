import { api } from "@/lib/axios";

export const createCampaign = async (formData: FormData) => {
    const response = await api.post("/api/v1/campaigns", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
