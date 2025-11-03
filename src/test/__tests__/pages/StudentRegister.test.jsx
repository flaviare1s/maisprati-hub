import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StudentRegister } from '../../../pages/StudentRegister';

// Mock do useNavigate
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

// Mock do react-hook-form
// Configuração padrão para o handleSubmit
const mockRegister = vi.fn();
const mockSetValue = vi.fn();
const mockFormState = { errors: {} };
const mockHandleSubmit = vi.fn((callback) => (e) => {
  e?.preventDefault?.();
  return callback({
    name: 'Nome Teste',
    email: 'email@teste.com',
    password: 'password123',
    whatsapp: '(11) 98765-4321',
    groupClass: 'T1',
    hasGroup: 'sim',
    wantsGroup: 'nao',
    type: 'STUDENT',
  });
});

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
  InputField: ({ label, name, register, error, validation, placeholder, type, disabled = false, options = [] }) => {
    if (type === 'radio') {
      return (
        <div data-testid={`input-${name}`}>
          <label htmlFor={name}>{label}</label>
          {options.map(option => (
            <input
              key={option.value}
              type="radio"
              value={option.value}
              data-testid={`radio-${name}-${option.value}`}
              {...(register ? register(name, validation) : {})}
            />
          ))}
          {error && <small data-testid={`error-${name}`}>{error}</small>}
        </div>
      );
    }
    return (
      <div data-testid={`input-${name}`}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          type={type}
          disabled={disabled}
          {...(register ? register(name, validation) : {})}
          data-testid={`input-field-${name}`}
          placeholder={placeholder}
        />
        {error && <small data-testid={`error-${name}`}>{error}</small>}
      </div>
    );
  }
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
  )
}));

vi.mock('../../../components/SubmitButton', () => ({
  SubmitButton: ({ label, disabled }) => (
    <button disabled={disabled} data-testid="submit-button" type="submit">
      {label}
    </button>
  )
}));

vi.mock('../assets/images/logo.png', () => ({
  default: 'logo-mock.png',
}));

const renderComponent = (path = '/') => {
  mockUseLocation.mockReturnValue({
    pathname: '/',
    search: path.includes('?') ? path.substring(path.indexOf('?')) : '',
    hash: '',
    state: null,
    key: 'default',
  });

  return render(
    <MemoryRouter initialEntries={[path]}>
      <StudentRegister />
    </MemoryRouter>
  );
};

describe('StudentRegister Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização e Campos', () => {
    it('deve renderizar o formulário e o link para login', () => {
      renderComponent();

      expect(screen.getByText('Nome Completo *')).toBeInTheDocument();
      expect(screen.getByText('E-mail *')).toBeInTheDocument();
      expect(screen.getByText('Senha *')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp *')).toBeInTheDocument();
      expect(screen.getByText('Turma')).toBeInTheDocument();
      expect(screen.getByText('Já possui grupo? *')).toBeInTheDocument();
      expect(screen.getByText('Deseja trabalhar em grupo? *')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Já tem conta\? Acesse aqui/i })).toBeInTheDocument();
    });
  });

  describe('Pré-preenchimento de Dados (Social Login)', () => {
    it('deve preencher os campos de nome e e-mail se houver parâmetros na URL', () => {
      const socialName = 'User Social';
      const socialEmail = 'user@social.com';
      renderComponent(`/?name=${socialName}&email=${socialEmail}`);

      expect(mockSetValue).toHaveBeenCalledWith('name', socialName);
      expect(mockSetValue).toHaveBeenCalledWith('email', socialEmail);

      expect(screen.getByTestId('input-field-name')).toHaveAttribute('disabled');
      expect(screen.getByTestId('input-field-email')).toHaveAttribute('disabled');
    });

    it('não deve preencher se não houver parâmetros na URL', () => {
      renderComponent('/');
      expect(mockSetValue).not.toHaveBeenCalled();
      expect(screen.getByTestId('input-field-name')).not.toHaveAttribute('disabled');
      expect(screen.getByTestId('input-field-email')).not.toHaveAttribute('disabled');
    });
  });

  describe('Submissão do Formulário', () => {
    it('deve chamar o handleSubmit e navegar para /warname com os dados limpos e formatados', async () => {
      renderComponent();

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalled();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/warname', {
        state: {
          name: 'Nome Teste',
          email: 'email@teste.com',
          password: 'password123',
          whatsapp: '11987654321',
          groupClass: 'T1',
          hasGroup: true,
          wantsGroup: false,
          type: 'STUDENT',
        },
      });
    });

    it('deve limpar corretamente o número de WhatsApp', async () => {
      mockHandleSubmit.mockImplementationOnce((callback) => (e) => {
        e?.preventDefault?.();
        return callback({
          name: 'Nome',
          email: 'e@mail.com',
          password: 'pass',
          whatsapp: ' +55 (21) 9999-0000 ',
          groupClass: 'T2',
          hasGroup: 'nao',
          wantsGroup: 'sim',
          type: 'STUDENT',
        });
      });

      renderComponent();
      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          '/warname',
          expect.objectContaining({
            state: expect.objectContaining({
              whatsapp: '552199990000',
              hasGroup: false,
              wantsGroup: true,
            }),
          })
        );
      });
    });
  });
});
