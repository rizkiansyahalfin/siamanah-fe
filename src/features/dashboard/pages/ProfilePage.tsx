import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    User as UserIcon,
    Shield,
    Eye,
    EyeOff,
    Camera,
    X,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks";
import { useUpdateProfile, useChangePassword } from "../hooks/profile.hooks";

export function ProfilePage() {
    const { data: user, isLoading: isUserLoading } = useCurrentUser();
    const updateProfileMutation = useUpdateProfile();
    const updatePasswordMutation = useChangePassword();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

    // Profile State
    const [profileData, setProfileData] = useState({
        fullName: "",
        phone: ""
    });

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setProfileData({
                fullName: user.fullName || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    // Security State
    const [securityData, setSecurityData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Password Validation Logic
    const passwordStrength = {
        hasMinLength: securityData.newPassword.length >= 8,
        hasNumber: /[0-9]/.test(securityData.newPassword),
        hasUpperLower: /[a-z]/.test(securityData.newPassword) && /[A-Z]/.test(securityData.newPassword),
        hasSymbol: /[^A-Za-z0-9]/.test(securityData.newPassword)
    };

    const isPasswordValid = passwordStrength.hasMinLength && passwordStrength.hasNumber;
    const isConfirmValid = securityData.confirmPassword === securityData.newPassword && securityData.confirmPassword !== "";

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(profileData);
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPasswordValid && isConfirmValid) {
            updatePasswordMutation.mutate({
                oldPassword: securityData.currentPassword,
                newPassword: securityData.newPassword
            }, {
                onSuccess: () => {
                    setSecurityData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                    });
                }
            });
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateProfileMutation.mutate({ avatar: file });
        }
    };

    const toggleShowPassword = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (isUserLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Profil</h1>
                <p className="text-sm sm:text-base text-slate-500 font-medium">
                    Kelola informasi akun dan keamanan Anda.
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar scroll-smooth">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === "profile"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                        }`}
                >
                    <UserIcon className="h-4 w-4" />
                    Profil
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === "security"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                        }`}
                >
                    <Shield className="h-4 w-4" />
                    Keamanan
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-w-0">
                {activeTab === "profile" ? (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group">
                                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-slate-50 overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                                    {user?.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `${import.meta.env.VITE_API_URL}/${user.avatarUrl}`}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="h-12 w-12 text-slate-300" />
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors border-2 border-white"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-center sm:text-left space-y-1">
                                <h3 className="font-bold text-slate-900">Foto Profil</h3>
                                <p className="text-xs text-slate-400 max-w-[200px]">
                                    Disarankan ukuran minimal 400x400px. Format JPG, PNG, atau WEBP.
                                </p>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSaveProfile} className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 bg-slate-50/50 transition-all text-sm font-semibold outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed text-sm font-semibold outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Nomor HP</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 bg-slate-50/50 transition-all text-sm font-semibold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    type="submit"
                                    disabled={updateProfileMutation.isPending}
                                    className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {updateProfileMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Profil"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Ganti Password</h3>
                            <p className="text-sm text-slate-500 font-medium">Pastikan password Anda kuat dan mudah diingat untuk keamanan akun.</p>
                        </div>

                        <form onSubmit={handleSavePassword} className="space-y-6">
                            <div className="space-y-6">
                                {/* Current Password */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password Saat Ini</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            value={securityData.currentPassword}
                                            onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                            className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 bg-slate-50/50 transition-all text-sm font-semibold outline-none"
                                            placeholder="Masukkan password lama"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShowPassword("current")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password Baru</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            value={securityData.newPassword}
                                            onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                            className={`w-full h-12 px-4 pr-12 rounded-xl border transition-all text-sm font-semibold outline-none ${securityData.newPassword
                                                ? (isPasswordValid ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30')
                                                : 'border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50'
                                                }`}
                                            placeholder="Masukkan password baru"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShowPassword("new")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password Checklist */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.hasMinLength ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                                            Minimal 8 Karakter
                                        </div>
                                        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${passwordStrength.hasNumber ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.hasNumber ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                                            Ada Angka (0-9)
                                        </div>
                                        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${passwordStrength.hasUpperLower ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.hasUpperLower ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                                        Huruf Besar & Kecil
                                        </div>
                                        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${passwordStrength.hasSymbol ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.hasSymbol ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                                            Ada Simbol (e.g. #!)
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Konfirmasi Password Baru</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={securityData.confirmPassword}
                                            onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                            className={`w-full h-12 px-4 pr-12 rounded-xl border transition-all text-sm font-semibold outline-none ${securityData.confirmPassword
                                                ? (isConfirmValid ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30')
                                                : 'border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50'
                                                }`}
                                            placeholder="Ulangi password baru"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShowPassword("confirm")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {securityData.confirmPassword && !isConfirmValid && (
                                        <p className="text-xs text-red-500 font-bold mt-1 px-1 flex items-center gap-1.5">
                                            <X className="h-3 w-3" /> Konfirmasi password tidak cocok.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
                                    className="w-full sm:w-auto px-8 h-12 rounded-2xl border-slate-200 text-slate-500 font-bold transition-all"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!isPasswordValid || !isConfirmValid || updatePasswordMutation.isPending}
                                    className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                    {updatePasswordMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
