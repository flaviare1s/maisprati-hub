import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/images/logo+prati.png";
import { InputField } from "../components/InputField";
import { SubmitButton } from "../components/SubmitButton";

export const NewPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password");

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = (data) => {
    console.log("Nova senha cadastrada:", data.password);
    navigate("/login");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center m-auto w-full p-4">

      {!isDesktop && (
        <div className="flex flex-col items-center justify-center w-full max-w-sm">
          <button
            type="button"
            className="text-blue-logo hover:orange-logo self-start mb-4"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>

          <div>
            <img src={logo} alt="ConectaVida" className="w-[180px] m-auto" />

            <h2 className="text-xl mb-10 text-center text-gray-muted font-montserrat">
              Cadastre sua nova senha
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full">
              <InputField
                name="password"
                type="password"
                placeholder="Digite sua nova senha"
                register={register}
                error={errors.password?.message}
                validation={{
                  required: "A senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres",
                  },
                }}
                autoComplete="new-password"
              />
              <InputField
                name="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                register={register}
                error={errors.confirmPassword?.message}
                validation={{
                  required: "Confirme sua senha",
                  validate: (value) =>
                    value === password || "As senhas não coincidem",
                }}
                autoComplete="new-password"
              />
              <SubmitButton label="Avançar" />
            </form>
          </div>
        </div>
      )}

      {isDesktop && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-[100vh]"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-[600px] animate-drop flex flex-row gap-8 items-center relative h-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="text-blue-logo hover:orange-logo absolute top-6 left-4"
                onClick={() => navigate(-1)}
              >
                ← Voltar
              </button>
              <img src={logo} alt="ConectaVida" className="w-[180px] m-auto" />
            </div>

            <div className="flex flex-col items-center w-full">
              <h2 className="text-xl mb-10 text-center text-gray-muted font-montserrat">
                Cadastre sua nova senha
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full">
                <InputField
                  name="password"
                  type="password"
                  placeholder="Digite sua nova senha"
                  register={register}
                  error={errors.password?.message}
                  validation={{
                    required: "A senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres",
                    },
                  }}
                  autoComplete="new-password"
                />
                <InputField
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  register={register}
                  error={errors.confirmPassword?.message}
                  validation={{
                    required: "Confirme sua senha",
                    validate: (value) =>
                      value === password || "As senhas não coincidem",
                  }}
                  autoComplete="new-password"
                />
                <SubmitButton label="Avançar" />
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
