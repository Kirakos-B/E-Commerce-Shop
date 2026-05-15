import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scissors, ArrowRight } from "lucide-react";
import { getMyCustomOrders } from "../../services/customOrderService";
import StatusBadge from "../../components/shared/StatusBadge";
import Spinner from "../../components/shared/Spinner";
import type { CustomOrder } from "../../types";

const MyCustomOrders = () => {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyCustomOrders();
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">
            My Custom Orders
          </h1>
          <p className="text-primary/60 mt-1">
            Track your bespoke tailoring requests
          </p>
        </div>
        <Link
          to="/custom-order"
          className="btn-primary flex items-center gap-2"
        >
          <Scissors size={16} /> New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Scissors size={64} className="mx-auto text-primary/20 mb-4" />
          <p className="text-primary/60 text-lg mb-2">No custom orders yet</p>
          <p className="text-primary/40 text-sm mb-8">
            Submit your measurements and design ideas to get started
          </p>
          <Link
            to="/custom-order"
            className="btn-primary inline-flex items-center gap-2"
          >
            Start a Custom Order <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-sm text-primary/50">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-primary/50">Fabric</p>
                      <p className="font-medium text-primary capitalize">
                        {order.fabric}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary/50">Color</p>
                      <p className="font-medium text-primary">{order.color}</p>
                    </div>
                    <div>
                      <p className="text-primary/50">Submitted</p>
                      <p className="font-medium text-primary">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {order.estimatedPrice && (
                      <div>
                        <p className="text-primary/50">Est. Price</p>
                        <p className="font-medium text-primary">
                          ${order.estimatedPrice}
                        </p>
                      </div>
                    )}
                    {order.finalPrice && (
                      <div>
                        <p className="text-primary/50">Final Price</p>
                        <p className="font-bold text-primary">
                          ${order.finalPrice}
                        </p>
                      </div>
                    )}
                    {order.deliveryDate && (
                      <div>
                        <p className="text-primary/50">Delivery Date</p>
                        <p className="font-medium text-primary">
                          {new Date(order.deliveryDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Design description */}
                  <div className="mt-3">
                    <p className="text-primary/50 text-sm">Description</p>
                    <p className="text-primary/80 text-sm mt-0.5 line-clamp-2">
                      {order.designDescription}
                    </p>
                  </div>

                  {/* Admin notes */}
                  {order.adminNotes && (
                    <div className="mt-3 bg-primary/5 rounded-lg p-3 border border-primary/10">
                      <p className="text-xs font-medium text-primary/60 mb-1">
                        📋 Note from our team
                      </p>
                      <p className="text-sm text-primary/80">
                        {order.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status timeline */}
                <div className="sm:w-40 flex-shrink-0">
                  <p className="text-xs text-primary/50 font-medium mb-2 uppercase tracking-wider">
                    Progress
                  </p>
                  <div className="space-y-1.5">
                    {[
                      "pending",
                      "reviewing",
                      "approved",
                      "in_progress",
                      "ready",
                      "delivered",
                    ].map((step, i, arr) => {
                      const currentIndex = arr.indexOf(order.status);
                      const isCancelled = order.status === "cancelled";
                      const isDone =
                        !isCancelled && arr.indexOf(step) <= currentIndex;
                      const isCurrent = step === order.status;

                      return (
                        <div key={step} className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              isCancelled
                                ? "bg-red-300"
                                : isDone
                                  ? isCurrent
                                    ? "bg-primary"
                                    : "bg-primary/40"
                                  : "bg-secondary-dark"
                            }`}
                          />
                          <span
                            className={`text-xs capitalize ${
                              isCurrent
                                ? "text-primary font-semibold"
                                : isDone
                                  ? "text-primary/50"
                                  : "text-primary/30"
                            }`}
                          >
                            {step.replace("_", " ")}
                          </span>
                        </div>
                      );
                    })}
                    {order.status === "cancelled" && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="text-xs text-red-500 font-semibold">
                          Cancelled
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCustomOrders;
