import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
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
import Community from "./pages/user/Community";

const Dashboard = () => (
  <div className="font-serif text-2xl text-primary">📊 Dashboard</div>
);
const NotFound = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <h1 className="text-4xl font-serif text-primary">404 — Page Not Found</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Checkout — public (guest + user) */}
        <Route
          path="/checkout"
          element={
            <MainLayout>
              <Checkout />
            </MainLayout>
          }
        />

        {/* Order confirmation — accessible after order */}
        <Route
          path="/order-confirmation/:id"
          element={
            <MainLayout>
              <OrderConfirmation />
            </MainLayout>
          }
        />

        {/* Protected user routes */}

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
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
          path="/posts"
          element={
            <MainLayout>
              <Community />
            </MainLayout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
