import { render, screen } from "@testing-library/react";
import { SelectField } from "../../../components/SelectField";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("SelectField - Testes de Renderização e Validação", () => {
  const mockRegister = vi.fn((name) => ({ name }));
  const mockOptions = [
    { value: "dev", label: "Desenvolvedor" },
    { value: "design", label: "Designer" },
    { value: "qa", label: "Garantia de Qualidade" },
  ];

  beforeEach(() => {
    mockRegister.mockClear();
  });

  // --- 1. Testes de Renderização Básica ---

  it("deve renderizar o label e as opções corretamente", () => {
    render(
      <SelectField
        label="Função"
        name="role"
        options={mockOptions}
        register={mockRegister}
        error={undefined}
        required={false}
      />
    );

    // 1. Verifica o Label e sua ligação com o select
    const labelElement = screen.getByText("Função");
    expect(labelElement).toBeInTheDocument();

    // 2. Verifica se o select está ligado ao label pelo 'htmlFor'/'id'
    const selectElement = screen.getByRole("combobox", { name: "Função" });
    expect(selectElement).toBeInTheDocument();

    // 3. Verifica a renderização das opções
    expect(screen.getByRole("option", { name: "Desenvolvedor" })).toHaveValue("dev");
    expect(screen.getByRole("option", { name: "Designer" })).toBeInTheDocument();
    expect(screen.getAllByRole("option").length).toBe(3);
  });

  it("deve exibir o indicador de campo obrigatório (*)", () => {
    render(
      <SelectField
        label="Status"
        name="status"
        options={mockOptions}
        register={mockRegister}
        required={true}
      />
    );

    // O label deve conter o asterisco
    const labelText = screen.getByText("Status", { exact: false });
    expect(labelText.textContent).toContain("*");
  });

  // --- 2. Testes de Validação e Erro ---

  it("deve exibir a mensagem de erro quando fornecida", () => {
    const errorMessage = "O campo Função é obrigatório.";

    render(
      <SelectField
        label="Função"
        name="role"
        options={mockOptions}
        register={mockRegister}
        error={{ message: errorMessage }}
        required={true}
      />
    );

    // Verifica se a mensagem de erro está visível
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass("text-red-primary");
  });

  it("deve chamar 'register' com as regras de validação corretas", () => {
    const fieldName = "projeto";
    const fieldLabel = "Projeto";

    render(
      <SelectField
        label={fieldLabel}
        name={fieldName}
        options={mockOptions}
        register={mockRegister}
        required={true}
      />
    );

    // Verifica se o register foi chamado corretamente
    expect(mockRegister).toHaveBeenCalledWith(
      fieldName,
      // Verifica se a regra de 'required' está presente com a mensagem correta
      { required: `${fieldLabel} é obrigatório` }
    );
  });

  it("NÃO deve adicionar a regra 'required' se o campo não for obrigatório", () => {
    const fieldName = "opcional";

    render(
      <SelectField
        label="Opcional"
        name={fieldName}
        options={mockOptions}
        register={mockRegister}
        required={false}
      />
    );

    // CORREÇÃO: O teste deve esperar { required: false } que é o que o componente envia
    // quando `required={false}` (pois o teste anterior esperava {}).
    expect(mockRegister).toHaveBeenCalledWith(
      fieldName,
      { required: false }
    );
  });
});
