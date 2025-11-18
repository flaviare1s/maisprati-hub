import { render, screen, within } from '@testing-library/react';
import { Forum } from '../../../components/Forum.jsx';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// --- Dados Mockados ---
const MOCK_USER = { id: 'u1', name: 'John Doe', type: 'student', avatar: '/avatar.png' };
const MOCK_ADMIN = { id: 'a1', name: 'Admin User', type: 'admin' };

const MOCK_POSTS = [
  {
    id: 'p1',
    authorId: 'u1',
    author: 'John Doe',
    avatar: '/user.png',
    content: 'Primeiro post sobre o projeto.',
    createdAt: new Date().toISOString(),
    comments: [
      { id: 'c1', postId: 'p1', authorId: 'a1', author: 'Admin User', avatar: '/admin.png', content: 'Ótima ideia.', createdAt: new Date().toISOString() },
    ],
  },
  {
    id: 'p2',
    authorId: 'u2',
    author: 'Jane Smith',
    avatar: '/jane.png',
    content: 'Dúvida sobre o cronograma.',
    createdAt: new Date().toISOString(),
    comments: [],
  },
];

// --- Mocks de Callbacks ---
const mockCallbacks = {
  handleCreatePost: vi.fn(),
  onDeletePost: vi.fn(),
  onUpdatePost: vi.fn(),
  onAddComment: vi.fn(),
  onDeleteComment: vi.fn(),
  onUpdateComment: vi.fn(),
};

// --- Props Mínimas (Estado inicial para o teste) ---
const baseProps = {
  forumPosts: MOCK_POSTS,
  newPost: "",
  setNewPost: vi.fn(),
  showNewPost: false,
  setShowNewPost: vi.fn(),
  currentUser: MOCK_USER,
  ...mockCallbacks,
};

