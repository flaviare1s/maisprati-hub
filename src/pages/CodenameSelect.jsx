import { useNavigate } from "react-router-dom";
import { SubmitButton } from "../components/SubmitButton";

export const CodenameSelect = () => {
  const navigate = useNavigate();

  const handleCodenameSubmit = () => {
    navigate("/common-room");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2>Escolha seu nome de guerra</h2>
      <form onSubmit={handleCodenameSubmit}>
        <SubmitButton label="Continuar" />
      </form>
    </div>
  );
};
