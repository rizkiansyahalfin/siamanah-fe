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
                            The most transparent, community-driven platform for positive global change.
                        </p>
                        <div className="flex gap-4">
                            <Facebook className="h-5 w-5 text-muted-foreground hover:text-green-600 cursor-pointer" />
                            <Twitter className="h-5 w-5 text-muted-foreground hover:text-green-600 cursor-pointer" />
                            <Instagram className="h-5 w-5 text-muted-foreground hover:text-green-600 cursor-pointer" />
                            <Youtube className="h-5 w-5 text-muted-foreground hover:text-green-600 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">For Donors</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-green-600">How It Works</Link></li>
                            <li><Link to="/explore" className="hover:text-green-600">Donor Guide</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Trust & Safety</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Gift Cards</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">For Recipients</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/subscription" className="hover:text-green-600">Pricing Plans</Link></li>
                            <li><Link to="/create-campaign" className="hover:text-green-600">Start Fundraising</Link></li>
                            <li><Link to="/dashboard" className="hover:text-green-600">Dashboard</Link></li>
                            <li><Link to="/explore" className="hover:text-green-600">Success Stories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-green-600">About Us</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Careers</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Privacy Policy</Link></li>
                            <li><Link to="/" className="hover:text-green-600">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2024 FundForward Platform. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/" className="hover:text-green-600">Privacy</Link>
                        <Link to="/" className="hover:text-green-600">Terms</Link>
                        <Link to="/" className="hover:text-green-600">Safety</Link>
                        <Link to="/" className="hover:text-green-600">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
