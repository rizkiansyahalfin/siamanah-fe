import { api } from "@/lib/axios";

export type HealthResponse = {
    status: string;
    message: string;
};

export async function getHealth(): Promise<HealthResponse> {
    const { data } = await api.get<HealthResponse>("/api/v1/health");
    return data;
}
