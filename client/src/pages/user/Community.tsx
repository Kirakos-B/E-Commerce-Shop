import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
} from "../../services/postService";
import Spinner from "../../components/shared/Spinner";
import { Heart, Trash2, Send, ImageIcon, Link } from "lucide-react";
import type { Post } from "../../types";

const Community = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;
    setSubmitting(true);
    try {
      await createPost(caption, []);
      setCaption("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const { liked, likesCount } = await likePost(postId);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          return {
            ...p,
            likes: liked
              ? [...p.likes, user!._id]
              : p.likes.filter((id) => id !== user!._id),
          };
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-primary mb-2">
          Community 🌍
        </h1>
        <p className="text-primary/60">Share your looks and inspire others</p>
      </div>

      {/* Create Post */}
      {isAuthenticated ? (
        <div className="card p-6 mb-8">
          <h2 className="font-semibold text-primary mb-4">
            Share Your Look ✨
          </h2>

          {submitted ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg">
              🎉 Post submitted! It will appear after admin approval.
            </div>
          ) : (
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                className="input-field resize-none h-24"
                placeholder="Share your style story, outfit details, or tailor experience..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary/40 text-sm">
                  <ImageIcon size={16} />
                  <span>Image upload coming soon</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !caption.trim()}
                  className="btn-primary flex items-center gap-2 py-2"
                >
                  {submitting ? <Spinner size="sm" /> : <Send size={16} />}
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="card p-6 mb-8 text-center">
          <p className="text-primary/60 mb-3">
            Sign in to share your look with the community
          </p>
          <Link to="/login" className="btn-primary inline-block">
            Sign In
          </Link>
        </div>
      )}

      {/* Posts Feed */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-primary/50 text-lg">No posts yet.</p>
          <p className="text-primary/40 text-sm mt-1">
            Be the first to share your look!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const isLiked = user ? post.likes.includes(user._id) : false;
            const isOwner = user?._id === post.user._id;

            return (
              <div key={post._id} className="card p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center font-bold">
                      {post.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-primary text-sm">
                        {post.user.name}
                      </p>
                      <p className="text-xs text-primary/40">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Images */}
                {post.images.length > 0 && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt="Post"
                      className="w-full object-cover max-h-96"
                    />
                  </div>
                )}

                {/* Caption */}
                <p className="text-primary/80 leading-relaxed mb-4">
                  {post.caption}
                </p>

                {/* Actions */}
                {isAuthenticated && (
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isLiked
                        ? "text-red-500"
                        : "text-primary/50 hover:text-red-400"
                    }`}
                  >
                    <Heart
                      size={18}
                      className={isLiked ? "fill-red-500" : ""}
                    />
                    {post.likes.length}{" "}
                    {post.likes.length === 1 ? "like" : "likes"}
                  </button>
                )}
                {!isAuthenticated && post.likes.length > 0 && (
                  <p className="text-sm text-primary/40">
                    ❤️ {post.likes.length}{" "}
                    {post.likes.length === 1 ? "like" : "likes"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;
