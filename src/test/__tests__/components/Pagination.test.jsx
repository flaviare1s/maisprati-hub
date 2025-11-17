import { render, screen } from "@testing-library/react";
import { Pagination } from "../../../components/Pagination";
import { describe, expect, it, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

describe("Pagination - Testes de Lógica e Interação", () => {
  const mockOnPageChange = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  // --- Cenário Base: 20 itens, 10 por página (2 páginas) ---

  const defaultProps = {
    totalItems: 20,
    itemsPerPage: 10,
    currentPage: 1,
    onPageChange: mockOnPageChange,
  };

  it("deve renderizar a página inicial (1/2) e desabilitar o botão Anterior", () => {
    render(<Pagination {...defaultProps} />);

    // 1. Verifica o indicador de página
    expect(screen.getByText("1 de 2")).toBeInTheDocument();

    // 2. Verifica o contador de itens (showCounts padrão é true)
    expect(screen.getByText("Mostrando 1-10 de 20")).toBeInTheDocument();

    // 3. Verifica o estado dos botões
    const prevButton = screen.getByRole("button", { name: /Página anterior/i });
    const nextButton = screen.getByRole("button", { name: /Próxima página/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it("deve navegar para a próxima página e chamar onPageChange", async () => {
    render(<Pagination {...defaultProps} />);

    const nextButton = screen.getByRole("button", { name: /Próxima página/i });
    await user.click(nextButton);

    // O componente pai deve ser notificado sobre a mudança para a página 2
    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("deve navegar para a página anterior e chamar onPageChange", async () => {
    // Simula a renderização na página 2
    const propsPage2 = { ...defaultProps, currentPage: 2 };
    render(<Pagination {...propsPage2} />);

    const prevButton = screen.getByRole("button", { name: /Página anterior/i });
    await user.click(prevButton);

    // O componente pai deve ser notificado sobre a mudança para a página 1
    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  // --- Cenário Final de Página ---

  it("deve renderizar a última página (2/2) e desabilitar o botão Próxima", () => {
    const propsLastPage = { ...defaultProps, currentPage: 2 };
    render(<Pagination {...propsLastPage} />);

    // 1. Verifica o indicador de página
    expect(screen.getByText("2 de 2")).toBeInTheDocument();

    // 2. Verifica o contador de itens (11-20)
    expect(screen.getByText("Mostrando 11-20 de 20")).toBeInTheDocument();

    // 3. Verifica o estado dos botões
    const prevButton = screen.getByRole("button", { name: /Página anterior/i });
    const nextButton = screen.getByRole("button", { name: /Próxima página/i });

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("NÃO deve chamar onPageChange se o botão desabilitado for clicado", async () => {
    const propsLastPage = { ...defaultProps, currentPage: 2 };
    render(<Pagination {...propsLastPage} />);

    const nextButton = screen.getByRole("button", { name: /Próxima página/i });

    // Tenta clicar no botão Próxima desabilitado
    await user.click(nextButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  // --- Cenários de Casos Limite ---

  it("deve lidar com 0 itens corretamente (exibir 'Nenhum registro')", () => {
    const propsZero = {
      totalItems: 0,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: mockOnPageChange,
    };
    render(<Pagination {...propsZero} />);

    // 1. Verifica o indicador de página (deve ser 1 de 1)
    expect(screen.getByText("1 de 1")).toBeInTheDocument();

    // 2. Verifica o contador de itens
    expect(screen.getByText("Nenhum registro")).toBeInTheDocument();

    // 3. Ambos os botões devem estar desabilitados
    expect(screen.getByRole("button", { name: /Página anterior/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Próxima página/i })).toBeDisabled();
  });

  it("NÃO deve mostrar o contador se showCounts for false", () => {
    render(<Pagination {...defaultProps} showCounts={false} />);

    expect(screen.queryByText(/Mostrando/i)).not.toBeInTheDocument();
  });

  it("deve lidar com página incompleta corretamente (ex: 22 itens, P3)", () => {
    const propsPartial = {
      totalItems: 22,
      itemsPerPage: 10,
      currentPage: 3,
      onPageChange: mockOnPageChange,
    };
    render(<Pagination {...propsPartial} />);

    // 1. Verifica o indicador (P3 de 3)
    expect(screen.getByText("3 de 3")).toBeInTheDocument();

    // 2. Verifica o contador de itens (21-22 de 22)
    expect(screen.getByText("Mostrando 21-22 de 22")).toBeInTheDocument();

    // 3. Botão Próxima deve estar desabilitado
    expect(screen.getByRole("button", { name: /Próxima página/i })).toBeDisabled();
  });
});
