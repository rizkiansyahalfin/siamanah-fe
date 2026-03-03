import { api } from "@/lib/axios";

export interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get("/api/v1/categories");
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
};
