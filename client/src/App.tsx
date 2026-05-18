import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/shared/ProtectedRoute";

// Auth
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";

// User pages
import Home from "./pages/user/Home";
import Shop from "./pages/user/Shop";
import ProductDetail from "./pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import CustomOrder from "./pages/user/CustomOrder";
import CustomOrderConfirmation from "./pages/user/CustomOrderConfirmation";
import Profile from "./pages/user/Profile";
import MyOrders from "./pages/user/MyOrders";
import OrderDetail from "./pages/user/OrderDetail";
import MyCustomOrders from "./pages/user/MyCustomOrders";
import Community from "./pages/user/Community";
import PaymentSuccess from "./pages/user/PaymentSuccess";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomOrders from "./pages/admin/AdminCustomOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminStats from "./pages/admin/AdminStats";

// 404
const NotFound = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-primary/60 text-lg mb-6">Page not found</p>
      <a href="/" className="btn-primary inline-block">
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ── */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <MainLayout>
              <Shop />
            </MainLayout>
          }
        />
        <Route
          path="/shop/:id"
          element={
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <MainLayout>
              <Cart />
            </MainLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <MainLayout>
              <Checkout />
            </MainLayout>
          }
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <MainLayout>
              <OrderConfirmation />
            </MainLayout>
          }
        />
        <Route
          path="/custom-order"
          element={
            <MainLayout>
              <CustomOrder />
            </MainLayout>
          }
        />
        <Route
          path="/custom-order/confirmation/:id"
          element={
            <MainLayout>
              <CustomOrderConfirmation />
            </MainLayout>
          }
        />
        <Route
          path="/posts"
          element={
            <MainLayout>
              <Community />
            </MainLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Payment routes ── */}
        <Route
          path="/payment/success"
          element={
            <MainLayout>
              <PaymentSuccess />
            </MainLayout>
          }
        />
        <Route
          path="/payment/verify"
          element={
            <MainLayout>
              <PaymentSuccess />
            </MainLayout>
          }
        />

        {/* ── Protected user routes ── */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyOrders />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrderDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-custom-orders"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyCustomOrders />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ── Admin only routes ── */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/custom-orders"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminCustomOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminFeedback />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminPosts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminStats />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
