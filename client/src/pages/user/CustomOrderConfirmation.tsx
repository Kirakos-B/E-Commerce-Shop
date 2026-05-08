import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { getCustomOrder } from "../../services/customOrderService";
import Spinner from "../../components/shared/Spinner";
import type { CustomOrder } from "../../types";

const CustomOrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getCustomOrder(id!);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={80} className="text-green-500" />
      </div>

      <h1 className="font-serif text-4xl font-bold text-primary mb-3">
        Order Submitted!
      </h1>
      <p className="text-primary/60 text-lg mb-8">
        Your custom order has been received. We'll review it and get back to you
        within 24–48 hours.
      </p>

      {order && (
        <div className="card p-6 text-left mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold text-primary">
              Order Summary
            </h2>
            <span className="text-xs text-primary/50 font-mono">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-primary/50">Fabric</p>
              <p className="text-primary font-medium capitalize">
                {order.fabric}
              </p>
            </div>
            <div>
              <p className="text-primary/50">Color</p>
              <p className="text-primary font-medium">{order.color}</p>
            </div>
            <div className="col-span-2">
              <p className="text-primary/50">Description</p>
              <p className="text-primary font-medium">
                {order.designDescription}
              </p>
            </div>
            <div>
              <p className="text-primary/50">Status</p>
              <div className="flex items-center gap-1 text-orange-500 font-medium">
                <Clock size={14} /> Pending Review
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/shop"
          className="btn-primary flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
        {order?.user && (
          <Link
            to="/my-orders"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            View My Orders
          </Link>
        )}
      </div>
    </div>
  );
};

export default CustomOrderConfirmation;
