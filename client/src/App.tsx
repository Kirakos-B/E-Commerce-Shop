import { BrowserRouter, Routes, Route } from "react-router-dom";

// Placeholder pages — we'll replace these one by one
const Home = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <h1 className="text-4xl font-serif text-primary">🦅 Home Page</h1>
  </div>
);

const Login = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <h1 className="text-4xl font-serif text-primary">🔐 Login Page</h1>
  </div>
);

const Register = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <h1 className="text-4xl font-serif text-primary">📝 Register Page</h1>
  </div>
);

const Shop = () => (
  <div className="min-h-screen bg-secondary flex items-center justify-center">
    <h1 className="text-4xl font-serif text-primary">🛍️ Shop Page</h1>
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
