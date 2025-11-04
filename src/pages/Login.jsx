import { useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import { SocialLoginButton } from "../components/SocialLoginButton";
import { SubmitButton } from "../components/SubmitButton";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import bg from "../assets/images/about-img1.png";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { PasswordField } from "../components/PasswordField";

export const Login = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password
      });

      toast.success("Login realizado com sucesso!");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Email ou senha inválidos");
      } else {
        toast.error("Erro ao conectar com o servidor");
      }
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-center md:mx-10 lg:mx-0 m-auto px-4">
      <div className="max-w-[600px]">
        <img className="hidden lg:block w-full" src={bg} alt="" />
      </div>
      <div className="w-full p-4 flex flex-col items-center justify-center rounded-2xl md:shadow-2xl sm:w-[400px] md:bg-light">
        <div className="flex items-center justify-center w-[180px]">
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
          <PasswordField
            name="password"
            placeholder="Senha"
            label="Senha *"
            register={register}
            error={errors.password?.message}
            requireStrong={false}
            validation={{
              required: "Senha é obrigatória"
            }}
          />
          <div className="mt-5">
            <SubmitButton label="Entrar" aria-label="Entrar no sistema" />
          </div>
        </form>
        <div className="w-full mt-4">
          <SocialLoginButton provider="google" aria-label="Entrar com Google" />
          <SocialLoginButton provider="github" aria-label="Entrar com GitHub" />
        </div>
        <Link
          to="/register"
          aria-label="Cadastrar"
          className="block text-center font-medium text-sm py-2 px-4 rounded-md transition-colors duration-75 font-montserrat focus:outline-none focus:shadow-outline w-full cursor-pointer mt-5 bg-orange-logo text-text-secondary shadow hover:bg-orange-400 uppercase hover:text-light"
        >
          Cadastre-se
        </Link>
        <Link
          to="/reset-password"
          aria-label="Esqueci minha senha"
          className="text-center text-sm text-red-primary font-bold hover:text-red-secondary mt-5 block"
        >
          Esqueci minha senha
        </Link>
      </div>
    </div>
  );
};
