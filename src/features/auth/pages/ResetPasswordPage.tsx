import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useResetPassword } from "../hooks";
import { resetPasswordSchema, type ResetPasswordFormData } from "../schemas";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";

export function ResetPasswordPage() {
    const [apiError, setApiError] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email as string | undefined;
    const resetPasswordMutation = useResetPassword();

    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!email) return;

        try {
            setApiError("");
            await resetPasswordMutation.mutateAsync({
                email,
                otpCode: data.otpCode,
                newPassword: data.newPassword,
            });
            // Navigation to /login is handled in the hook onSuccess
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Gagal mereset password. Silakan coba lagi.";
            setApiError(message);
        }
    };

    if (!email) return null;

    return (
        <AuthLayout>
            <AuthCard title="Reset Password" subtitle={`Kode OTP telah dikirim ke ${email}`}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
                    {apiError && (
                        <div className="rounded-lg bg-red-50/80 backdrop-blur-sm border border-red-200 p-3">
                            <p className="text-xs text-red-800">{apiError}</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="otpCode"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Kode OTP
                        </Label>
                        <Input
                            id="otpCode"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Masukkan 6 digit kode OTP"
                            {...register("otpCode")}
                            className={`h-11 bg-white/85 rounded-2xl border-white/45 focus-visible:ring-blue-500 text-center text-lg tracking-widest font-bold ${errors.otpCode ? "border-red-500" : ""
                                }`}
                        />
                        {errors.otpCode && (
                            <p className="text-[10px] text-red-600 ml-1">
                                {errors.otpCode.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="newPassword"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Password Baru
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password baru"
                                {...register("newPassword")}
                                className={`h-11 bg-white/85 rounded-2xl border-white/45 pr-12 focus-visible:ring-blue-500 ${errors.newPassword ? "border-red-500" : ""
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
                        {errors.newPassword && (
                            <p className="text-[10px] text-red-600 ml-1">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-xs text-gray-700 font-semibold ml-1"
                        >
                            Konfirmasi Password Baru
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Konfirmasi password baru"
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
                        disabled={resetPasswordMutation.isPending}
                    >
                        {resetPasswordMutation.isPending ? "MEMPROSES..." : "RESET PASSWORD"}
                    </Button>

                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="w-full text-center text-xs text-gray-600 hover:text-gray-800 font-medium mt-2 transition-colors"
                    >
                        Kirim ulang kode OTP
                    </button>
                </form>
            </AuthCard>
        </AuthLayout>
    );
}
