import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectColumn } from '../../../components/project/ProjectColumn';
import { ProjectPhaseCard } from '../../../components/project/ProjectPhaseCard'; 

vi.mock('../../../components/project/ProjectPhaseCard', () => {
    const MockedProjectPhaseCard = vi.fn(({ phase, canDrag }) => (
        <div data-testid="project-phase-card" data-phase-id={phase.id} data-can-drag={String(canDrag)}>
            {phase.name}
        </div>
    ));
    return { ProjectPhaseCard: MockedProjectPhaseCard };
});

const mockUseDrop = vi.fn();
vi.mock('react-dnd', () => ({
  useDrop: (spec) => {
    mockUseDrop.dropFunction = spec.drop;
    mockUseDrop.canDropFunction = spec.canDrop;
    return [
      mockUseDrop.collectedProps || { isOver: false }, 
      (node) => node 
    ];
  },
}));

const setupUseDropMock = ({ isOver = false, canDrop = true }) => {
  mockUseDrop.collectedProps = { isOver };
  mockUseDrop.canDropFunction = () => canDrop;
  mockUseDrop.dropFunction = mockUseDrop.dropFunction || vi.fn(); 
};

const mockPhases = [
  { id: 101, name: 'Fase de Design', description: 'desc 1' },
  { id: 102, name: 'Fase de Codificação', description: 'desc 2' },
];

const defaultProps = {
  status: 'IN_PROGRESS',
  title: 'Em Andamento',
  color: '#007BFF', // HEX
  phases: mockPhases,
  onDropPhase: vi.fn(),
  userTeam: 'FRONTEND',
  user: { id: 1, type: 'member' },
};

describe('ProjectColumn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupUseDropMock({ isOver: false, canDrop: true });
    ProjectPhaseCard.mockClear(); 
  });

  it('deve renderizar o título, contador de fases e fases corretamente', () => {
    render(<ProjectColumn {...defaultProps} />);

    const titleElement = screen.getByRole('heading', { name: defaultProps.title });
    expect(titleElement).toBeInTheDocument();
    
    expect(titleElement).toHaveStyle('filter: brightness(1.2) contrast(1.1)'); 
    
    expect(screen.getByText(String(mockPhases.length))).toBeInTheDocument();

    const phaseCards = screen.getAllByTestId('project-phase-card');
    expect(phaseCards).toHaveLength(mockPhases.length);
    
    phaseCards.forEach(card => {
        expect(card).toHaveAttribute('data-can-drag', 'true');
    });
  });
  
  it('deve aplicar a cor da coluna como border-top-color', () => {
    render(<ProjectColumn {...defaultProps} />);
    const titleElement = screen.getByText(defaultProps.title);
    
    const columnElement = titleElement.closest('div').parentElement;
    
    expect(columnElement).toHaveStyle('border-top-color: rgb(0, 123, 255)');
  });

  it('deve renderizar a mensagem de "Nenhuma fase" quando phases é vazio', () => {
    const props = { ...defaultProps, phases: [] };
    render(<ProjectColumn {...props} />);
    expect(screen.getByText('Nenhuma fase nesta coluna')).toBeInTheDocument();
    expect(screen.queryAllByTestId('project-phase-card')).toHaveLength(0);
  });
  
  it('deve chamar onDropPhase e permitir arrastar quando o usuário for "member"', () => {
    setupUseDropMock({ isOver: false, canDrop: true });
    const itemId = 99;
    
    render(<ProjectColumn {...defaultProps} />);
    
    mockUseDrop.dropFunction({ id: itemId });

    expect(defaultProps.onDropPhase).toHaveBeenCalledWith(itemId, defaultProps.status);
    
    expect(ProjectPhaseCard).toHaveBeenCalledWith(
      expect.objectContaining({ canDrag: true }), 
      undefined 
    );
  });
  
  it('NÃO deve chamar onDropPhase e deve desabilitar o arrastar quando o usuário for "admin"', () => {
    const adminProps = { ...defaultProps, user: { id: 2, type: 'admin' } };
    
    setupUseDropMock({ isOver: false, canDrop: false }); 
    const itemId = 99;
    
    render(<ProjectColumn {...adminProps} />);
    
    mockUseDrop.dropFunction({ id: itemId });

    expect(adminProps.onDropPhase).not.toHaveBeenCalled();
    
    expect(ProjectPhaseCard).toHaveBeenCalledWith(
        expect.objectContaining({ canDrag: false }), 
        undefined
    );
  });

  it('deve aplicar estilos de isOver quando permitido mover e isOver for true', () => {
    setupUseDropMock({ isOver: true, canDrop: true }); 

    render(<ProjectColumn {...defaultProps} />);
    
    const titleElement = screen.getByText(defaultProps.title);
    const columnElement = titleElement.closest('div').parentElement; 
    
    expect(columnElement).toHaveClass('bg-gray-50');
    expect(columnElement).toHaveClass('scale-105');
  });
  
  it('NÃO deve aplicar estilos de isOver quando NÃO for permitido mover (admin)', () => {
    setupUseDropMock({ isOver: true, canDrop: false }); 
    const adminProps = { ...defaultProps, user: { id: 2, type: 'admin' } };

    render(<ProjectColumn {...adminProps} />);
    
    const titleElement = screen.getByText(defaultProps.title);
    const columnElement = titleElement.closest('div').parentElement; 
    
    expect(columnElement).not.toHaveClass('bg-gray-50');
    expect(columnElement).not.toHaveClass('scale-105');
  });
});