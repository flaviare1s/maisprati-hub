import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';

vi.mock('../../../api.js/auth', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  logoutUser: vi.fn(),
  decodeJWT: vi.fn(() => ({ exp: Date.now() / 1000 + 3600 }))
}));

import { Login } from '../../../pages/Login';

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(<Login />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});
