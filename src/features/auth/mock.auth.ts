import type { User, LoginResponse } from "./api";

export const MOCK_USERS: Record<string, { user: User; password: string }> = {
  "donor@siamanah.id": {
    user: {
      id: "mock-donor-1",
      fullName: "Donatur Baik",
      email: "donor@siamanah.id",
      phone: "08123456789",
      role: "DONOR",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    },
    password: "password123",
  },
  "fundraiser@siamanah.id": {
    user: {
      id: "mock-fundraiser-1",
      fullName: "Santri IT Ambasador",
      email: "fundraiser@siamanah.id",
      phone: "08987654321",
      role: "FUNDRAISER",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    },
    password: "password123",
  },
  "admin@siamanah.id": {
    user: {
      id: "mock-admin-1",
      fullName: "Admin SIAmanah",
      email: "admin@siamanah.id",
      phone: "08000000000",
      role: "ADMIN",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=100",
    },
    password: "password123",
  },
};

export const MOCK_TOKENS = {
  accessToken: "mock-access-token-jwt-secret",
  refreshToken: "mock-refresh-token-jwt-secret",
};

export function findMockUser(email: string, password?: string): User | null {
  const account = MOCK_USERS[email];
  if (!account) return null;
  if (password && account.password !== password) return null;
  return account.user;
}

export function generateMockLoginResponse(user: User): LoginResponse {
  return {
    accessToken: MOCK_TOKENS.accessToken,
    refreshToken: MOCK_TOKENS.refreshToken,
    user,
  };
}
