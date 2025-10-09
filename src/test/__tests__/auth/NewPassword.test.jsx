import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';

// Mock do módulo de API
vi.mock('../../../api.js/auth', () => ({
  resetPassword: vi.fn()
}));

// Mock do react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ token: 'mock-token' }),
    useNavigate: () => vi.fn()
  };
});

import { NewPassword } from '../../../pages/NewPassword';

describe('NewPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de nova senha', () => {
    render(<NewPassword />);

    expect(screen.getByPlaceholderText(/digite sua nova senha/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirme sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /alterar senha/i })).toBeInTheDocument();
  });
});