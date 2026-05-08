import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { getOrder, cancelOrder } from "../../services/orderService";
import StatusBadge from "../../components/shared/StatusBadge";
import Spinner from "../../components/shared/Spinner";
import type { Order } from "../../types";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id!);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const updated = await cancelOrder(id!);
      setOrder(updated);
    } catch (error) {
      console.error(error);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-primary/60">Order not found.</p>
      </div>
    );
  }

  const canCancel = !["delivered", "cancelled"].includes(order.orderStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-primary/50 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={order.orderStatus} />
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Items */}
        <div className="card p-6">
          <h2 className="font-serif text-lg font-bold text-primary mb-4">
            Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/20">
                      <Package size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary">{item.name}</p>
                  <p className="text-sm text-primary/50">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-secondary-dark mt-4 pt-4 flex justify-between font-bold text-primary">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className="card p-6">
          <h2 className="font-serif text-lg font-bold text-primary mb-4">
            Shipping Address
          </h2>
          <p className="text-primary/70">
            {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state}, {order.shippingAddress.country} —{" "}
            {order.shippingAddress.zip}
          </p>
        </div>

        {/* Payment */}
        <div className="card p-6">
          <h2 className="font-serif text-lg font-bold text-primary mb-4">
            Payment
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-primary/50">Method</p>
              <p className="text-primary font-medium capitalize">
                {order.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-primary/50">Status</p>
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="card p-6">
            <h2 className="font-serif text-lg font-bold text-primary mb-2">
              Notes
            </h2>
            <p className="text-primary/70 text-sm">{order.notes}</p>
          </div>
        )}

        {/* Cancel */}
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full py-3 rounded-lg border-2 border-red-400 text-red-500 font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {cancelling ? <Spinner size="sm" /> : null}
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
