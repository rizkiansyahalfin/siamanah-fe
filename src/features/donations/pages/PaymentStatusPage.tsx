import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "@/services/payment.service";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaymentStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => getPaymentStatus(orderId!),
    enabled: !!orderId,
    refetchInterval: (query) =>
      query.state.data?.data.paymentStatus === "PENDING" ? 5000 : false,
  });

  const status = data?.data.paymentStatus;

  useEffect(() => {
    if (status === "PAID") {
      const t = setTimeout(() => {
        navigate("/donation/success?guest=true");
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [status, navigate]);

  if (!orderId) {
    return <div className="p-8 text-center">Order ID tidak ditemukan.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-slate-500">Memeriksa status pembayaran...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="h-10 w-10 text-red-500" />
        <p className="text-slate-500">Gagal mengambil status pembayaran.</p>
        <Button onClick={() => refetch()}>Coba Lagi</Button>
      </div>
    );
  }

  const isPaid = status === "PAID";
  const isFailed = status === "FAILED";
  const isExpired = status === "EXPIRED";
  const isPending = status === "PENDING";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-card text-center space-y-6">
        <div className="flex justify-center">
          {isPaid && (
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          )}
          {isPending && (
            <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="h-10 w-10 text-amber-600" />
            </div>
          )}
          {(isFailed || isExpired) && (
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">
            {isPaid && "Pembayaran Berhasil"}
            {isPending && "Menunggu Pembayaran"}
            {isFailed && "Pembayaran Gagal"}
            {isExpired && "Pembayaran Kedaluwarsa"}
          </h1>
          <p className="text-slate-500 text-sm">
            Nomor Order:{" "}
            <span className="font-mono">{data.data.orderId}</span>
          </p>
        </div>

        {isPending && (
          <p className="text-xs text-slate-500">
            Kami belum menerima konfirmasi pembayaran. Jika Anda sudah membayar,
            halaman ini akan terupdate otomatis.
          </p>
        )}

        {(isFailed || isExpired) && (
          <p className="text-xs text-slate-500">
            Silakan coba lakukan pembayaran ulang atau pilih campaign lain.
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold"
          >
            <Link to="/explore">Cari Campaign Lain</Link>
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-slate-200 font-bold text-slate-600"
            onClick={() => refetch()}
          >
            Refresh Status
          </Button>
        </div>
      </div>
    </div>
  );
}

