import { render, screen } from "@testing-library/react";
import { Footer } from "../../../components/Footer";
import { describe, expect, it } from "vitest";

describe("Footer - Testes de Componente", () => {

  it("deve renderizar a logo e o texto descritivo corretamente", () => {
    // Renderiza o componente Footer
    render(<Footer />);

    // 1. Verifica se a logo está presente e possui o alt text correto
    const logoImage = screen.getByAltText("Logo-+praTiHub");
    expect(logoImage).toBeInTheDocument();

    // 2. Verifica se o texto principal sobre a plataforma está visível
    expect(
      screen.getByText(/\+praTiHub foi criada para o gerenciamento dos projetos/i)
    ).toBeInTheDocument();
  });

  it("deve renderizar todos os links de redes sociais e e-mail com atributos corretos", () => {
    render(<Footer />);

    // Mapeamento dos links esperados
    const linksData = [
      {
        name: /e-mail/i,
        href: "mailto:maisprati.hub@gmail.com",
        iconTestId: "MdOutlineMail"
      },
      {
        name: /linkedin/i,
        href: "https://www.linkedin.com/search/results/all",
        iconTestId: "FaLinkedin"
      },
      {
        name: /instagram/i,
        href: "https://www.instagram.com/maisprati",
        iconTestId: "FaInstagram"
      },
      {
        name: /facebook/i,
        href: "https://www.facebook.com/maispratioficial",
        iconTestId: "FaFacebook"
      },
      {
        name: /youtube/i,
        href: "https://www.youtube.com/@maispraTI",
        iconTestId: "FaYoutube"
      },
    ];

    // Verifica cada link
    linksData.forEach(link => {
      // Usamos getByRole('link') e then testamos o href
      const aElement = screen.getByRole('link', { name: link.name, hidden: true });

      // Asserção 1: O elemento 'a' (link) existe
      expect(aElement).toBeInTheDocument();

      // Asserção 2: O atributo href (URL) está correto (usando toContain para URLs longas)
      expect(aElement).toHaveAttribute('href', expect.stringContaining(link.href));

      // Asserção 3: Verifica se o link é externo (target='_blank') e seguro (rel="noopener noreferrer")
      if (link.href.startsWith('http')) {
        expect(aElement).toHaveAttribute('target', '_blank');
        expect(aElement).toHaveAttribute('rel', 'noopener noreferrer');
      }

      // Asserção 4: Verifica a presença do ícone (Não testamos o ícone SVG diretamente, mas sua acessibilidade)
      // Nota: No seu componente, os ícones não têm nome acessível, mas como são envoltos pela tag <a>, 
      // o nome do link serve como nome acessível para a âncora.
    });

    // Testa a contagem total de botões/links (1 de Enviar Notificação + 5 de Footer = 6)
    // No seu componente, só temos os 5 links no footer e nenhum outro botão no HTML fornecido, 
    // então verificamos que 5 links de navegação estão presentes.
    const allLinks = screen.getAllByRole('link', { hidden: true });
    expect(allLinks.length).toBe(5);

  });

  it("deve garantir que o texto do corpo da plataforma seja legível", () => {
    render(<Footer />);

    const paragraph = screen.getByText(/Plataforma desenvolvida por alunos para alunos/i);
    expect(paragraph).toHaveClass('text-sm'); // Verifica o tamanho da fonte (legibilidade)
    expect(paragraph.textContent.length).toBeGreaterThan(100); // Verifica se o texto é substancial
  });

});
