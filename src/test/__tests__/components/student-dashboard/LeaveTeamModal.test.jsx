import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeaveTeamModal } from '../../../../components/student-dashboard/LeaveTeamModal'; 

const mockProps = {
    open: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    reason: '',
    setReason: vi.fn(),
};

const renderComponent = (props = {}) => {
    return render(<LeaveTeamModal {...mockProps} {...props} />);
};

describe('LeaveTeamModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('não deve renderizar o modal quando open for false', () => {
        renderComponent({ open: false });
        
        expect(screen.queryByText('Confirmar saída do time')).not.toBeInTheDocument();
    });

    it('deve renderizar o modal e seus elementos quando open for true', () => {
        renderComponent({ open: true });
        
        expect(screen.getByText('Confirmar saída do time')).toBeInTheDocument();
        
        expect(screen.getByPlaceholderText('Digite seu motivo aqui...')).toBeInTheDocument();
        
        expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirmar saída' })).toBeInTheDocument();
    });

    it('deve chamar setReason com o valor do textarea quando o usuário digitar', () => {
        renderComponent();
        const textarea = screen.getByPlaceholderText('Digite seu motivo aqui...');
        const newReason = 'Mudando de projeto';

        fireEvent.change(textarea, { target: { value: newReason } });

        expect(mockProps.setReason).toHaveBeenCalledWith(newReason);
    });

    it('deve exibir o valor de razão (reason) passado via props', () => {
        const initialReason = 'Testando o preenchimento';
        renderComponent({ reason: initialReason });
        const textarea = screen.getByPlaceholderText('Digite seu motivo aqui...');

        expect(textarea).toHaveValue(initialReason);
    });

    it('deve chamar a função onClose quando o botão Cancelar for clicado', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: 'Cancelar' });

        fireEvent.click(cancelButton);

        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('deve chamar a função onConfirm quando o botão Confirmar saída for clicado', () => {
        renderComponent();
        const confirmButton = screen.getByRole('button', { name: 'Confirmar saída' });

        fireEvent.click(confirmButton);

        expect(mockProps.onConfirm).toHaveBeenCalledTimes(1);
    });
});