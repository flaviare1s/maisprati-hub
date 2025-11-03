import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../../../pages/Home'; // Ajuste o caminho conforme a estrutura real do seu projeto

// Mockando as importações de imagens, pois elas se transformam em strings de URL/path
// Isso impede erros de processamento de asset no ambiente de teste.
vi.mock('../../../assets/images/home-personagem.png', () => ({ default: 'home-personagem.png' }));
vi.mock('../../../assets/images/pratihub_homepage_option_5-removebg-preview.png', () => ({ default: 'card-equipe.png' }));
vi.mock('../../../assets/images/pratihub_homepage_option_6-removebg-preview.png', () => ({ default: 'card-projeto.png' }));
vi.mock('../../../assets/images/pratihub_homepage_complete_v1-removebg-preview.png', () => ({ default: 'card-tutor.png' }));
vi.mock('../../../assets/images/pratihub_homepage_option_4-removebg-preview.png', () => ({ default: 'card-entrega.png' }));


describe('Home Page', () => {

  const renderComponent = () => {
    // É essencial envolver componentes que usam <Link> com <BrowserRouter>
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  // --- Testes da Seção HERO ---
  describe('Seção Hero (Título e Subtítulo)', () => {
    it('deve renderizar o título principal', () => {
      renderComponent();

      const title = screen.getByText(/Conexões Inteligentes\. Projetos Perfeitos\./);
      expect(title).toBeInTheDocument();

      // Verifica o segundo título (que está separado por <br /> mas faz parte do h1)
      expect(title).toHaveTextContent('Conexões Inteligentes. Projetos Perfeitos.');
    });

    it('deve renderizar o subtítulo de descrição', () => {
      renderComponent();

      expect(
        screen.getByText(/Organize equipes, agende reuniões e conecte-se ao professor de forma simples e prática\./)
      ).toBeInTheDocument();
    });

    it('deve renderizar a imagem principal do personagem', () => {
      renderComponent();

      const image = screen.getByAltText('Personagem Home');
      expect(image).toBeInTheDocument();
      // Verifica se o mock da imagem foi aplicado corretamente
      expect(image).toHaveAttribute('src', 'home-personagem.png');
    });
  });

  // --- Testes da Seção CARDS ---
  describe('Seção Cards de Ações', () => {
    it('deve renderizar os 4 cards de ação', () => {
      renderComponent();

      // Verifica os títulos dos cards
      expect(screen.getByText('Crie sua equipe')).toBeInTheDocument();
      expect(screen.getByText('Organize seu projeto')).toBeInTheDocument();
      expect(screen.getByText('Interaja com os colegas')).toBeInTheDocument();
      expect(screen.getByText('Agende reuniões')).toBeInTheDocument();
    });

    it('deve renderizar todas as imagens dos cards com alt text correto', () => {
      renderComponent();

      expect(screen.getByAltText('Crie sua equipe')).toBeInTheDocument();
      expect(screen.getByAltText('Organize seu Projeto')).toBeInTheDocument();
      expect(screen.getByAltText('Organize com o Tutor')).toBeInTheDocument(); // Alt text do seu código
      expect(screen.getByAltText('Entregue seu Projeto')).toBeInTheDocument(); // Alt text do seu código
    });
  });

  // --- Testes dos Botões de Ação ---
  describe('Seção Botões de Ação (Links)', () => {
    it('deve renderizar o botão "Já tenho cadastro" com o link correto para /login', () => {
      renderComponent();

      const loginLink = screen.getByRole('link', { name: /Já tenho cadastro/i });

      expect(loginLink).toBeInTheDocument();
      // O componente Link renderiza o 'to' como 'href'
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('deve renderizar o botão "Quero me cadastrar" com o link correto para /register', () => {
      renderComponent();

      const registerLink = screen.getByRole('link', { name: /Quero me cadastrar/i });

      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });
});
