import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo_conectavida_name.png";
import { InputField } from "../components/InputField";

export const NewPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = (data) => {
    // Substitua este console.log por uma requisição real ao backend
    console.log("Nova senha cadastrada:", data.password);
    navigate("/login"); // redireciona para o login após cadastrar
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Logo */}
      <img src={logo} alt="ConectaVida" className="w-80 mb-8" />

      {/* Texto de instrução */}
      <h2 className="text-2xl mb-10 text-center text-gray-500 font-roboto">
        Cadastre sua nova senha.
      </h2>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        {/* Nova senha */}
        <InputField
          name="password"
          type="password"
          placeholder="Nova senha"
          className="w-72"
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

        {/* Confirmar senha */}
        <InputField
          name="confirmPassword"
          type="password"
          placeholder="Confirme sua senha"
          className="w-72"
          register={register}
          error={errors.confirmPassword?.message}
          validation={{
            required: "Confirme sua senha",
            validate: (value) =>
              value === password || "As senhas não coincidem",
          }}
          autoComplete="new-password"
        />

        {/* Botão */}
        <button
          type="submit"
          className="w-72 py-3 rounded-md font-semibold bg-red-700 text-white hover:opacity-90 transition-all cursor-pointer"
        >
          SALVAR NOVA SENHA
        </button>
      </form>
    </div>
  );
};
