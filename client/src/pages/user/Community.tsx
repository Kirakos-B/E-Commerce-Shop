import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
} from "../../services/postService";
import api from "../../services/api";
import Spinner from "../../components/shared/Spinner";
import { Heart, Trash2, Send, ImageIcon, X, Upload, Link } from "lucide-react";
import type { Post } from "../../types";

const Community = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Image upload state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const { data } = await api.post(
        "/upload/multiple?folder=posts",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const newUrls = data.urls.map((u: { url: string }) => u.url);
      setImageUrls((prev) => [...prev, ...newUrls]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;
    setSubmitting(true);
    try {
      await createPost(caption, imageUrls);
      setCaption("");
      setImageUrls([]);
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
      await likePost(postId);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const alreadyLiked = p.likes.includes(user!._id);
          return {
            ...p,
            likes: alreadyLiked
              ? p.likes.filter((id) => id !== user!._id)
              : [...p.likes, user!._id],
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

              {/* Image previews */}
              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url) => (
                    <div
                      key={url}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-secondary-dark"
                    >
                      <img
                        src={url}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-sm text-primary/60 hover:text-primary border border-secondary-dark rounded-lg px-3 py-2 hover:border-primary transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <Spinner size="sm" />
                    ) : (
                      <ImageIcon size={15} />
                    )}
                    {uploading ? "Uploading..." : "Add Photos"}
                  </button>

                  {imageUrls.length > 0 && (
                    <span className="text-xs text-primary/40">
                      {imageUrls.length} photo
                      {imageUrls.length > 1 ? "s" : ""} added
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || !caption.trim()}
                  className="btn-primary flex items-center gap-2 py-2 disabled:opacity-50"
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
          <Upload size={48} className="mx-auto text-primary/20 mb-3" />
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
              <div key={post._id} className="card overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center justify-between p-5 pb-3">
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
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Caption */}
                <p className="text-primary/80 leading-relaxed px-5 pb-3">
                  {post.caption}
                </p>

                {/* Images grid */}
                {post.images.length > 0 && (
                  <div
                    className={`grid gap-0.5 ${
                      post.images.length === 1
                        ? "grid-cols-1"
                        : post.images.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-2"
                    }`}
                  >
                    {post.images.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        className={`relative overflow-hidden bg-secondary ${
                          post.images.length === 1
                            ? "h-80"
                            : post.images.length === 3 && i === 0
                              ? "row-span-2 h-64"
                              : "h-40"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Post image ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {/* Show +N overlay if more than 4 images */}
                        {i === 3 && post.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                              +{post.images.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="px-5 py-3 border-t border-secondary-dark">
                  {isAuthenticated ? (
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
                  ) : (
                    <p className="text-sm text-primary/40 flex items-center gap-1.5">
                      <Heart size={14} />
                      {post.likes.length}{" "}
                      {post.likes.length === 1 ? "like" : "likes"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;
