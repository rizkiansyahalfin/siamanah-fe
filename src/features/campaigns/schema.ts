import { z } from "zod";

export const CreateCampaignSchema = z.object({
  title: z.string().min(10, "Judul minimal 10 karakter").max(100, "Judul maksimal 100 karakter"),
  categoryId: z.string().min(1, "Kategori harus dipilih"),
  targetAmount: z.preprocess((val) => {
    if (typeof val === 'string') return val.replace(/\./g, '');
    return val;
  }, z.coerce.number().min(50000, "Target dana minimal Rp 50.000")),
  endDate: z.string().min(1, "Batas waktu harus diisi").refine((val) => {
    return new Date(val).getTime() > Date.now();
  }, "Batas waktu harus di masa depan"),
  shortDescription: z.string().min(20, "Deskripsi singkat minimal 20 karakter").max(200, "Maksimal 200 karakter"),
  description: z.string().min(50, "Cerita campaign minimal 50 karakter"),
  image: z.any().refine((files) => files?.length === 1, "Gambar utama harus diunggah"),
  videoUrl: z.string().url("Format URL video tidak valid").optional().or(z.literal('')),
});

export type CreateCampaignFormData = z.infer<typeof CreateCampaignSchema>;
