export interface PaymentMethod {
    id: string;
    name: string;
    iconUrl: string;
    category: "BANK_TRANSFER" | "E_WALLET" | "QRIS";
}

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: "pm-qris",
        name: "QRIS",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg",
        category: "QRIS"
    },
    {
        id: "pm-bca",
        name: "BCA Virtual Account",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
        category: "BANK_TRANSFER"
    },
    {
        id: "pm-gopay",
        name: "GoPay",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg",
        category: "E_WALLET"
    },
    {
        id: "pm-ovo",
        name: "OVO",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg",
        category: "E_WALLET"
    }
];

export interface DonationSubmission {
    campaignId: string;
    amount: number;
    isAnonymous: boolean;
    donorName?: string;
    donorMessage?: string;
    donorEmail?: string;
    donorPhone?: string;
    // Guest donor fields for anonymous/guest flow
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    // Payment method identifier, aligned with backend
    paymentMethod: string;
}

export interface DonationResponse {
    success: boolean;
    data: {
        transactionId: string;
        amount: number;
        paymentMethod: string;
        expiryDate: string;
        paymentData: string; // e.g., QR string or Account Number
    };
}

export const createMockDonationResponse = (data: DonationSubmission): DonationResponse => {
    return {
        success: true,
        data: {
            transactionId: "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            amount: data.amount,
            paymentMethod: MOCK_PAYMENT_METHODS.find(pm => pm.id === data.paymentMethod)?.name || "QRIS",
            expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            paymentData: data.paymentMethod === "pm-qris" 
                ? "00020101021226660014ID12345678901234567890" 
                : "8801234567890123"
        }
    };
};

// =============================
// Payment Service Mocks
// =============================

export interface CreatePaymentPayload {
    amount: number;
    campaignId: string;
    isAnonymous?: boolean;
    donorName?: string;
    donorMessage?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    paymentMethod: string;
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

/**
 * Create mock payment response with fake snapToken
 */
export const createMockPaymentResponse = (payload: CreatePaymentPayload): CreatePaymentResponse => {
    const uniqueCode = Math.floor(Math.random() * 999);
    const totalPaid = payload.amount + uniqueCode;
    const orderId = `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const donationId = `don-${Math.random().toString(36).substr(2, 9)}`;
    const paymentId = `pay-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate fake snapToken (format: mock_snap_token_<random>)
    const snapToken = `mock_snap_token_${Math.random().toString(36).substr(2, 16)}`;

    return {
        data: {
            donationId,
            paymentId,
            orderId,
            totalPaid,
            snapToken,
        },
    };
};

/**
 * Create mock payment status response
 */
export const createMockPaymentStatusResponse = (
    orderId: string,
    status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" = "PENDING"
): PaymentStatusResponse => {
    // Extract amount from orderId if possible, or use default
    const mockAmount = 50000;
    const mockTotalPaid = mockAmount + 123; // unique code

    return {
        data: {
            orderId,
            paymentStatus: status,
            donationStatus: status,
            amount: mockAmount.toString(),
            totalPaid: mockTotalPaid.toString(),
            paymentType: status === "PAID" ? "qris" : null,
            paidAt: status === "PAID" ? new Date().toISOString() : null,
        },
    };
};