describe('Forum - Testes de Interatividade e Fluxo de Posts/Comentários', () => {
  const user = userEvent.setup();

  // --- 1. Testes de Renderização e Criação de Post (Estado Condicional) ---

  it('deve exibir o botão "Criar Novo Post" e ocultar o formulário inicialmente', () => {
    render(<Forum {...baseProps} />);

    // O botão deve estar visível
    expect(screen.getByRole('button', { name: /Criar Novo Post/i })).toBeInTheDocument();

    // O formulário (textarea) deve estar oculto
    expect(screen.queryByPlaceholderText(/Compartilhe algo/i)).not.toBeInTheDocument();
  });

  it('deve mostrar o formulário e ocultar o botão ao clicar em "Criar Novo Post"', async () => {
    // Simula o estado onde o showNewPost é false
    render(<Forum {...baseProps} showNewPost={false} />);

    const createButton = screen.getByRole('button', { name: /Criar Novo Post/i });
    await user.click(createButton);

    // Verifica se a prop setShowNewPost(true) foi chamada
    expect(baseProps.setShowNewPost).toHaveBeenCalledWith(true);

    // --- NOTE: Testar a visibilidade total só é possível se renderizarmos com showNewPost: true ---
  });

  it('deve habilitar o botão Publicar quando o textarea é preenchido', () => {
    // Simula o estado onde o formulário está aberto e a prop newPost tem conteúdo
    const props = { ...baseProps, showNewPost: true, newPost: "Meu novo post" };
    render(<Forum {...props} />);

    const publishButton = screen.getByRole('button', { name: /Publicar/i });

    // Deve estar HABILITADO
    expect(publishButton).not.toBeDisabled();
  });

  // --- 2. Testes de Interação com Posts (Excluir e Editar) ---

  it('deve permitir a exclusão de um post pelo autor', async () => {
    // currentUser é o autor do post 'p1'
    render(<Forum {...baseProps} currentUser={MOCK_USER} />);

    // 1. O botão Deletar deve estar visível no post 'p1'
    const postElement = screen.getByText(/Primeiro post sobre o projeto/i).closest('.forum-post');
    const deleteButton = within(postElement).getByRole('button', { name: 'Deletar post' });

    await user.click(deleteButton);

    // 2. Verifica se a callback foi chamada com o ID correto
    expect(mockCallbacks.onDeletePost).toHaveBeenCalledWith('p1');
  });

  it('deve iniciar e salvar a edição de um post pelo autor', async () => {
    render(<Forum {...baseProps} currentUser={MOCK_USER} />);

    const postElement = screen.getByText(/Primeiro post sobre o projeto/i).closest('.forum-post');
    const editButton = within(postElement).getByRole('button', { name: 'Editar post' });

    // 1. Inicia a edição (clica em editar)
    await user.click(editButton);

    // 2. O conteúdo deve se transformar em textarea com o conteúdo original
    const textarea = within(postElement).getByRole('textbox');
    expect(textarea).toHaveValue('Primeiro post sobre o projeto.');

    // 3. Modifica o conteúdo e salva
    await user.clear(textarea);
    await user.type(textarea, 'Conteúdo editado e salvo.');

    const saveButton = within(postElement).getByRole('button', { name: 'Salvar' });
    await user.click(saveButton);

    // 4. Verifica a callback de update com o novo conteúdo
    expect(mockCallbacks.onUpdatePost).toHaveBeenCalledWith('p1', 'Post do Fórum', 'Conteúdo editado e salvo.');

    // 5. Verifica se o modo de edição é desativado
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
  });

  // --- 3. Testes de Comentários (Adicionar e Visualizar) ---

  it('deve alternar a visibilidade dos comentários (Mostrar/Ocultar)', async () => {
    render(<Forum {...baseProps} />);
    const postElement = screen.getByText(/Primeiro post sobre o projeto/i).closest('.forum-post');

    // Comentários devem estar OCULTOS por padrão
    expect(within(postElement).queryByText('Ótima ideia.')).not.toBeInTheDocument();

    // 1. Clica em MOSTRAR
    const showButton = within(postElement).getByRole('button', { name: 'Mostrar' });
    await user.click(showButton);

    // 2. Verifica se o comentário está visível e o botão mudou para 'Ocultar'
    expect(within(postElement).getByText('Ótima ideia.')).toBeInTheDocument();
    expect(within(postElement).getByRole('button', { name: 'Ocultar' })).toBeInTheDocument();

    // 3. Clica em OCULTAR
    const hideButton = within(postElement).getByRole('button', { name: 'Ocultar' });
    await user.click(hideButton);

    // 4. Verifica se o comentário foi ocultado
    expect(within(postElement).queryByText('Ótima ideia.')).not.toBeInTheDocument();
  });

  it('deve adicionar um novo comentário e limpar o input', async () => {
    // Simula o estado onde o currentUser é 'u2' (Jane Smith)
    render(<Forum {...baseProps} currentUser={{ ...MOCK_USER, id: 'u2', name: 'Jane Smith' }} />);
    const postElement = screen.getByText(/Dúvida sobre o cronograma/i).closest('.forum-post'); // Post p2

    // 1. Clica em 'Comentar' para abrir o textarea
    const commentButton = within(postElement).getByRole('button', { name: 'Comentar' });
    await user.click(commentButton);

    // 2. Preenche o textarea
    const textarea = within(postElement).getByPlaceholderText(/Escreva um comentário/i);
    await user.type(textarea, 'Concordo com a dúvida.');

    // 3. Clica em 'Comentar' para enviar
    const submitButton = within(postElement).getByRole('button', { name: 'Comentar' });
    await user.click(submitButton);

    // 4. Verifica se a callback de adição foi chamada
    expect(mockCallbacks.onAddComment).toHaveBeenCalledWith(
      'p2', // postId
      'u2', // currentUserId
      'Concordo com a dúvida.' // content
    );

    // 5. Verifica se o input de comentário foi fechado
    expect(within(postElement).queryByPlaceholderText(/Escreva um comentário/i)).not.toBeInTheDocument();
  });
});
