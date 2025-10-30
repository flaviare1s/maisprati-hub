import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TeacherDashboardPage } from "../../../pages/TeacherDashboardPage";
import { AuthContext } from "../../../contexts/AuthContext";
import { describe, expect, it } from "vitest";

describe("TeacherDashboardPage", () => {
  it("deve renderizar o layout do dashboard com as abas corretas", () => {
    const mockUser = { id: "1", role: "admin", codename: "Edu da Codifica" };

    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <MemoryRouter>
          <TeacherDashboardPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Edu da Codifica/i)).toBeInTheDocument();

    const adminElements = screen.getAllByText(/Administrador/i);
    expect(adminElements).toHaveLength(2);
    expect(adminElements[1]).toHaveClass("font-semibold text-blue-logo");

    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
    const timesButton = screen.getAllByText(/Times/i).find(
      (element) => element.tagName === "BUTTON" && element.classList.contains("cursor-pointer")
    );
    expect(timesButton).toBeInTheDocument();
    expect(screen.getByText(/Usuários/i)).toBeInTheDocument();
    expect(screen.getByText(/Reuniões/i)).toBeInTheDocument();
    expect(screen.getByText(/Notificações/i)).toBeInTheDocument();

    const notificationsTab = screen.getByText(/Notificações/i);
    fireEvent.click(notificationsTab);

    expect(notificationsTab).toHaveClass("border-blue-logo text-blue-logo");
  });

  it("deve renderizar uma mensagem de erro ao carregar dados do usuário", () => {
    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter>
          <TeacherDashboardPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Erro ao carregar dados do usuário/i)).toBeInTheDocument();
  });
});