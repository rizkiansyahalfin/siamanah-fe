import type { UseFormReturn } from "react-hook-form";
import type { CreateCampaignFormData } from "../../schema";
import type { Category } from "@/services/category.service";

interface BasicStepProps {
    form: UseFormReturn<CreateCampaignFormData>;
    categories: Category[];
}

export function BasicStep({ form, categories }: BasicStepProps) {
    const { register, formState: { errors } } = form;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900">Informasi Dasar</h1>
                <p className="text-slate-500 leading-relaxed">Berikan judul yang menarik dan pilih kategori yang tepat untuk misi kebaikan Anda.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Judul Campaign</label>
                    <input
                        type="text"
                        {...register("title")}
                        placeholder="Cth: Bantuan Air Bersih Desa Nibelle"
                        className={`w-full px-6 py-4 rounded-2xl border ${errors.title ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-green-500/10 focus:border-green-500'} focus:outline-none focus:ring-4 transition-all font-bold text-slate-900`}
                    />
                    {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title.message as string}</p>}
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deskripsi Singkat</label>
                    <textarea
                        {...register("shortDescription")}
                        rows={3}
                        placeholder="Tuliskan 1-2 kalimat rangkuman campaign Anda..."
                        className={`w-full px-6 py-4 rounded-2xl border ${errors.shortDescription ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-green-500/10 focus:border-green-500'} focus:outline-none focus:ring-4 transition-all font-medium text-slate-600 resize-none`}
                    ></textarea>
                    {errors.shortDescription && <p className="text-xs text-red-500 font-bold">{errors.shortDescription.message as string}</p>}
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori Kebaikan</label>
                    <select
                        {...register("categoryId")}
                        className={`w-full px-6 py-4 rounded-2xl border ${errors.categoryId ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-green-500/10 focus:border-green-500'} bg-white focus:outline-none focus:ring-4 transition-all font-bold text-slate-900`}
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-xs text-red-500 font-bold">{errors.categoryId.message as string}</p>}
                </div>
            </div>
        </div>
    );
}
