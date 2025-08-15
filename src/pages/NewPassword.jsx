import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo_conectavida_name.png";
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

  const onSubmit = (data) => {
    console.log("Nova senha cadastrada:", data.password);
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-12 font-roboto">
      {/* Logo */}
      <img src={logo} alt="ConectaVida" className="w-80 mb-8" />

      {/* Texto de instrução */}
      <h2 className="text-2xl font-semibold mb-10 text-center text-[var(--color-gray-muted)]">
        Cadastre sua nova senha.
      </h2>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-6"
      >
        {/* Nova senha */}
        <div className="flex flex-col w-72">
          <label
            htmlFor="password"
            className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]"
          >
            Digite sua nova senha
          </label>
          <InputField
            name="password"
            type="password"
            placeholder="Digite sua nova senha"
            className="placeholder:text-gray-400 rounded-md border px-3 py-2 bg-[var(--color-bg-input)] border-[var(--color-border-input)]"
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
        </div>

        {/* Confirmar senha */}
        <div className="flex flex-col w-72">
          <label
            htmlFor="confirmPassword"
            className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]"
          >
            Confirme sua senha
          </label>
          <InputField
            name="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            className="placeholder:text-gray-400 rounded-md border px-3 py-2 bg-[var(--color-bg-input)] border-[var(--color-border-input)]"
            register={register}
            error={errors.confirmPassword?.message}
            validation={{
              required: "Confirme sua senha",
              validate: (value) =>
                value === password || "As senhas não coincidem",
            }}
            autoComplete="new-password"
          />
        </div>

        {/* Botão reutilizável */}
        <SubmitButton className="w-72" label="Avançar" />
      </form>
    </div>
  );
};
