import { useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import { SubmitButton } from "../components/SubmitButton";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/images/logo_conectavida_name.png";


export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      navigate("/");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      
      <div className="bg-soft p-[30px] flex flex-col items-center justify-center w-[90%] sm:w-[500px] rounded-xs">
        <div className="flex items-center justify-center w-[310px]">
          <img className="w-full" src={logo} alt="Logo" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="my-4 w-full">
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

          <InputField
            name="password"
            type="password"
            placeholder="Senha"
            register={register}
            error={errors.password?.message}
            validation={{
              required: "Senha é obrigatória",
              minLength: {
                value: 6,
                message: "A senha deve ter pelo menos 6 caracteres",
              },
            }}
          />

          <SubmitButton
            label="Entrar"
            bgColor="verde-primario"
          />
          <Link to="/register" className="block text-center font-medium text-sm py-2 px-4 rounded-md transition-colors duration-75 font-inter focus:outline-none focus:shadow-outline w-full cursor-pointer mt-5 bg-bg-input text-text-secondary shadow hover:bg-bg-menu-mobile">Cadastre-se</Link>
          <Link to="/reset-password" className="text-center text-sm text-red-logo font-bold hover:text-red-secondary mt-5 block">Esqueci minha senha</Link>
        </form>
      </div>
    </div>
  );
};
