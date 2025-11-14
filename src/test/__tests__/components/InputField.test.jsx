import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import { InputField } from '../../../components/InputField';

describe('InputField Component', () => {
  const mockRegister = vi.fn(() => ({}));
  const defaultProps = {
    label: 'Nome',
    name: 'name',
    type: 'text',
    register: mockRegister
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o label e input', () => {
    render(<InputField {...defaultProps} />);

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando fornecida', () => {
    render(<InputField {...defaultProps} error="Campo obrigatório" />);

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });
});