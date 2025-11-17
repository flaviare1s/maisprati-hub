import { useNavigate } from "react-router-dom";

export const ReturnButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Voltar"
      className="text-blue-logo hover:underline cursor-pointer font-medium"
    >
      &larr; Voltar
    </button>
  );
};
