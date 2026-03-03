import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useRegister } from "../hooks";
import { registerSchema, type RegisterFormData } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";

import { useNavigate, useSearchParams } from "react-router-dom";

export function RegisterPage() {
    const [apiError, setApiError] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const registerMutation = useRegister();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });


    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/v1/auth/google`;
    };

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setApiError("");
            // Remove confirmPassword before sending to API
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...registerData } = data;
            const res = await registerMutation.mutateAsync(registerData);
            
            // Navigate to OTP verification page after registration
            navigate("/verify-otp", {
                state: {
                    userId: res.userId,
                    email: res.email,
                    redirectTo: redirectTo,
                },
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Registrasi gagal. Silakan coba lagi.";
            setApiError(message);
        }
    };

    return (
        <AuthLayout>
            <AuthCard title="Daftar" subtitle="Daftar Akun Baru">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
                    {apiError && (
                        <div className="rounded-lg bg-red-50/80 backdrop-blur-sm border border-red-200 p-3">
                            <p className="text-xs text-red-800">{apiError}</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <Label
                            htmlFor="name"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Masukkan Nama Lengkap
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nama"
                            {...register("fullName")}
                            className={`h-11 bg-white/85 rounded-2xl border-white/45 focus-visible:ring-blue-500 ${errors.fullName ? "border-red-500" : ""
                                }`}
                        />
                        {errors.fullName && (
                            <p className="text-[10px] text-red-600 ml-1">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="email"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Masukkan Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            {...register("email")}
                            className={`h-11 bg-white/85 rounded-2xl border-white/45 focus-visible:ring-blue-500 ${errors.email ? "border-red-500" : ""
                                }`}
                        />
                        {errors.email && (
                            <p className="text-[10px] text-red-600 ml-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="phone"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Nomor HP
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Nomor HP"
                            {...register("phone")}
                            className={`h-11 bg-white/85 rounded-2xl border-white/45 focus-visible:ring-blue-500 ${errors.phone ? "border-red-500" : ""
                                }`}
                        />
                        {errors.phone && (
                            <p className="text-[10px] text-red-600 ml-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="birthDate"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Tanggal Lahir
                        </Label>
                        <Input
                            id="birthDate"
                            type="date"
                            {...register("birthDate")}
                            className={`h-11 bg-white/85 rounded-2xl border-white/45 focus-visible:ring-blue-500 ${errors.birthDate ? "border-red-500" : ""
                                }`}
                        />
                        {errors.birthDate && (
                            <p className="text-[10px] text-red-600 ml-1">
                                {errors.birthDate.message}
                            </p>
                        )}
                    </div>


                    <div className="space-y-1">
                        <Label
                            htmlFor="password"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Masukkan Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password")}
                                className={`h-11 bg-white/85 rounded-2xl border-white/45 pr-12 focus-visible:ring-blue-500 ${errors.password ? "border-red-500" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[10px] text-red-600 ml-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Konfirmasi Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Konfirmasi Password"
                                {...register("confirmPassword")}
                                className={`h-11 bg-white/85 rounded-2xl border-white/45 pr-12 focus-visible:ring-blue-500 ${errors.confirmPassword ? "border-red-500" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-[10px] text-red-600 ml-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-[#0B5ED7] hover:bg-[#0a58ca] text-white font-bold rounded-2xl shadow-md transition-colors mt-4"
                        disabled={isSubmitting || registerMutation.isPending}
                    >
                        {isSubmitting || registerMutation.isPending ? "MEMUAT..." : "DAFTAR"}
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold">
                            <span className="bg-transparent px-2 text-gray-700">atau</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleLogin}
                        className="w-full h-11 bg-white/85 hover:bg-white border-white/45 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors text-gray-700"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Daftar dengan Google
                    </Button>

                    <p className="text-center text-xs text-gray-700 mt-4 font-medium">
                        Sudah Punya Akun?{" "}
                        <Link
                            to={`/login${window.location.search}`}
                            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Ke Halaman Login
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </AuthLayout>
    );
}

