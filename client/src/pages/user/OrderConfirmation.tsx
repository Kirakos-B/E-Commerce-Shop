import { useState, useEffect } from "react";
import { initializePayment } from "../../services/paymentService";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { getOrder } from "../../services/orderService";
import Spinner from "../../components/shared/Spinner";
import type { Order } from "../../types";

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  const handlePayNow = async () => {
    if (!order) return;
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const { checkoutUrl } = await initializePayment(order._id);
      window.location.href = checkoutUrl;
    } catch {
      setPaymentError("Failed to initialize payment. Please try again.");
      setPaymentLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-primary/60">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <CheckCircle size={80} className="text-green-500" />
      </div>

      <h1 className="font-serif text-4xl font-bold text-primary mb-3">
        Order Placed!
      </h1>
      <p className="text-primary/60 text-lg mb-8">
        Thank you for your order. We'll get started right away.
      </p>

      {/* Order Details Card */}
      <div className="card p-6 text-left mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-primary">
            Order Details
          </h2>
          <span className="text-xs text-primary/50 font-mono">
            #{order._id.slice(-8).toUpperCase()}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-primary/70">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-primary">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-dark my-4" />

        <div className="flex justify-between font-bold text-primary">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-secondary-dark grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-primary/50">Payment</p>
            <p className="font-medium text-primary capitalize">
              {order.paymentMethod}
            </p>
          </div>
          <div>
            <p className="text-primary/50">Status</p>
            <p className="font-medium text-green-600 capitalize">
              {order.orderStatus}
            </p>
          </div>
          {/* Pay Now button for unpaid orders */}
          {order.paymentStatus === "unpaid" &&
            order.orderStatus !== "cancelled" && (
              <div className="mt-6 pt-4 border-t border-secondary-dark">
                {paymentError && (
                  <p className="text-red-500 text-sm mb-3">{paymentError}</p>
                )}
                <button
                  onClick={handlePayNow}
                  disabled={paymentLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {paymentLoading ? <Spinner size="sm" /> : "💳"}
                  {paymentLoading
                    ? "Redirecting to Chapa..."
                    : "Pay Now with Chapa"}
                </button>
                <p className="text-xs text-primary/40 text-center mt-2">
                  Secure payment powered by Chapa
                </p>
              </div>
            )}
          <div className="col-span-2">
            <p className="text-primary/50">Shipping to</p>
            <p className="font-medium text-primary">
              {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/my-orders"
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Package size={18} /> Track My Orders
        </Link>
        <Link
          to="/shop"
          className="btn-secondary flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
