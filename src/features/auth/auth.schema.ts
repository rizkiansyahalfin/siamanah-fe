import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  phoneNumber: z.string().min(8, "Nomor tidak valid"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});



export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;