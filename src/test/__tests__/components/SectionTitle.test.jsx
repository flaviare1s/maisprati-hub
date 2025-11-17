import { render, screen } from "@testing-library/react";
import { SectionTitle } from "../../../components/SectionTitle";
import { describe, expect, it } from "vitest";

describe("SectionTitle - Testes de Renderização", () => {
  const mockTitle = "TÍTULO DA SEÇÃO IMPORTANTE";
  const mockTitleLower = "título da seção importante";

  it("deve renderizar o título e aplicar as classes corretas", () => {
    // Renderiza o componente com o título
    render(
      <SectionTitle title={mockTitle} />
    );

    // 1. Verifica se o texto do título está presente
    const titleElement = screen.getByText(mockTitle);
    expect(titleElement).toBeInTheDocument();

    // 2. Verifica se o elemento é um H2 (conforme o componente)
    expect(titleElement.tagName).toBe('H2');

    // 3. Verifica a aplicação das classes de estilo (confirmando o visual)
    expect(titleElement).toHaveClass('uppercase');
    expect(titleElement).toHaveClass('bg-blue-logo');
    expect(titleElement).toHaveClass('rounded-full');
  });

  it("deve renderizar o título mesmo que seja passado em minúsculas (devido à classe uppercase)", () => {
    // Renderiza o componente com o título em minúsculas
    render(
      <SectionTitle title={mockTitleLower} />
    );

    // 1. Busca pelo texto em minúsculas (que é o que realmente está no DOM)
    const titleElement = screen.getByText(mockTitleLower, { selector: 'h2' });
    expect(titleElement).toBeInTheDocument();

    // 2. CORREÇÃO: Removemos a asserção toHaveTextContent que falhava e garantimos
    // que a classe 'uppercase' está aplicada, confirmando o efeito visual.
    expect(titleElement).toHaveClass('uppercase');
  });
});
