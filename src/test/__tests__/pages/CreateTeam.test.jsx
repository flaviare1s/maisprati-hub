import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreateTeam } from '../../../pages/CreateTeam';

// Mock do useAuth
const mockUseAuth = vi.fn();
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock do isAdmin
const mockIsAdmin = vi.fn();
vi.mock('../../../utils/permissions', () => ({
  isAdmin: () => mockIsAdmin()
}));

// Mock da API
const mockCreateTeam = vi.fn();
vi.mock('../../../api.js/teams', () => ({
  createTeam: (...args) => mockCreateTeam(...args)
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do react-hook-form
const mockRegister = vi.fn();
const mockHandleSubmit = vi.fn();
const mockSetValue = vi.fn();
const mockFormState = { errors: {} };

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    formState: mockFormState,
    setValue: mockSetValue,
  }),
}));

// Mock dos componentes
vi.mock('../../../components/InputField', () => ({
  InputField: ({ label, name, register, error, validation, placeholder }) => (
    <div data-testid={`input-${name}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        {...(register ? register(name, validation) : {})}
        data-testid={`input-field-${name}`}
        placeholder={placeholder}
      />
      {error && <small data-testid={`error-${name}`}>{error}</small>}
    </div>
  )
}));

vi.mock('../../../components/SubmitButton', () => ({
  SubmitButton: ({ label, isLoading, disabled }) => (
    <button disabled={disabled} data-testid="submit-button">
      {isLoading ? 'Loading...' : label}
    </button>
  )
}));

// Mock dos ícones
vi.mock('react-icons/fa', () => ({
  FaArrowLeft: () => <svg data-testid="arrow-left" />,
  FaRandom: () => <svg data-testid="random-icon" />,
  FaEye: () => <svg data-testid="eye-icon" />,
  FaEyeSlash: () => <svg data-testid="eye-slash-icon" />
})); const renderComponent = () => {
  return render(
    <BrowserRouter>
      <CreateTeam />
    </BrowserRouter>
  );
};

describe('CreateTeam Component', () => {
  beforeEach(() => {
    // Reset todos os mocks
    vi.clearAllMocks();

    // Configurações padrão
    mockUseAuth.mockReturnValue({ user: { id: 'admin-1', name: 'Professor' } });
    mockIsAdmin.mockReturnValue(true);
    mockCreateTeam.mockResolvedValue({ id: 'team-1', name: 'Time Teste' });
    mockHandleSubmit.mockImplementation((callback) => (e) => {
      e?.preventDefault?.();
      return callback({
        name: 'Time Teste',
        description: 'Descrição teste',
        maxMembers: '5',
        securityCode: 'ABC123'
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Permissões', () => {
    it('deve redirecionar para /401 se o usuário não for administrador', async () => {
      mockUseAuth.mockReturnValue({ user: { id: 'student-1', name: 'Aluno' } });
      mockIsAdmin.mockReturnValue(false);

      renderComponent();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/401');
      });
    });

    it('deve renderizar o formulário se o usuário for administrador', () => {
      renderComponent();

      expect(screen.getByText('Criar Novo Time')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });
  });

  describe('Formulário', () => {
    it('deve renderizar todos os campos necessários', () => {
      renderComponent();

      expect(screen.getByTestId('input-name')).toBeInTheDocument();
      expect(screen.getByLabelText('Descrição do Time/Projeto')).toBeInTheDocument();
      expect(screen.getByLabelText(/Código de Segurança/)).toBeInTheDocument();
    });

    it('deve submeter o formulário com dados corretos', async () => {
      renderComponent();

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateTeam).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Time Teste',
            description: 'Descrição teste',
            maxMembers: 5,
            securityCode: 'ABC123'
          }),
          'admin-1'
        );
      });
    });

    it('deve redirecionar após criação bem-sucedida', async () => {
      mockCreateTeam.mockResolvedValue({ name: 'Time Criado' });

      renderComponent();

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
          state: { message: 'Time "Time Criado" criado com sucesso!' }
        });
      });
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erros da API', async () => {
      mockCreateTeam.mockRejectedValue(new Error('Erro de rede'));

      renderComponent();

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).not.toBeDisabled();
      });
    });
  });
});
