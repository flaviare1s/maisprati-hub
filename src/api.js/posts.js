import api from "../services/api";

export const fetchPosts = async () => {
  const { data: posts } = await api.get(`/posts?_sort=createdAt&_order=desc`);
  return posts.map((p) => ({
    id: p.id,
    authorId: p.authorId || p.userId,
    title: p.title,
    content: p.content,
    createdAt: p.createdAt,
  }));
};

export const createPost = async (userId, title, content, tags = []) => {
  const newPost = {
    authorId: userId,
    title,
    content,
    tags,
    postType: "knowledge_sharing",
    isActive: true,
    reactions: { fire: 0, heart: 0, lightbulb: 0 },
    responses: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { data } = await api.post("/posts", newPost);
  return data;
};

export const deletePost = async (postId) => {
  // Primeiro busca todos os comentários do post
  const { data: comments } = await api.get(`/comments?postId=${postId}`);

  // Deleta todos os comentários
  await Promise.all(
    comments.map((comment) => api.delete(`/comments/${comment.id}`))
  );

  // Depois deleta o post
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
};

export const fetchComments = async (postId) => {
  const { data } = await api.get(
    `/comments?postId=${postId}&_sort=createdAt&_order=asc`
  );

  // Retorna os dados básicos do comentário, deixando o processamento
  // dos dados do autor para o componente que tem acesso à lista de usuários
  return data.map((c) => ({
    ...c,
    authorId: c.authorId || c.userId,
    createdAt: c.createdAt,
  }));
};

export const addComment = async (postId, userId, content) => {
  const newComment = {
    postId,
    authorId: userId,
    content,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  const { data } = await api.post("/comments", newComment);
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

// Função para buscar posts com seus comentários e informações dos autores
export const fetchPostsWithComments = async () => {
  try {
    // Buscar posts
    const { data: posts } = await api.get(
      `/posts?_sort=createdAt&_order=desc&_expand=user`
    );

    // Para cada post, buscar os comentários
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const { data: comments } = await api.get(
          `/comments?postId=${post.id}&_expand=user&_sort=createdAt&_order=asc`
        );

        return {
          id: post.id,
          authorId: post.authorId || post.userId,
          title: post.title,
          content: post.content,
          author:
            post.user?.codename || post.user?.name || "Usuário Desconhecido",
          avatar: post.user?.avatar || "",
          createdAt: post.createdAt,
          comments: comments.map((comment) => ({
            id: comment.id,
            authorId: comment.authorId || comment.userId,
            content: comment.content,
            author:
              comment.user?.codename ||
              comment.user?.name ||
              "Usuário Desconhecido",
            avatar: comment.user?.avatar || "",
            createdAt: comment.createdAt,
          })),
        };
      })
    );

    return postsWithComments;
  } catch (error) {
    console.error("Erro ao buscar posts com comentários:", error);
    throw error;
  }
};

// Função para buscar um usuário por ID
export const fetchUserById = async (userId) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};
