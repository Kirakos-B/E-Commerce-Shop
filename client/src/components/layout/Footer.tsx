import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-2xl font-bold mb-3">🦅 Emu Shop</h2>
            <p className="text-secondary/70 text-sm leading-relaxed max-w-sm">
              Premium tailoring services crafted with passion. Your style, your
              measurements, our expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-secondary/90">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-secondary/70">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-secondary transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/custom-order"
                  className="hover:text-secondary transition-colors"
                >
                  Custom Order
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  className="hover:text-secondary transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-4 text-secondary/90">Account</h3>
            <ul className="space-y-2 text-sm text-secondary/70">
              <li>
                <Link
                  to="/login"
                  className="hover:text-secondary transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-secondary transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="hover:text-secondary transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-secondary transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-secondary/20 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary/50">
          <p>© {new Date().getFullYear()} Emu Shop. All rights reserved.</p>
          <p>Made with ❤️ for premium tailoring</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
