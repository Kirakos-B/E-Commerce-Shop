import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { verifyPayment } from "../../services/paymentService";
import Spinner from "../../components/shared/Spinner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const txRef = searchParams.get("trx_ref") || searchParams.get("tx_ref") || "";

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );

  useEffect(() => {
    const verify = async () => {
      if (!txRef) {
        setStatus("failed");
        return;
      }
      try {
        const result = await verifyPayment(txRef);
        setStatus(result.success ? "success" : "failed");
      } catch {
        setStatus("failed");
      }
    };
    verify();
  }, [txRef]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-primary/60">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <XCircle size={80} className="mx-auto text-red-500 mb-6" />
        <h1 className="font-serif text-3xl font-bold text-primary mb-3">
          Payment Failed
        </h1>
        <p className="text-primary/60 mb-8">
          Something went wrong with your payment. Your order is still saved.
        </p>
        <div className="flex flex-col gap-3">
          {orderId && (
            <Link
              to={`/order-confirmation/${orderId}`}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Try Again
            </Link>
          )}
          <Link
            to="/my-orders"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
      <h1 className="font-serif text-3xl font-bold text-primary mb-3">
        Payment Successful! 🎉
      </h1>
      <p className="text-primary/60 mb-8">
        Your payment has been confirmed. We'll start processing your order right
        away.
      </p>
      <div className="flex flex-col gap-3">
        <Link
          to="/my-orders"
          className="btn-primary flex items-center justify-center gap-2"
        >
          Track My Order <ArrowRight size={16} />
        </Link>
        <Link
          to="/shop"
          className="btn-secondary flex items-center justify-center gap-2"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
