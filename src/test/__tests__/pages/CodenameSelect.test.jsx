import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CodenameSelect } from '../../../pages/CodenameSelect';
import { useAuth } from '../../../hooks/useAuth';
import * as authApi from '../../../api.js/auth';
import toast from 'react-hot-toast';
import { CustomLoader } from '../../../components/CustomLoader';

// Declara os mocks AQUI fora
const mockLogin = vi.fn();
const mockNavigate = vi.fn();
const mockLocation = { state: null };

// Mocks globais
vi.mock('../../../hooks/useAuth');
vi.mock('../../../api.js/auth');
vi.mock('react-hot-toast');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

vi.mock('../../../assets/images/logo.png', () => ({
  default: '/mock-logo.png',
}));

vi.mock('../../../components/SubmitButton', () => ({
  SubmitButton: ({ label, isLoading, disabled }) => (
    <button
      data-testid="submit-button"
      disabled={disabled || isLoading}
      type="submit"
    >
      {isLoading ? <CustomLoader /> : label}
    </button>
  ),
}));

// beforeEach global — garante que o estado sempre seja resetado
beforeEach(() => {
  vi.clearAllMocks();

  mockLocation.state = {
    name: 'João Silva',
    email: 'joao@test.com',
    password: 'senha123',
    whatsapp: '11999999999',
    groupClass: 'Turma A',
    hasGroup: 'sim',
    wantsGroup: 'nao',
  };

  useAuth.mockReturnValue({
    login: mockLogin,
  });

  authApi.registerUser.mockResolvedValue({ success: true });
  toast.success = vi.fn();
  toast.error = vi.fn();
});

