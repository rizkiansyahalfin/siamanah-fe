import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/axios";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch {
      // Tetap tampilkan sukses (jangan bocorkan info)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Reset Password
      </h2>

      {submitted ? (
        <div className="text-sm text-green-600 bg-green-100 p-3 rounded">
          If the email exists, we have sent a reset link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <p className="text-sm text-center mt-6">
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
}
