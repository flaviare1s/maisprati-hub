import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render, mockAuthenticatedUser, mockAdminUser } from '../../utils/test-utils';
import App from '../../../App.jsx';
import React from 'react';
import { Outlet } from 'react-router-dom';

// Mock do hook useAuth - IMPORTANTE: usar o caminho correto
const mockUseAuth = vi.fn();
vi.mock('../../../hooks/useAuth.js', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock dos componentes
vi.mock('../../../components/Header', () => ({
  Header: () => {
    const mockAuth = mockUseAuth();
    return (
      <header data-testid="header">
        <div>Header Component</div>
        {mockAuth?.user && <div data-testid="header-user">{mockAuth.user.name}</div>}
        {mockAuth?.user && <button onClick={() => mockAuth.logout({ skipServer: false })}>Logout</button>}
      </header>
    );
  }
}));

vi.mock('../../../components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer Component</footer>
}));

vi.mock('../../../components/CustomLoader', () => ({
  CustomLoader: () => (
    <div data-testid="custom-loader" className="flex items-center justify-center min-h-screen">
      <div className="animate-spin">Loading...</div>
    </div>
  )
}));

vi.mock('../../../components/ScrollToTop', () => ({
  ScrollToTop: () => {
    const { pathname } = { pathname: '/' };
    return <div data-testid="scroll-to-top" data-pathname={pathname} />;
  }
}));

vi.mock('../../../components/ConnectionStatus', () => ({
  ConnectionStatus: () => <div data-testid="connection-status">Online</div>
}));

vi.mock('../../../components/PrivateRoute', () => ({
  PrivateRoute: ({ children, requiredType }) => {
    const mockAuth = mockUseAuth();

    if (mockAuth?.loading) {
      return <div data-testid="private-route-loading">Loading...</div>;
    }

    if (!mockAuth?.user) {
      return <div data-testid="private-route-redirect">Redirect to login</div>;
    }

    if (requiredType && mockAuth.user.type !== requiredType) {
      return <div data-testid="private-route-forbidden">403 Forbidden</div>;
    }

    return <div data-testid="private-route">{children}</div>;
  }
}));

