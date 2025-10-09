import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';

// Mock do módulo de API
vi.mock('../../../api.js/auth', () => ({
  forgotPassword: vi.fn()
}));

import { ResetPassword } from '../../../pages/ResetPassword';

describe('ResetPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de recuperação de senha', () => {
    render(<ResetPassword />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });
});