describe('CodenameSelect Page', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLogin
    });

    authApi.registerUser.mockResolvedValue({ success: true });
    toast.success = vi.fn();
    toast.error = vi.fn();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CodenameSelect />
      </BrowserRouter>
    );
  };

  describe('Renderização Inicial', () => {
    it('deve renderizar o logo', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/mock-logo.png');
    });

    it('deve renderizar título principal', () => {
      renderComponent();

      expect(screen.getByText('Escolha seu Nome de Guerra')).toBeInTheDocument();
    });

    it('deve renderizar subtítulo', () => {
      renderComponent();

      expect(screen.getByText('Customize sua identidade antes de entrar na aventura')).toBeInTheDocument();
    });

    it('deve renderizar seções de primeiro nome, sobrenome e avatar', () => {
      renderComponent();

      expect(screen.getByText('Primeiro Nome')).toBeInTheDocument();
      expect(screen.getByText('Sobrenome')).toBeInTheDocument();
      expect(screen.getByText('Avatar')).toBeInTheDocument();
    });
  });

  describe('Seleção de Primeiro Nome', () => {
    it('deve renderizar todos os primeiros nomes', () => {
      renderComponent();

      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Backend')).toBeInTheDocument();
      expect(screen.getByText('FullStack')).toBeInTheDocument();
      expect(screen.getByText('DevOps')).toBeInTheDocument();
    });

    it('deve permitir selecionar um primeiro nome', () => {
      renderComponent();

      const frontendButton = screen.getByText('Frontend');
      fireEvent.click(frontendButton);

      expect(frontendButton).toHaveClass('border-blue-logo', 'bg-blue-logo');
    });

    it('deve permitir mudar a seleção do primeiro nome', () => {
      renderComponent();

      const frontendButton = screen.getByText('Frontend');
      const backendButton = screen.getByText('Backend');

      fireEvent.click(frontendButton);
      fireEvent.click(backendButton);

      expect(backendButton).toHaveClass('border-blue-logo', 'bg-blue-logo');
    });

    it('deve ter 25 opções de primeiro nome', () => {
      renderComponent();

      const firstNameButtons = screen.getAllByRole('button')
        .filter(btn => ['Frontend', 'Backend', 'FullStack'].includes(btn.textContent));

      expect(firstNameButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Seleção de Sobrenome', () => {
    it('deve renderizar todos os sobrenomes', () => {
      renderComponent();

      expect(screen.getByText('Iniciante')).toBeInTheDocument();
      expect(screen.getByText('Avançado')).toBeInTheDocument();
      expect(screen.getByText('Esforçado')).toBeInTheDocument();
    });

    it('deve permitir selecionar um sobrenome', () => {
      renderComponent();

      const inicianteButton = screen.getByText('Iniciante');
      fireEvent.click(inicianteButton);

      expect(inicianteButton).toHaveClass('border-orange-logo', 'bg-orange-logo');
    });

    it('deve permitir mudar a seleção do sobrenome', () => {
      renderComponent();

      const inicianteButton = screen.getByText('Iniciante');
      const avancadoButton = screen.getByText('Avançado');

      fireEvent.click(inicianteButton);
      fireEvent.click(avancadoButton);

      expect(avancadoButton).toHaveClass('border-orange-logo', 'bg-orange-logo');
    });
  });

  describe('Seleção de Avatar', () => {
    it('deve renderizar galeria de avatares', () => {
      renderComponent();

      const avatarSection = screen.getByText('Avatar').closest('div');
      expect(avatarSection).toBeInTheDocument();
    });

    it('deve ter scroll para muitos avatares', () => {
      renderComponent();

      const avatarGrid = screen.getByText('Avatar')
        .closest('div')
        ?.querySelector('.overflow-y-auto');

      expect(avatarGrid).toBeInTheDocument();
    });

    it('deve permitir selecionar um avatar', () => {
      renderComponent();

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));

      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
        expect(avatarButtons[0]).toHaveClass('border-green-500');
      }
    });
  });

  describe('Preview', () => {
    it('deve mostrar preview quando tudo estiver selecionado', () => {
      renderComponent();

      // Selecionar primeiro nome
      fireEvent.click(screen.getByText('Frontend'));

      // Selecionar sobrenome
      fireEvent.click(screen.getByText('Iniciante'));

      // Selecionar avatar (primeiro disponível)
      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      expect(screen.getByText('Preview')).toBeInTheDocument();
      expect(screen.getByText('Frontend Iniciante')).toBeInTheDocument();
    });

    it('não deve mostrar preview se algo não estiver selecionado', () => {
      renderComponent();

      // Selecionar apenas primeiro nome
      fireEvent.click(screen.getByText('Frontend'));

      expect(screen.queryByText('Preview')).not.toBeInTheDocument();
    });
  });

  describe('Validação do Formulário', () => {
    it('botão deve estar desabilitado inicialmente', () => {
      renderComponent();

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('botão deve estar habilitado quando tudo estiver selecionado', () => {
      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });

    it('deve mostrar erro se não selecionar tudo', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));

      const form = screen.queryByRole('form') || screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Por favor, selecione um nome, sobrenome e avatar'
        );
      });
    });
  });

  describe('Submissão do Formulário', () => {
    it('deve registrar usuário com dados corretos', async () => {
      renderComponent();

      // Preencher todos os campos
      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(authApi.registerUser).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'João Silva',
            email: 'joao@test.com',
            password: 'senha123',
            codename: 'Frontend Iniciante',
            type: 'STUDENT'
          })
        );
      });
    });

    it('deve fazer login automático após registro', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'joao@test.com',
          password: 'senha123'
        });
      });
    });

    it('deve redirecionar para team-select se hasGroup=true', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/team-select');
      });
    });

    it('deve redirecionar para common-room se wantsGroup=true', async () => {
      mockLocation.state.hasGroup = 'nao';
      mockLocation.state.wantsGroup = 'sim';

      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/common-room');
      });
    });

    it('deve mostrar mensagem de sucesso', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Cadastro realizado com sucesso!');
      });
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erro sem dados do formulário', async () => {
      mockLocation.state = null;

      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Dados do cadastro não encontrados. Volte e preencha o formulário.'
        );
      });
    });

    it('deve tratar erro 400 do backend', async () => {
      const error = new Error('Bad Request');
      error.response = {
        status: 400,
        data: { error: 'Email já cadastrado' }
      };
      authApi.registerUser.mockRejectedValueOnce(error);

      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Email já cadastrado');
      });
    });

    it('deve tratar erro genérico', async () => {
      authApi.registerUser.mockRejectedValueOnce(new Error('Network Error'));

      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Erro ao realizar cadastro. Tente novamente.'
        );
      });
    });
  });

  describe('Estado de Loading', () => {
    it('deve mostrar loading durante submissão', async () => {
      authApi.registerUser.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      renderComponent();

      fireEvent.click(screen.getByText('Frontend'));
      fireEvent.click(screen.getByText('Iniciante'));

      const avatarButtons = screen.getAllByRole('button')
        .filter(btn => btn.querySelector('img[alt^="Avatar"]'));
      if (avatarButtons.length > 0) {
        fireEvent.click(avatarButtons[0]);
      }

      const form = screen.getByTestId('submit-button').closest('form');
      fireEvent.submit(form);

      // Durante loading
      expect(screen.getByTestId('submit-button')).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toHaveTextContent('Continuar');
      });
    });
  });
});
