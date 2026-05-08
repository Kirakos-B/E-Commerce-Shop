import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  Package,
  ShoppingBag,
  Scissors,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Image,
} from "lucide-react";
import { getDashboard } from "../../services/adminService";
import type { DashboardData } from "../../services/adminService";
import StatCard from "../../components/shared/StatCard";
import StatusBadge from "../../components/shared/StatusBadge";
import Spinner from "../../components/shared/Spinner";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PIE_COLORS = [
  "#004643",
  "#006B65",
  "#F0EDE5",
  "#D9D4C7",
  "#e63946",
  "#457b9d",
  "#2a9d8f",
];

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getDashboard();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-primary/60">Failed to load dashboard.</p>;
  }

  // Format sales data for chart
  const salesChartData = data.salesData.map((s) => ({
    name: `${MONTHS[s._id.month - 1]} ${s._id.year}`,
    revenue: s.revenue,
    orders: s.orders,
  }));

  // Format orders by status for pie chart
  const pieData = data.ordersByStatus.map((o) => ({
    name: o._id,
    value: o.count,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">
          Dashboard
        </h1>
        <p className="text-primary/60 mt-1">
          Welcome back! Here's what's happening.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${data.totalRevenue.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          color="bg-green-600"
          subtitle="From paid orders"
        />
        <StatCard
          title="Total Orders"
          value={data.counts.totalOrders}
          icon={<ShoppingBag size={24} />}
          color="bg-primary"
        />
        <StatCard
          title="Total Users"
          value={data.counts.totalUsers}
          icon={<Users size={24} />}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Products"
          value={data.counts.totalProducts}
          icon={<Package size={24} />}
          color="bg-purple-600"
        />
        <StatCard
          title="Custom Orders"
          value={data.counts.totalCustomOrders}
          icon={<Scissors size={24} />}
          color="bg-orange-500"
          subtitle={`${data.counts.pendingCustomOrders} pending`}
        />
        <StatCard
          title="Feedback"
          value={data.counts.totalFeedback}
          icon={<MessageSquare size={24} />}
          color="bg-teal-600"
        />
        <StatCard
          title="Community Posts"
          value={data.counts.totalPosts}
          icon={<Image size={24} />}
          color="bg-pink-500"
        />
        <StatCard
          title="Low Stock Items"
          value={data.lowStockProducts.length}
          icon={<AlertTriangle size={24} />}
          color="bg-red-500"
          subtitle="Stock ≤ 5"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="xl:col-span-2 card p-6">
          <h2 className="font-serif text-xl font-bold text-primary mb-6">
            Revenue (Last 6 Months)
          </h2>
          {salesChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#004643" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#004643" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #F0EDE5",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#004643"
                  strokeWidth={2.5}
                  dot={{ fill: "#004643", r: 4 }}
                  name="Revenue ($)"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#006B65"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#006B65", r: 3 }}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-primary/40">
              No sales data yet
            </div>
          )}
        </div>

        {/* Orders by Status Pie Chart */}
        <div className="card p-6">
          <h2 className="font-serif text-xl font-bold text-primary mb-6">
            Orders by Status
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  formatter={(value) => (
                    <span className="capitalize text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-primary/40">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <h2 className="font-serif text-xl font-bold text-primary mb-4">
            Recent Orders
          </h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-primary/40 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-dark">
                    <th className="text-left py-2 text-primary/50 font-medium">
                      Customer
                    </th>
                    <th className="text-left py-2 text-primary/50 font-medium">
                      Amount
                    </th>
                    <th className="text-left py-2 text-primary/50 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-secondary-dark/50 hover:bg-secondary/50 transition-colors"
                    >
                      <td className="py-3 text-primary">
                        {order.user?.name || order.guestInfo?.name || "Guest"}
                      </td>
                      <td className="py-3 font-medium text-primary">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={order.orderStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="card p-6">
          <h2 className="font-serif text-xl font-bold text-primary mb-4">
            Low Stock Alert
          </h2>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-primary/40 text-sm">
              All products are well stocked! ✅
            </p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      size={16}
                      className="text-red-500 flex-shrink-0"
                    />
                    <span className="text-sm font-medium text-primary">
                      {product.name}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      product.stock === 0 ? "text-red-600" : "text-orange-500"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
