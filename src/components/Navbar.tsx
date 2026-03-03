import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, LogOut, User as UserIcon, X, Wallet, Settings } from "lucide-react";
import { useCurrentUser, useLogout } from "@/features/auth/hooks";

export function Navbar() {
    const { data: user } = useCurrentUser();
    const logoutMutation = useLogout();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate(`/explore`);
        }
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 rotate-45 bg-[#F3BC20] rounded-sm flex items-center justify-center overflow-hidden">
                       <div className="absolute inset-0 bg-blue-600/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </div>
                    <span className="text-2xl font-bold text-[#1A60C0] tracking-tight">SIA<span className="text-slate-900">manah</span><span className="text-blue-500 font-normal">.id</span></span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-8 text-base font-medium text-slate-600">
                    <Link to="/" className="transition-colors hover:text-blue-600">Beranda</Link>
                    <Link to="/explore" className="transition-colors hover:text-blue-600">Donasi</Link>
                    
                    {/* Role-based navigation */}
                    <Link to="/create-campaign" className="transition-colors hover:text-blue-600">Galang Dana</Link>
                    
                    {user?.role === "ADMIN" && (
                        <Link to="/admin/review" className="transition-colors hover:text-blue-600 text-amber-600 font-bold">Review</Link>
                    )}

                    <Link to="/about" className="transition-colors hover:text-blue-600">Tentang Kami</Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="hidden md:flex relative">
                        <input
                            type="text"
                            placeholder="Cari campaign..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 pl-10 pr-4 rounded-full bg-slate-100 border-none text-sm focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 transition-all"
                        />
                        <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </form>
                    <Button variant="ghost" size="icon" className="md:hidden bg-[#FDE2E2] hover:bg-red-200 text-red-500 rounded-lg h-10 w-10" onClick={() => navigate('/explore')}>
                        <Search className="h-5 w-5" />
                    </Button>
                    
                    {user ? (
                        <div className="flex items-center gap-3 ml-2">
                             <div className="hidden md:flex flex-col items-end mr-1">
                                <span className="text-sm font-bold text-slate-900 leading-none">{user.fullName}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{user.role}</span>
                            </div>
                            
                            <Link to="/dashboard" className="hidden sm:block h-10 w-10 rounded-full border-2 border-blue-100 p-0.5 hover:border-blue-500 transition-colors">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <div className="h-full w-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                )}
                            </Link>

                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={handleLogout}
                                className="hidden sm:flex h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Keluar"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button className="bg-[#1A60C0] hover:bg-blue-700 text-white rounded-lg font-bold px-8 h-10 shadow-sm transition-all hidden sm:block">
                                Masuk
                            </Button>
                        </Link>
                    )}

                    <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="h-6 w-6 text-slate-600" />
                    </Button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeMenu}></div>
                    <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <span className="font-bold text-slate-900">Menu</span>
                            <Button variant="ghost" size="icon" onClick={closeMenu} className="h-10 w-10">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="px-4 space-y-2 mb-6 text-sm font-bold text-slate-700">
                                <Link to="/" onClick={closeMenu} className="block py-3 px-4 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors">Beranda</Link>
                                <Link to="/explore" onClick={closeMenu} className="block py-3 px-4 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors">Donasi</Link>
                                <Link to="/create-campaign" onClick={closeMenu} className="block py-3 px-4 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors">Galang Dana</Link>
                                <Link to="/about" onClick={closeMenu} className="block py-3 px-4 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors">Tentang Kami</Link>
                                {user?.role === "ADMIN" && (
                                    <Link to="/admin/review" onClick={closeMenu} className="block py-3 px-4 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">Admin Review</Link>
                                )}
                            </div>

                            {user ? (
                                <div className="border-t border-slate-100 pt-6 px-4">
                                    <div className="flex items-center gap-3 mb-6 px-4">
                                        <div className="h-12 w-12 rounded-full border-2 border-blue-100 p-0.5 relative overflow-hidden">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <UserIcon className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{user.fullName}</div>
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{user.role}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 font-bold text-sm">
                                        <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            <Settings className="h-5 w-5" /> Dashboard
                                        </Link>
                                        <Link to="/dashboard/donations" onClick={closeMenu} className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            <Wallet className="h-5 w-5" /> Donasi Saya
                                        </Link>
                                        <button onClick={() => { closeMenu(); handleLogout(); }} className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left">
                                            <LogOut className="h-5 w-5" /> Keluar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-4 mt-6">
                                    <Link to="/login" onClick={closeMenu}>
                                        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-bold text-sm">
                                            Masuk
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
