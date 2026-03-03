import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./auth.api";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("token", response.token);

      navigate("/");
    } catch (err) {
      setError((err as Error)?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Login Akun
      </h2>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

              <div className="text-right mt-1">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Lupa Password?
          </Link>
        </div>


        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="google"
          className="w-5 h-5"
        />
        Login with Google
      </button>

      {/* Register Link */}
      <p className="text-sm text-center mt-6">
        Belum punya akun?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
