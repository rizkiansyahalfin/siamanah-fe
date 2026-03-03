import type { UseFormReturn } from "react-hook-form";
import type { CreateCampaignFormData } from "../../schema";

interface FinancialStepProps {
    form: UseFormReturn<CreateCampaignFormData>;
}

export function FinancialStep({ form }: FinancialStepProps) {
    const { register, formState: { errors } } = form;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900">Target & Waktu</h1>
                <p className="text-slate-500 leading-relaxed">Tentukan berapa dana yang dibutuhkan dan berapa lama waktu penggalangannya.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Dana (Rp)</label>
                    <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">Rp</span>
                        <input
                            type="text"
                            placeholder="Contoh: 10.000.000"
                            className={`w-full pl-16 pr-6 py-4 rounded-2xl border ${errors.targetAmount ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-green-500/10 focus:border-green-500'} focus:outline-none focus:ring-4 transition-all font-bold text-slate-900`}
                            {...register("targetAmount", {
                                onChange: (e) => {
                                    // Remove any non-number chars
                                    const value = e.target.value.replace(/\D/g, "");
                                    // Format with dots
                                    const formattedValue = value ? Number(value).toLocaleString("id-ID") : "";
                                    e.target.value = formattedValue;
                                }
                            })}
                        />
                    </div>
                    {errors.targetAmount && <p className="text-xs text-red-500 font-bold">{errors.targetAmount.message as string}</p>}
                    <p className="text-xs text-slate-400 font-bold">Minimal pencairan adalah Rp 50.000</p>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Batas Waktu (End Date)</label>
                    <input
                        type="date"
                        {...register("endDate")}
                        className={`w-full px-6 py-4 rounded-2xl border ${errors.endDate ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-green-500/10 focus:border-green-500'} bg-white focus:outline-none focus:ring-4 transition-all font-bold text-slate-900`}
                    />
                    {errors.endDate && <p className="text-xs text-red-500 font-bold">{errors.endDate.message as string}</p>}
                </div>
            </div>
        </div>
    );
}
