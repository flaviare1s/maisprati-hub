import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import { DashboardTab } from '../../../components/DashboardTab';

describe('DashboardTab Component', () => {
  const mockSetActiveTab = vi.fn();
  const defaultProps = {
    icon: <span>📊</span>,
    title: 'Usuários',
    activeTab: '',
    setActiveTab: mockSetActiveTab
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o nome da aba', () => {
    render(<DashboardTab {...defaultProps} />);

    expect(screen.getByText('Usuários')).toBeInTheDocument();
  });

  it('deve chamar setActiveTab quando clicado', () => {
    render(<DashboardTab {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetActiveTab).toHaveBeenCalledWith('usuários');
  });
});