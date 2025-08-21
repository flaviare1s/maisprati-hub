import { FaMagic, FaComments } from "react-icons/fa";
import { useState } from "react";

export const Forum = ({
  forumPosts,
  newPost,
  setNewPost,
  showNewPost,
  setShowNewPost,
  handleCreatePost,
}) => {
  const [visibleComments, setVisibleComments] = useState({}); // controla quais comentários estão visíveis

  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="w-full bg-gradient-to-r from-blue-logo to-orange-logo text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
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

      <div className="space-y-4">
        {forumPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
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
                <span className="font-semibold text-gray-800">{post.author}</span>
                <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{post.content}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                  >
                    <FaComments /> {visibleComments[post.id] ? "Ocultar Comentários" : "Ver Comentários"}
                  </button>
                </div>

                {visibleComments[post.id] && post.comments && (
                  <div className="mt-3 border-t pt-2 space-y-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2">
                        {comment.avatar && (
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <span className="font-semibold text-gray-700 text-sm">
                            {comment.author}
                          </span>
                          <p className="text-gray-600 text-sm">{comment.content}</p>
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
