import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CreateCampaignFormData } from "../../schema";
import { Image as ImageIcon, Video, HelpCircle } from "lucide-react";

interface StoryStepProps {
    form: UseFormReturn<CreateCampaignFormData>;
}

export function StoryStep({ form }: StoryStepProps) {
    const { register, watch, formState: { errors } } = form;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const imageFiles = watch("image");

    // We intentionally ignore the react-hooks/exhaustive-deps warning here 
    useEffect(() => {
        if (imageFiles && imageFiles.length > 0) {
            const file = imageFiles[0];
            const url = URL.createObjectURL(file);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [imageFiles]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900">Ceritakan Kisah Anda</h1>
                <p className="text-slate-500 leading-relaxed">Berikan detail yang akan membantu donatur memahami penyebab Anda dan merasa terinspirasi untuk berkontribusi.</p>
            </div>

            <div className="space-y-8">
                {/* Story Editor Placeholder */}
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cerita Campaign</label>
                    <div className={`rounded-2xl border ${errors.description ? 'border-red-500' : 'border-slate-200'} overflow-hidden`}>
                        <div className="bg-slate-50 border-b p-3 flex gap-4 text-slate-400">
                            <span className="font-serif">B</span>
                            <span className="italic">I</span>
                            <span className="underline">U</span>
                            <span className="ml-2">¶</span>
                        </div>
                        <textarea
                            {...register("description")}
                            rows={8}
                            placeholder="Jelaskan alasan penggalangan dana dan bagaimana dana akan digunakan..."
                            className="w-full px-6 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 text-slate-600 leading-relaxed resize-none"
                        ></textarea>
                    </div>
                    {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description.message as string}</p>}
                </div>

                {/* Media Upload */}
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Gambar Cover Campaign</label>
                    
                    {!previewUrl ? (
                         <label className={`block border-2 border-dashed ${errors.image ? 'border-red-500' : 'border-slate-200 hover:border-green-300'} rounded-[32px] p-12 text-center space-y-4 transition-colors cursor-pointer group`}>
                            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-green-50 transition-colors">
                                <ImageIcon className="h-8 w-8 text-slate-300 group-hover:text-green-500 transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-900">Pilih gambar utama</p>
                                <p className="text-xs text-slate-400">Format JPEG, PNG, atau WEBP (Maks 5MB)</p>
                            </div>
                            <p className="text-xs font-black text-green-600 uppercase tracking-widest group-hover:underline">Pilih File</p>
                            <input
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                className="hidden"
                                {...register("image")}
                            />
                        </label>
                    ) : (
                        <div className="relative rounded-[32px] overflow-hidden border border-slate-200 aspect-[21/9] group">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="bg-white/90 text-slate-900 px-6 py-3 rounded-full font-bold cursor-pointer hover:bg-white transition-colors">
                                    Ganti Gambar
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        className="hidden"
                                        {...register("image")}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                    {errors.image && <p className="text-xs text-red-500 font-bold">{errors.image.message as string}</p>}
                </div>

                {/* Video Link */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Link Video <span className="text-slate-300 font-medium normal-case">(Opsional)</span></label>
                    </div>
                    <div className="relative">
                        <Video className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="url"
                            {...register("videoUrl")}
                            placeholder="https://youtube.com/watch?v=..."
                            className={`w-full pl-14 pr-6 py-4 rounded-2xl border ${errors.videoUrl ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-green-500/10 focus:border-green-500'} focus:outline-none font-medium text-slate-900 bg-slate-50/50`}
                        />
                    </div>
                    {errors.videoUrl && <p className="text-xs text-red-500 font-bold">{errors.videoUrl.message as string}</p>}
                </div>

                {/* Info Card */}
                <div className="bg-green-50 rounded-[32px] p-8 border border-green-100 flex gap-6 items-start">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-green-100">
                        <HelpCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-green-900">Apa yang terjadi selanjutnya?</p>
                        <p className="text-sm text-green-800/70 leading-relaxed">
                            Setelah Anda mengirimkan form, tim admin kami akan meninjau detail campaign Anda untuk memastikan sesuai dengan pedoman keamanan kami. Proses ini biasanya memakan waktu 12-24 jam.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
