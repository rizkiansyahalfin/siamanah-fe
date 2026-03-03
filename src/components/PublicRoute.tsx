import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/auth.store";

type PublicRouteProps = {
    children: React.ReactNode;
};

/**
 * Component for public routes (login, register)
 * Redirects to home if user is already authenticated
 */
export function PublicRoute({ children }: PublicRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get("redirectTo");
        return <Navigate to={redirectTo || "/"} replace />;
    }

    return <>{children}</>;
}
