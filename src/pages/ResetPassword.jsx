import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import { InputField } from "../components/InputField";
import { SubmitButton } from "../components/SubmitButton";
import { forgotPassword } from "../api/auth";
import toast from "react-hot-toast";

export const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      toast.success("Email enviado! Verifique sua caixa de entrada.");
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast.error("Não foi possível enviar o email. Tente novamente.");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center m-auto w-full p-4">

      {!isDesktop && (
        <div className="flex flex-col items-center w-full max-w-sm">
          <button
            type="button"
            className="text-blue-logo hover:text-orange self-start mb-4"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>

          <div className="flex flex-col items-center">
            <img src={logo} alt="ConectaVida" className="w-[180px] mb-8" />
            <div className="flex flex-col">
              <h2 className="text-xl text-center text-gray-muted font-montserrat mb-5">
                Digite seu e-mail
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full">
                <InputField
                  name="email"
                  type="email"
                  placeholder="Email"
                  register={register}
                  error={errors.email?.message}
                  validation={{
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: "Email inválido",
                    },
                  }}
                />
                <SubmitButton label="Enviar e-mail" />
              </form>
            </div>
          </div>
        </div>
      )}

      {isDesktop && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-[100vh]"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-light rounded-2xl shadow-2xl p-8 w-[600px] animate-drop flex flex-row gap-8 h-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="text-blue-logo hover:text-orange-logo self-start mb-4"
                onClick={() => navigate(-1)}
              >
                ← Voltar
              </button>
              <img src={logo} alt="ConectaVida" className="w-[180px] m-auto" />
            </div>

            <div className="flex flex-col items-center w-full m-auto">


              <h2 className="text-xl mb-10 text-center text-gray-muted font-montserrat">
                Digite seu e-mail
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full">
                <InputField
                  name="email"
                  type="email"
                  placeholder="Email"
                  register={register}
                  error={errors.email?.message}
                  validation={{
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: "Email inválido",
                    },
                  }}
                />
                <SubmitButton label="Enviar e-mail" />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
