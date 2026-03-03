import { api } from "@/lib/axios";

// =============================
// TYPES
// =============================

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  ktpNumber?: string;
  bankAccountNumber?: string;
};

export type FundraiserVerificationRequest = {
  phone: string;
  email: string;
  ktpNumber: string;
  bankAccountNumber: string;
};

export type LoginOtpRequiredResponse = {
  requiresOtp: true;
  userId: string;
};

export type LoginSuccessResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type LoginResponse =
  | LoginOtpRequiredResponse
  | LoginSuccessResponse;

export type RegisterResponse = {
  success: boolean;
  message: string;
  userId: string;
  email: string;
};

export type VerifyOtpRequest = {
  userId: string;
  otpCode: string;
};

export type VerifyOtpResponse = {
  verified: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
};

export type RefreshTokenResponse = {
  accessToken: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  email: string;
  otpCode: string;
  newPassword: string;
};

// =============================
// API Response Wrapper (BE format)
// =============================

type ApiWrapper<T> = {
  success: boolean;
  message: string;
  data: T;
};

// =============================
// LOGIN
// =============================

export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const { findMockUser, generateMockLoginResponse } = await import("./mock.auth");
  
  try {
    const { data: res } = await api.post<ApiWrapper<LoginResponse>>(
      "/api/v1/auth/login",
      credentials,
    );

    const data = res.data;

    // If direct login (without OTP), save tokens
    if ("accessToken" in data) {
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
    }

    return data;
  } catch (error) {
    // Only use mock if enabled
    if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
      const mockUser = findMockUser(credentials.email, credentials.password);
      if (mockUser) {
        const mockResponse = generateMockLoginResponse(mockUser) as LoginSuccessResponse;
        localStorage.setItem("access_token", mockResponse.accessToken);
        localStorage.setItem("refresh_token", mockResponse.refreshToken);
        localStorage.setItem("mock_user_email", mockUser.email);
        return mockResponse;
      }
    }
    throw error;
  }
}

// =============================
// VERIFY OTP
// =============================

export async function verifyOtp(
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  const { data: res } = await api.post<ApiWrapper<VerifyOtpResponse>>(
    "/api/v1/auth/verify-otp",
    payload,
  );

  const data = res.data;

  // If OTP success returns tokens, save them
  if (data.accessToken && data.refreshToken) {
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
  }

  return data;
}

// =============================
// RESEND OTP
// =============================

export async function resendOtp(userId: string): Promise<void> {
  await api.post("/api/v1/auth/resend-otp", {
    userId,
  });
}

// =============================
// REGISTER
// =============================

export async function register(
  userData: RegisterRequest,
): Promise<RegisterResponse> {
  const { data: res } = await api.post<ApiWrapper<{ userId: string; email: string }>>(
    "/api/v1/auth/register",
    userData,
  );

  return {
    success: res.success,
    message: res.message,
    userId: res.data.userId,
    email: res.data.email,
  };
}

// =============================
// REFRESH TOKEN
// =============================

export async function refreshTokenApi(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  const { data: res } = await api.post<ApiWrapper<RefreshTokenResponse>>(
    "/api/v1/auth/refresh-token",
    { refreshToken },
  );

  const data = res.data;
  localStorage.setItem("access_token", data.accessToken);

  return data;
}

// =============================
// FORGOT PASSWORD
// =============================

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<{ success: boolean; message: string }> {
  const { data: res } = await api.post<ApiWrapper<{ success: boolean; message: string }>>(
    "/api/v1/auth/forgot-password",
    payload,
  );

  return res.data;
}

// =============================
// RESET PASSWORD
// =============================

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<{ success: boolean; message: string }> {
  const { data: res } = await api.post<ApiWrapper<{ success: boolean; message: string }>>(
    "/api/v1/auth/reset-password",
    payload,
  );

  return res.data;
}

// =============================
// LOGOUT
// =============================

export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("mock_user_email");
}

/**
 * Logout from backend (optional)
 */
export async function logoutApi(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");
  await api.post("/api/v1/auth/logout", { refreshToken });
}

/**
 * Clear semua auth storage
 */
export function clearAuth(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("mock_user_email");
  sessionStorage.removeItem("otpUserId");
}

// =============================
// GET CURRENT USER
// =============================

export async function getCurrentUser(): Promise<User> {
  const { findMockUser, MOCK_TOKENS } = await import("./mock.auth");
  const token = localStorage.getItem("access_token");
  const mockEmail = localStorage.getItem("mock_user_email");

  try {
    const { data: res } = await api.get<ApiWrapper<User>>("/api/v1/auth/me");
    return res.data;
  } catch (error) {
    // Only use mock if enabled and we have a mock token
    if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
      if (token === MOCK_TOKENS.accessToken && mockEmail) {
        const mockUser = findMockUser(mockEmail);
        if (mockUser) return mockUser;
      }
    }
    throw error;
  }
}

// =============================
// UTILS
// =============================

export function hasAuthToken(): boolean {
  return !!localStorage.getItem("access_token");
}

// =============================
// VERIFY FUNDRAISER
// =============================

export async function verifyFundraiser(
  data: FundraiserVerificationRequest,
): Promise<User> {
  const { data: res } = await api.post<ApiWrapper<User>>(
    "/api/v1/auth/verify-fundraiser",
    data,
  );

  return res.data;
}
