import { z } from "zod";

/**
 * Login form schema with Zod validation
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email harus diisi")
        .email("Format email tidak valid"),
    password: z.string().min(1, "Password harus diisi"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form schema with Zod validation
 */
export const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(1, "Nama harus diisi")
            .min(3, "Nama minimal 3 karakter"),
        email: z
            .string()
            .min(1, "Email harus diisi")
            .email("Format email tidak valid"),
        phone: z
            .string()
            .min(1, "Nomor HP harus diisi")
            .refine(
                (phone) => {
                    const cleaned = phone.replace(/[\s-]/g, "");
                    if (cleaned.startsWith("+62")) {
                        const number = cleaned.slice(3);
                        return /^8\d{8,11}$/.test(number);
                    }
                    if (cleaned.startsWith("08")) {
                        return /^08\d{8,11}$/.test(cleaned);
                    }
                    return false;
                },
                {
                    message:
                        "Format nomor HP tidak valid (contoh: 08123456789 atau +628123456789)",
                },
            ),
        birthDate: z.string().min(1, "Tanggal lahir harus diisi"),
        password: z
            .string()
            .min(1, "Password harus diisi")
            .min(8, "Password minimal 8 karakter"),
        confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak sama",
        path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email harus diisi")
        .email("Format email tidak valid"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password form schema
 */
export const resetPasswordSchema = z
    .object({
        otpCode: z
            .string()
            .min(6, "Kode OTP harus 6 digit")
            .max(6, "Kode OTP harus 6 digit")
            .regex(/^\d+$/, "Kode OTP hanya boleh angka"),
        newPassword: z
            .string()
            .min(1, "Password baru harus diisi")
            .min(8, "Password minimal 8 karakter"),
        confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Password tidak sama",
        path: ["confirmPassword"],
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
