import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CommonRoom } from '../../../pages/CommonRoom';
import { useAuth } from '../../../hooks/useAuth';
import { useTeam } from '../../../contexts/TeamContext';
import * as usersApi from '../../../api/users';
import * as forumApi from '../../../api/forum';
import * as notificationsApi from '../../../api/notifications';
import toast from 'react-hot-toast';

// Mocks
vi.mock('../../../hooks/useAuth');
vi.mock('../../../contexts/TeamContext');
vi.mock('../../../api/users');
vi.mock('../../../api/forum');
vi.mock('../../../api/notifications');
vi.mock('react-hot-toast');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// MOCK do NoTeamList:
vi.mock('../../../components/NoTeamList', () => ({
  NoTeamList: ({ heroes, handleStartChat, handleSendInvite }) => (
    <div data-testid="no-team-list">
      {heroes.map(hero => (
        <div key={hero.id} data-testid={`hero-${hero.id}`}>
          <span>{hero.codename}</span>
          <button onClick={() => handleStartChat(hero.whatsapp)}>Chat</button>
          <button onClick={() => handleSendInvite(hero)}>Convidar</button>
        </div>
      ))}
    </div>
  )
}));

// MOCK do Forum:
vi.mock('../../../components/Forum', () => ({
  Forum: ({ forumPosts, onAddComment, onDeletePost, onUpdatePost, handleCreatePost }) => (
    <div data-testid="forum">
      {forumPosts.length === 0 && (
        <div data-testid="forum-empty-state">
          <button onClick={handleCreatePost}>Criar Novo Post</button>
          <p>Nenhum post ainda. Seja o primeiro a compartilhar!</p>
        </div>
      )}
      {forumPosts.map(post => (
        <div key={post.id} data-testid={`post-${post.id}`}>
          <span>{post.content}</span>
          <button onClick={() => onDeletePost(post.id)}>Delete Post</button>
          <button onClick={() => onUpdatePost(post.id, 'New Title', 'New Content')}>
            Update Post
          </button>
          <button onClick={() => onAddComment(post.id, 'user-1', 'Test comment')}>
            Add Comment
          </button>
        </div>
      ))}
    </div>
  )
}));

