import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CustomLoader } from "../components/CustomLoader";

export const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loadUserData } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      const processOAuth2Login = async () => {
        try {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          await new Promise(resolve => setTimeout(resolve, 200));

          const userData = await loadUserData();
          if (userData) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }

        } catch (error) {
          console.error("Erro no processo de OAuth2:", error);
          navigate("/login", { replace: true });
        }
      };
      processOAuth2Login();
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, loadUserData]);

  return (
    <CustomLoader />
  );
};
