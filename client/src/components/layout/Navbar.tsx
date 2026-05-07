import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-secondary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl font-bold tracking-wide">
            🦅 Emu Shop
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-secondary/70 transition-colors">
              Home
            </Link>
            <Link
              to="/shop"
              className="hover:text-secondary/70 transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/custom-order"
              className="hover:text-secondary/70 transition-colors"
            >
              Custom Order
            </Link>
            <Link
              to="/posts"
              className="hover:text-secondary/70 transition-colors"
            >
              Community
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative hover:text-secondary/70 transition-colors"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:text-secondary/70 transition-colors"
                >
                  <User size={22} />
                  <span className="text-sm">{user?.name.split(" ")[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-primary rounded-xl shadow-lg border border-secondary-dark overflow-hidden z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary transition-colors"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary transition-colors"
                    >
                      <ShoppingCart size={16} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary transition-colors"
                      >
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary transition-colors w-full text-left text-red-500"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm hover:text-secondary/70 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-secondary text-primary text-sm font-medium px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-dark px-4 pb-4 space-y-3 text-sm font-medium">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block py-2 hover:text-secondary/70"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
            className="block py-2 hover:text-secondary/70"
          >
            Shop
          </Link>
          <Link
            to="/custom-order"
            onClick={() => setMenuOpen(false)}
            className="block py-2 hover:text-secondary/70"
          >
            Custom Order
          </Link>
          <Link
            to="/posts"
            onClick={() => setMenuOpen(false)}
            className="block py-2 hover:text-secondary/70"
          >
            Community
          </Link>
          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="block py-2 hover:text-secondary/70"
          >
            Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-secondary/70"
              >
                Profile
              </Link>
              <Link
                to="/my-orders"
                onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-secondary/70"
              >
                My Orders
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 hover:text-secondary/70"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block py-2 text-red-400 hover:text-red-300 w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-secondary/70"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-secondary/70"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
