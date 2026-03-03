import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./auth.schema";
import type { RegisterInput } from "./auth.schema";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "./auth.api";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response: any) => {
      navigate("/verify-otp", {
        state: {
          userId: response.userId,
          email: response.email,
        },
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });


  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Account
      </h2>

      {mutation.isError && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">
          Gagal mendaftar. Coba lagi.
        </div>
      )}

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nama Lengkap
          </label>
          <input
            {...register("fullName")}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tanggal Lahir
          </label>
          <input
            type="date"
            {...register("birthDate")}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nomor telepon
          </label>
          <input
            {...register("phoneNumber")}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>


        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {mutation.isPending ? "Loading..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        Sudah punya akun?{" "}
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Login di sini
        </Link>
      </p>
    </div>
  );
}
