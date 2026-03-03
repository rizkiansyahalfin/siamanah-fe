import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    login as loginApi,
    register as registerApi,
    logoutApi,
    clearAuth,
    getCurrentUser,
    forgotPassword as forgotPasswordApi,
    resetPassword as resetPasswordApi,
    verifyFundraiser as verifyFundraiserApi,
    type LoginRequest,
    type RegisterRequest,
    type ForgotPasswordRequest,
    type ResetPasswordRequest,
    type FundraiserVerificationRequest,
    type LoginResponse,
} from "./api";
import { useAuthStore } from "@/modules/auth/store/auth.store";


export function useLogin() {
    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state: ReturnType<typeof useAuthStore.getState>) => state.setAuth);

    return useMutation({
        mutationFn: (credentials: LoginRequest): Promise<LoginResponse> => loginApi(credentials),
        onSuccess: (data) => {
            // Handle direct login success
            if ("accessToken" in data && data.user) {
                queryClient.setQueryData(["auth", "user"], data.user);
                // Sync with useAuthStore for ProtectedRoute
                setAuth(data.user as unknown as Parameters<typeof setAuth>[0], data.accessToken);
            }
        },
    });
}

/**
 * Hook for register mutation
 * After successful registration, navigates to OTP verification page
 */
export function useRegister() {

    return useMutation({
        mutationFn: (userData: RegisterRequest) => registerApi(userData),
        onSuccess: () => {
            // No automatic navigation here
        },
    });
}


/**
 * Hook for logout
 */
export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            try {
                await logoutApi();
            } catch (error) {
                // Continue even if API call fails
                console.error("Logout API error:", error);
            }
            // Clear all auth storage
            clearAuth();
            useAuthStore.getState().clearAuth();
        },
        onSuccess: () => {
            // Clear cache react query
            queryClient.removeQueries();
            // Redirect to login
            navigate("/login");
        },
    });
}


/* =========================================================
   CURRENT USER HOOK
========================================================= */
export function useCurrentUser(
  options?: { enabled?: boolean },
) {

  return useQuery({

    queryKey: ["auth", "user"],

    queryFn: getCurrentUser,

    retry: false,

    staleTime: Infinity,

    enabled:
      options?.enabled ?? true,

  });

}

/**
 * Hook for forgot password mutation
 */
export function useForgotPassword() {
    return useMutation({
        mutationFn: (payload: ForgotPasswordRequest) => forgotPasswordApi(payload),
    });
}

/**
 * Hook for reset password mutation
 */
export function useResetPassword() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: ResetPasswordRequest) => resetPasswordApi(payload),
        onSuccess: () => {
            navigate("/login");
        },
    });
}

/**
 * Hook for fundraiser verification
 */
export function useVerifyFundraiser() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: FundraiserVerificationRequest) => verifyFundraiserApi(data),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["auth", "user"], updatedUser);
            navigate("/create-campaign");
        },
    });
}
