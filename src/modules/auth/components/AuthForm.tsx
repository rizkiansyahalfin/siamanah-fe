import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/features/auth/schemas";
import type { LoginFormData } from "@/features/auth/schemas";
import { useLogin } from "../hooks/useAuthHooks";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthCard } from "@/features/auth/components/AuthCard";

export function LoginFormPage() {
  const [apiError, setApiError] = useState<string>("");
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError("");
      await loginMutation.mutateAsync(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Login gagal. Silakan coba lagi.";
      setApiError(message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Masuk" subtitle="Masuk ke Akun Anda">
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
              className={`h-11 bg-white/85 rounded-2xl border-white/45 focus-visible:ring-blue-500 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-[10px] text-red-600 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs text-gray-700 font-semibold ml-1"
            >
              Masukkan Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`h-11 bg-white/85 rounded-2xl border-white/45 focus-visible:ring-blue-500 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-[10px] text-red-600 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right pr-1">
            <Link
              to="/forgot-password"
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Lupa Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[#0B5ED7] hover:bg-[#0a58ca] text-white font-bold rounded-2xl shadow-md transition-colors"
            disabled={isSubmitting || loginMutation.isPending}
          >
            {isSubmitting || loginMutation.isPending ? "MEMUAT..." : "MASUK"}
          </Button>

          <p className="text-center text-xs text-gray-700 mt-6 font-medium">
            Belum Punya Akun?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Buat Akun
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

