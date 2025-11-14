import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';

vi.mock('../../../api.js/auth', () => ({
  forgotPassword: vi.fn(),
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  resetPassword: vi.fn(),
  logoutUser: vi.fn(),
  decodeJWT: vi.fn(() => ({ exp: Date.now() / 1000 + 3600 }))
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
