import { useState, useEffect } from "react";
import {
  getAllFeedbackAdmin,
  deleteFeedbackAdmin,
} from "../../services/adminService";
import Spinner from "../../components/shared/Spinner";
import { Trash2, Star, MessageSquare } from "lucide-react";

interface FeedbackData {
  _id: string;
  user: { name: string; email: string };
  product?: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getAllFeedbackAdmin();
        setFeedback(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await deleteFeedbackAdmin(id);
      setFeedback((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Feedback</h1>
        <p className="text-primary/60 mt-1">{feedback.length} reviews total</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare size={48} className="mx-auto text-primary/20 mb-3" />
          <p className="text-primary/50">No feedback yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((f) => (
            <div key={f._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center font-bold text-xs">
                      {f.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-primary text-sm">
                        {f.user.name}
                      </p>
                      <p className="text-xs text-primary/40">{f.user.email}</p>
                    </div>
                    {f.product && (
                      <span className="text-xs bg-secondary text-primary/60 px-2 py-1 rounded-full">
                        {f.product.name}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= f.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-primary/20"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-primary/70 text-sm">{f.comment}</p>
                  <p className="text-xs text-primary/40 mt-2">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(f._id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
