import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../../services/api";
import Spinner from "../../components/shared/Spinner";
import { TrendingUp, ShoppingBag, Package } from "lucide-react";

interface SalesStat {
  _id: { year: number; month: number; day: number };
  revenue: number;
  orders: number;
}

interface OrderStat {
  byStatus: { _id: string; count: number }[];
  byPayment: { _id: string; count: number }[];
  topProducts: {
    _id: string;
    name: string;
    totalSold: number;
    totalRevenue: number;
  }[];
}

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

const AdminStats = () => {
  const [salesData, setSalesData] = useState<SalesStat[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStat | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const [salesRes, orderRes] = await Promise.all([
        api.get("/admin/stats/sales", { params }),
        api.get("/admin/stats/orders"),
      ]);

      setSalesData(salesRes.data.stats);
      setOrderStats(orderRes.data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const salesChartData = salesData.map((s) => ({
    name: `${MONTHS[s._id.month - 1]} ${s._id.day}`,
    revenue: s.revenue,
    orders: s.orders,
  }));

  const totalRevenue = salesData.reduce((acc, s) => acc + s.revenue, 0);
  const totalOrders = salesData.reduce((acc, s) => acc + s.orders, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">
          Sales Statistics
        </h1>
        <p className="text-primary/60 mt-1">
          Detailed breakdown of revenue and orders
        </p>
      </div>

      {/* Date Filter */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary mb-1">
              From Date
            </label>
            <input
              type="date"
              className="input-field"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary mb-1">
              To Date
            </label>
            <input
              type="date"
              className="input-field"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button onClick={fetchStats} className="btn-primary px-6">
            Apply Filter
          </button>
          {(fromDate || toDate) && (
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
                fetchStats();
              }}
              className="btn-secondary px-6"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-sm text-primary/50">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                <ShoppingBag size={22} />
              </div>
              <div>
                <p className="text-sm text-primary/50">Total Orders</p>
                <p className="text-2xl font-bold text-primary">{totalOrders}</p>
              </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-sm text-primary/50">Avg. Order Value</p>
                <p className="text-2xl font-bold text-primary">
                  $
                  {totalOrders > 0
                    ? (totalRevenue / totalOrders).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Over Time */}
          <div className="card p-6">
            <h2 className="font-serif text-xl font-bold text-primary mb-6">
              Revenue Over Time
            </h2>
            {salesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE5" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#004643" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#004643" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #F0EDE5",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#004643"
                    strokeWidth={2.5}
                    dot={{ fill: "#004643", r: 4 }}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-primary/40">
                No sales data for this period
              </div>
            )}
          </div>

          {/* Orders Over Time */}
          <div className="card p-6">
            <h2 className="font-serif text-xl font-bold text-primary mb-6">
              Orders Over Time
            </h2>
            {salesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE5" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#004643" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#004643" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #F0EDE5",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#004643"
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-primary/40">
                No order data for this period
              </div>
            )}
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Orders by Status */}
            {orderStats && (
              <div className="card p-6">
                <h2 className="font-serif text-xl font-bold text-primary mb-4">
                  Orders by Status
                </h2>
                <div className="space-y-3">
                  {orderStats.byStatus.map((s) => {
                    const total = orderStats.byStatus.reduce(
                      (acc, x) => acc + x.count,
                      0,
                    );
                    const pct =
                      total > 0 ? Math.round((s.count / total) * 100) : 0;
                    return (
                      <div key={s._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-primary font-medium">
                            {s._id}
                          </span>
                          <span className="text-primary/60">
                            {s.count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary-dark rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Products */}
            {orderStats && orderStats.topProducts.length > 0 && (
              <div className="card p-6">
                <h2 className="font-serif text-xl font-bold text-primary mb-4">
                  Top Selling Products
                </h2>
                <div className="space-y-3">
                  {orderStats.topProducts.map((p, i) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-4 p-3 bg-secondary rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary text-sm truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-primary/50">
                          {p.totalSold} units sold
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-primary text-sm">
                          ${p.totalRevenue.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 justify-end text-primary/40">
                          <Package size={10} />
                          <span className="text-xs">{p.totalSold}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Status */}
            {orderStats && (
              <div className="card p-6 xl:col-span-2">
                <h2 className="font-serif text-xl font-bold text-primary mb-4">
                  Payment Status Breakdown
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {orderStats.byPayment.map((p) => (
                    <div
                      key={p._id}
                      className="bg-secondary rounded-xl p-4 text-center"
                    >
                      <p className="text-2xl font-bold text-primary">
                        {p.count}
                      </p>
                      <p className="text-sm text-primary/60 capitalize mt-1">
                        {p._id}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStats;
