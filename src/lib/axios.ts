import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
// import { refreshTokenApi, clearAuth } from "@/features/auth/api";

// Custom interface for pending requests in queue
interface PendingRequest {
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL?.endsWith("/")
        ? import.meta.env.VITE_API_URL
        : `${import.meta.env.VITE_API_URL}/`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Variables to handle token refresh concurrency
let isRefreshing = false;
let failedQueue: PendingRequest[] = [];

/**
 * Process the queue of pending requests
 * @param error - The error to reject with if refresh failed
 * @param token - The new access token to retry with if refresh succeeded
 */
const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor — attach auth token if available
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("access_token");
        if (token && token !== "null") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor — auto refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error has no config or is not a 401, reject immediately
        if (!originalRequest || !error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Extract URL path to check if it's one of the ignored endpoints
        const url = originalRequest.url || "";
        const isAuthEndpoint =
            url.includes("/api/v1/auth/login") ||
            url.includes("/api/v1/auth/register") ||
            url.includes("/api/v1/auth/refresh-token");

        // If it's a 401 from an auth endpoint or already retried, don't refresh and clear auth
        if (isAuthEndpoint || originalRequest._retry) {
            // For general 401 (not on login/register/refresh), clear auth and redirect
            if (!isAuthEndpoint && !url.includes("/api/v1/auth/me")) {
                const { clearAuth } = await import("@/features/auth/api");
                clearAuth();
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }

        // Handle concurrency: if already refreshing, wait for it to finish
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }

        // Start refreshing process
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refresh_token");

        // If no refresh token available, just logout
        if (!refreshToken) {
            isRefreshing = false;
            if (!url.includes("/api/v1/auth/me")) {
                const { clearAuth } = await import("@/features/auth/api");
                clearAuth();
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }

        try {
            const { refreshTokenApi } = await import("@/features/auth/api");
            const { accessToken } = await refreshTokenApi(refreshToken);

            isRefreshing = false;
            processQueue(null, accessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError as AxiosError, null);

            // Clear auth and redirect after failed refresh
            const { clearAuth } = await import("@/features/auth/api");
            clearAuth();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    },
);
