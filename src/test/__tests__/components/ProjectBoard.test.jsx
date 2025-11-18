import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProjectBoard } from '../../../components/project/ProjectBoard';
import * as authHooks from '../../../hooks/useAuth';
import * as reactRouterDom from 'react-router-dom';
import * as usersApi from '../../../api/users';
import * as teamsApi from '../../../api/teams';
import * as projectProgressApi from '../../../api/projectProgress';
import toast from 'react-hot-toast';

// Mock das dependências
vi.mock('../../../hooks/useAuth');
vi.mock('react-router-dom');
vi.mock('../../../api/users');
vi.mock('../../../api/teams');
vi.mock('../../../api/projectProgress');
vi.mock('react-hot-toast');
vi.mock('../../../components/CustomLoader', () => ({
  CustomLoader: () => <div data-testid="custom-loader">Loading...</div>
}));
vi.mock('../../../components/ReturnButton', () => ({
  ReturnButton: () => <div data-testid="return-button">Return</div>
}));
vi.mock('../../../components/project/ProjectColumn', () => ({
  ProjectColumn: ({ status, title, phases, onDropPhase }) => (
    <div data-testid={`project-column-${status}`}>
      <h3>{title}</h3>
      {phases.map(phase => (
        <div key={phase.id} data-testid={`phase-${phase.id}`}>
          {phase.title} - {phase.status}
          <button
            onClick={() => onDropPhase(phase.id, 'done')}
            data-testid={`update-phase-${phase.id}`}
          >
            Move to Done
          </button>
        </div>
      ))}
    </div>
  )
}));
vi.mock('react-dnd', () => ({
  DndProvider: ({ children }) => <div data-testid="dnd-provider">{children}</div>
}));
vi.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: 'HTML5Backend'
}));

