import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { AuthContext } from "../../../contexts/AuthContext";
import { describe, expect, it } from "vitest";

describe("DashboardLayout", () => {
  it("renders the dashboard layout with tabs", () => {
    const mockUser = { id: "123", role: "student" };

    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <MemoryRouter>
          <DashboardLayout />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Notificações/i)).toBeInTheDocument();
  });
});