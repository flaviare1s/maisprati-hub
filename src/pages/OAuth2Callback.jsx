import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomLoader } from "../components/CustomLoader";

export const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/dashboard", { replace: true });
    } else {
      console.error("Tokens não encontrados na URL");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <CustomLoader />
  );
};
