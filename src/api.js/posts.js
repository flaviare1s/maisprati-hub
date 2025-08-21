import api from "../services/api";

export const fetchPosts = async () => {
  const { data: posts } = await api.get(`/posts?_sort=createdAt&_order=desc`);
  return posts.map((p) => ({
    id: p.id,
    authorId: p.authorId,
    title: p.title,
    content: p.content,
    createdAt: p.createdAt,
  }));
};

export const createPost = async (userId, title, content, tags = []) => {
  const newPost = {
    userId,
    title,
    content,
    tags,
    reactions: { fire: 0, heart: 0, lightbulb: 0 },
    responses: 0,
    createdAt: new Date().toISOString(),
  };

  const { data } = await api.post("/posts", newPost);
  return data;
};

export const fetchComments = async (postId) => {
  const { data } = await api.get(
    `/comments?postId=${postId}&_expand=user&_sort=createdAt&_order=asc`
  );

  return data.map((c) => ({
    ...c,
    author: c.user || { username: "Desconhecido", avatar: "" },
    createdAt: c.createdAt,
  }));
};

export const addComment = async (postId, userId, content) => {
  const newComment = {
    postId,
    userId,
    content,
    createdAt: new Date().toISOString(),
  };

  const { data } = await api.post("/comments", newComment);
  return data;
};