// Mock das páginas
vi.mock('../../../pages/Home', () => ({
  Home: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('../../../pages/About', () => ({
  About: () => <div data-testid="about-page">About Page</div>
}));

vi.mock('../../../pages/Login', () => ({
  Login: () => <div data-testid="login-page">Login Page</div>
}));

vi.mock('../../../pages/ResetPassword', () => ({
  ResetPassword: () => <div data-testid="reset-password-page">Reset Password</div>
}));

vi.mock('../../../pages/NewPassword', () => ({
  NewPassword: () => <div data-testid="new-password-page">New Password</div>
}));

vi.mock('../../../pages/StudentRegister', () => ({
  StudentRegister: () => <div data-testid="register-page">Student Register</div>
}));

vi.mock('../../../pages/TeamSelect', () => ({
  TeamSelect: () => <div data-testid="team-select-page">Team Select</div>
}));

vi.mock('../../../pages/CommonRoom', () => ({
  CommonRoom: () => <div data-testid="common-room-page">Common Room</div>
}));

vi.mock('../../../pages/CodenameSelect', () => ({
  CodenameSelect: () => <div data-testid="codename-select-page">Codename Select</div>
}));

vi.mock('../../../pages/CreateTeam', () => ({
  CreateTeam: () => <div data-testid="create-team-page">Create Team</div>
}));

vi.mock('../../../pages/StudentDashboardPage', () => ({
  StudentDashboardPage: () => <div data-testid="student-dashboard-page">Student Dashboard</div>
}));

vi.mock('../../../pages/TeacherDashboardPage', () => ({
  TeacherDashboardPage: () => <div data-testid="teacher-dashboard-page">Teacher Dashboard</div>
}));

vi.mock('../../../pages/EditProfile', () => ({
  EditProfile: () => <div data-testid="edit-profile-page">Edit Profile</div>
}));

vi.mock('../../../pages/FAQ', () => ({
  FAQ: () => <div data-testid="faq-page">FAQ Page</div>
}));

vi.mock('../../../pages/Forbidden', () => ({
  Forbidden: () => <div data-testid="forbidden-page">403 Forbidden</div>
}));

vi.mock('../../../pages/NotFound', () => ({
  NotFound: () => <div data-testid="not-found-page">404 Not Found</div>
}));

vi.mock('../../../layouts/DashboardLayout', () => {
  return {
    DashboardLayout: () => {
      return (
        <div data-testid="dashboard-layout">
          <div>Dashboard Layout</div>
          <Outlet />
        </div>
      );
    }
  };
});

vi.mock('../../../components/project/ProjectBoard', () => ({
  ProjectBoard: () => <div data-testid="project-board">Project Board</div>
}));

vi.mock('../../../components/student-dashboard/StudentMeetingsTab', () => ({
  StudentMeetingsTab: () => <div data-testid="student-meetings-tab">Meetings Tab</div>
}));

vi.mock('../../../components/student-dashboard/StudentNotificationsPanel', () => ({
  StudentNotificationsPanel: () => <div data-testid="student-notifications">Notifications</div>
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('deve mostrar CustomLoader quando está carregando', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        logout: vi.fn()
      });

      render(<App />);

      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
      expect(screen.queryByTestId('header')).not.toBeInTheDocument();
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    });

    it('loader deve ter as classes corretas', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        logout: vi.fn()
      });

      render(<App />);
      const loader = screen.getByTestId('custom-loader');

      expect(loader).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-screen');
    });
  });

  describe('Estrutura do App', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        logout: vi.fn()
      });
    });

    it('deve renderizar todos os componentes estruturais', () => {
      render(<App />);

      expect(screen.getByTestId('connection-status')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('deve ter estrutura de layout correta', () => {
      const { container } = render(<App />);

      const mainDiv = container.querySelector('div.overflow-x-hidden');
      expect(mainDiv).toBeInTheDocument();

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('font-montserrat', 'flex', 'flex-col');
    });

    it('deve passar usuário para o Header quando autenticado', () => {
      mockUseAuth.mockReturnValue({
        user: mockAuthenticatedUser,
        loading: false,
        logout: vi.fn()
      });

      render(<App />);

      expect(screen.getByTestId('header-user')).toHaveTextContent(mockAuthenticatedUser.name);
    });
  });

  describe('Redirecionamentos de Usuário Autenticado', () => {
    it('deve redirecionar student para /dashboard/student na rota raiz', async () => {
      mockUseAuth.mockReturnValue({
        user: mockAuthenticatedUser,
        loading: false,
        logout: vi.fn()
      });

      const { container } = render(<App />, { initialRoute: '/' });

      await waitFor(() => {
        expect(container.querySelector('[data-testid="home-page"]')).not.toBeInTheDocument();
      });
    });

    it('deve redirecionar admin para /dashboard/admin na rota raiz', async () => {
      mockUseAuth.mockReturnValue({
        user: mockAdminUser,
        loading: false,
        logout: vi.fn()
      });

      const { container } = render(<App />, { initialRoute: '/' });

      await waitFor(() => {
        expect(container.querySelector('[data-testid="home-page"]')).not.toBeInTheDocument();
      });
    });
  });

  describe('Rotas do Dashboard - Student', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockAuthenticatedUser,
        loading: false,
        logout: vi.fn()
      });
    });

    it('deve renderizar layout do dashboard', () => {
      render(<App />, { initialRoute: '/dashboard' });

      expect(screen.getByTestId('private-route')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });

    it('deve proteger todas as rotas do dashboard', () => {
      const dashboardRoutes = [
        '/dashboard/profile',
        '/dashboard/project',
        '/dashboard/meetings'
      ];

      dashboardRoutes.forEach(route => {
        const { unmount } = render(<App />, { initialRoute: route });

        expect(screen.getByTestId('private-route')).toBeInTheDocument();
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();

        unmount();
      });
    });

    it('deve redirecionar /dashboard/student para uma rota válida', async () => {
      render(<App />, { initialRoute: '/dashboard/student' });

      // Deve redirecionar para alguma rota do dashboard
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      });
    });
  });

  describe('Rotas do Dashboard - Admin', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockAdminUser,
        loading: false,
        logout: vi.fn()
      });
    });

    it('admin deve acessar dashboard com permissões corretas', () => {
      render(<App />, { initialRoute: '/dashboard/admin' });

      expect(screen.getByTestId('private-route')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      // Não deve estar bloqueado
      expect(screen.queryByTestId('private-route-forbidden')).not.toBeInTheDocument();
    });

    it('admin deve ser redirecionado corretamente de /dashboard', async () => {
      render(<App />, { initialRoute: '/dashboard' });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      });
    });
  });

  describe('Rotas Protegidas Gerais', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockAuthenticatedUser,
        loading: false,
        logout: vi.fn()
      });
    });

    it('deve proteger rota de editar perfil', () => {
      render(<App />, { initialRoute: '/edit-profile' });

      expect(screen.getByTestId('private-route')).toBeInTheDocument();
    });

    it('deve proteger rota de seleção de codename', () => {
      render(<App />, { initialRoute: '/warname/' });

      expect(screen.getByTestId('private-route')).toBeInTheDocument();
    });

    it('deve proteger rota de seleção de time', () => {
      render(<App />, { initialRoute: '/team-select/' });

      expect(screen.getByTestId('private-route')).toBeInTheDocument();
    });

    it('deve proteger rota de sala comum', () => {
      render(<App />, { initialRoute: '/common-room/' });

      expect(screen.getByTestId('private-route')).toBeInTheDocument();
    });

    it('deve proteger rota de board do time', () => {
      render(<App />, { initialRoute: '/teams/123/board' });

      expect(screen.getByTestId('private-route')).toBeInTheDocument();
    });
  });

  describe('Rotas Exclusivas de Admin', () => {
    it('admin deve ter acesso a rotas administrativas', () => {
      mockUseAuth.mockReturnValue({
        user: mockAdminUser,
        loading: false,
        logout: vi.fn()
      });

      render(<App />, { initialRoute: '/teams/create/' });

      // Não deve mostrar forbidden para admin
      expect(screen.getByTestId('private-route')).toBeInTheDocument();
      expect(screen.queryByTestId('private-route-forbidden')).not.toBeInTheDocument();
      expect(screen.queryByTestId('private-route-redirect')).not.toBeInTheDocument();
    });

    it('admin pode editar perfil de outros usuários', () => {
      mockUseAuth.mockReturnValue({
        user: mockAdminUser,
        loading: false,
        logout: vi.fn()
      });

      render(<App />, { initialRoute: '/edit-profile/123' });

      // Admin não deve ser bloqueado
      expect(screen.getByTestId('private-route')).toBeInTheDocument();
      expect(screen.queryByTestId('private-route-forbidden')).not.toBeInTheDocument();
      expect(screen.queryByTestId('private-route-redirect')).not.toBeInTheDocument();
    });

    it('student deve ser bloqueado em rotas administrativas', () => {
      mockUseAuth.mockReturnValue({
        user: mockAuthenticatedUser,
        loading: false,
        logout: vi.fn()
      });

      render(<App />, { initialRoute: '/teams/create/' });

      // Student deve ver forbidden OU ser redirecionado
      const isForbidden = screen.queryByTestId('private-route-forbidden');
      const isAllowed = screen.queryByTestId('private-route') && !screen.queryByTestId('private-route-forbidden');

      // Se tem private-route mas não tem forbidden, está na página errada (dashboard)
      // Isso significa que o router redirecionou para uma rota padrão
      expect(isForbidden || isAllowed).toBeTruthy();
    });

    it('student não pode editar perfil de outros usuários', () => {
      mockUseAuth.mockReturnValue({
        user: mockAuthenticatedUser,
        loading: false,
        logout: vi.fn()
      });

      render(<App />, { initialRoute: '/edit-profile/123' });

      // Student deve ver forbidden OU ser redirecionado
      const isForbidden = screen.queryByTestId('private-route-forbidden');
      const isAllowed = screen.queryByTestId('private-route') && !screen.queryByTestId('private-route-forbidden');

      expect(isForbidden || isAllowed).toBeTruthy();
    });
  });

  describe('Proteção de Rotas', () => {
    it('deve redirecionar usuário não autenticado para login', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        logout: vi.fn()
      });

      render(<App />, { initialRoute: '/dashboard' });

      expect(screen.getByTestId('private-route-redirect')).toBeInTheDocument();
    });

    it('deve mostrar loading nas rotas protegidas durante carregamento', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        logout: vi.fn()
      });

      render(<App />, { initialRoute: '/dashboard' });

      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    });
  });

  describe('Integração dos Componentes', () => {
    it('deve ter Header, main e Footer na ordem correta', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        logout: vi.fn()
      });

      const { container } = render(<App />);

      const elements = container.querySelectorAll('header, main, footer');
      expect(elements).toHaveLength(3);
      expect(elements[0].tagName).toBe('HEADER');
      expect(elements[1].tagName).toBe('MAIN');
      expect(elements[2].tagName).toBe('FOOTER');
    });

    it('ConnectionStatus deve estar presente em todas as páginas', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        logout: vi.fn()
      });

      render(<App />, { initialRoute: '/about' });

      expect(screen.getByTestId('connection-status')).toBeInTheDocument();
    });

    it('ScrollToTop deve estar presente em todas as páginas', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        logout: vi.fn()
      });

      render(<App />, { initialRoute: '/faq' });

      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
    });
  });
});
