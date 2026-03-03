import { api } from "@/lib/axios";
import {
  createMockPaymentResponse,
  createMockPaymentStatusResponse,
} from "./mock.donations";

export interface CreatePaymentPayload {
  amount: number;
  campaignId: string;
  isAnonymous?: boolean;
  donorName?: string;
  donorMessage?: string;
  // Guest info (untuk donasi tanpa akun)
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  // Metode pembayaran yang dipilih (ID dari backend)
  paymentMethod: string;
  // Email yang akan dikirim ke Midtrans (bisa email user atau guest)
  email?: string;
}

export interface CreatePaymentResponse {
  data: {
    donationId: string;
    paymentId: string;
    orderId: string;
    totalPaid: number;
    snapToken: string;
  };
}

export const createPayment = async (
  payload: CreatePaymentPayload
): Promise<CreatePaymentResponse> => {
  try {
    const res = await api.post("/api/v1/payment", payload);
    return res.data;
  } catch (error) {
    if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
      console.warn("API Error (create payment), falling back to mock data:", error);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return createMockPaymentResponse(payload);
    }
    throw error;
  }
};

export interface PaymentStatusResponse {
  data: {
    orderId: string;
    paymentStatus: string;
    donationStatus: string;
    amount: string;
    totalPaid: string;
    paymentType?: string | null;
    paidAt?: string | null;
  };
}

export const getPaymentStatus = async (
  orderId: string
): Promise<PaymentStatusResponse> => {
  try {
    const res = await api.get(`/api/v1/payment/status/${orderId}`);
    return res.data;
  } catch (error) {
    if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
      console.warn("API Error (get payment status), falling back to mock data:", error);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // For mock, return PENDING status by default
      return createMockPaymentStatusResponse(orderId, "PENDING");
    }
    throw error;
  }
};

