import { render, screen } from "@testing-library/react";
import { AboutItemImg } from "../../../components/AboutItemImg";
import { describe, expect, it } from "vitest";

describe("AboutItemImg - Testes de Renderização", () => {
  const mockImgSrc = "/assets/img/mock-image.png";
  const mockAltText = "Imagem ilustrativa do sobre";

  it("deve renderizar a imagem com src e alt corretos", () => {
    // 1. Renderiza o componente com props mockadas
    render(
      <AboutItemImg img={mockImgSrc} alt={mockAltText} />
    );

    // 2. Busca o elemento da imagem usando o texto alternativo (alt text)
    const imageElement = screen.getByRole("img", { name: mockAltText });

    // Asserção 1: O elemento da imagem deve estar presente no documento
    expect(imageElement).toBeInTheDocument();

    // Asserção 2: O atributo 'src' deve corresponder ao mockImgSrc
    expect(imageElement).toHaveAttribute("src", mockImgSrc);

    // Asserção 3: O atributo 'alt' deve corresponder ao mockAltText (Verificado implicitamente pelo seletor, mas reconfirmado)
    expect(imageElement).toHaveAttribute("alt", mockAltText);

    // Asserção 4: Verifica se a classe CSS correta está aplicada (w-full)
    expect(imageElement).toHaveClass("w-full");
  });

  it("deve funcionar corretamente mesmo com texto alternativo vazio", () => {
    // É uma boa prática testar o caso onde o alt é fornecido como uma string vazia (comum em imagens decorativas)
    render(
      <AboutItemImg img={mockImgSrc} alt="" />
    );

    // CORREÇÃO: Usamos getByAltText("") porque imagens com alt="" perdem a função "img"
    const imageElement = screen.getByAltText("");

    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", mockImgSrc);
    expect(imageElement).toHaveAttribute("alt", "");
  });
});
