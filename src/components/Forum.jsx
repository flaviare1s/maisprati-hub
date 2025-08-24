import { FaMagic, FaComments, FaReply } from "react-icons/fa";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

export const Forum = ({
  forumPosts,
  newPost,
  setNewPost,
  showNewPost,
  setShowNewPost,
  handleCreatePost,
  currentUser,
  onDeletePost,
  onDeleteComment,
  onAddComment,
}) => {
  const [visibleComments, setVisibleComments] = useState({});
  const [showCommentForm, setShowCommentForm] = useState({});
  const [commentText, setCommentText] = useState({});

  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleCommentForm = (postId) => {
    setShowCommentForm((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentText[postId]?.trim();
    if (!content) return;

    try {
      await onAddComment(postId, currentUser.id, content);
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentForm((prev) => ({ ...prev, [postId]: false }));
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  const canDeletePost = (post) => {
    return (
      currentUser?.type === "admin" ||
      post.authorId === currentUser?.id
    );
  };

  const canDeleteComment = (comment, post) => {
    return (
      currentUser?.type === "admin" ||
      comment.authorId === currentUser?.id ||
      post.authorId === currentUser?.id
    );
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Tem certeza que deseja deletar este post?")) {
      try {
        await onDeletePost(postId);
      } catch (error) {
        console.error("Erro ao deletar post:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    if (window.confirm("Tem certeza que deseja deletar este comentário?")) {
      try {
        await onDeleteComment(commentId, postId);
      } catch (error) {
        console.error("Erro ao deletar comentário:", error);
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="w-full bg-gradient-to-r from-blue-logo to-orange-logo text-light font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FaMagic />
          Criar Post
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
              className="bg-blue-logo text-light px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              Publicar
            </button>
            <button
              onClick={() => setShowNewPost(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {forumPosts.map((post) => (
          <div
            key={post.id}
            className="bg-light border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              {post.avatar && (
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-gray-800">{post.author}</span>
                    <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{post.content}</p>
                  </div>

                  {canDeletePost(post) && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Deletar post"
                    >
                      <AiOutlineDelete size={16} className="cursor-pointer" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1 text-blue-logo hover:underline text-sm cursor-pointer"
                  >
                    <FaComments />
                    {visibleComments[post.id] ? "Ocultar" : `Comentários (${post.comments?.length || 0})`}
                  </button>

                  <button
                    onClick={() => toggleCommentForm(post.id)}
                    className="flex items-center gap-1 text-orange-logo hover:underline text-sm cursor-pointer"
                  >
                    <FaReply /> Comentar
                  </button>
                </div>

                {showCommentForm[post.id] && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg border">
                    <textarea
                      value={commentText[post.id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))
                      }
                      placeholder="Escreva seu comentário..."
                      className="w-full p-2 border rounded resize-none h-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-logo"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="bg-blue-logo text-white px-3 py-1 rounded text-sm hover:bg-blue-600 cursor-pointer"
                        disabled={!commentText[post.id]?.trim()}
                      >
                        Comentar
                      </button>
                      <button
                        onClick={() => toggleCommentForm(post.id)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {visibleComments[post.id] && post.comments && (
                  <div className="mt-3 border-t pt-2 space-y-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2 group">
                        {comment.avatar && (
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-semibold text-gray-700 text-sm">
                                {comment.author}
                              </span>
                              <p className="text-gray-600 text-sm">{comment.content}</p>
                            </div>

                            {canDeleteComment(comment, post) && (
                              <button
                                onClick={() => handleDeleteComment(comment.id, post.id)}
                                className="text-red-primary hover:text-red-secondary p-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                title="Deletar comentário"
                              >
                                <AiOutlineDelete className="cursor-pointer" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
