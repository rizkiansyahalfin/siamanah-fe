import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-slate-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link to="/" className="text-xl font-bold text-green-600">FundForward</Link>
                        <p className="text-sm text-muted-foreground">
                            Platform penggalangan dana paling transparan dan berbasis komunitas untuk perubahan global yang positif.
                        </p>
                        <div className="flex gap-4">
                            <Facebook className="h-5 w-5 text-muted-foreground hover:text-green-600 cursor-pointer" />
                            <Twitter className="h-5 w-5 text-muted-foreground hover:text-green-600 cursor-pointer" />
                            <Instagram className="h-5 w-5 text-muted-foreground hover:text-green-600 cursor-pointer" />
                            <Youtube className="h-5 w-5 text-muted-foreground hover:text-green-600 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Untuk Donatur</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-green-600">Cara Kerja</Link></li>
                            <li><Link to="/explore" className="hover:text-green-600">Panduan Donatur</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Kepercayaan & Keamanan</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Kartu Hadiah</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Untuk Penggalang Dana</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/subscription" className="hover:text-green-600">Paket Harga</Link></li>
                            <li><Link to="/create-campaign" className="hover:text-green-600">Mulai Galang Dana</Link></li>
                            <li><Link to="/dashboard" className="hover:text-green-600">Dashboard</Link></li>
                            <li><Link to="/explore" className="hover:text-green-600">Kisah Sukses</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Perusahaan</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-green-600">Tentang Kami</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Karir</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Kebijakan Privasi</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Syarat & Ketentuan</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2024 Platform FundForward. Seluruh Hak Cipta Dilindungi.</p>
                    <div className="flex gap-6">
                        <Link to="/" className="hover:text-green-600">Privasi</Link>
                        <Link to="/" className="hover:text-green-600">Ketentuan</Link>
                        <Link to="/" className="hover:text-green-600">Keamanan</Link>
                        <Link to="/" className="hover:text-green-600">Kontak</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
