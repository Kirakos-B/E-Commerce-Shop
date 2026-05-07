import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import ProtectedRoute from "./components/shared/ProtectedRoute";

// Placeholder pages
const Home = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <h1 className="text-4xl font-serif text-primary">🦅 Home Page</h1>
  </div>
);

const Shop = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <h1 className="text-4xl font-serif text-primary">🛍️ Shop Page</h1>
  </div>
);

const Dashboard = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <h1 className="text-4xl font-serif text-primary">📊 Admin Dashboard</h1>
  </div>
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
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected user routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="p-8 font-serif text-2xl text-primary">
                👤 Profile Page
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin only routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
