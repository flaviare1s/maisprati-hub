import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../../../contexts/AuthContext';
import { useContext } from 'react';
import { mockUsers } from '../../utils/mock-data';

// Mock do localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock do navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock das APIs
vi.mock('../../../api.js/teams', () => ({
  getTeamWithMembers: vi.fn()
}));

vi.mock('../../../api.js/auth', () => ({
  loginUser: vi.fn(),
  decodeJWT: vi.fn(() => ({ exp: Date.now() / 1000 + 3600 })) // Token válido por 1 hora
}));

vi.mock('../../../api.js/users', () => ({
  getCurrentUserData: vi.fn()
}));

// Componente de teste para acessar o contexto
const TestComponent = () => {
  const auth = useContext(AuthContext);
  return (
    <div>
      <div data-testid="user">{auth?.user ? JSON.stringify(auth.user) : 'null'}</div>
      <div data-testid="authenticated">{auth?.user ? 'true' : 'false'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('deve inicializar com usuário não autenticado', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('deve carregar usuário do localStorage na inicialização', () => {
    const storedUser = JSON.stringify(mockUsers[0]);
    mockLocalStorage.getItem.mockReturnValue(storedUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });
});