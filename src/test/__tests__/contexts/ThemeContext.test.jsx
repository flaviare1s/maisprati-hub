import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../../contexts/ThemeContext.jsx';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

// Mock do classList
const classListMock = {
  add: vi.fn(),
  remove: vi.fn(),
  contains: vi.fn()
};

// Configurar mocks globais
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(document, 'documentElement', {
  value: {
    classList: classListMock
  },
  writable: true
});

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ThemeProvider', () => {
    it('deve inicializar com tema light quando localStorage não tem valor', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current.lightMode).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('deve inicializar com tema dark quando localStorage tem "dark"', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current.lightMode).toBe(false);
    });

    it('deve inicializar com tema light quando localStorage tem "light"', () => {
      localStorageMock.getItem.mockReturnValue('light');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current.lightMode).toBe(true);
    });
  });

  describe('Alternar Tema', () => {
    it('deve alternar de light para dark', () => {
      localStorageMock.getItem.mockReturnValue('light');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current.lightMode).toBe(true);

      act(() => {
        result.current.setLightMode(false);
      });

      expect(result.current.lightMode).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(classListMock.add).toHaveBeenCalledWith('dark');
    });

    it('deve alternar de dark para light', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current.lightMode).toBe(false);

      act(() => {
        result.current.setLightMode(true);
      });

      expect(result.current.lightMode).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(classListMock.remove).toHaveBeenCalledWith('dark');
    });
  });

  describe('Persistência do Tema', () => {
    it('deve salvar tema dark no localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      act(() => {
        result.current.setLightMode(false);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('deve salvar tema light no localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      act(() => {
        result.current.setLightMode(true);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('Classes do HTML', () => {
    it('deve adicionar classe "dark" ao documentElement quando dark mode', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      act(() => {
        result.current.setLightMode(false);
      });

      expect(classListMock.add).toHaveBeenCalledWith('dark');
    });

    it('deve remover classe "dark" do documentElement quando light mode', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      act(() => {
        result.current.setLightMode(true);
      });

      expect(classListMock.remove).toHaveBeenCalledWith('dark');
    });
  });

  describe('useTheme Hook', () => {
    it('deve retornar lightMode e setLightMode', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current).toHaveProperty('lightMode');
      expect(result.current).toHaveProperty('setLightMode');
      expect(typeof result.current.setLightMode).toBe('function');
    });

    it('deve retornar undefined quando usado fora do ThemeProvider', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current).toBeUndefined();
    });
  });

  describe('Múltiplas Alternâncias', () => {
    it('deve permitir alternar o tema múltiplas vezes', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      // Limpar as chamadas do setup inicial
      localStorageMock.setItem.mockClear();

      // Light -> Dark
      act(() => {
        result.current.setLightMode(false);
      });
      expect(result.current.lightMode).toBe(false);

      // Dark -> Light
      act(() => {
        result.current.setLightMode(true);
      });
      expect(result.current.lightMode).toBe(true);

      // Light -> Dark novamente
      act(() => {
        result.current.setLightMode(false);
      });
      expect(result.current.lightMode).toBe(false);

      // Verifica que setItem foi chamado 3 vezes (após o clear)
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
    });
  });
});
