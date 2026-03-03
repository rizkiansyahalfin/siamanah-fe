import LoginForm from "./login-form";
import bg from "@/assets/Warga-Palestina.png";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <LoginForm />
      </div>

    </div>
  );
}
