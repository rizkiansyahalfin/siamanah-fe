import { z } from "zod";

/**
 * Schema untuk validasi input OTP
 */
export const otpSchema = z.object({

  otpCode: z
    .string()
    .min(6, "Kode OTP harus 6 digit")
    .max(6, "Kode OTP harus 6 digit")
    .regex(/^\d+$/, "Kode OTP hanya boleh angka"),

});

export type OtpFormData = z.infer<typeof otpSchema>;
