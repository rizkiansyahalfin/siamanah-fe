import { Button } from "@/components/ui/button";
import { 
    FileText, 
    Download, 
    Filter,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

export function ReportsPage() {
    const reportStats = [
        { 
            label: "Total Donasi", 
            value: "Rp 12.450.000", 
            change: "+12.5%", 
            trend: "up", 
            desc: "Dibandingkan bulan lalu" 
        },
        { 
            label: "Donatur Baru", 
            value: "142", 
            change: "+8.2%", 
            trend: "up", 
            desc: "Pertumbuhan organik" 
        },
        { 
            label: "Rata-rata Donasi", 
            value: "Rp 87.500", 
            change: "-2.1%", 
            trend: "down", 
            desc: "Sedikit penurunan" 
        },
        { 
            label: "Konversi Kampanye", 
            value: "15.4%", 
            change: "+4.3%", 
            trend: "up", 
            desc: "Optimasi konten" 
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <FileText className="h-7 w-7 text-blue-600" />
                        </div>
                        Laporan & Analitik
                    </h1>
                    <p className="text-slate-500 font-medium ml-12 sm:ml-0 px-2">
                        Pantau performa kampanye dan pertumbuhan donasi Anda secara detail.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-2 sm:px-0">
                    <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 font-bold gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 gap-2">
                        <Download className="h-4 w-4" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 sm:px-0">
                {reportStats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <div className={`p-1.5 rounded-lg ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">{stat.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 sm:px-0">
                <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-soft min-h-[300px] sm:min-h-[400px] relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Pertumbuhan Donasi</h3>
                            <p className="text-sm text-slate-400 font-medium">Tren donasi harian dalam 30 hari terakhir</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                            <button className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600">7H</button>
                            <button className="px-3 py-1.5 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm">30H</button>
                        </div>
                    </div>
                    
                    {/* Simulated Chart Visualization */}
                    <div className="absolute inset-x-4 sm:inset-x-8 bottom-4 sm:bottom-8 top-28 sm:top-32 flex items-end gap-1 sm:gap-2 group-hover:scale-[1.02] transition-transform duration-500">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-50 relative rounded-t-lg group/bar">
                                <div 
                                    className="absolute bottom-0 inset-x-0 bg-blue-600/10 transition-all duration-1000 ease-out rounded-t-lg group-hover/bar:bg-blue-600/20"
                                    style={{ height: `${h}%` }}
                                />
                                <div 
                                    className="absolute bottom-0 inset-x-0 bg-blue-600 transition-all duration-1000 delay-100 ease-out rounded-t-lg group-hover/bar:brightness-110"
                                    style={{ height: `${h * 0.4}%` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-soft min-h-[400px] flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Distribusi Kategori</h3>
                        <div className="space-y-6">
                            {[
                                { label: "Kemanusiaan", value: 45, color: "bg-blue-500" },
                                { label: "Pendidikan", value: 25, color: "bg-purple-500" },
                                { label: "Kesehatan", value: 20, color: "bg-green-500" },
                                { label: "Lingkungan", value: 10, color: "bg-amber-500" },
                            ].map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-600">{cat.label}</span>
                                        <span className="font-black text-slate-900">{cat.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`${cat.color} h-full rounded-full transition-all duration-1000`} 
                                            style={{ width: `${cat.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full text-blue-600 font-bold hover:bg-blue-50 gap-2">
                        Lihat Semua Kategory <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-soft overflow-hidden">
                <div className="p-5 sm:p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Aktifitas Donasi Terbaru</h3>
                    <Button variant="link" className="text-blue-600 font-bold p-0">Lihat Semua</Button>
                </div>
                <div className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                                    {String.fromCharCode(64 + item)}
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase">Donatur Anonim #{item}203</h4>
                                    <p className="text-xs text-slate-400 font-medium">15 menit yang lalu • Kampanye Penghijauan</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-black text-slate-900">Rp 50.000</span>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tight">Berhasil</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
