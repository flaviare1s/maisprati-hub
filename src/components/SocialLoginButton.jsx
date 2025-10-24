// src/components/SocialLoginButton.jsx
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export const SocialLoginButton = ({ provider }) => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/oauth2/authorization/${provider}`;
  };

  const isGoogle = provider === "google";
  const Icon = isGoogle ? FcGoogle : FaGithub;
  const label = isGoogle ? "Entrar com Google" : "Entrar com GitHub";

  return (
    <button
      onClick={handleLogin}
      className={`flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md py-2 px-4 mt-3 transition hover:bg-gray-100`}
    >
      <Icon size={22} />
      <span className="font-medium">{label}</span>
    </button>
  );
};
