import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFound } from '../../../pages/NotFound';

// Mock da imagem
vi.mock('../../../assets/images/not_found.png', () => ({
  default: 'mocked-not-found-image.png'
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('NotFound Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização da Página', () => {
    it('deve renderizar a página 404 corretamente', () => {
      renderWithRouter(<NotFound />);

      // Verificar se a página está presente
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('deve exibir o código de erro 404', () => {
      renderWithRouter(<NotFound />);

      // Verificar se o código 404 está presente
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('404')).toHaveClass('text-5xl', 'font-extrabold', 'text-orange-logo');
    });

    it('deve exibir a mensagem de erro', () => {
      renderWithRouter(<NotFound />);

      // Verificar se a mensagem está presente
      expect(screen.getByText('Ops! Página não encontrada')).toBeInTheDocument();
      expect(screen.getByText('Ops! Página não encontrada')).toHaveClass('text-2xl', 'font-extrabold', 'text-orange-logo');
    });

    it('deve exibir a imagem de erro', () => {
      renderWithRouter(<NotFound />);

      // Verificar se a imagem está presente
      const image = screen.getByAltText('Página não encontrada');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'mocked-not-found-image.png');
      expect(image).toHaveClass('w-32', 'sm:w-64', 'mb-8');
    });
  });

  describe('Navegação', () => {
    it('deve ter um botão para voltar ao início', () => {
      renderWithRouter(<NotFound />);

      // Verificar se o botão está presente
      const backButton = screen.getByRole('link', { name: /voltar ao início/i });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute('href', '/');
    });

    it('deve aplicar as classes corretas no botão', () => {
      renderWithRouter(<NotFound />);

      // Verificar se o botão tem as classes corretas
      const backButton = screen.getByRole('link', { name: /voltar ao início/i });
      expect(backButton).toHaveClass(
        'bg-blue-logo',
        'hover:bg-orange-logo',
        'text-light',
        'font-bold',
        'px-6',
        'py-3',
        'rounded-lg',
        'shadow-lg',
        'transition-transform',
        'transform',
        'hover:scale-105'
      );
    });
  });

  describe('Layout e Estrutura', () => {
    it('deve ter a estrutura de layout correta', () => {
      renderWithRouter(<NotFound />);

      // Verificar se o container principal tem as classes corretas
      const container = screen.getByTestId('not-found-page');
      expect(container).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-screen',
        'p-6'
      );
    });

    it('deve ter todos os elementos na ordem correta', () => {
      renderWithRouter(<NotFound />);

      const container = screen.getByTestId('not-found-page');
      const children = Array.from(container.children);

      // Verificar ordem dos elementos
      expect(children[0]).toHaveTextContent('404'); // Primeiro: código de erro
      expect(children[1]).toHaveAttribute('alt', 'Página não encontrada'); // Segundo: imagem
      expect(children[2]).toHaveTextContent('Ops! Página não encontrada'); // Terceiro: mensagem
      expect(children[3]).toHaveTextContent('Voltar ao Início'); // Quarto: botão
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter alt text apropriado na imagem', () => {
      renderWithRouter(<NotFound />);

      const image = screen.getByAltText('Página não encontrada');
      expect(image).toBeInTheDocument();
    });

    it('deve ter o botão de navegação acessível', () => {
      renderWithRouter(<NotFound />);

      const backButton = screen.getByRole('link', { name: /voltar ao início/i });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute('href', '/');
    });

    it('deve ter data-testid para testes', () => {
      renderWithRouter(<NotFound />);

      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve aplicar classes responsivas na imagem', () => {
      renderWithRouter(<NotFound />);

      const image = screen.getByAltText('Página não encontrada');
      expect(image).toHaveClass('w-32', 'sm:w-64');
    });

    it('deve aplicar padding responsivo no container', () => {
      renderWithRouter(<NotFound />);

      const container = screen.getByTestId('not-found-page');
      expect(container).toHaveClass('p-6');
    });
  });
});
