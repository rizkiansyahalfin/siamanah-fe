import type { UseFormReturn } from "react-hook-form";
import type { CreateCampaignFormData } from "../../schema";
import type { Category } from "@/services/category.service";

interface ReviewStepProps {
    form: UseFormReturn<CreateCampaignFormData>;
    categories: Category[];
}

export function ReviewStep({ form, categories }: ReviewStepProps) {
    const { getValues } = form;
    const values = getValues();
    
    // Find category name
    const categoryName = categories.find(c => c.id === values.categoryId)?.name || "Kategori tidak diketahui";
    
    // Format amount
    const rawAmount = typeof values.targetAmount === 'string' 
        ? Number((values.targetAmount as string).replace(/\./g, '')) 
        : values.targetAmount;

    const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(rawAmount || 0);

    // Format date
    const formattedDate = values.endDate ? new Date(values.endDate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : "-";

    // Preview URL
    const imageFiles = values.image;
    const previewUrl = imageFiles && imageFiles.length > 0 ? URL.createObjectURL(imageFiles[0]) : "";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900">Tinjau Campaign Anda</h1>
                <p className="text-slate-500 leading-relaxed">Pastikan semua data di bawah ini sudah benar sebelum mengirimkan untuk direview oleh admin.</p>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="relative aspect-[21/9] bg-slate-100 overflow-hidden">
                    {previewUrl ? (
                         <img src={previewUrl} alt="Campaign Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            Tidak ada gambar dipilih
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-slate-700">
                        {categoryName}
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">{values.title || "Tanpa Judul"}</h2>
                        <p className="text-slate-600 font-medium leading-relaxed">{values.shortDescription || "-"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-6">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Dana</p>
                            <p className="text-xl font-black text-green-600">{formattedAmount}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Batas Waktu</p>
                            <p className="text-xl font-bold text-slate-700">{formattedDate}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cerita Lengkap</p>
                        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {values.description || "-"}
                        </div>
                    </div>

                    {values.videoUrl && (
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tautan Video</p>
                            <a href={values.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                {values.videoUrl}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
