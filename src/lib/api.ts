import axios, { AxiosError } from "axios";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor to handle specialized backend response structure
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        let message = "Terjadi kesalahan pada server";

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            message = error.response.data?.message || error.message;

            const status = error.response.status;
            const data = error.response.data;

            return Promise.reject(new ApiError(message, status, data));
        } else if (error.request) {
            // The request was made but no response was received
            message = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
            return Promise.reject(new ApiError(message));
        } else {
            // Something happened in setting up the request that triggered an Error
            message = error.message;
            return Promise.reject(new ApiError(message));
        }
    }
);

export default api;
