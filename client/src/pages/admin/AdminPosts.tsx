import { useState, useEffect } from "react";
import {
  getAllPostsAdmin,
  approvePost,
  deletePostAdmin,
} from "../../services/adminService";
import Spinner from "../../components/shared/Spinner";
import { Trash2, CheckCircle, Clock, Image } from "lucide-react";

interface PostData {
  _id: string;
  user: { name: string; email: string };
  caption: string;
  images: string[];
  likes: string[];
  isApproved: boolean;
  createdAt: string;
}

const AdminPosts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPostsAdmin();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleApprove = async (id: string) => {
    setApproving(id);
    try {
      await approvePost(id);
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isApproved: true } : p)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePostAdmin(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const pending = posts.filter((p) => !p.isApproved);
  const approved = posts.filter((p) => p.isApproved);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">
          Community Posts
        </h1>
        <p className="text-primary/60 mt-1">
          {pending.length} pending · {approved.length} approved
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <Image size={48} className="mx-auto text-primary/20 mb-3" />
          <p className="text-primary/50">No posts yet.</p>
        </div>
      ) : (
        <>
          {/* Pending Posts */}
          {pending.length > 0 && (
            <div>
              <h2 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Clock size={16} className="text-orange-500" />
                Pending Approval ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((post) => (
                  <div
                    key={post._id}
                    className="card p-5 border-l-4 border-orange-400"
                  >
                    <PostRow
                      post={post}
                      onApprove={handleApprove}
                      onDelete={handleDelete}
                      approving={approving}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Posts */}
          {approved.length > 0 && (
            <div>
              <h2 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Approved ({approved.length})
              </h2>
              <div className="space-y-3">
                {approved.map((post) => (
                  <div key={post._id} className="card p-5">
                    <PostRow
                      post={post}
                      onApprove={handleApprove}
                      onDelete={handleDelete}
                      approving={approving}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PostRow = ({
  post,
  onApprove,
  onDelete,
  approving,
}: {
  post: PostData;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  approving: string | null;
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full bg-primary text-secondary flex items-center justify-center text-xs font-bold">
          {post.user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-primary">
          {post.user.name}
        </span>
        <span className="text-xs text-primary/40">{post.user.email}</span>
      </div>
      <p className="text-sm text-primary/70 mb-1">{post.caption}</p>
      <p className="text-xs text-primary/40">
        {new Date(post.createdAt).toLocaleDateString()} · {post.likes.length}{" "}
        likes
      </p>
    </div>

    <div className="flex items-center gap-2 flex-shrink-0">
      {!post.isApproved && (
        <button
          onClick={() => onApprove(post._id)}
          disabled={approving === post._id}
          className="flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <CheckCircle size={13} />
          {approving === post._id ? "Approving..." : "Approve"}
        </button>
      )}
      <button
        onClick={() => onDelete(post._id)}
        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

export default AdminPosts;
