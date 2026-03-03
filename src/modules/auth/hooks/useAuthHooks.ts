import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser,
  refreshToken,
  type LoginRequest,
  type RegisterRequest,
} from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginRequest) => loginApi(payload),
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);
      queryClient.setQueryData(["auth", "me"], res.data);
      navigate("/");
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterRequest) => registerApi(payload),
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);
      queryClient.setQueryData(["auth", "me"], res.data);
      navigate("/");
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
}

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await getCurrentUser();
      return res.data.user;
    },
    enabled: options?.enabled ?? true,
    staleTime: Infinity,
    retry: false,
  });
}

// Used internally by axios interceptor
export async function refreshAccessToken() {
  const res = await refreshToken();
  const { user, accessToken } = res.data;
  const setAuth = useAuthStore.getState().setAuth;
  setAuth(user, accessToken);
  return accessToken;
}

