import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Mail,
  Phone,
  LogIn,
  User as UserIcon,
  ShieldCheck,
  History,
  Zap,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { DonationSuccessModal } from "../components/DonationSuccessModal";
import { useNavigate, Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { GuestDonationForm } from "../components/GuestDonationForm";
import { getPublicCampaignDetail } from "@/services/campaign.public";
import { getPaymentMethods } from "@/services/donation.service";
import { createPayment } from "@/services/payment.service";
import { useQuery } from "@tanstack/react-query";

type CheckoutMode = "choice" | "guest" | "authenticated";

export function CheckoutPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  // Success & Loading states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationResult, setDonationResult] = useState<{ amount: number; paymentMethod: string; transactionId?: string; orderId?: string } | null>(null);

  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>(
    isAuthenticated ? "authenticated" : "choice"
  );

  // Fetch Campaign Detail
  const { data: campaign, isLoading: isLoadingCampaign } = useQuery({
    queryKey: ["campaign-checkout", campaignId],
    queryFn: () => getPublicCampaignDetail(campaignId!),
    enabled: !!campaignId,
  });

  // Fetch payment methods
  const {
    data: paymentMethods = [],
    isLoading: isLoadingMethods,
  } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  });

  // States for form
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState("");

  // Auth-dependent field states
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");

  // Guest form state
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Hydrate from sessionStorage if available
  useEffect(() => {
    const saved = sessionStorage.getItem(`checkout_state_${campaignId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.customAmount) setCustomAmount(parsed.customAmount);
        if (parsed.donorMessage) setDonorMessage(parsed.donorMessage);
        if (parsed.isAnonymous !== undefined) setIsAnonymous(parsed.isAnonymous);
        if (parsed.donorName) setDonorName(parsed.donorName);
        if (parsed.selectedAmount) setSelectedAmount(parsed.selectedAmount);
      } catch (err) {
        console.error("Failed to restore checkout state", err);
      }
    }
  }, [campaignId]);

  // Persist to sessionStorage
  useEffect(() => {
    const state = {
      customAmount,
      donorMessage,
      isAnonymous,
      donorName,
      selectedAmount
    };
    sessionStorage.setItem(`checkout_state_${campaignId}`, JSON.stringify(state));
  }, [campaignId, customAmount, donorMessage, isAnonymous, donorName, selectedAmount]);

  // Selected payment method (default QRIS jika tersedia)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("pm-qris");

  // Update email when user loaded
  useEffect(() => {
    if (user?.email) setDonorEmail(user.email);
    if (isAuthenticated) setCheckoutMode("authenticated");
  }, [user, isAuthenticated]);

  const handleGuestChange = (field: string, value: string) => {
    setGuestData((prev) => ({ ...prev, [field]: value }));
  };

  const rupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);

  const quickAmounts = [
    1000, 5000, 10000, 20000, 50000, 100000, 200000, 500000,
  ];

  const currentAmount = customAmount
    ? parseInt(customAmount.replace(/[^0-9]/g, "")) || 0
    : selectedAmount || 0;

  const displayAmount = useMemo(() => {
    if (!customAmount) return "";
    const num = parseInt(customAmount.replace(/[^0-9]/g, ""));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  }, [customAmount]);

  const handleCompleteDonation = async () => {
    if (checkoutMode === "guest") {
      if (!guestData.name || !guestData.email || !guestData.phone) {
        alert("Mohon lengkapi semua data tamu yang diperlukan.");
        return;
      }
    }

    if (!selectedPaymentMethod) {
      alert("Silakan pilih metode pembayaran.");
      return;
    }

    setIsSubmitting(true);
    try {
      const basePayload = {
        campaignId: campaignId!,
        amount: currentAmount,
        isAnonymous,
        donorMessage,
        paymentMethod: selectedPaymentMethod,
      };

      const guestPart =
        !isAuthenticated && checkoutMode === "guest"
          ? {
              guestName: guestData.name,
              guestEmail: guestData.email,
              guestPhone: guestData.phone,
              donorName: donorName || guestData.name,
            }
          : {
              donorName: donorName || user?.fullName,
            };

      const emailForMidtrans =
        checkoutMode === "guest"
          ? guestData.email
          : donorEmail || user?.email || "";

      const payload = {
        ...basePayload,
        ...guestPart,
        email: emailForMidtrans,
      };

      const response = await createPayment(payload);
      const { orderId, snapToken } = response.data;

      // Clear state after successful payment creation
      sessionStorage.removeItem(`checkout_state_${campaignId}`);

      setDonationResult({
        ...response.data,
        amount: currentAmount,
        paymentMethod: selectedPaymentMethod,
      });

      // Panggil Snap popup (termasuk untuk mock token, akan error tapi onClose akan terpanggil)
      if ((window as unknown as { snap: Record<string, unknown> }).snap && snapToken) {
        (window as unknown as { snap: { pay: (token: string, callbacks: Record<string, () => void>) => void } }).snap.pay(snapToken, {
          onSuccess: () => {
            navigate(`/donation/status/${orderId}`);
          },
          onPending: () => {
            navigate(`/donation/status/${orderId}`);
          },
          onError: () => {
            // Jika error (misalnya mock token), redirect ke status page
            navigate(`/donation/status/${orderId}`);
          },
          onClose: () => {
            // User menutup Snap (termasuk setelah error dengan mock token), redirect ke status page
            navigate(`/donation/status/${orderId}`);
          },
        });
      } else {
        // Fallback: jika Snap tidak tersedia, langsung arahkan ke halaman status
        navigate(`/donation/status/${orderId}`);
      }
    } catch (error) {
      console.error("Donation failed", error);
      alert("Terjadi kesalahan saat memproses donasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    if (isAuthenticated) {
      navigate("/dashboard/overview");
    } else {
      navigate("/donation/success?guest=true");
    }
  };

  if (isLoadingCampaign) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium">Menyiapkan halaman donasi...</p>
            </div>
        );
    }

  if (!campaign) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <h1 className="text-2xl font-bold text-slate-900">Campaign tidak ditemukan</h1>
                <Link to="/explore">
                    <Button variant="link" className="mt-4 text-blue-600 font-bold">Kembali ke Jelajah</Button>
                </Link>
            </div>
        );
    }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

                    {/* Section: Campaign Header Card */}
                    <div className="bg-white rounded-[28px] sm:rounded-[32px] overflow-hidden border border-slate-100 shadow-soft">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-[45%] lg:w-[40%] h-64 md:h-auto relative">
                                <img
                                    src={campaign.imageUrl}
                                    alt={campaign.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#F3BC20] text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                        Donasi Sekarang
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-tight min-w-0">
                                        {campaign.title}
                                    </h1>
                                    <p className="text-sm text-slate-500 line-clamp-2 sm:line-clamp-3 mb-6 leading-relaxed">
                                        {campaign.shortDescription}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-lg sm:text-2xl font-black text-slate-900 leading-none">{rupiah(campaign.currentAmount)}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terkumpul</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-lg sm:text-2xl font-black text-slate-900 leading-none">
                                                {Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hari Lagi</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#1A60C0] rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:gap-8 min-w-0">

                        {/* Section: Pilih Nominal Donasi */}
                        <section className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-100 p-5 sm:p-8 shadow-card space-y-6">
                            <h2 className="text-lg font-bold text-slate-900">Pilih Nominal Donasi</h2>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {quickAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => {
                                            setSelectedAmount(amount);
                                            setCustomAmount(amount.toString());
                                        }}
                                        className={cn(
                                            "py-2.5 px-4 sm:px-5 rounded-xl border-2 font-bold transition-all text-sm",
                                            (customAmount === amount.toString() || (selectedAmount === amount && !customAmount))
                                                ? "border-[#1A60C0] bg-[#1A60C0] text-white shadow-md scale-105"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 shadow-sm"
                                        )}
                                    >
                                        {rupiah(amount).replace("Rp\u00a0", "Rp ")}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs text-slate-400 font-medium italic">atau nominal donasi lainnya (Masukkan dalam kelipatan ribuan)</p>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">Rp</div>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={displayAmount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            if (val === "0" && !customAmount) return;
                                            setCustomAmount(val);
                                            setSelectedAmount(null);
                                        }}
                                        placeholder="0"
                                        className="w-full pl-16 pr-6 py-5 sm:py-6 rounded-2xl border-2 border-slate-100 focus:border-[#1A60C0] focus:outline-none transition-all text-xl sm:text-2xl font-black bg-white shadow-soft text-slate-900 placeholder:text-slate-100"
                                    />
                                </div>
                            </div>
                        </section>

                        {!isAuthenticated && checkoutMode === "choice" && (
                            <section className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-100 p-5 sm:p-8 shadow-card space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-black text-slate-900">Ingin Pengalaman Donasi Lebih Baik?</h2>
                                    <p className="text-sm text-slate-500">Login untuk menikmati fitur lengkap atau lanjutkan sebagai tamu.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="h-6 w-6 text-blue-600" />
                                            <h3 className="font-bold text-slate-800">Donasi Terdaftar</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {[
                                                { icon: History, text: "Riwayat donasi tercatat rapi" },
                                                { icon: Zap, text: "Checkout lebih cepat berikutnya" },
                                                { icon: UserIcon, text: "Kelola profil & kampanye saya" }
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                                    <item.icon className="h-3.5 w-3.5 text-blue-500" />
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button asChild className="w-full bg-[#1A60C0] hover:bg-blue-700 h-11 rounded-xl gap-2 font-bold shadow-md shadow-blue-100">
                                            <Link to={`/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`}>
                                                <LogIn className="h-4 w-4" /> Masuk Sekarang
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <UserIcon className="h-6 w-6 text-slate-400" />
                                            <h3 className="font-bold text-slate-800">Donasi Tamu</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-slate-500 leading-relaxed italic">
                                                "Tetap bisa berbuat baik tanpa akun. Namun Anda tidak dapat melacak riwayat donasi dikemudian hari."
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCheckoutMode("guest")}
                                            className="w-full border-slate-300 h-11 rounded-xl font-bold bg-white hover:bg-slate-50 text-slate-700"
                                        >
                                            Lanjutkan Sebagai Tamu
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {(checkoutMode === "authenticated" || checkoutMode === "guest") && (
                            <section className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-100 p-5 sm:p-8 shadow-card space-y-6 animate-in fade-in duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-slate-900">Data Donatur</h2>
                                    {!isAuthenticated && (
                                        <button
                                            onClick={() => setCheckoutMode("choice")}
                                            className="text-xs font-bold text-[#1A60C0] hover:underline"
                                        >
                                            Ganti Metode
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-1.5 flex flex-col w-full">
                                        <label htmlFor="donorName" className="text-xs font-bold text-slate-700 ml-1">Tampilkan Nama Sebagai (Opsional)</label>
                                        <input
                                            id="donorName"
                                            type="text"
                                            placeholder="Contoh: Hamba Allah / John Doe"
                                            value={donorName}
                                            onChange={(e) => setDonorName(e.target.value)}
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-[#1A60C0] outline-none transition-all text-sm bg-white shadow-sm"
                                        />
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="peer hidden"
                                                checked={isAnonymous}
                                                onChange={() => setIsAnonymous(!isAnonymous)}
                                            />
                                            <div className="h-5 w-5 rounded-md border-2 border-slate-200 peer-checked:bg-[#1A60C0] peer-checked:border-[#1A60C0] transition-all flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                            Sembunyikan nama saya (Donasi anonim)
                                        </span>
                                    </label>

                                    <div className="space-y-1.5 flex flex-col w-full">
                                        <label htmlFor="donorMessage" className="text-xs font-bold text-slate-700 ml-1">Berikan Pesan / Doa (Opsional)</label>
                                        <textarea
                                            id="donorMessage"
                                            placeholder="Tuliskan doa atau pesan dukungan..."
                                            value={donorMessage}
                                            onChange={(e) => setDonorMessage(e.target.value)}
                                            rows={3}
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-[#1A60C0] outline-none transition-all text-sm resize-none bg-white shadow-sm"
                                        />
                                    </div>

                                    {checkoutMode === "guest" ? (
                                        <GuestDonationForm
                                            formData={guestData}
                                            onChange={handleGuestChange}
                                        />
                                    ) : (
                                        <div className="space-y-6 pt-6 border-t border-slate-100">
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Informasi Kontak</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5 w-full">
                                                    <label htmlFor="donorEmail" className="text-xs font-bold text-slate-700 ml-1">Email</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                        <input
                                                            id="donorEmail"
                                                            type="email"
                                                            placeholder="Email (Opsional)"
                                                            value={donorEmail}
                                                            onChange={(e) => setDonorEmail(e.target.value)}
                                                            className="w-full pl-11 pr-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-[#1A60C0] outline-none transition-all text-sm bg-white"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 w-full">
                                                    <label htmlFor="donorPhone" className="text-xs font-bold text-slate-700 ml-1">No Handphone</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                        <input
                                                            id="donorPhone"
                                                            type="tel"
                                                            placeholder="No Handphone (Opsional)"
                                                            value={donorPhone}
                                                            onChange={(e) => setDonorPhone(e.target.value)}
                                                            className="w-full pl-11 pr-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-[#1A60C0] outline-none transition-all text-sm bg-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-100 pl-4 mt-4">
                                        Data kontak digunakan untuk notifikasi perkembangan kampanye dan tidak akan dipublikasikan.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Section: Pilih Metode Pembayaran */}
                        <div className="space-y-4">
                          <section className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-100 px-6 sm:px-8 py-5 sm:py-6 shadow-soft">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-bold text-slate-800">
                                Pilih Metode Pembayaran
                              </h3>
                              {isLoadingMethods && (
                                <span className="text-xs text-slate-400">
                                  Memuat...
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-3">
                              {paymentMethods.map((pm) => (
                                <button
                                  key={pm.id}
                                  type="button"
                                  onClick={() => setSelectedPaymentMethod(pm.id)}
                                  className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm",
                                    selectedPaymentMethod === pm.id
                                      ? "border-[#1A60C0] bg-blue-50"
                                      : "border-slate-200 bg-white hover:bg-slate-50"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    {pm.iconUrl && (
                                      <img
                                        src={pm.iconUrl}
                                        alt={pm.name}
                                        className="h-5 w-auto"
                                      />
                                    )}
                                    <span className="font-medium text-slate-800">
                                      {pm.name}
                                    </span>
                                  </div>
                                  <span className="text-[10px] uppercase font-bold text-slate-400">
                                    {pm.category}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </section>

                          <Button
                            onClick={handleCompleteDonation}
                            disabled={
                              currentAmount < 1000 ||
                              (checkoutMode === "choice" && !isAuthenticated) ||
                              isSubmitting
                            }
                            className="w-full h-14 sm:h-16 bg-[#1A60C0] hover:bg-blue-700 text-white rounded-[20px] sm:rounded-[24px] text-lg sm:text-xl font-black shadow-lg shadow-blue-200 transition-all gap-2 uppercase tracking-[0.1em]"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />{" "}
                                Memproses...
                              </>
                            ) : (
                              <>
                                {checkoutMode === "choice" && !isAuthenticated
                                  ? "Pilih Metode Login/Tamu"
                                  : "Bayar Sekarang"}{" "}
                                <ChevronRight className="h-6 w-6 stroke-[3px]" />
                              </>
                            )}
                          </Button>
                        </div>

                    </div>

                    {/* Success Modal (saat ini tidak otomatis dibuka di flow Midtrans, tapi disimpan jika ingin dipakai nantinya) */}
                    <DonationSuccessModal
                      isOpen={isSuccessModalOpen}
                      onClose={handleCloseModal}
                      data={{
                        campaignTitle: campaign.title,
                        campaignId: campaign.id,
                        campaignImage: campaign.imageUrl,
                        amount: donationResult?.amount || currentAmount,
                        paymentMethod: donationResult?.paymentMethod || "QRIS",
                        transactionId:
                          donationResult?.transactionId || "TX-MOCK",
                        createdAt:
                          new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }) +
                          ", " +
                          new Date().toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) +
                          " WIB",
                        message: donorMessage || undefined,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
}
