import logo from "../assets/images/logo_conectavida_name.png";

export const ResetPassword = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-light)] p-4">
      {/* Logo */}
      <img src={logo} alt="ConectaVida" className="w-80 mb-8" />

      {/* Texto de instrução */}
      <h2
       className="text-2xl mb-10 text-center"
       style={{
       color: "var(--color-gray-muted)",
       fontFamily: "var(--font-roboto)",
       }}
      >
      Digite seu e-mail ou número
      </h2>


      {/* Campo de entrada */}
      <input
        type="text"
        placeholder="Número de telefone ou E-mail"
        className="w-72 px-4 py-3 mb-6 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-red-secondary)]"
        style={{
          backgroundColor: "var(--color-bg-input)",
          border: `1px solid var(--color-border-input)`,
          fontFamily: "var(--font-open-sans)",
          color: "var(--color-dark)",
        }}
      />

      {/* Botão */}
      <button
        className="w-72 py-3 rounded-md font-semibold transition hover:opacity-90"
        style={{
          backgroundColor: "var(--color-red-logo)",
          color: "#fff",
          fontFamily: "var(--font-roboto)",
        }}
      >
        AVANÇAR
      </button>
    </div>
  );
};
