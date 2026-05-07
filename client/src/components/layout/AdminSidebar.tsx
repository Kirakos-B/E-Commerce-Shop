import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Scissors,
  Users,
  MessageSquare,
  Image,
  BarChart2,
} from "lucide-react";

const links = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/custom-orders", icon: Scissors, label: "Custom Orders" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/feedback", icon: MessageSquare, label: "Feedback" },
  { to: "/admin/posts", icon: Image, label: "Posts" },
  { to: "/admin/stats", icon: BarChart2, label: "Stats" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-primary text-secondary min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-secondary/20">
        <h1 className="font-serif text-xl font-bold">🦅 Emu Shop</h1>
        <p className="text-secondary/50 text-xs mt-1">Admin Panel</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-secondary/20 text-secondary"
                  : "text-secondary/70 hover:bg-secondary/10 hover:text-secondary"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-4 border-t border-secondary/20 text-xs text-secondary/40">
        Emu Shop © {new Date().getFullYear()}
      </div>
    </aside>
  );
};

export default AdminSidebar;
