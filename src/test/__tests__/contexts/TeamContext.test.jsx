import { render, screen, waitFor } from "@testing-library/react";
import { TeamProvider, useTeam } from "../../../contexts/TeamContext";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../contexts/AuthContext";

const mockIsUserInActiveTeam = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("../../../api/teams", () => ({
  isUserInActiveTeam: (...args) => mockIsUserInActiveTeam(...args),
}));

vi.mock("../../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

const TestConsumer = () => {
  const { userInTeam } = useTeam();
  return (
    <div data-testid="team-status">
      {userInTeam ? "IN_TEAM" : "NO_TEAM"}
    </div>
  );
};

const MockAuthWrapper = ({ user, children }) => (
  <AuthContext.Provider value={{ user }}>
    {children}
  </AuthContext.Provider>
);

describe("TeamProvider - Testes de Lógica de Contexto", () => {
  const USER_LOGGED_IN = { id: "u123", name: "Test User" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve ser inicializado como NO_TEAM quando o usuário está deslogado", () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(
      <MockAuthWrapper user={null}>
        <TeamProvider>
          <TestConsumer />
        </TeamProvider>
      </MockAuthWrapper>
    );

    expect(screen.getByTestId("team-status")).toHaveTextContent("NO_TEAM");
    expect(mockIsUserInActiveTeam).not.toHaveBeenCalled();
  });

  it("deve retornar IN_TEAM quando API retorna true", async () => {
    mockUseAuth.mockReturnValue({ user: USER_LOGGED_IN });
    mockIsUserInActiveTeam.mockResolvedValue(true);

    render(
      <MockAuthWrapper user={USER_LOGGED_IN}>
        <TeamProvider>
          <TestConsumer />
        </TeamProvider>
      </MockAuthWrapper>
    );

    await waitFor(() => {
      expect(mockIsUserInActiveTeam).toHaveBeenCalledWith("u123");
      expect(screen.getByTestId("team-status")).toHaveTextContent("IN_TEAM");
    });
  });

  it("deve retornar NO_TEAM quando API retorna false", async () => {
    mockUseAuth.mockReturnValue({ user: USER_LOGGED_IN });
    mockIsUserInActiveTeam.mockResolvedValue(false);

    render(
      <MockAuthWrapper user={USER_LOGGED_IN}>
        <TeamProvider>
          <TestConsumer />
        </TeamProvider>
      </MockAuthWrapper>
    );

    await waitFor(() => {
      expect(mockIsUserInActiveTeam).toHaveBeenCalledWith("u123");
      expect(screen.getByTestId("team-status")).toHaveTextContent("NO_TEAM");
    });
  });

  it("deve logar erro e retornar NO_TEAM quando API falha", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });
    mockUseAuth.mockReturnValue({ user: USER_LOGGED_IN });
    mockIsUserInActiveTeam.mockRejectedValue(new Error("DB connection failed"));

    render(
      <MockAuthWrapper user={USER_LOGGED_IN}>
        <TeamProvider>
          <TestConsumer />
        </TeamProvider>
      </MockAuthWrapper>
    );

    await waitFor(() => {
      expect(mockIsUserInActiveTeam).toHaveBeenCalled();
      expect(screen.getByTestId("team-status")).toHaveTextContent("NO_TEAM");
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });
});
