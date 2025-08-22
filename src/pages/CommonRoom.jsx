import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaCrown, FaComments } from "react-icons/fa";
import toast from "react-hot-toast";
import { fetchUsers } from "../api.js/users";
import { NoTeamList } from "../components/NoTeamList";
import { fetchComments, fetchPosts } from "../api.js/posts";
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
    const loadForumPosts = async () => {
      try {
        const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()]);

        const postsWithAuthorsAndComments = await Promise.all(
          posts.map(async (post) => {
            const author = users.find((u) => u.id === post.authorId);
            const commentsData = await fetchComments(post.id);

            const commentsWithAuthors = commentsData.map((c) => {
              const commentAuthor = users.find((u) => u.id === c.authorId);
              return {
                ...c,
                author: commentAuthor?.username || "Desconhecido",
                avatar:
                  commentAuthor?.avatar ||
                  "/src/assets/images/avatar/default.png",
              };
            });

            return {
              ...post,
              author: author?.username || "Desconhecido",
              avatar: author?.avatar || "/src/assets/images/avatar/default.png",
              comments: commentsWithAuthors,
            };
          })
        );

        setForumPosts(postsWithAuthorsAndComments);
      } catch (error) {
        console.error("Erro ao buscar posts do fórum:", error);
        toast.error("Não foi possível carregar os posts do fórum.");
      }
    };

    loadForumPosts();
  }, []);

  const handleJoinTeam = () => {
    navigate("/team-select");
  };

  const handleStartChat = (whatsapp) => {
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/55${cleanWhatsapp}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Abrindo WhatsApp! �");
  };

  const handleSendInvite = async (hero) => {
    if (user.type === "student" && userInTeam) {
      try {
        const notification = {
          userId: hero.id,
          title: "Convite para Guilda",
          message: `${user.codename} - ${user.username} convidou você para entrar na guilda dele!`,
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

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast.error("Escreva algo antes de postar!");
      return;
    }
    toast.success("Post criado com sucesso! 🎉");
    setNewPost("");
    setShowNewPost(false);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-logo mb-2 flex items-center justify-center gap-3">
            <FaCrown className="text-yellow-500 animate-pulse" />
            Taverna dos Hérois
            <FaCrown className="text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-gray-muted">
            O ponto de encontro dos aventureiros independentes
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
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
                  {user?.codename || user?.username}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2"></div>
              </div>

              {user.type === "student" && !userInTeam && (
                <button
                  onClick={handleJoinTeam}
                  className="w-full bg-gradient-to-r from-blue-logo to-orange-logo text-light font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
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
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors cursor-pointer ${
                    activeTab === "forum"
                      ? "border-b-2 border-orange-logo text-light bg-blue-logo"
                      : "text-gray-600 hover:text-blue-logo"
                  }`}
                >
                  <FaComments className="inline mr-2" />
                  Fórum de Conexões
                </button>
                <button
                  onClick={() => setActiveTab("heroes")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors cursor-pointer ${
                    activeTab === "heroes"
                      ? "border-b-2 border-orange-logo text-light bg-blue-logo"
                      : "text-gray-600 hover:text-blue-logo"
                  }`}
                >
                  <HiOutlineUserGroup className="inline mr-2" />
                  Hérois sem Guilda ({heroes.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === "forum" && (
                  <Forum
                    forumPosts={forumPosts}
                    newPost={newPost}
                    setNewPost={setNewPost}
                    showNewPost={showNewPost}
                    setShowNewPost={setShowNewPost}
                    handleCreatePost={handleCreatePost}
                  />
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
