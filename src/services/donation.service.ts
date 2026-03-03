import { api } from "@/lib/axios";
import { 
    MOCK_PAYMENT_METHODS, 
    createMockDonationResponse, 
    type PaymentMethod, 
    type DonationSubmission, 
    type DonationResponse 
} from "./mock.donations";

/**
 * Fetch available payment methods
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    try {
        const response = await api.get("/api/v1/donations/payment-methods");
        return response.data.data;
    } catch (error) {
        if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
            console.warn("API Error (payment methods), falling back to mock data:", error);
            return MOCK_PAYMENT_METHODS;
        }
        throw error;
    }
};

/**
 * Submit a new donation
 */
export const createDonation = async (data: DonationSubmission): Promise<DonationResponse> => {
    try {
        const response = await api.post("/api/v1/donations", data);
        return response.data;
    } catch (error) {
        if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
            console.warn("API Error (create donation), falling back to mock data:", error);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            return createMockDonationResponse(data);
        }
        throw error;
    }
};
