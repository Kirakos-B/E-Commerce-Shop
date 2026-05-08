import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { getMyOrders } from "../../services/orderService";
import StatusBadge from "../../components/shared/StatusBadge";
import Spinner from "../../components/shared/Spinner";
import type { Order } from "../../types";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-primary mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-primary/20 mb-4" />
          <p className="text-primary/60 text-lg mb-4">No orders yet</p>
          <Link to="/shop" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-primary/50">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <StatusBadge status={order.orderStatus} />
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                  <p className="text-sm text-primary/60">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-primary/60 mt-1">
                    {order.items.length} item
                    {order.items.length > 1 ? "s" : ""} ·{" "}
                    <span className="font-semibold text-primary">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </p>
                </div>
                <Link
                  to={`/my-orders/${order._id}`}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>

              {/* Items preview */}
              <div className="mt-4 pt-4 border-t border-secondary-dark flex gap-3 overflow-x-auto">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-primary/70 truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
