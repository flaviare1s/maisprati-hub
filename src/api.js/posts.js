import api from "../services/api";

export const fetchPosts = async () => {
  const { data } = await api.get(
    `/posts?_expand=user&_sort=createdAt&_order=desc`
  );

  return data.map((p) => ({
    ...p,
    tags: p.tags || [],
    reactions: p.reactions || { fire: 0, heart: 0, lightbulb: 0 },
    responses: p.responses || 0,
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

export const reactToPost = async (postId, type) => {
  const { data: post } = await api.get(`/posts/${postId}`);
  if (!post) throw new Error("Post não encontrado");

  const updated = {
    ...post,
    reactions: {
      ...post.reactions,
      [type]: (post.reactions?.[type] || 0) + 1,
    },
  };

  const { data } = await api.patch(`/posts/${postId}`, updated);
  return data;
};
