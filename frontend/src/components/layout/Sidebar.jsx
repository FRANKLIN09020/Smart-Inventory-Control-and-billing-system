import { NavLink } from "react-router-dom";
import { Package, Receipt, Boxes, BarChart3, Users, UserPen ,Tags} from "lucide-react";
import clsx from "clsx";
import { jwtDecode } from "jwt-decode";  

const Sidebar = ({ isOpen }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");  
  const user = token ? jwtDecode(token) : null;

  return (
    <aside
      className={clsx(
        "bg-gray-900 text-gray-200 h-full transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-14 flex items-center justify-center border-b border-gray-800">
        {isOpen ? "SICBS" : "SB"}
      </div>

      <nav className="mt-4 space-y-1">
        <NavItem to="/dashboard" icon={<BarChart3 />} label="Dashboard" isOpen={isOpen} />
        <NavItem to="/category" icon={<Tags />} label="Category" isOpen={isOpen} />
        <NavItem to="/products" icon={<Package />} label="Products" isOpen={isOpen} />
        <NavItem to="/inventory" icon={<Boxes />} label="Inventory" isOpen={isOpen} />
        <NavItem to="/billing" icon={<Receipt />} label="Billing" isOpen={isOpen} />
        <NavItem to="/customers" icon={<Users />} label="Customers" isOpen={isOpen} />
        <NavItem to="/reports" icon={<BarChart3 />} label="Reports" isOpen={isOpen} />
        {user?.role === "ADMIN" && (
          <NavItem to="/users" icon={<UserPen />} label="Staff Control Panel" isOpen={isOpen} />
        )}
      </nav>
    </aside>
  );
};

const NavItem = ({ to, icon, label, isOpen }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      clsx(
        "flex items-center gap-3 px-4 py-2 mx-2 rounded hover:bg-gray-800 transition-colors",
        isActive && "bg-gray-800"
      )
    }
  >
    {icon}
    {isOpen && <span>{label}</span>}
  </NavLink>
);

export default Sidebar;
