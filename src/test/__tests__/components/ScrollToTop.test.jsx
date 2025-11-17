import { render } from "@testing-library/react";
import { ScrollToTop } from "../../../components/ScrollToTop";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock da função useLocation do react-router-dom
const mockUseLocation = vi.fn();
vi.mock("react-router-dom", () => ({
  useLocation: () => mockUseLocation(),
}));

describe("ScrollToTop - Testes de Efeito de Rota", () => {
  // Spy para monitorar a função window.scrollTo, que é nativa do navegador
  let scrollToSpy;

  beforeEach(() => {
    // Inicializa o spy antes de cada teste
    // Garante que o window.scrollTo real seja substituído pela nossa função mockada
    scrollToSpy = vi.spyOn(window, 'scrollTo');
    // Define o comportamento inicial para garantir que o scroll seja resetado entre os testes
    scrollToSpy.mockClear();

    // Define o estado inicial da rota
    mockUseLocation.mockReturnValue({ pathname: "/initial" });
  });

  it("deve chamar window.scrollTo ao montar o componente", () => {
    render(<ScrollToTop />);

    // Verifica que o scrollTo foi chamado na montagem (primeiro useEffect)
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("deve chamar window.scrollTo novamente quando o pathname muda", () => {
    const { rerender } = render(<ScrollToTop />);

    // 1. Chamada inicial (já verificada)
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    // 2. Simula a mudança de rota (atualizando o mock e forçando a rerenderização)
    mockUseLocation.mockReturnValue({ pathname: "/new-page" });
    rerender(<ScrollToTop />);

    // Verifica que o scrollTo foi chamado uma segunda vez (total de 2)
    expect(scrollToSpy).toHaveBeenCalledTimes(2);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });

    // 3. Simula uma terceira mudança de rota
    mockUseLocation.mockReturnValue({ pathname: "/another-page" });
    rerender(<ScrollToTop />);

    // Verifica que foi chamado pela terceira vez (total de 3)
    expect(scrollToSpy).toHaveBeenCalledTimes(3);
  });

  it("NÃO deve chamar window.scrollTo se outras propriedades de useLocation mudarem (fora pathname)", () => {
    const { rerender } = render(<ScrollToTop />);

    // 1. Chamada inicial (total 1)
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    // 2. Simula a mudança de 'search' ou 'hash', mas mantém o pathname
    mockUseLocation.mockReturnValue({ pathname: "/initial", search: "?query=1" });
    rerender(<ScrollToTop />);

    // O useEffect só deve reagir a [pathname], então a contagem deve permanecer em 1
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    // 3. Muda o pathname para confirmar que ainda funciona
    mockUseLocation.mockReturnValue({ pathname: "/final", search: "?query=2" });
    rerender(<ScrollToTop />);

    // Agora deve ter chamado novamente (total 2)
    expect(scrollToSpy).toHaveBeenCalledTimes(2);
  });
});
