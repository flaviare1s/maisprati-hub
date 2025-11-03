import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from '../../../pages/About';

// Mock dos componentes
vi.mock('../../components/AboutItemContent', () => ({
  AboutItemContent: ({ title, description }) => (
    <div data-testid="about-item-content">
      <h2 data-testid="content-title">{title}</h2>
      <p data-testid="content-description">{description}</p>
    </div>
  )
}));

vi.mock('../../../components/AboutItemImg', () => ({
  AboutItemImg: ({ img, alt }) => (
    <div data-testid="about-item-img">
      <img src={img} alt={alt} />
    </div>
  )
}));

// Mock das imagens
vi.mock('../../../assets/images/about-img1.png', () => ({
  default: '/mock-img1.png'
}));

vi.mock('../../../assets/images/about-img2.png', () => ({
  default: '/mock-img2.png'
}));

vi.mock('../../../assets/images/about-img3.png', () => ({
  default: '/mock-img3.png'
}));

describe('About Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar a página About', () => {
      render(<About />);

      expect(screen.getAllByTestId('about-item-content')).toHaveLength(3);
      expect(screen.getAllByTestId('about-item-img')).toHaveLength(3);
    });

    it('deve ter estrutura de grid correta', () => {
      const { container } = render(<About />);

      const gridContainer = container.firstChild;
      expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2');
    });

    it('deve ter classes de espaçamento corretas', () => {
      const { container } = render(<About />);

      const gridContainer = container.firstChild;
      expect(gridContainer).toHaveClass('gap-[5px]', 'py-[5px]');
    });
  });

  describe('Conteúdo - Sobre o +praTiHub', () => {
    it('deve renderizar seção "Sobre o +praTiHub"', () => {
      render(<About />);

      const titles = screen.getAllByTestId('content-title');
      expect(titles[0]).toHaveTextContent('Sobre o +praTiHub');
    });

    it('deve ter descrição correta na seção "Sobre"', () => {
      render(<About />);

      const descriptions = screen.getAllByTestId('content-description');
      expect(descriptions[0]).toHaveTextContent(/O \+praTiHub é a rede social/);
      expect(descriptions[0]).toHaveTextContent(/conecta alunos e professores/);
    });

    it('deve ter imagem correspondente na seção "Sobre"', () => {
      render(<About />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'Imagem de pessoas conectadas');
      expect(images[0]).toHaveAttribute('src', '/mock-img1.png');
    });
  });

  describe('Conteúdo - Como Funciona', () => {
    it('deve renderizar seção "Como Funciona"', () => {
      render(<About />);

      const titles = screen.getAllByTestId('content-title');
      expect(titles[1]).toHaveTextContent('Como Funciona');
    });

    it('deve ter descrição correta na seção "Como Funciona"', () => {
      render(<About />);

      const descriptions = screen.getAllByTestId('content-description');
      expect(descriptions[1]).toHaveTextContent(/Os alunos se cadastram/);
      expect(descriptions[1]).toHaveTextContent(/formar equipes/);
      expect(descriptions[1]).toHaveTextContent(/organizar o progresso/);
    });

    it('deve ter imagem correspondente na seção "Como Funciona"', () => {
      render(<About />);

      const images = screen.getAllByRole('img');
      expect(images[1]).toHaveAttribute('alt', 'Imagem de formulário digital sendo preenchido');
      expect(images[1]).toHaveAttribute('src', '/mock-img2.png');
    });
  });

  describe('Conteúdo - Acompanhamento', () => {
    it('deve renderizar seção "Acompanhamento"', () => {
      render(<About />);

      const titles = screen.getAllByTestId('content-title');
      expect(titles[2]).toHaveTextContent('Acompanhamento');
    });

    it('deve ter descrição correta na seção "Acompanhamento"', () => {
      render(<About />);

      const descriptions = screen.getAllByTestId('content-description');
      expect(descriptions[2]).toHaveTextContent(/Com o \+praTiHub, professores e alunos/);
      expect(descriptions[2]).toHaveTextContent(/painel claro e prático/);
      expect(descriptions[2]).toHaveTextContent(/transparência/);
    });

    it('deve ter imagem correspondente na seção "Acompanhamento"', () => {
      render(<About />);

      const images = screen.getAllByRole('img');
      expect(images[2]).toHaveAttribute('alt', 'Imagem de dashboard de acompanhamento de projetos');
      expect(images[2]).toHaveAttribute('src', '/mock-img3.png');
    });
  });

  describe('Layout Responsivo', () => {
    it('deve ter classes responsivas para mobile', () => {
      const { container } = render(<About />);

      expect(container.firstChild).toHaveClass('grid-cols-1');
    });

    it('deve ter classes responsivas para desktop', () => {
      const { container } = render(<About />);

      expect(container.firstChild).toHaveClass('md:grid-cols-2');
    });

    it('deve ter ordem correta dos elementos no desktop', () => {
      const { container } = render(<About />);

      const orderElements = container.querySelectorAll('.md\\:order-4, .md\\:order-5');
      expect(orderElements).toHaveLength(2);
    });
  });

  describe('Acessibilidade', () => {
    it('todas as imagens devem ter alt text', () => {
      render(<About />);

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    it('deve ter textos descritivos para todas as seções', () => {
      render(<About />);

      const descriptions = screen.getAllByTestId('content-description');
      expect(descriptions).toHaveLength(3);

      descriptions.forEach(desc => {
        expect(desc.textContent.length).toBeGreaterThan(50);
      });
    });
  });

  describe('Conteúdo da Página', () => {
    it('deve mencionar recursos principais do +praTiHub', () => {
      render(<About />);

      const pageText = screen.getAllByTestId('content-description')
        .map(el => el.textContent)
        .join(' ');

      expect(pageText).toMatch(/alunos/i);
      expect(pageText).toMatch(/professores/i);
      expect(pageText).toMatch(/projetos/i);
      expect(pageText).toMatch(/equipes/i);
    });

    it('deve ter 3 seções principais', () => {
      render(<About />);

      const sections = screen.getAllByTestId('about-item-content');
      expect(sections).toHaveLength(3);
    });

    it('deve ter 3 imagens ilustrativas', () => {
      render(<About />);

      const imageSections = screen.getAllByTestId('about-item-img');
      expect(imageSections).toHaveLength(3);
    });
  });

  describe('Classes CSS', () => {
    it('deve ter classe "about" no container principal', () => {
      const { container } = render(<About />);

      expect(container.firstChild).toHaveClass('about');
    });

    it('deve ter background light', () => {
      const { container } = render(<About />);

      expect(container.firstChild).toHaveClass('bg-light');
    });

    it('deve ocupar largura total da tela', () => {
      const { container } = render(<About />);

      expect(container.firstChild).toHaveClass('w-screen');
    });
  });
});