describe('CommonRoom Page', () => {
  const mockUser = {
    id: 'user-1',
    name: 'João Silva',
    codename: 'Frontend Iniciante',
    avatar: '/avatar.png',
    type: 'student'
  };

  const mockHeroes = [
    {
      id: 'hero-1',
      name: 'Maria Santos',
      codename: 'Backend Avançado',
      whatsapp: '11999999999',
      hasGroup: false,
      wantsGroup: true
    },
    {
      id: 'hero-2',
      name: 'Pedro Costa',
      codename: 'FullStack Expert',
      whatsapp: '11988888888',
      hasGroup: false,
      wantsGroup: true
    }
  ];

  const mockPosts = [
    {
      id: 'post-1',
      authorId: 'user-1',
      title: 'Post Title',
      content: 'Post Content',
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      user: mockUser
    });

    useTeam.mockReturnValue({
      userInTeam: true
    });

    usersApi.fetchUsers.mockResolvedValue([mockUser, ...mockHeroes]);
    forumApi.fetchPosts.mockResolvedValue(mockPosts);
    forumApi.fetchComments.mockResolvedValue([]);
    forumApi.createPost.mockResolvedValue({ success: true });
    forumApi.deletePost.mockResolvedValue({ success: true });
    forumApi.updatePost.mockResolvedValue({ success: true });
    forumApi.addComment.mockResolvedValue({
      id: 'comment-1',
      content: 'Test comment',
      authorId: 'user-1'
    });
    notificationsApi.createNotification.mockResolvedValue({ success: true });

    toast.success = vi.fn();
    toast.error = vi.fn();

    // Mock window.open
    globalThis.open = vi.fn();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CommonRoom />
      </BrowserRouter>
    );
  };

  describe('Renderização Inicial', () => {
    it('deve renderizar título da página', () => {
      renderComponent();

      expect(screen.getByText('Taverna dos Heróis')).toBeInTheDocument();
    });

    it('deve renderizar subtítulo', () => {
      renderComponent();

      expect(screen.getByText('O ponto de encontro dos aventureiros independentes')).toBeInTheDocument();
    });

    it('deve mostrar informações do usuário logado', () => {
      renderComponent();

      expect(screen.getByText(mockUser.codename)).toBeInTheDocument();
      expect(screen.getByAltText('Avatar')).toHaveAttribute('src', mockUser.avatar);
    });

    it('deve mostrar botão de entrar em guilda se não estiver em time', () => {
      useTeam.mockReturnValue({ userInTeam: false });

      renderComponent();

      expect(screen.getByText('Entrar em Guilda')).toBeInTheDocument();
    });

    it('não deve mostrar botão de entrar em guilda se já estiver em time', () => {
      useTeam.mockReturnValue({ userInTeam: true });

      renderComponent();

      expect(screen.queryByText('Entrar em Guilda')).not.toBeInTheDocument();
    });
  });

  describe('Tabs de Navegação', () => {
    it('deve renderizar tab do fórum', () => {
      renderComponent();

      expect(screen.getByText(/Fórum de Conexões/)).toBeInTheDocument();
    });

    it('deve renderizar tab de heróis sem guilda', async () => {
      renderComponent();

      await screen.findByText(/Heróis sem Guilda \(2\)/);
    });

    it('deve iniciar com tab do fórum ativa', () => {
      renderComponent();

      const forumTab = screen.getByText(/Fórum de Conexões/).closest('button');
      expect(forumTab).toHaveClass('bg-blue-logo');
    });

    it('deve alternar para tab de heróis', async () => {
      renderComponent();

      const heroesTab = screen.getByText(/Heróis sem Guilda/).closest('button');
      fireEvent.click(heroesTab);

      await screen.findByTestId('no-team-list');

      const activeTab = screen.getByText(/Heróis sem Guilda/).closest('button');
      expect(activeTab).toHaveClass('bg-blue-logo');
    });
  });

  describe('Carregamento de Dados', () => {
    it('deve carregar lista de heróis na inicialização', async () => {
      renderComponent();

      await waitFor(() => {
        expect(usersApi.fetchUsers).toHaveBeenCalled();
      });
    });

    it('deve carregar posts do fórum na inicialização', async () => {
      renderComponent();

      await waitFor(() => {
        expect(forumApi.fetchPosts).toHaveBeenCalled();
      });
    });

    it('deve filtrar heróis sem grupo que querem grupo', async () => {
      renderComponent();

      await screen.findByText(/Heróis sem Guilda \(2\)/);
    });

    it('deve mostrar loading enquanto carrega posts', () => {
      forumApi.fetchPosts.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockPosts), 100))
      );
      usersApi.fetchUsers.mockImplementationOnce(
        () => new Promise(resolve => resolve([mockUser, ...mockHeroes]))
      );

      const { container } = renderComponent();

      const loadingSpinner = container.querySelector('.animate-spin');

      expect(loadingSpinner).toBeInTheDocument();
    });

  });

  describe('Funcionalidades do Fórum', () => {
    it('deve renderizar posts do fórum', async () => {
      renderComponent();

      await screen.findByTestId('forum');
      expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
    });

    it('deve permitir adicionar comentário', async () => {
      renderComponent();

      await screen.findByTestId('post-post-1');
      const addCommentButton = screen.getByText('Add Comment');
      fireEvent.click(addCommentButton);

      await waitFor(() => {
        expect(forumApi.addComment).toHaveBeenCalledWith('post-1', mockUser.id, 'Test comment');
        expect(toast.success).toHaveBeenCalledWith('Comentário adicionado com sucesso!');
      });
    });

    it('deve permitir deletar post', async () => {
      renderComponent();

      await screen.findByTestId('post-post-1');
      const deleteButton = screen.getByText('Delete Post');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(forumApi.deletePost).toHaveBeenCalledWith('post-1');
        expect(toast.success).toHaveBeenCalledWith('Post deletado com sucesso!');
      });
    });

    it('deve permitir atualizar post', async () => {
      renderComponent();

      await screen.findByTestId('post-post-1');
      const updateButton = screen.getByText('Update Post');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(forumApi.updatePost).toHaveBeenCalledWith('post-1', 'New Title', 'New Content');
        expect(toast.success).toHaveBeenCalledWith('Post atualizado com sucesso!');
      });
    });

    it('deve tratar erro ao adicionar comentário', async () => {
      forumApi.addComment.mockRejectedValueOnce(new Error('Error'));

      renderComponent();

      await screen.findByTestId('post-post-1');
      const addCommentButton = screen.getByText('Add Comment');
      fireEvent.click(addCommentButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erro ao adicionar comentário. Tente novamente.');
      });
    });
  });

  describe('Interação com Heróis', () => {
    it('deve abrir WhatsApp ao clicar em chat', async () => {
      renderComponent();

      const heroesTab = screen.getByText(/Heróis sem Guilda/).closest('button');
      fireEvent.click(heroesTab);

      await screen.findByTestId('no-team-list');

      await waitFor(() => {
        const chatButton = screen.getAllByText('Chat')[0];
        fireEvent.click(chatButton);
      });

      expect(globalThis.open).toHaveBeenCalledWith(
        'https://wa.me/5511999999999',
        '_blank'
      );
      expect(toast.success).toHaveBeenCalledWith('Abrindo WhatsApp! 📱');
    });

    it('deve enviar convite para herói', async () => {
      renderComponent();

      const heroesTab = screen.getByText(/Heróis sem Guilda/).closest('button');
      fireEvent.click(heroesTab);

      await screen.findByTestId('no-team-list');

      await waitFor(() => {
        const inviteButton = screen.getAllByText('Convidar')[0];
        fireEvent.click(inviteButton);
      });

      await waitFor(() => {
        expect(notificationsApi.createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 'hero-1',
            type: 'guild-invite',
            fromUserId: mockUser.id
          })
        );
        expect(toast.success).toHaveBeenCalledWith('Convite enviado para Backend Avançado!');
      });
    });

    it('não deve permitir enviar convite se não estiver em time', async () => {
      useTeam.mockReturnValue({ userInTeam: false });

      renderComponent();

      const heroesTab = screen.getByText(/Heróis sem Guilda/).closest('button');
      fireEvent.click(heroesTab);
      await screen.findByTestId('no-team-list');

      await waitFor(() => {
        const inviteButton = screen.getAllByText('Convidar')[0];
        fireEvent.click(inviteButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Você não pode enviar convites.');
        expect(notificationsApi.createNotification).not.toHaveBeenCalled();
      });
    });
  });

  describe('Navegação', () => {
    it('deve navegar para team-select ao clicar no botão', () => {
      useTeam.mockReturnValue({ userInTeam: false });

      renderComponent();

      const joinButton = screen.getByText('Entrar em Guilda');
      fireEvent.click(joinButton);

      expect(mockNavigate).toHaveBeenCalledWith('/team-select');
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erro ao carregar heróis', async () => {
      usersApi.fetchUsers.mockRejectedValueOnce(new Error('Network Error'));
      forumApi.fetchPosts.mockResolvedValue([]);

      renderComponent();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Não foi possível carregar os heróis.');
      });
    });

    it('deve tratar erro ao carregar posts', async () => {
      forumApi.fetchPosts.mockRejectedValueOnce(new Error('Network Error'));

      renderComponent();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Não foi possível carregar os posts do fórum.');
      });
    });

    it('deve tratar erro ao enviar convite', async () => {
      notificationsApi.createNotification.mockRejectedValueOnce(new Error('Error'));

      renderComponent();

      const heroesTab = screen.getByText(/Heróis sem Guilda/).closest('button');
      fireEvent.click(heroesTab);

      await screen.findByTestId('no-team-list');

      await waitFor(() => {
        const inviteButton = screen.getAllByText('Convidar')[0];
        fireEvent.click(inviteButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erro ao enviar convite');
      });
    });
  });

  describe('Contador de Heróis', () => {
    it('deve mostrar número correto de heróis', async () => {
      renderComponent();

      await screen.findByText(/Heróis sem Guilda \(2\)/);
    });

  });

  describe('Estado Vazio', () => {
    it('deve lidar com lista vazia de heróis', async () => {
      usersApi.fetchUsers.mockResolvedValue([mockUser]);

      renderComponent();

      await screen.findByText(/Heróis sem Guilda \(0\)/);

      const heroesTab = screen.getByText(/Heróis sem Guilda/).closest('button');
      fireEvent.click(heroesTab);

      const noTeamList = await screen.findByTestId('no-team-list');
      expect(noTeamList.children).toHaveLength(0);
    });

    it('deve lidar com lista vazia de posts', async () => {
      forumApi.fetchPosts.mockResolvedValue([]);

      renderComponent();

      await screen.findByTestId('forum');

      await screen.findByText(/Nenhum post ainda. Seja o primeiro a compartilhar!/);

      expect(screen.queryByTestId('post-post-1')).not.toBeInTheDocument();
    });
  });
});
