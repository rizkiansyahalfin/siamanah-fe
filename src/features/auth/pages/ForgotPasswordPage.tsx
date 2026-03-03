import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForgotPassword } from "../hooks";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";

export function ForgotPasswordPage() {
    const [apiError, setApiError] = useState<string>("");
    const navigate = useNavigate();
    const forgotPasswordMutation = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setApiError("");
            await forgotPasswordMutation.mutateAsync({ email: data.email });
            // Navigate to reset password page with email
            navigate("/reset-password", {
                state: { email: getValues("email") },
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Gagal mengirim email reset password. Silakan coba lagi.";
            setApiError(message);
        }
    };

    return (
        <AuthLayout>
            <AuthCard title="Lupa Password" subtitle="Reset Password Kamu Melalui Email">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    {apiError && (
                        <div className="rounded-lg bg-red-50/80 backdrop-blur-sm border border-red-200 p-3">
                            <p className="text-xs text-red-800">{apiError}</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
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

                    <Button
                        type="submit"
                        className="w-full h-10 bg-[#0B5ED7] hover:bg-[#0a58ca] text-white font-bold rounded-2xl shadow-md transition-colors mt-2"
                        disabled={forgotPasswordMutation.isPending}
                    >
                        {forgotPasswordMutation.isPending ? "MENGIRIM..." : "KIRIM KODE OTP"}
                    </Button>

                    <div className="pt-2">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-xs font-medium hover:underline group transition-all"
                        >
                            <span className="text-gray-700">Sudah Punya Akun?</span>
                            <span className="text-blue-600 font-bold">Ke Halaman Login</span>
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </AuthLayout>
    );
}
