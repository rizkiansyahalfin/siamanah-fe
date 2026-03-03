import { createContext, useContext, useEffect, useState } from "react";
import { hasAuthToken, type User } from "../api";
import { useCurrentUser } from "../hooks";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [hasToken, setHasToken] = useState(hasAuthToken());

    // Check token on mount and when storage changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasToken(hasAuthToken());
    }, []);

    const {
        data: userData,
        isLoading,
        isError,
    } = useCurrentUser({
        enabled: hasToken,
    });

    // Derive user synchronously when rendering to avoid cascading setState
    const derivedUser = (hasToken && !isError && userData) ? userData : null;

    const value: AuthContextType = {
        user: derivedUser,
        isAuthenticated: !!derivedUser && hasToken,
        isLoading: hasToken ? isLoading : false,
        setUser: () => {}, // Cannot be used to set user globally anymore if derived, will be kept for compat with clearAuth
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
