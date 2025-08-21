import { api } from "../services/api";

// ============ POSTS DO FÓRUM ============

// Buscar todos os posts do fórum
export const fetchForumPosts = async () => {
  try {
    const response = await api.get(
      "/forumPosts?_expand=author&_embed=forumComments&_embed=forumReactions"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar posts do fórum:", error);
    throw new Error("Erro ao carregar posts");
  }
};

// Criar novo post
export const createForumPost = async (postData) => {
  try {
    const newPost = {
      ...postData,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await api.post("/forumPosts", newPost);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw new Error("Erro ao criar post");
  }
};

// Deletar post
export const deleteForumPost = async (postId) => {
  try {
    await api.patch(`/forumPosts/${postId}`, { isActive: false });
    return true;
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    throw new Error("Erro ao deletar post");
  }
};

// ============ REAÇÕES ============

// Adicionar reação a um post
export const addReaction = async (postId, userId, reactionType) => {
  try {
    // Verificar se já existe reação do usuário para este post
    const existingReactions = await api.get(
      `/forumReactions?postId=${postId}&userId=${userId}`
    );

    if (existingReactions.data.length > 0) {
      // Se já existe, atualizar tipo de reação
      const reactionId = existingReactions.data[0].id;
      const response = await api.patch(`/forumReactions/${reactionId}`, {
        reactionType,
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } else {
      // Se não existe, criar nova reação
      const newReaction = {
        postId,
        userId,
        reactionType,
        createdAt: new Date().toISOString(),
      };
      const response = await api.post("/forumReactions", newReaction);
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao adicionar reação:", error);
    throw new Error("Erro ao reagir ao post");
  }
};

// Remover reação
export const removeReaction = async (postId, userId) => {
  try {
    const reactions = await api.get(
      `/forumReactions?postId=${postId}&userId=${userId}`
    );

    if (reactions.data.length > 0) {
      await api.delete(`/forumReactions/${reactions.data[0].id}`);
    }

    return true;
  } catch (error) {
    console.error("Erro ao remover reação:", error);
    throw new Error("Erro ao remover reação");
  }
};

// ============ COMENTÁRIOS ============

// Buscar comentários de um post
export const fetchPostComments = async (postId) => {
  try {
    const response = await api.get(
      `/forumComments?postId=${postId}&_expand=author`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    throw new Error("Erro ao carregar comentários");
  }
};

// Adicionar comentário
export const addComment = async (postId, authorId, content) => {
  try {
    const newComment = {
      postId,
      authorId,
      content,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const response = await api.post("/forumComments", newComment);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    throw new Error("Erro ao comentar");
  }
};

// ============ ESTATÍSTICAS ============

// Buscar estatísticas de um post (reações e comentários)
export const getPostStatistics = async (postId) => {
  try {
    const [reactions, comments] = await Promise.all([
      api.get(`/forumReactions?postId=${postId}`),
      api.get(`/forumComments?postId=${postId}&isActive=true`),
    ]);

    // Contar reações por tipo
    const reactionCounts = reactions.data.reduce((acc, reaction) => {
      acc[reaction.reactionType] = (acc[reaction.reactionType] || 0) + 1;
      return acc;
    }, {});

    return {
      reactions: reactionCounts,
      commentsCount: comments.data.length,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    throw new Error("Erro ao carregar estatísticas");
  }
};
