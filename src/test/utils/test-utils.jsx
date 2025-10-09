
import { render } from '@testing-library/react';
import { AllTheProviders } from './AllTheProviders';

// Função customizada de render que inclui os providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything

// Override render method
export { customRender as render };

// Mock de usuário autenticado
export const mockAuthenticatedUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@teste.com',
  type: 'student',
  codename: 'JOAO123'
};

// Mock de usuário admin
export const mockAdminUser = {
  id: '2',
  name: 'Admin User',
  email: 'admin@teste.com',
  type: 'admin',
  codename: 'ADMIN123'
};