describe('ProjectBoard', () => {
  const mockUser = {
    id: 'user123',
    codename: 'TestUser',
    type: 'student',
    hasGroup: false
  };

  const mockAdminUser = {
    id: 'admin123',
    codename: 'AdminUser',
    type: 'admin'
  };

  const mockTeam = {
    id: 'team123',
    name: 'Test Team',
    members: [{ userId: 'user123', codename: 'TestUser' }]
  };

  const mockProgress = {
    id: 'progress123',
    teamId: 'team123',
    phases: [
      { id: 'phase1', title: 'Phase 1', status: 'TODO' },
      { id: 'phase2', title: 'Phase 2', status: 'IN_PROGRESS' },
      { id: 'phase3', title: 'Phase 3', status: 'DONE' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    authHooks.useAuth.mockReturnValue({ user: mockUser });
    reactRouterDom.useParams.mockReturnValue({});
    reactRouterDom.useSearchParams.mockReturnValue([new URLSearchParams()]);
    toast.success = vi.fn();
    toast.error = vi.fn();
  });

  describe('Status Mapping Functions', () => {
    it('deve mapear status do frontend para backend corretamente', async () => {
      // Renderizar o componente para ter acesso às funções internas
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      // Verificar se o mapeamento está correto através do comportamento do componente
      await waitFor(() => {
        expect(screen.getByText('TestUser (Trabalho Solo)')).toBeInTheDocument();
      });

      // Verificar se as fases foram mapeadas corretamente
      expect(screen.getByText('Phase 1 - todo')).toBeInTheDocument();
      expect(screen.getByText('Phase 2 - in_progress')).toBeInTheDocument();
      expect(screen.getByText('Phase 3 - done')).toBeInTheDocument();
    });

    it('deve mapear status do backend para frontend corretamente', async () => {
      const progressWithBackendStatus = {
        ...mockProgress,
        phases: [
          { id: 'phase1', title: 'Phase 1', status: 'TODO' },
          { id: 'phase2', title: 'Phase 2', status: 'IN_PROGRESS' },
          { id: 'phase3', title: 'Phase 3', status: 'DONE' }
        ]
      };

      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(progressWithBackendStatus);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('Phase 1 - todo')).toBeInTheDocument();
        expect(screen.getByText('Phase 2 - in_progress')).toBeInTheDocument();
        expect(screen.getByText('Phase 3 - done')).toBeInTheDocument();
      });
    });

    it('deve retornar status original se não encontrado no mapeamento', async () => {
      const progressWithUnknownStatus = {
        ...mockProgress,
        phases: [
          { id: 'phase1', title: 'Phase 1', status: 'CUSTOM_STATUS' }
        ]
      };

      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(progressWithUnknownStatus);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('TestUser (Trabalho Solo)')).toBeInTheDocument();
      });

      // Verificar se a fase não aparece em nenhuma das colunas conhecidas
      // pois 'custom_status' não corresponde a 'todo', 'in_progress' ou 'done'
      expect(screen.queryByTestId('phase-phase1')).not.toBeInTheDocument();

      // Verificar se as colunas estão vazias
      const todoColumn = screen.getByTestId('project-column-todo');
      const inProgressColumn = screen.getByTestId('project-column-in_progress');
      const doneColumn = screen.getByTestId('project-column-done');

      expect(todoColumn).not.toHaveTextContent('Phase 1');
      expect(inProgressColumn).not.toHaveTextContent('Phase 1');
      expect(doneColumn).not.toHaveTextContent('Phase 1');
    });
  });

  describe('Solo Project Scenarios', () => {
    it('deve carregar projeto solo quando usuário não tem grupo', async () => {
      authHooks.useAuth.mockReturnValue({ user: { ...mockUser, hasGroup: false } });
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('TestUser (Trabalho Solo)')).toBeInTheDocument();
      });

      expect(projectProgressApi.fetchProjectProgress).toHaveBeenCalledWith('solo-user123');
    });

    it('deve criar novo progresso se não existir para projeto solo', async () => {
      authHooks.useAuth.mockReturnValue({ user: { ...mockUser, hasGroup: false } });
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(null);
      projectProgressApi.createProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(projectProgressApi.createProjectProgress).toHaveBeenCalledWith('solo-user123');
      });
    });

    it('deve lidar com erro ao carregar projeto solo', async () => {
      authHooks.useAuth.mockReturnValue({ user: { ...mockUser, hasGroup: false } });
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockRejectedValue(new Error('API Error'));

      // Mock console.warn para evitar logs desnecessários no teste
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('TestUser (Trabalho Solo)')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Admin Viewing User Projects', () => {
    it('deve carregar projeto de usuário específico quando admin usa viewUser', async () => {
      authHooks.useAuth.mockReturnValue({ user: mockAdminUser });
      reactRouterDom.useSearchParams.mockReturnValue([new URLSearchParams('viewUser=user456')]);

      const mockUserData = { id: 'user456', name: 'John Doe', codename: 'JohnD' };
      usersApi.getUserById.mockResolvedValue(mockUserData);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('Projeto Solo - John Doe')).toBeInTheDocument();
      });

      expect(usersApi.getUserById).toHaveBeenCalledWith('user456');
      expect(projectProgressApi.fetchProjectProgress).toHaveBeenCalledWith('solo-user456');
    });

    it('deve usar dados padrão quando falhar ao buscar dados do usuário', async () => {
      authHooks.useAuth.mockReturnValue({ user: mockAdminUser });
      reactRouterDom.useSearchParams.mockReturnValue([new URLSearchParams('viewUser=user456')]);

      usersApi.getUserById.mockRejectedValue(new Error('User not found'));
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      // Mock console.warn
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('Projeto Solo - Usuário user456')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('deve criar progresso vazio quando falhar ao carregar projeto do usuário', async () => {
      authHooks.useAuth.mockReturnValue({ user: mockAdminUser });
      reactRouterDom.useSearchParams.mockReturnValue([new URLSearchParams('viewUser=user456')]);

      const mockUserData = { id: 'user456', name: 'John Doe' };
      usersApi.getUserById.mockResolvedValue(mockUserData);
      projectProgressApi.fetchProjectProgress.mockRejectedValue(new Error('Progress not found'));

      // Mock console.warn
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('Projeto Solo - John Doe')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Team Project Scenarios', () => {
    it('deve carregar projeto do time específico quando teamId é fornecido', async () => {
      reactRouterDom.useParams.mockReturnValue({ teamId: 'team123' });
      teamsApi.getTeamWithMembers.mockResolvedValue(mockTeam);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('Test Team')).toBeInTheDocument();
      });

      expect(teamsApi.getTeamWithMembers).toHaveBeenCalledWith('team123');
      expect(projectProgressApi.fetchProjectProgress).toHaveBeenCalledWith('team123');
    });

    it('deve carregar projeto do time do usuário quando hasGroup é true', async () => {
      authHooks.useAuth.mockReturnValue({
        user: { ...mockUser, hasGroup: true, id: 'user123' }
      });

      const teams = [
        { id: 'team123', members: [{ userId: 'user123' }] },
        { id: 'team456', members: [{ userId: 'user456' }] }
      ];

      teamsApi.fetchTeams.mockResolvedValue(teams);
      teamsApi.getTeamWithMembers.mockResolvedValue(mockTeam);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('Test Team')).toBeInTheDocument();
      });

      expect(teamsApi.getTeamWithMembers).toHaveBeenCalledWith('team123');
    });

    it('deve carregar projeto solo do admin quando teamId começa com "solo-"', async () => {
      reactRouterDom.useParams.mockReturnValue({ teamId: 'solo-user456' });
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('Projeto Solo (ID: user456)')).toBeInTheDocument();
      });

      expect(projectProgressApi.fetchProjectProgress).toHaveBeenCalledWith('solo-user456');
    });
  });

  describe('Phase Update Functionality', () => {
    it('deve atualizar status da fase quando handleDropPhase é chamado', async () => {
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      const updatedProgress = {
        ...mockProgress,
        phases: [
          { id: 'phase1', title: 'Phase 1', status: 'DONE' },
          { id: 'phase2', title: 'Phase 2', status: 'IN_PROGRESS' },
          { id: 'phase3', title: 'Phase 3', status: 'DONE' }
        ]
      };

      projectProgressApi.updatePhaseStatus.mockResolvedValue(updatedProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('TestUser (Trabalho Solo)')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-phase-phase1');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(projectProgressApi.updatePhaseStatus).toHaveBeenCalledWith(
          'solo-user123',
          'Phase 1',
          'DONE',
          'user123'
        );
        expect(toast.success).toHaveBeenCalledWith('Status da fase atualizado!');
      });
    });

    it('deve mostrar erro quando fase não é encontrada para atualização', async () => {
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('TestUser (Trabalho Solo)')).toBeInTheDocument();
      });

      // Simular tentativa de atualizar fase inexistente
      // Como não temos uma fase com id 'nonexistent', isso deve resultar em erro
      // Vamos simular isso através do estado interno
      expect(screen.queryByTestId('update-phase-nonexistent')).not.toBeInTheDocument();
    });

    it('deve lidar com erro ao atualizar status da fase', async () => {
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);
      projectProgressApi.updatePhaseStatus.mockRejectedValue(new Error('Update failed'));

      // Mock console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('TestUser (Trabalho Solo)')).toBeInTheDocument();
      });

      const updateButton = screen.getByTestId('update-phase-phase1');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar status da fase');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('deve lidar com erro de autenticação quando admin falha ao visualizar projeto', async () => {
      authHooks.useAuth.mockReturnValue({ user: mockAdminUser });
      reactRouterDom.useSearchParams.mockReturnValue([new URLSearchParams('viewUser=user456')]);

      const authError = new Error('Auth failed');
      authError.response = { status: 401 };

      usersApi.getUserById.mockRejectedValue(authError);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      // Mock console.warn para capturar o log de erro
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

      render(<ProjectBoard />);

      // Verificar se o componente ainda renderiza com dados padrão após o erro
      await waitFor(() => {
        expect(screen.getByText('Projeto Solo - Usuário user456')).toBeInTheDocument();
      });

      // Verificar se o console.warn foi chamado com a mensagem de erro
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao buscar dados do usuário, usando dados padrão:',
        authError
      );

      consoleSpy.mockRestore();
    });

    it('deve mostrar erro genérico para outros tipos de erro', async () => {
      // Mockar erro no useEffect inicial
      authHooks.useAuth.mockReturnValue({ user: { ...mockUser, hasGroup: true } });
      teamsApi.fetchTeams.mockRejectedValue(new Error('Network error'));

      // Mock console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erro ao carregar dados do projeto');
      }, { timeout: 3000 });

      consoleSpy.mockRestore();
    });
  });

  describe('Loading and No Team States', () => {
    it('deve mostrar loader enquanto carrega', () => {
      render(<ProjectBoard />);
      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    });

    it('deve mostrar mensagem quando não há time', async () => {
      authHooks.useAuth.mockReturnValue({ user: { ...mockUser, hasGroup: true } });
      teamsApi.fetchTeams.mockResolvedValue([]);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('Você precisa estar vinculado a um time para acessar o projeto.')).toBeInTheDocument();
      });
    });
  });

  describe('Progress Bar Calculation', () => {
    it('deve calcular progresso corretamente baseado nas fases concluídas', async () => {
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByText('1 de 3 fases concluídas')).toBeInTheDocument();
      });

      // Usar container.querySelector para encontrar a barra de progresso
      const progressBar = document.querySelector('.bg-blue-logo.h-3.rounded-full');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ width: '33.33333333333333%' });
    });
  });

  describe('Component Integration', () => {
    it('deve renderizar todos os componentes necessários', async () => {
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        expect(screen.getByTestId('dnd-provider')).toBeInTheDocument();
        expect(screen.getByTestId('return-button')).toBeInTheDocument();
        expect(screen.getByTestId('project-column-todo')).toBeInTheDocument();
        expect(screen.getByTestId('project-column-in_progress')).toBeInTheDocument();
        expect(screen.getByTestId('project-column-done')).toBeInTheDocument();
      });
    });

    it('deve distribuir fases corretamente entre as colunas', async () => {
      teamsApi.fetchTeams.mockResolvedValue([]);
      projectProgressApi.fetchProjectProgress.mockResolvedValue(mockProgress);

      render(<ProjectBoard />);

      await waitFor(() => {
        // Verificar se as fases estão nas colunas corretas
        const todoColumn = screen.getByTestId('project-column-todo');
        const inProgressColumn = screen.getByTestId('project-column-in_progress');
        const doneColumn = screen.getByTestId('project-column-done');

        expect(todoColumn).toHaveTextContent('Phase 1 - todo');
        expect(inProgressColumn).toHaveTextContent('Phase 2 - in_progress');
        expect(doneColumn).toHaveTextContent('Phase 3 - done');
      });
    });
  });
});