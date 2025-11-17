import { render, screen } from "@testing-library/react";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("ConfirmationModal - Testes de Componente", () => {
  const mockMessage = "Você tem certeza que deseja prosseguir com esta ação?";
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 1. Testes de Renderização Condicional ---

  it("NÃO deve renderizar o modal quando 'open' é falso", () => {
    render(
      <ConfirmationModal
        open={false}
        message={mockMessage}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    // O título "Confirmação" e o corpo da mensagem NÃO devem estar no DOM
    expect(screen.queryByText("Confirmação")).not.toBeInTheDocument();
    expect(screen.queryByText(mockMessage)).not.toBeInTheDocument();
  });

  it("deve renderizar o modal e exibir a mensagem correta quando 'open' é verdadeiro", () => {
    render(
      <ConfirmationModal
        open={true}
        message={mockMessage}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    // Verifica a presença do título e da mensagem
    expect(screen.getByText("Confirmação")).toBeInTheDocument();
    expect(screen.getByText(mockMessage)).toBeInTheDocument();

    // Verifica se os botões de ação estão presentes
    expect(screen.getByRole("button", { name: "NÃO" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SIM" })).toBeInTheDocument();
  });

  // --- 2. Testes de Interação ---

  it("deve chamar 'onClose' quando o botão NÃO é clicado", async () => {
    render(
      <ConfirmationModal
        open={true}
        message={mockMessage}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const noButton = screen.getByRole("button", { name: "NÃO" });
    await user.click(noButton);

    // Verifica se a função de fechar foi chamada, e a de confirmar NÃO
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("deve chamar 'onConfirm' quando o botão SIM é clicado", async () => {
    render(
      <ConfirmationModal
        open={true}
        message={mockMessage}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const yesButton = screen.getByRole("button", { name: "SIM" });
    await user.click(yesButton);

    // Verifica se a função de confirmação foi chamada, e a de fechar NÃO
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  // --- 3. Teste de Acessibilidade (Títulos dos botões) ---

  it("deve garantir que os botões tenham nomes acessíveis claros", () => {
    render(
      <ConfirmationModal
        open={true}
        message={mockMessage}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    // Verifica os nomes acessíveis dos botões de ação
    expect(screen.getByRole("button", { name: "NÃO" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SIM" })).toBeInTheDocument();
  });
});
