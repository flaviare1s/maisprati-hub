import { render, screen } from "@testing-library/react";
import { ReturnButton } from "../../../components/ReturnButton";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

// 1. Mocka o hook useNavigate do react-router-dom
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

describe("ReturnButton - Testes de Interatividade", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockedNavigate.mockClear(); // Limpa chamadas entre os testes
  });

  it("deve renderizar o botão com o texto e aria-label corretos", () => {
    render(<ReturnButton />);

    // 1. Verifica se o botão está presente usando o texto visível (inclui a seta)
    const buttonElement = screen.getByRole("button", { name: /Voltar/i });
    expect(buttonElement).toBeInTheDocument();

    // 2. Verifica se o aria-label está correto (crucial para acessibilidade)
    expect(buttonElement).toHaveAttribute("aria-label", "Voltar");

    // 3. Verifica o texto visível (inclui a seta &larr;)
    expect(buttonElement).toHaveTextContent("← Voltar");
  });

  it("deve chamar navigate(-1) ao ser clicado", async () => {
    render(<ReturnButton />);

    const buttonElement = screen.getByRole("button", { name: "Voltar" });

    // Simula o clique
    await user.click(buttonElement);

    // Verifica se a função navigate foi chamada
    expect(mockedNavigate).toHaveBeenCalledTimes(1);

    // Verifica se foi chamada com o argumento -1 (voltar uma página)
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});
