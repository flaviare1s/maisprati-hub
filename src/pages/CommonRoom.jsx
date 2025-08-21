import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserGroup, HiOutlineChat, HiOutlineFire } from "react-icons/hi";
import { FaCrown, FaComments, FaMagic, FaGamepad, FaHeart, FaLightbulb, FaWhatsapp} from "react-icons/fa";
import toast from 'react-hot-toast';
import { MdGroupAdd } from "react-icons/md";

// Mock data para demonstração - em produção viria de uma API
const HEROES_ONLINE = [
  { id: 1, codename: "Frontend Ninja", avatar: "/src/assets/images/avatar/avatares 1.png", specialty: "React", status: "looking", whatsapp: "(11) 99999-1111" },
  { id: 2, codename: "Backend Wizard", avatar: "/src/assets/images/avatar/avatares 2.png", specialty: "Node.js", status: "available", whatsapp: "(11) 99999-2222" },
  { id: 3, codename: "Design Guru", avatar: "/src/assets/images/avatar/avatares 4.png", specialty: "UI/UX", status: "chatting", whatsapp: "(11) 99999-3333" },
  { id: 4, codename: "FullStack Master", avatar: "/src/assets/images/avatar/avatares 5.png", specialty: "React + Node", status: "looking", whatsapp: "(11) 99999-4444" },
  { id: 5, codename: "DevOps Legend", avatar: "/src/assets/images/avatar/avatares 7.png", specialty: "Docker", status: "available", whatsapp: "(11) 99999-5555" }
];

const FORUM_POSTS = [
  {
    id: 1,
    author: "Console.Log Debugador",
    avatar: "/src/assets/images/avatar/avatares 8.png",
    title: "Procurando Front-end para projeto React! 🚀",
    content: "Estou montando uma equipe para desenvolver uma plataforma de e-learning. Preciso de alguém forte em React e CSS!",
    tags: ["React", "Frontend", "Urgente"],
    reactions: { fire: 5, heart: 3, lightbulb: 2 },
    timestamp: "5 min atrás",
    responses: 8
  },
  {
    id: 2,
    author: "Backend Refatorador",
    avatar: "/src/assets/images/avatar/avatares 9.png",
    title: "Dica: Como estruturar APIs REST eficientes 💡",
    content: "Vou compartilhar algumas práticas que aprendi para organizar rotas e middlewares de forma mais limpa...",
    tags: ["Backend", "API", "Dicas"],
    reactions: { lightbulb: 12, heart: 8, fire: 6 },
    timestamp: "15 min atrás",
    responses: 15
  },
  {
    id: 3,
    author: "Designer Iniciante",
    avatar: "/src/assets/images/avatar/avatares 10.png",
    title: "Alguém pode me ajudar com Figma? 🎨",
    content: "Sou novo no design e queria aprender mais sobre prototipagem. Alguém topa fazer pair programming?",
    tags: ["Design", "Figma", "Ajuda"],
    reactions: { heart: 9, lightbulb: 4, fire: 1 },
    timestamp: "30 min atrás",
    responses: 12
  }
];

export const CommonRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forum');
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const handleJoinTeam = () => {
    navigate('/team-select');
  };

  const handleReaction = (postId, reactionType) => {
    toast.success(`Reação ${reactionType} adicionada!`);
  };

  const handleStartChat = (whatsapp) => {
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanWhatsapp}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Abrindo WhatsApp! �");
  };

  const handleSendInvite = async () => {
    try {
      toast.success("Convite enviado! 🎉");
    } catch {
      toast.error("Erro ao enviar convite");
    }
  };


  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast.error("Escreva algo antes de postar!");
      return;
    }
    toast.success("Post criado com sucesso! 🎉");
    setNewPost('');
    setShowNewPost(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
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
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-200">
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
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                </div>
              </div>

              <button
                onClick={handleJoinTeam}
                className="w-full bg-gradient-to-r from-blue-logo to-orange-logo text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
              >
                Entrar em Guilda
              </button>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('forum')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 'forum'
                    ? 'border-b-2 border-orange-logo text-light bg-blue-logo'
                    : 'text-gray-600 hover:text-blue-logo'
                    }`}
                >
                  <FaComments className="inline mr-2" />
                  Fórum de Conexões
                </button>
                <button
                  onClick={() => setActiveTab('heroes')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 'heroes'
                    ? 'border-b-2 border-orange-logo text-light bg-blue-logo'
                    : 'text-gray-600 hover:text-blue-logo'
                    }`}
                >
                  <HiOutlineUserGroup className="inline mr-2" />
                  Hérois sem Guilda ({HEROES_ONLINE.length})
                </button>
              </div>

              {/* Conteúdo das Tabs */}
              <div className="p-6">
                {activeTab === 'forum' && (
                  <div>
                    {/* Novo Post */}
                    <div className="mb-6">
                      <button
                        onClick={() => setShowNewPost(!showNewPost)}
                        className="w-full bg-gradient-to-r from-blue-logo to-orange-logo text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FaMagic />
                        Criar Post Épico
                      </button>
                    </div>

                    {showNewPost && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-6 border-2 border-dashed border-blue-300">
                        <textarea
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          placeholder="Compartilhe suas ideias, procure parceiros ou ofereça ajuda..."
                          className="w-full p-3 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-logo"
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleCreatePost}
                            className="bg-blue-logo text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Publicar
                          </button>
                          <button
                            onClick={() => setShowNewPost(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Posts do Fórum */}
                    <div className="space-y-4">
                      {FORUM_POSTS.map((post) => (
                        <div key={post.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src={post.avatar}
                              alt={post.author}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-800">{post.author}</span>
                                <span className="text-gray-500 text-sm">{post.timestamp}</span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                              <p className="text-gray-600 text-sm mb-3">{post.content}</p>

                              <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                  {post.tags.map((tag) => (
                                    <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleReaction(post.id, 'fire')}
                                className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                              >
                                <HiOutlineFire /> {post.reactions.fire}
                              </button>
                              <button
                                onClick={() => handleReaction(post.id, 'heart')}
                                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                              >
                                <FaHeart /> {post.reactions.heart}
                              </button>
                              <button
                                onClick={() => handleReaction(post.id, 'lightbulb')}
                                className="flex items-center gap-1 hover:text-yellow-500 transition-colors"
                              >
                                <FaLightbulb /> {post.reactions.lightbulb}
                              </button>
                            </div>
                            <div className="flex items-center gap-1">
                              <HiOutlineChat />
                              {post.responses} respostas
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'heroes' && (
                  <div>
                    <div className="mb-4 text-center">
                      <p className="text-gray-muted">
                        Conecte-se com outros hérois e forme sua equipe dos sonhos!
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {HEROES_ONLINE.map((hero) => (
                        <div key={hero.id} className="bg-gradient-to-r from-white to-blue-50 border rounded-lg p-4 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={hero.avatar}
                              alt={hero.codename}
                              className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{hero.codename}</h4>
                              <p className="text-sm text-blue-logo">{hero.specialty}</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${hero.status === 'looking' ? 'bg-green-400' :
                              hero.status === 'available' ? 'bg-yellow-400' : 'bg-red-400'
                              }`}></div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStartChat(hero.whatsapp)}
                              className="flex items-center gap-2 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors justify-center cursor-pointer"
                            >
                              <FaWhatsapp />
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleSendInvite()}
                              className="flex items-center gap-2 bg-blue-logo text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors cursor-pointer"
                            >
                              <MdGroupAdd />
                              Convidar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
