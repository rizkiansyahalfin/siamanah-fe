import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resendOtp } from "../api";
import { useVerifyOtp } from "../otp/UseVerifyOtp";
import authBg from "@/assets/auth-bg.jpg";

export function VerifyOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get from state or fallback to sessionStorage
    const [userId, setUserId] = useState<string | null>(location.state?.userId || sessionStorage.getItem("otp_user_id"));
    const [email, setEmail] = useState<string | null>(location.state?.email || sessionStorage.getItem("otp_email"));
    const redirectTo = location.state?.redirectTo;

    // Save to sessionStorage when state changes
    useEffect(() => {
        if (location.state?.userId) {
            setUserId(location.state.userId);
            sessionStorage.setItem("otp_user_id", location.state.userId);
        }
        if (location.state?.email) {
            setEmail(location.state.email);
            sessionStorage.setItem("otp_email", location.state.email);
        }
    }, [location.state]);

    const verifyOtpMutation = useVerifyOtp();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [apiError, setApiError] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    /**
     * Jika user buka halaman ini tanpa userId
     * redirect ke login
     */
    useEffect(() => {
        if (!userId) {
            navigate("/login");
        }
    }, [userId, navigate]);

    /**
     * Timer countdown
     */
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    /**
     * Handle input change untuk setiap digit OTP
     */
    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    /**
     * Format timer untuk display
     */
    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    /**
     * Submit OTP
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpCode = otp.join("");

        // Validasi: semua field harus terisi
        if (otpCode.length !== 6) {
            setApiError("Kode OTP harus 6 digit");
            return;
        }

        // Validasi: hanya angka
        if (!/^\d+$/.test(otpCode)) {
            setApiError("Kode OTP hanya boleh angka");
            return;
        }

        try {
            setApiError("");
            setResendSuccess("");

            await verifyOtpMutation.mutateAsync({
                userId: userId!,
                otpCode,
            });

            /**
             * Redirect ke dashboard atau halaman yang dituju setelah sukses
             */
            navigate(redirectTo || "/");
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "OTP tidak valid. Silakan coba lagi.";
            setApiError(message);
        }
    };

    /**
     * Resend OTP
     */
    const handleResendOtp = async () => {
        if (timer > 0) return;

        try {
            setResendLoading(true);
            setResendSuccess("");
            setApiError("");

            await resendOtp(userId!);

            setResendSuccess("OTP berhasil dikirim ulang");
            setTimer(30); // Reset timer
        } catch {
            setApiError("Gagal mengirim ulang OTP");
        } finally {
            setResendLoading(false);
        }
    };

    if (!userId) {
        return null;
    }

    return (
        <div
            className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4 font-sans"
            style={{ backgroundImage: `url(${authBg})` }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-sm">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute -top-6 left-0 text-white/80 hover:text-white transition-colors"
                >
                    <ChevronLeft size={28} />
                </button>

                {/* OTP Card */}
                <div className="w-full rounded-[32px] bg-[#1A1D1E]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 text-center mt-4">
                    <h1 className="text-2xl font-bold text-white mb-2">Verifikasi Kode</h1>
                    <p className="text-xs text-white/60 mb-1">Kami mengirim kode ke</p>
                    <p className="text-sm font-bold text-white mb-8">{email || "email Anda"}</p>

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between gap-2 mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-10 h-12 bg-white/10 border border-white/5 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                                        apiError ? "border-red-500" : ""
                                    }`}
                                    placeholder="&mdash;"
                                />
                            ))}
                        </div>

                        {apiError && (
                            <p className="text-xs text-red-500 mb-6">{apiError}</p>
                        )}

                        {resendSuccess && (
                            <p className="text-xs text-green-500 mb-6">{resendSuccess}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#216BFF] hover:bg-[#1C5FE3] text-white font-bold rounded-2xl shadow-lg transition-all mb-6 text-base"
                            disabled={verifyOtpMutation.isPending}
                        >
                            {verifyOtpMutation.isPending ? "MEMVERIFIKASI..." : "Verifikasi"}
                        </Button>

                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={timer > 0 || resendLoading}
                                    className={`text-xs font-medium transition-colors ${
                                        timer > 0 || resendLoading
                                            ? "text-white/40 cursor-not-allowed"
                                            : "text-white/80 hover:text-white"
                                    }`}
                                >
                                    Kirim ulang kode{" "}
                                    {timer > 0 && (
                                        <span className="font-bold">{formatTimer(timer)}</span>
                                    )}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.removeItem("otp_user_id");
                                    sessionStorage.removeItem("otp_email");
                                    navigate("/login");
                                }}
                                className="text-xs font-medium text-white/40 hover:text-white/60 transition-colors"
                            >
                                Ganti Nomor/Email
                            </button>
                        </div>
                    </form>
                </div>

                {/* Bottom Indicator Mock */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
            </div>
        </div>
    );
}
