import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";

// Placeholders
const Home = () => (
  <div className="p-8 font-serif text-2xl text-primary">🦅 Home Page</div>
);
const Shop = () => (
  <div className="p-8 font-serif text-2xl text-primary">🛍️ Shop Page</div>
);
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
        {/* Public routes — with Navbar + Footer */}
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected user routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div className="p-8 font-serif text-2xl text-primary">
                  👤 Profile
                </div>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin routes — with sidebar layout */}
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
