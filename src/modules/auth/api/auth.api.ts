import { api } from "@/lib/axios";

export type UserRole = "ADMIN" | "FUNDRAISER" | "DONOR";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  role?: UserRole;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
  };
};

export type MeResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
};

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", payload, {
    withCredentials: true,
  });
  return data;
}

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", {
    ...payload,
    role: payload.role ?? "DONOR",
  });
  return data;
}

export async function getCurrentUser(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>("/api/auth/me");
  return data;
}

export async function logout(): Promise<void> {
  await api.post(
    "/api/auth/logout",
    {},
    {
      withCredentials: true,
    },
  );
}

export async function refreshToken(): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/api/auth/refresh",
    {},
    { withCredentials: true },
  );
  return data;
}

