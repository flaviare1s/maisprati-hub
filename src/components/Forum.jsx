import { useState } from "react";
import { FaTrash, FaPlus, FaPaperPlane, FaEdit } from "react-icons/fa";

export const Forum = ({
  forumPosts,
  newPost,
  setNewPost,
  showNewPost,
  setShowNewPost,
  handleCreatePost,
  currentUser,
  onDeletePost,
  onUpdatePost,
  onDeleteComment,
  onUpdateComment,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [editCommentContent, setEditCommentContent] = useState("");

  const handleCommentSubmit = (postId) => {
    const content = newComment[postId]?.trim();
    if (!content) return;

    onAddComment(postId, currentUser.id, content);
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
    setShowCommentInput((prev) => ({ ...prev, [postId]: false }));
  };

  // Funções para editar posts
  const handleStartEditPost = (post) => {
    setEditingPost(post.id);
    setEditPostContent(post.content);
  };

  const handleSaveEditPost = () => {
    if (!editPostContent.trim()) return;
    onUpdatePost(editingPost, "Post do Fórum", editPostContent.trim());
    setEditingPost(null);
    setEditPostContent("");
  };

  const handleCancelEditPost = () => {
    setEditingPost(null);
    setEditPostContent("");
  };

  // Funções para editar comentários
  const handleStartEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveEditComment = (postId) => {
    if (!editCommentContent.trim()) return;
    onUpdateComment(editingComment, postId, editCommentContent.trim());
    setEditingComment(null);
    setEditCommentContent("");
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentContent("");
  };

  const toggleComments = (postId) => {
    setVisibleComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Botão para novo post */}
      {!showNewPost && (
        <div className="text-center">
          <button
            onClick={() => setShowNewPost(true)}
            className="bg-blue-logo text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaPlus size={16} />
            Criar Novo Post
          </button>
        </div>
      )}

      {/* Formulário de novo post */}
      {showNewPost && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Compartilhe algo com a comunidade..."
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-logo focus:border-transparent"
            rows="4"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => {
                setShowNewPost(false);
                setNewPost("");
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreatePost}
              className="bg-blue-logo text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              disabled={!newPost.trim()}
            >
              <FaPaperPlane size={14} />
              Publicar
            </button>
          </div>
        </div>
      )}

      {/* Lista de posts */}
      {forumPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum post ainda. Seja o primeiro a compartilhar!</p>
        </div>
      ) : (
        forumPosts.map((post) => (
          <div key={post.id} className="bg-white border rounded-lg p-4 shadow-sm">
            {/* Header do post */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{post.author}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              {/* Botões de ação do post */}
              {currentUser && (currentUser.id === post.authorId || currentUser.type === "admin") && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEditPost(post)}
                    className="text-blue-logo hover:text-blue-700 transition-colors cursor-pointer"
                    title="Editar post"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="text-red-primary hover:text-red-700 cursor-pointer transition-colors"
                    title="Deletar post"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Conteúdo do post */}
            <div className="mb-4">
              {editingPost === post.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-logo focus:border-transparent"
                    rows="3"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEditPost}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEditPost}
                      className="px-3 py-1 bg-blue-logo text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      disabled={!editPostContent.trim()}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              )}
            </div>

            {/* Comentários */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-800">
                  Comentários ({post.comments?.length || 0})
                </h5>
                {post.comments?.length > 0 && (
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="text-blue-logo hover:text-blue-600 transition-colors text-sm cursor-pointer"
                  >
                    {visibleComments[post.id] ? "Ocultar" : "Mostrar"}
                  </button>
                )}
              </div>

              {/* Lista de comentários */}
              {visibleComments[post.id] && (
                <div className="space-y-3 mb-4">
                  {post.comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-800">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>

                          {/* Botões de ação do comentário */}
                          {currentUser && (currentUser.id === comment.authorId || currentUser.type === "admin") && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStartEditComment(comment)}
                                className="text-blue-logo hover:text-blue-700 transition-colors cursor-pointer"
                                title="Editar comentário"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => onDeleteComment(comment.id, post.id)}
                                className="text-red-primary hover:text-red-secondary transition-colors cursor-pointer"
                                title="Deletar comentário"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Conteúdo do comentário */}
                        {editingComment === comment.id ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editCommentContent}
                              onChange={(e) => setEditCommentContent(e.target.value)}
                              className="w-full p-2 border rounded text-sm resize-none focus:ring-2 focus:ring-blue-logo focus:border-transparent"
                              rows="2"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={handleCancelEditComment}
                                className="px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors text-xs"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleSaveEditComment(post.id)}
                                className="px-2 py-1 bg-blue-logo text-white rounded hover:bg-blue-600 transition-colors text-xs cursor-pointer"
                                disabled={!editCommentContent.trim()}
                              >
                                Salvar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Input para novo comentário */}
              {showCommentInput[post.id] ? (
                <div className="flex gap-3">
                  <img
                    src={currentUser?.avatar || "/src/assets/images/avatar/default.png"}
                    alt="Você"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment[post.id] || ""}
                      onChange={(e) =>
                        setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Escreva um comentário..."
                      className="w-full p-2 border rounded text-sm resize-none focus:ring-2 focus:ring-blue-logo focus:border-transparent"
                      rows="2"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() =>
                          setShowCommentInput(prev => ({ ...prev, [post.id]: false }))
                        }
                        className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="px-3 py-1 bg-blue-logo text-white rounded hover:bg-blue-600 transition-colors text-sm flex items-center gap-1 cursor-pointer"
                        disabled={!newComment[post.id]?.trim()}
                      >
                        <FaPaperPlane size={12} />
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setShowCommentInput(prev => ({ ...prev, [post.id]: true }))
                  }
                  className="text-blue-logo hover:text-blue-600 transition-colors text-sm font-medium cursor-pointer"
                >
                  Comentar
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
