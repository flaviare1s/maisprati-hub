import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Forbidden } from '../../../pages/Forbidden';

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

describe('Forbidden Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização da Página', () => {
    it('deve renderizar a página 401 corretamente', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se a página está presente
      expect(screen.getByTestId('forbidden-page')).toBeInTheDocument();
    });

    it('deve exibir o código de erro 401', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se o código 401 está presente
      expect(screen.getByText('401')).toBeInTheDocument();
      expect(screen.getByText('401')).toHaveClass('text-5xl', 'font-extrabold', 'text-orange-logo');
    });

    it('deve exibir a mensagem de erro', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se a mensagem está presente
      expect(screen.getByText('Não Autorizado!')).toBeInTheDocument();
      expect(screen.getByText('Não Autorizado!')).toHaveClass('text-2xl', 'font-extrabold', 'text-orange-logo');
    });

    it('deve exibir a imagem de erro', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se a imagem está presente
      const image = screen.getByAltText('Erro de status 401');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'mocked-not-found-image.png');
      expect(image).toHaveClass('w-32', 'sm:w-64', 'mb-8');
    });
  });

  describe('Navegação', () => {
    it('deve ter um botão para voltar ao início', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se o botão está presente
      const backButton = screen.getByRole('link', { name: /voltar ao início/i });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute('href', '/');
    });

    it('deve aplicar as classes corretas no botão', () => {
      renderWithRouter(<Forbidden />);

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
      renderWithRouter(<Forbidden />);

      // Verificar se o container principal tem as classes corretas
      const container = screen.getByTestId('forbidden-page');
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
      renderWithRouter(<Forbidden />);

      const container = screen.getByTestId('forbidden-page');
      const children = Array.from(container.children);

      // Verificar ordem dos elementos
      expect(children[0]).toHaveTextContent('401'); // Primeiro: código de erro
      expect(children[1]).toHaveAttribute('alt', 'Erro de status 401'); // Segundo: imagem
      expect(children[2]).toHaveTextContent('Não Autorizado!'); // Terceiro: mensagem
      expect(children[3]).toHaveTextContent('Voltar ao Início'); // Quarto: botão
    });
  });

  describe('Diferenças entre 401 e 404', () => {
    it('deve mostrar erro 401 em vez de 404', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se mostra 401 e não 404
      expect(screen.getByText('401')).toBeInTheDocument();
      expect(screen.queryByText('404')).not.toBeInTheDocument();
    });

    it('deve mostrar mensagem de "Não Autorizado" em vez de "Página não encontrada"', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se mostra a mensagem correta
      expect(screen.getByText('Não Autorizado!')).toBeInTheDocument();
      expect(screen.queryByText('Ops! Página não encontrada')).not.toBeInTheDocument();
    });

    it('deve usar alt text específico para erro 401', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se o alt text é específico para 401
      expect(screen.getByAltText('Erro de status 401')).toBeInTheDocument();
      expect(screen.queryByAltText('Página não encontrada')).not.toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter alt text apropriado na imagem', () => {
      renderWithRouter(<Forbidden />);

      const image = screen.getByAltText('Erro de status 401');
      expect(image).toBeInTheDocument();
    });

    it('deve ter o botão de navegação acessível', () => {
      renderWithRouter(<Forbidden />);

      const backButton = screen.getByRole('link', { name: /voltar ao início/i });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute('href', '/');
    });

    it('deve ter data-testid para testes', () => {
      renderWithRouter(<Forbidden />);

      expect(screen.getByTestId('forbidden-page')).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve aplicar classes responsivas na imagem', () => {
      renderWithRouter(<Forbidden />);

      const image = screen.getByAltText('Erro de status 401');
      expect(image).toHaveClass('w-32', 'sm:w-64');
    });

    it('deve aplicar padding responsivo no container', () => {
      renderWithRouter(<Forbidden />);

      const container = screen.getByTestId('forbidden-page');
      expect(container).toHaveClass('p-6');
    });
  });

  describe('Cenários de Uso', () => {
    it('deve ser adequado para erros de autenticação', () => {
      renderWithRouter(<Forbidden />);

      // Verificar se os elementos indicam erro de autorização
      expect(screen.getByText('401')).toBeInTheDocument();
      expect(screen.getByText('Não Autorizado!')).toBeInTheDocument();
    });

    it('deve permitir navegação de volta ao início', () => {
      renderWithRouter(<Forbidden />);

      const backButton = screen.getByRole('link', { name: /voltar ao início/i });
      expect(backButton).toHaveAttribute('href', '/');
    });
  });
});
