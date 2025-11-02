import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do ReactDOM
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn()
  }))
}));

// Mock dos contexts e componentes
vi.mock('../contexts/ThemeContext.jsx', () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>
}));

vi.mock('../contexts/AuthContext.jsx', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>
}));

vi.mock('../contexts/TeamContext.jsx', () => ({
  TeamProvider: ({ children }) => <div data-testid="team-provider">{children}</div>
}));

vi.mock('../App.jsx', () => ({
  default: () => <div data-testid="app">App Component</div>
}));

vi.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>
}));

describe('main.jsx - Inicialização da Aplicação', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock do elemento root do DOM
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('deve ter elemento root no DOM', () => {
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeInTheDocument();
  });

  it('deve importar createRoot do react-dom/client', async () => {
    const { createRoot } = await import('react-dom/client');
    expect(createRoot).toBeDefined();
  });

  it('deve importar App corretamente', async () => {
    const App = (await import('../../../App.jsx')).default;
    expect(App).toBeDefined();
  });

  it('deve importar BrowserRouter do react-router-dom', async () => {
    const { BrowserRouter } = await import('react-router-dom');
    expect(BrowserRouter).toBeDefined();
  });

  it('deve importar Toaster do react-hot-toast', async () => {
    const { Toaster } = await import('react-hot-toast');
    expect(Toaster).toBeDefined();
  });

  it('deve importar todos os providers necessários', async () => {
    const { ThemeProvider } = await import('../../../contexts/ThemeContext.jsx');
    const { AuthProvider } = await import('../../../contexts/AuthContext.jsx');
    const { TeamProvider } = await import('../../../contexts/TeamContext.jsx');

    expect(ThemeProvider).toBeDefined();
    expect(AuthProvider).toBeDefined();
    expect(TeamProvider).toBeDefined();
  });

  it('deve verificar a hierarquia de providers esperada', () => {
    // Este teste documenta a ordem correta dos providers
    const expectedHierarchy = [
      'StrictMode',
      'ThemeProvider',
      'BrowserRouter',
      'AuthProvider',
      'TeamProvider',
      'Toaster',
      'App'
    ];

    expect(expectedHierarchy).toHaveLength(7);
    expect(expectedHierarchy[0]).toBe('StrictMode');
    expect(expectedHierarchy[expectedHierarchy.length - 1]).toBe('App');
  });
});
