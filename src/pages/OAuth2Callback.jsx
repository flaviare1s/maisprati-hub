import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomLoader } from "../components/CustomLoader";

export const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      try {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
      } catch (error) {
        console.error("Erro ao salvar tokens:", error);
        navigate("/login", { replace: true });
      }
    } else {
      console.error("Tokens não encontrados na URL");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <CustomLoader />
  );
};
