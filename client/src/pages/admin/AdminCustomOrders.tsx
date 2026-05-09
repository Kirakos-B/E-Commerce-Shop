import { useState, useEffect } from "react";
import {
  getAllCustomOrdersAdmin,
  updateCustomOrderAdmin,
} from "../../services/adminService";
import StatusBadge from "../../components/shared/StatusBadge";
import Spinner from "../../components/shared/Spinner";
import { Scissors, ChevronDown, X } from "lucide-react";
import type { CustomOrder } from "../../types";

const CUSTOM_STATUSES = [
  "pending",
  "reviewing",
  "approved",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
];

const AdminCustomOrders = () => {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CustomOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    status: "",
    estimatedPrice: "",
    finalPrice: "",
    adminNotes: "",
    deliveryDate: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllCustomOrdersAdmin();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openOrder = (order: CustomOrder) => {
    setSelected(order);
    setForm({
      status: order.status,
      estimatedPrice: String(order.estimatedPrice || ""),
      finalPrice: String(order.finalPrice || ""),
      adminNotes: order.adminNotes || "",
      deliveryDate: order.deliveryDate ? order.deliveryDate.split("T")[0] : "",
    });
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await updateCustomOrderAdmin(selected._id, {
        status: form.status,
        estimatedPrice: form.estimatedPrice
          ? Number(form.estimatedPrice)
          : undefined,
        finalPrice: form.finalPrice ? Number(form.finalPrice) : undefined,
        adminNotes: form.adminNotes || undefined,
        deliveryDate: form.deliveryDate || undefined,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selected._id
            ? {
                ...o,
                status: form.status,
                estimatedPrice: form.estimatedPrice
                  ? Number(form.estimatedPrice)
                  : o.estimatedPrice,
                finalPrice: form.finalPrice
                  ? Number(form.finalPrice)
                  : o.finalPrice,
                adminNotes: form.adminNotes || o.adminNotes,
                deliveryDate: form.deliveryDate || o.deliveryDate,
              }
            : o,
        ),
      );
      setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">
          Custom Orders
        </h1>
        <p className="text-primary/60 mt-1">
          {orders.length} custom orders total
        </p>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-secondary-dark">
              <h2 className="font-serif text-xl font-bold text-primary">
                Custom Order #{selected._id.slice(-8).toUpperCase()}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-primary/50 hover:text-primary"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Order Info */}
              <div className="bg-secondary rounded-xl p-4 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-primary/50">Fabric</p>
                    <p className="font-medium capitalize">{selected.fabric}</p>
                  </div>
                  <div>
                    <p className="text-primary/50">Color</p>
                    <p className="font-medium">{selected.color}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-primary/50">Description</p>
                    <p className="font-medium">{selected.designDescription}</p>
                  </div>
                </div>

                {/* Measurements */}
                {Object.keys(selected.measurements || {}).length > 0 && (
                  <div>
                    <p className="text-primary/50 mb-1">Measurements</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(selected.measurements)
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <div key={k}>
                            <span className="text-primary/40 capitalize">
                              {k}:
                            </span>{" "}
                            <span className="font-medium">{String(v)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      className="input-field appearance-none pr-8"
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      {CUSTOM_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Estimated Price ($)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={form.estimatedPrice}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          estimatedPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Final Price ($)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={form.finalPrice}
                      onChange={(e) =>
                        setForm({ ...form, finalPrice: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.deliveryDate}
                    onChange={(e) =>
                      setForm({ ...form, deliveryDate: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    className="input-field resize-none h-20"
                    placeholder="Notes for the customer..."
                    value={form.adminNotes}
                    onChange={(e) =>
                      setForm({ ...form, adminNotes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="btn-primary flex items-center gap-2 flex-1 justify-center"
                >
                  {updating ? <Spinner size="sm" /> : null}
                  {updating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Scissors size={48} className="mx-auto text-primary/20 mb-3" />
          <p className="text-primary/50">No custom orders yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary border-b border-secondary-dark">
                <tr>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    ID
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Fabric
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Est. Price
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Actions
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
                      {order.user
                        ? (
                            order as unknown as {
                              user?: { name: string };
                            }
                          ).user?.name
                        : order.guestInfo?.name || "Guest"}
                    </td>
                    <td className="px-6 py-4 capitalize text-primary/70">
                      {order.fabric}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-primary">
                      {order.estimatedPrice ? `$${order.estimatedPrice}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-primary/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openOrder(order)}
                        className="text-primary text-xs font-medium hover:underline"
                      >
                        Review
                      </button>
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

export default AdminCustomOrders;
