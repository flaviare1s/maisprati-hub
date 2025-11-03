import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EditProfile } from '../../../pages/EditProfile';
import * as usersApi from '../../../api.js/users';
import toast from 'react-hot-toast';

// Mock do useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do useAuth
const mockUpdateUserContext = vi.fn();
const mockLoadUserData = vi.fn();
let mockCurrentUser = {
  id: '1',
  name: 'User Test',
  email: 'user@test.com',
  type: 'student',
  whatsapp: '11999999999',
  groupClass: 'T1',
};

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockCurrentUser,
    updateUser: mockUpdateUserContext,
    loadUserData: mockLoadUserData,
  }),
}));

// Mock da API
vi.mock('../../../api.js/users', () => ({
  updateUser: vi.fn(),
  getUserById: vi.fn(),
}));

// Mock do react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock do react-hook-form
const mockRegister = vi.fn();
const mockReset = vi.fn();
const mockFormState = { errors: {} };
const mockHandleSubmit = vi.fn((callback) => (e) => {
  e?.preventDefault?.();
  return callback({
    name: 'Updated Name',
    email: 'updated@email.com',
    whatsapp: '11988888888',
    groupClass: 'T2',
  });
});

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    reset: mockReset,
    formState: mockFormState,
  }),
}));

// Mock dos componentes
vi.mock('../../../components/CustomLoader', () => ({
  CustomLoader: () => <div data-testid="custom-loader">Loading...</div>,
}));

vi.mock('../../../components/ReturnButton', () => ({
  ReturnButton: () => <button data-testid="return-button">Voltar</button>,
}));

vi.mock('../../../components/SelectField', () => ({
  SelectField: ({ label, name, register, error, options = [] }) => (
    <div data-testid={`select-${name}`}>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        {...(register ? register(name, {}) : {})}
        data-testid={`select-field-${name}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <small data-testid={`error-${name}`}>{error}</small>}
    </div>
  ),
}));

vi.mock('../../../components/SubmitButton', () => ({
  SubmitButton: ({ label, disabled }) => (
    <button disabled={disabled} data-testid="submit-button" type="submit">
      {label}
    </button>
  ),
}));

const renderComponent = (userId = null) => {
  const path = userId ? `/edit-profile/${userId}` : '/edit-profile';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/edit-profile/:id?" element={<EditProfile />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/forbidden" element={<div>Forbidden</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('EditProfile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Resetar mockCurrentUser para o valor padrão
    mockCurrentUser = {
      id: '1',
      name: 'User Test',
      email: 'user@test.com',
      type: 'student',
      whatsapp: '11999999999',
      groupClass: 'T1',
    };

    usersApi.getUserById.mockResolvedValue(mockCurrentUser);
    usersApi.updateUser.mockResolvedValue({
      ...mockCurrentUser,
      name: 'Updated Name',
      email: 'updated@email.com',
    });

    // Resetar mock do handleSubmit
    mockHandleSubmit.mockImplementation((callback) => (e) => {
      e?.preventDefault?.();
      return callback({
        name: 'Updated Name',
        email: 'updated@email.com',
        whatsapp: '11988888888',
        groupClass: 'T2',
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização e Loading', () => {
    it('deve renderizar o formulário após carregar os dados do próprio usuário', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Editar Meu Perfil')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Nome Completo *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email *')).toBeInTheDocument();
      expect(screen.getByLabelText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('Turma')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('deve exibir mensagem se o usuário não for encontrado', async () => {
      usersApi.getUserById.mockRejectedValueOnce(new Error('Usuário não encontrado'));

      renderComponent('999');

      await waitFor(() => {
        expect(screen.getByText('Usuário não encontrado')).toBeInTheDocument();
      });
    });
  });

  describe('Edição de Perfil Próprio', () => {
    it('deve carregar e preencher os dados do usuário atual', async () => {
      renderComponent();

      await waitFor(() => {
        expect(mockReset).toHaveBeenCalledWith({
          name: mockCurrentUser.name,
          email: mockCurrentUser.email,
          whatsapp: mockCurrentUser.whatsapp,
          groupClass: mockCurrentUser.groupClass,
        });
      });
    });

    it('deve atualizar o perfil com sucesso', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(usersApi.updateUser).toHaveBeenCalledWith('1', {
          name: 'Updated Name',
          email: 'updated@email.com',
          whatsapp: '11988888888',
          groupClass: 'T2',
        });
      });

      expect(mockUpdateUserContext).toHaveBeenCalled();
      expect(mockLoadUserData).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Perfil atualizado com sucesso!');
    });
  });

  describe('Edição de Perfil de Outro Usuário (Admin)', () => {
    it('deve redirecionar para /forbidden se não for admin', async () => {
      mockCurrentUser.type = 'student';

      renderComponent('2');

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/forbidden');
      });
    });
  });

  describe('Validação e Campos Condicionais', () => {
    it('deve exibir campos de WhatsApp e Turma apenas para estudantes', async () => {
      mockCurrentUser.type = 'student';

      renderComponent();

      await waitFor(() => {
        expect(screen.getByLabelText('WhatsApp')).toBeInTheDocument();
        expect(screen.getByText('Turma')).toBeInTheDocument();
      });
    });

    it('não deve exibir campos de WhatsApp e Turma para não estudantes', async () => {
      mockCurrentUser.type = 'admin';

      const adminUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@test.com',
        type: 'admin'
      };

      usersApi.getUserById.mockResolvedValueOnce(adminUser);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Editar Meu Perfil')).toBeInTheDocument();
      });

      expect(screen.queryByLabelText('WhatsApp')).not.toBeInTheDocument();
      expect(screen.queryByText('Turma')).not.toBeInTheDocument();
    });

    it('deve exibir aviso sobre atualização de email', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Atenção, ao atualizar seu email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve exibir erro 400 com mensagem personalizada', async () => {
      usersApi.updateUser.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { error: 'Dados inválidos' },
        },
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Dados inválidos');
      });
    });

    it('deve exibir erro 403 para falta de permissão', async () => {
      usersApi.updateUser.mockRejectedValueOnce({
        response: { status: 403 },
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Você não tem permissão para editar este perfil');
      });
    });

    it('deve exibir erro genérico para outros erros', async () => {
      usersApi.updateUser.mockRejectedValueOnce(new Error('Erro desconhecido'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar perfil. Tente novamente.');
      });
    });
  });

  describe('Limpeza de Dados', () => {
    it('deve fazer trim dos dados antes de enviar', async () => {
      mockHandleSubmit.mockImplementationOnce((callback) => (e) => {
        e?.preventDefault?.();
        return callback({
          name: '  Updated Name  ',
          email: '  updated@email.com  ',
          whatsapp: '  11988888888  ',
          groupClass: 'T2',
        });
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(usersApi.updateUser).toHaveBeenCalledWith('1', {
          name: 'Updated Name',
          email: 'updated@email.com',
          whatsapp: '11988888888',
          groupClass: 'T2',
        });
      });
    });

    it('deve enviar whatsapp como null se estiver vazio', async () => {
      mockHandleSubmit.mockImplementationOnce((callback) => (e) => {
        e?.preventDefault?.();
        return callback({
          name: 'Updated Name',
          email: 'updated@email.com',
          whatsapp: '',
          groupClass: 'T2',
        });
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(usersApi.updateUser).toHaveBeenCalledWith('1', {
          name: 'Updated Name',
          email: 'updated@email.com',
          whatsapp: null,
          groupClass: 'T2',
        });
      });
    });
  });
});
