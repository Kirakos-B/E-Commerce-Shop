import api from "./api";

export interface DashboardData {
  counts: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalCustomOrders: number;
    totalFeedback: number;
    totalPosts: number;
    pendingCustomOrders: number;
  };
  totalRevenue: number;
  recentOrders: {
    _id: string;
    user?: { name: string; email: string };
    guestInfo?: { name: string; email: string };
    totalPrice: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
  }[];
  ordersByStatus: { _id: string; count: number }[];
  salesData: {
    _id: { year: number; month: number };
    revenue: number;
    orders: number;
  }[];
  lowStockProducts: { _id: string; name: string; stock: number }[];
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const getDashboard = async (): Promise<DashboardData> => {
  const { data } = await api.get("/admin/dashboard");
  return data.dashboard;
};

export const getAllUsers = async (): Promise<UserData[]> => {
  const { data } = await api.get("/admin/users");
  return data.users;
};

export const updateUserRole = async (
  id: string,
  role: string,
): Promise<void> => {
  await api.put(`/admin/users/${id}/role`, { role });
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

export const getAllOrdersAdmin = async () => {
  const { data } = await api.get("/orders");
  return data.orders;
};

export const updateOrderStatus = async (
  id: string,
  orderStatus?: string,
  paymentStatus?: string,
): Promise<void> => {
  await api.put(`/orders/${id}/status`, { orderStatus, paymentStatus });
};

export const getAllCustomOrdersAdmin = async () => {
  const { data } = await api.get("/custom-orders");
  return data.orders;
};

export const updateCustomOrderAdmin = async (
  id: string,
  payload: {
    status?: string;
    estimatedPrice?: number;
    finalPrice?: number;
    adminNotes?: string;
    deliveryDate?: string;
  },
): Promise<void> => {
  await api.put(`/custom-orders/${id}`, payload);
};

export const getAllFeedbackAdmin = async () => {
  const { data } = await api.get("/feedback");
  return data.feedback;
};

export const deleteFeedbackAdmin = async (id: string): Promise<void> => {
  await api.delete(`/feedback/${id}`);
};

export const getAllPostsAdmin = async () => {
  const { data } = await api.get("/posts/all");
  return data.posts;
};

export const approvePost = async (id: string): Promise<void> => {
  await api.put(`/posts/${id}/approve`);
};

export const deletePostAdmin = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

export const createProductAdmin = async (payload: {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
}) => {
  const { data } = await api.post("/products", payload);
  return data.product;
};

export const updateProductAdmin = async (id: string, payload: object) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.product;
};

export const deleteProductAdmin = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
