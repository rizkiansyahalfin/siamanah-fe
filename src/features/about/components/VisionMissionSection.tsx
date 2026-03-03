import { Target, Heart } from "lucide-react";

interface VisionMissionProps {
    vision?: string;
    mission?: string;
}

export function VisionMissionSection({ vision, mission }: VisionMissionProps) {
    return (
        <section className="py-16 sm:py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-stretch">
                    {/* Vision Card */}
                    <div className="group bg-blue-50 p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] border border-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-blue-200">
                            <Target className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">Visi Kami</h2>
                        <p className="text-slate-600 text-lg leading-relaxed font-medium">
                            {vision || "Menjadi jembatan kebaikan yang paling transparan dan terpercaya, mengubah niat baik menjadi dampak nyata bagi dunia."}
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="group bg-green-50 p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] border border-green-100/50 hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-green-600 rounded-3xl flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-green-200">
                            <Heart className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">Misi Kami</h2>
                        <p className="text-slate-600 text-lg leading-relaxed font-medium">
                            {mission || "Memberdayakan komunitas dengan platform yang memudahkan setiap orang untuk menggalang dana dan berdonasi secara aman dan berdampak."}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
