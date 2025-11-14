import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectBoardWithLayout } from '../../../components/project/ProjectBoardWithLayout';

const mockUseLocation = vi.fn();
vi.mock('react-router-dom', () => ({
  useLocation: () => mockUseLocation(),
}));

vi.mock('../../../components/project/ProjectBoard', () => ({
  ProjectBoard: () => <div data-testid="project-board-mock" />,
}));

vi.mock('../../../components/Calendar', () => ({
  Calendar: () => <div data-testid="calendar-mock" />,
}));

describe('ProjectBoardWithLayout', () => {

  it('deve renderizar o layout completo (com Calendar e título) quando a rota for /teams/:teamId/board', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/teams/123/board', 
    });

    render(<ProjectBoardWithLayout />);

    expect(screen.getByText('Projeto da Equipe')).toBeInTheDocument();

    expect(screen.getByTestId('calendar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('project-board-mock')).toBeInTheDocument();

    const mainLayoutDiv = screen.getByText('Projeto da Equipe').closest('.dashboard-main').parentElement.parentElement;
    expect(mainLayoutDiv).toHaveClass('my-auto'); // Classe da div externa
  });

  it('deve renderizar APENAS o ProjectBoard quando a rota não for /teams/:teamId/board', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/tasks/other-view',
    });

    render(<ProjectBoardWithLayout />);

    expect(screen.getByTestId('project-board-mock')).toBeInTheDocument();

    expect(screen.queryByText('Projeto da Equipe')).not.toBeInTheDocument();
    expect(screen.queryByTestId('calendar-mock')).not.toBeInTheDocument();
  });

  it('deve renderizar APENAS o ProjectBoard para a rota raiz /', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/',
    });

    render(<ProjectBoardWithLayout />);

    expect(screen.queryByText('Projeto da Equipe')).not.toBeInTheDocument();
    expect(screen.queryByTestId('calendar-mock')).not.toBeInTheDocument();
    
    expect(screen.getByTestId('project-board-mock')).toBeInTheDocument();
  });
});