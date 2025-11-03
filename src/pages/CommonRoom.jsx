import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaCrown, FaComments } from "react-icons/fa";
import toast from "react-hot-toast";
import { fetchUsers } from "../api.js/users";
import { NoTeamList } from "../components/NoTeamList";
import {
  fetchComments,
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  deleteComment,
  addComment,
  updateComment
} from "../api.js/forum";
import { Forum } from "../components/Forum";
import { useTeam } from "../contexts/TeamContext";
import { createNotification } from "../api.js/notifications";

export const CommonRoom = () => {
  const { userInTeam } = useTeam();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("forum");
  const [newPost, setNewPost] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [heroes, setHeroes] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroes = async () => {
      try {
        const users = await fetchUsers();
        const filtered = users.filter((u) => !u.hasGroup && u.wantsGroup);
        setHeroes(filtered);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error("Não foi possível carregar os heróis.");
      }
    };
    loadHeroes();
  }, []);

  useEffect(() => {
    loadForumPosts();
  }, []);

  const loadForumPosts = async () => {
    try {
      setLoading(true);
      const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()]);

      const postsWithAuthorsAndComments = await Promise.all(
        posts.map(async (post) => {
          // Normalizar IDs (MongoDB usa _id)
          const postId = post.id || post._id;
          const postAuthorId = post.authorId?.toString();

          // Buscar autor do post
          const author = users.find((u) => {
            const userId = u.id || u._id;
            return userId?.toString() === postAuthorId;
          });

          const commentsData = await fetchComments(postId);

          const commentsWithAuthors = commentsData.map((c) => {
            // Normalizar o ID do comment
            const commentId = c.id || c._id;

            // O backend já retorna o objeto author completo!
            let commentAuthorId;
            let commentAuthor;

            if (c.author && typeof c.author === 'object') {
              // Usar diretamente o objeto author que vem do backend
              commentAuthorId = c.author.id;
              commentAuthor = c.author;
            } else {
              // Fallback para busca manual (caso não venha o author)
              commentAuthorId = (c.authorId || c.userId)?.toString();
              commentAuthor = users.find(u => {
                const userId = u.id || u._id;
                return userId?.toString() === commentAuthorId;
              });
            }

            return {
              ...c,
              id: commentId,
              authorId: commentAuthorId,
              author: commentAuthor?.codename || commentAuthor?.name || "Desconhecido",
              avatar: commentAuthor?.avatar || "/src/assets/images/avatar/default.png",
            };
          });

          return {
            ...post,
            id: postId,
            authorId: postAuthorId,
            author: author?.codename || author?.name || "Desconhecido",
            avatar: author?.avatar || "/src/assets/images/avatar/default.png",
            comments: commentsWithAuthors,
          };
        })
      );

      setForumPosts(postsWithAuthorsAndComments);
    } catch (error) {
      console.error("Erro ao buscar posts do fórum:", error);
      toast.error("Não foi possível carregar os posts do fórum.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = () => {
    navigate("/team-select");
  };

  const handleStartChat = (whatsapp) => {
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/55${cleanWhatsapp}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Abrindo WhatsApp! 📱");
  };

  const handleSendInvite = async (hero) => {
    if (user.type === "student" && userInTeam) {
      try {
        const notification = {
          userId: hero.id,
          title: "Convite para Guilda",
          message: `${user.codename} - ${user.name} convidou você para entrar na guilda dele!`,
          createdAt: new Date().toISOString(),
          type: "guild-invite",
          fromUserId: user.id,
        };

        await createNotification(notification);
        toast.success(`Convite enviado para ${hero.codename}!`);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao enviar convite");
      }
    } else {
      toast.error("Você não pode enviar convites.");
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast.error("Escreva algo antes de postar!");
      return;
    }

    if (!user) {
      toast.error("Usuário não autenticado!");
      return;
    }

    try {
      await createPost(
        user.id,
        "Post do Fórum",
        newPost.trim()
      );

      toast.success("Post criado com sucesso! 🎉");
      setNewPost("");
      setShowNewPost(false);

      await loadForumPosts();
    } catch (error) {
      console.error("Erro ao criar post:", error);
      toast.error("Erro ao criar post. Tente novamente.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);

      setForumPosts(prev => prev.filter(post => post.id !== postId));

      toast.success("Post deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      toast.error("Erro ao deletar post. Tente novamente.");
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId);

      setForumPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            }
            : post
        )
      );

      toast.success("Comentário deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      toast.error("Erro ao deletar comentário. Tente novamente.");
    }
  };

  const handleUpdatePost = async (postId, newTitle, newContent) => {
    try {
      await updatePost(postId, newTitle, newContent);

      setForumPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, title: newTitle, content: newContent }
            : post
        )
      );

      toast.success("Post atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar post:", error);
      toast.error("Erro ao atualizar post. Tente novamente.");
    }
  };

  const handleUpdateComment = async (commentId, postId, newContent) => {
    try {
      await updateComment(commentId, newContent);

      setForumPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.id === commentId
                  ? { ...comment, content: newContent }
                  : comment
              )
            }
            : post
        )
      );

      toast.success("Comentário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
      toast.error("Erro ao atualizar comentário. Tente novamente.");
    }
  };

  const handleAddComment = async (postId, userId, content) => {
    try {
      const newComment = await addComment(postId, userId, content);

      const users = await fetchUsers();
      const commentAuthor = users.find(u => u.id === userId) || user;

      const commentWithUser = {
        ...newComment,
        authorId: userId,
        author: commentAuthor?.codename || commentAuthor?.name || "Desconhecido",
        avatar: commentAuthor?.avatar || "/src/assets/images/avatar/default.png",
      };
      setForumPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
              ...post,
              comments: [...(post.comments || []), commentWithUser]
            }
            : post
        )
      );

      toast.success("Comentário adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      toast.error("Erro ao adicionar comentário. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-logo mb-2 flex items-center justify-center gap-3">
            <FaCrown className="text-yellow-500 animate-pulse" />
            Taverna dos Heróis
            <FaCrown className="text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-gray-muted">
            O ponto de encontro dos aventureiros independentes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-light rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-200">
              <div className="text-center mb-4">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-purple-400 mx-auto mb-3"
                  />
                )}
                <h3 className="font-bold text-gray-800">
                  {user?.codename || user?.name}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2"></div>
              </div>

              {user.type === "student" && !userInTeam && (
                <button
                  onClick={handleJoinTeam}
                  className="w-full bg-gradient-to-r from-blue-logo to-orange-logo text-light font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4 cursor-pointer"
                >
                  Entrar em Guilda
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-light rounded-lg shadow-md mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("forum")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors cursor-pointer ${activeTab === "forum"
                    ? "border-b-2 border-orange-logo text-light bg-blue-logo"
                    : "text-gray-600 hover:text-blue-logo"
                    }`}
                >
                  <FaComments className="inline mr-2" />
                  Fórum de Conexões
                </button>
                <button
                  onClick={() => setActiveTab("heroes")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors cursor-pointer ${activeTab === "heroes"
                    ? "border-b-2 border-orange-logo text-light bg-blue-logo"
                    : "text-gray-600 hover:text-blue-logo"
                    }`}
                >
                  <HiOutlineUserGroup className="inline mr-2" />
                  Heróis sem Guilda ({heroes.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === "forum" && (
                  <>
                    {loading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-logo"></div>
                      </div>
                    ) : (
                      <Forum
                        forumPosts={forumPosts}
                        newPost={newPost}
                        setNewPost={setNewPost}
                        showNewPost={showNewPost}
                        setShowNewPost={setShowNewPost}
                        handleCreatePost={handleCreatePost}
                        currentUser={user}
                        onDeletePost={handleDeletePost}
                        onUpdatePost={handleUpdatePost}
                        onDeleteComment={handleDeleteComment}
                        onUpdateComment={handleUpdateComment}
                        onAddComment={handleAddComment}
                      />
                    )}
                  </>
                )}

                {activeTab === "heroes" && (
                  <NoTeamList
                    heroes={heroes}
                    handleStartChat={handleStartChat}
                    handleSendInvite={handleSendInvite}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
