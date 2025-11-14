import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectPhaseCard } from '../../../components/project/ProjectPhaseCard'; 
import { FaCheckCircle, FaClock, FaLock } from "react-icons/fa";

const mockUseDrag = vi.fn();
vi.mock('react-dnd', () => ({
    useDrag: (spec) => {
        mockUseDrag.canDrag = spec.canDrag;
        mockUseDrag.item = spec.item;
        
        return [
            mockUseDrag.collectedProps || { opacity: 1, isDragging: false }, 
            (node) => node 
        ];
    },
}));

vi.mock('react-icons/fa', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        FaCheckCircle: vi.fn(actual.FaCheckCircle),
        FaClock: vi.fn(actual.FaClock),
        FaUsers: vi.fn(actual.FaUsers),
        FaLock: vi.fn(actual.FaLock),
    };
});

const setupUseDragMock = (isDragging = false, opacity = 1) => {
    mockUseDrag.collectedProps = { isDragging, opacity };
};

const mockPhaseTodo = {
    id: 1,
    title: 'Configurar Ambiente',
    status: 'todo',
    startedAt: null,
    completedAt: null,
};

const mockPhaseInProgress = {
    id: 2,
    title: 'Desenvolvimento Backend',
    status: 'in_progress',
    startedAt: '2025-10-01T10:00:00Z',
    completedAt: null,
};

const mockPhaseDone = {
    id: 3,
    title: 'Deploy Final',
    status: 'done',
    startedAt: '2025-10-01T10:00:00Z',
    completedAt: '2025-11-14T10:00:00Z',
};

const mockUserTeam = { name: 'Alpha Squad' };

const defaultProps = {
    phase: mockPhaseTodo,
    userTeam: mockUserTeam,
    canDrag: true,
};

describe('ProjectPhaseCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupUseDragMock(false, 1);
        mockUseDrag.canDrag = () => true;
    });

    it('deve renderizar o título e o nome do time corretamente', () => {
        render(<ProjectPhaseCard {...defaultProps} />);

        expect(screen.getByRole('heading', { name: mockPhaseTodo.title })).toBeInTheDocument();
        expect(screen.getByText(mockUserTeam.name)).toBeInTheDocument();
        expect(screen.getByTitle('Arraste para mover')).toBeInTheDocument();
    });

    it('deve renderizar o status "todo" corretamente (Cor Cinza)', () => {
        render(<ProjectPhaseCard {...defaultProps} />);
        const cardElement = screen.getByTitle('Arraste para mover');

        expect(FaClock).toHaveBeenCalled(); 
        expect(FaCheckCircle).not.toHaveBeenCalled();

        expect(cardElement).toHaveClass('border-l-gray-400');
        expect(cardElement).toHaveClass('bg-gray-50');
    });

    it('deve renderizar o status "in_progress" corretamente (Cor Azul)', () => {
        const props = { ...defaultProps, phase: mockPhaseInProgress };
        render(<ProjectPhaseCard {...props} />);
        const cardElement = screen.getByTitle('Arraste para mover');

        expect(FaClock).toHaveBeenCalled();
        
        expect(cardElement).toHaveClass('border-l-blue-logo');
        expect(cardElement).toHaveClass('bg-blue-50');
    });

    it('deve renderizar o status "done" corretamente (Cor Verde)', () => {
        const props = { ...defaultProps, phase: mockPhaseDone };
        render(<ProjectPhaseCard {...props} />);
        const cardElement = screen.getByTitle('Arraste para mover');

        expect(FaCheckCircle).toHaveBeenCalled();
        
        expect(cardElement).toHaveClass('border-l-green-500');
        expect(cardElement).toHaveClass('bg-green-50');
    });

    it('deve mostrar a data de conclusão quando a fase estiver "done"', () => {
        const props = { ...defaultProps, phase: mockPhaseDone };
        render(<ProjectPhaseCard {...props} />);

        const expectedDate = new Date(mockPhaseDone.completedAt).toLocaleDateString();
        expect(screen.getByText(`Concluído em ${expectedDate}`)).toBeInTheDocument();
    });
    
    it('deve mostrar a data de início quando a fase estiver "in_progress"', () => {
        const props = { ...defaultProps, phase: mockPhaseInProgress };
        render(<ProjectPhaseCard {...props} />);

        const expectedDate = new Date(mockPhaseInProgress.startedAt).toLocaleDateString();
        expect(screen.getByText(`Iniciado em ${expectedDate}`)).toBeInTheDocument();
    });

    it('não deve mostrar datas se startedAt e completedAt forem nulos', () => {
        render(<ProjectPhaseCard {...defaultProps} />);
        expect(screen.queryByText(/Iniciado em/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Concluído em/i)).not.toBeInTheDocument();
    });

    it('deve habilitar o arrasto quando canDrag for true e definir o item correto', () => {
        render(<ProjectPhaseCard {...defaultProps} canDrag={true} />);

        expect(mockUseDrag.canDrag()).toBe(true);
        
        expect(mockUseDrag.item).toEqual({ id: mockPhaseTodo.id });
        
        expect(screen.getByTitle('Arraste para mover')).toHaveClass('cursor-grab');
        
        expect(FaLock).not.toHaveBeenCalled();
    });
    
    it('deve desabilitar o arrasto e aplicar estilos e mensagens corretas quando canDrag for false', () => {
        render(<ProjectPhaseCard {...defaultProps} canDrag={false} />);
        const cardElement = screen.getByTitle('Apenas estudantes podem mover cards');

        expect(mockUseDrag.canDrag()).toBe(false);
        
        expect(cardElement).toHaveAttribute('title', 'Apenas estudantes podem mover cards');
        expect(cardElement).toHaveClass('cursor-default');
        expect(cardElement).toHaveClass('opacity-75');

        expect(FaLock).toHaveBeenCalled();
    });

    it('deve aplicar estilos de arrasto (opacity e rotation) quando isDragging é true', () => {
        setupUseDragMock(true, 0.5);

        render(<ProjectPhaseCard {...defaultProps} />);
        const cardElement = screen.getByTitle('Arraste para mover');

        expect(cardElement).toHaveStyle('opacity: 0.5');
        expect(cardElement).toHaveClass('rotate-2');
        expect(cardElement).toHaveClass('scale-105');
        expect(cardElement).toHaveClass('cursor-grabbing'); 
    });
});