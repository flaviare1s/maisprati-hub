import api from "../services/api";

export const fetchPosts = async () => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    throw error;
  }
};

export const fetchComments = async (postId) => {
  try {
    // Corrigido para usar o endpoint correto do backend
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    throw error;
  }
};

export const createPost = async (authorId, title, content) => {
  try {
    const response = await api.post("/posts", {
      authorId,
      title,
      content,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    throw error;
  }
};

export const addComment = async (postId, userId, content) => {
  try {
    // Corrigido para usar o endpoint correto do backend
    const response = await api.post(`/posts/${postId}/comments`, {
      userId, // ou authorId, dependendo do modelo Comment
      content,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar comentário:", error);
    throw error;
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar comentário:", error);
    throw error;
  }
};
