import { useState, useEffect } from "react";
import {
  getAllOrdersAdmin,
  updateOrderStatus,
} from "../../services/adminService";
import StatusBadge from "../../components/shared/StatusBadge";
import Spinner from "../../components/shared/Spinner";
import { ShoppingBag, ChevronDown } from "lucide-react";
import type { Order } from "../../types";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrdersAdmin();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (
    orderId: string,
    field: "orderStatus" | "paymentStatus",
    value: string,
  ) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(
        orderId,
        field === "orderStatus" ? value : undefined,
        field === "paymentStatus" ? value : undefined,
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, [field]: value } : o)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Orders</h1>
        <p className="text-primary/60 mt-1">{orders.length} orders total</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={48} className="mx-auto text-primary/20 mb-3" />
          <p className="text-primary/50">No orders yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary border-b border-secondary-dark">
                <tr>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Order Status
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Payment
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-secondary-dark/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-primary/60">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-primary">
                      {(
                        order as unknown as {
                          user?: { name: string };
                          guestInfo?: { name: string };
                        }
                      ).user?.name ||
                        (
                          order as unknown as {
                            guestInfo?: { name: string };
                          }
                        ).guestInfo?.name ||
                        "Guest"}
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex items-center gap-2">
                        <select
                          value={order.orderStatus}
                          disabled={updating === order._id}
                          onChange={(e) =>
                            handleStatusUpdate(
                              order._id,
                              "orderStatus",
                              e.target.value,
                            )
                          }
                          className="appearance-none bg-transparent border border-secondary-dark rounded-lg px-3 py-1.5 text-xs font-medium text-primary pr-7 cursor-pointer hover:border-primary transition-colors"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={12}
                          className="absolute right-2 text-primary/40 pointer-events-none"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex items-center gap-2">
                        <select
                          value={order.paymentStatus}
                          disabled={updating === order._id}
                          onChange={(e) =>
                            handleStatusUpdate(
                              order._id,
                              "paymentStatus",
                              e.target.value,
                            )
                          }
                          className="appearance-none bg-transparent border border-secondary-dark rounded-lg px-3 py-1.5 text-xs font-medium text-primary pr-7 cursor-pointer hover:border-primary transition-colors"
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={12}
                          className="absolute right-2 text-primary/40 pointer-events-none"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-primary/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
