import { render, screen } from "@testing-library/react";
import { FaqItem } from "../../../components/FaqItem";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { Zap } from "lucide-react"; // Importa um ícone de exemplo

describe("FaqItem - Testes de Interatividade", () => {
  const mockQuestion = "Qual é o prazo final do projeto?";
  const mockAnswer = "O prazo final é 30 de Dezembro.";

  // CORREÇÃO: Cria um matcher que corresponde à Pergunta E a Seta,
  // ignorando os espaços e caracteres adicionais que o navegador insere.
  const createButtonMatcher = (text) => new RegExp(text + '.*▼', 'i');

  it("deve renderizar a pergunta e o ícone, e a resposta deve estar oculta inicialmente", () => {
    render(
      <FaqItem
        question={mockQuestion}
        answer={mockAnswer}
        icon={<Zap data-testid="faq-icon" />} // Adiciona data-testid para o ícone
      />
    );

    // 1. Verifica a presença da pergunta
    expect(screen.getByText(mockQuestion)).toBeInTheDocument();

    // 2. Verifica a presença do ícone de forma acessível
    expect(screen.getByTestId("faq-icon")).toBeInTheDocument();

    // 3. Verifica que a resposta NÃO está no DOM (estado inicial `isOpen: false`)
    expect(screen.queryByText(mockAnswer)).not.toBeInTheDocument();

    // 4. Verifica a presença do botão de toggle usando o nome completo (regex flexível)
    expect(screen.getByRole('button', { name: createButtonMatcher(mockQuestion) })).toBeInTheDocument();
  });

  it("deve mostrar a resposta após clicar no botão (abrir)", async () => {
    render(
      <FaqItem
        question={mockQuestion}
        answer={mockAnswer}
        icon={<Zap />}
      />
    );
    const user = userEvent.setup();
    // Usa o novo matcher
    const toggleButton = screen.getByRole('button', { name: createButtonMatcher(mockQuestion) });

    // Clica para ABRIR
    await user.click(toggleButton);

    // 1. Verifica que a resposta AGORA está visível
    expect(screen.getByText(mockAnswer)).toBeInTheDocument();

    // 2. Verifica se o ícone de seta girou (rotate-180)
    const arrowSpan = screen.getByText('▼').closest('span'); // Procura pelo caractere da seta
    expect(arrowSpan).toHaveClass('rotate-180');
  });

  it("deve ocultar a resposta após clicar novamente (fechar)", async () => {
    render(
      <FaqItem
        question={mockQuestion}
        answer={mockAnswer}
        icon={<Zap />}
      />
    );
    const user = userEvent.setup();
    // Usa o novo matcher
    const toggleButton = screen.getByRole('button', { name: createButtonMatcher(mockQuestion) });

    // 1. Clica para ABRIR
    await user.click(toggleButton);
    expect(screen.getByText(mockAnswer)).toBeInTheDocument();

    // 2. Clica novamente para FECHAR
    await user.click(toggleButton);

    // 3. Verifica que a resposta NÃO está mais no DOM
    expect(screen.queryByText(mockAnswer)).not.toBeInTheDocument();

    // 4. Verifica se o ícone de seta voltou ao normal
    const arrowSpan = screen.getByText('▼').closest('span');
    expect(arrowSpan).not.toHaveClass('rotate-180');
  });
});
