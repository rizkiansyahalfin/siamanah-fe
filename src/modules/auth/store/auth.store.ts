import { create } from "zustand";
import type { AuthUser } from "../api/auth.api";

export type { AuthUser };

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user: AuthUser, accessToken: string) =>
    set(() => {
      localStorage.setItem("access_token", accessToken);
      return { user, accessToken, isAuthenticated: true };
    }),
  clearAuth: () =>
    set(() => {
      localStorage.removeItem("access_token");
      return { user: null, accessToken: null, isAuthenticated: false };
    }),
}));

