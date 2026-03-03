import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useCurrentUser } from "@/features/auth/hooks";
import { useEffect } from "react";

type ProtectedRouteProps = {
    children: React.ReactNode;
    requireAuth?: boolean;
};

/**
 * Component to protect routes that require authentication
 * Redirects to /login if user is not authenticated and requireAuth is true
 * Also handles hydration of auth state from local storage token
 */
import type { AuthUser } from "@/modules/auth/store/auth.store";
export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((state: { isAuthenticated: boolean }) => state.isAuthenticated);
    const setAuth = useAuthStore((state: { setAuth: (user: AuthUser, token: string) => void }) => state.setAuth);
    const storeToken = useAuthStore((state: { accessToken: string | null }) => state.accessToken);

    const token = localStorage.getItem("access_token") || storeToken;
    
    // Attempt to hydrate user if token exists but not authenticated in store
    const { data: user, isLoading, isError } = useCurrentUser({ 
        enabled: !!(requireAuth && !isAuthenticated && token) 
    });

    useEffect(() => {
        // Only set auth if we have all data AND we aren't already authenticated
        // This prevents the "Maximum update depth" by ensuring we don't trigger
        // setAuth if the store already reflects the authenticated state.
        if (user && token && !isAuthenticated) {
            setAuth(user as AuthUser, token);
        }
    }, [user, token, isAuthenticated, setAuth]);

    if (requireAuth) {
        // If we have a token but aren't authenticated in store yet, wait for the query
        if (token && !isAuthenticated) {
            if (isLoading) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-slate-50">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium animate-pulse">Menyiapkan Sesi...</p>
                        </div>
                    </div>
                );
            }
            if (isError) {
                const currentPath = window.location.pathname + window.location.search;
                return <Navigate to={`/login?redirectTo=${encodeURIComponent(currentPath)}`} replace />;
            }
        }

        // Final check: No token and not authenticated
        if (!isAuthenticated && !token) {
            const currentPath = window.location.pathname + window.location.search;
            return <Navigate to={`/login?redirectTo=${encodeURIComponent(currentPath)}`} replace />;
        }
    }

    return <>{children}</>;
}
