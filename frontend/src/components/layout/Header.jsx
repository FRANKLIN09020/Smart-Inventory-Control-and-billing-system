import { Menu, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const Header = ({ toggleSidebar, handleLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user data");
      }
    }
  }, []);

  return (
    <header className="h-14 bg-white border-b shadow-sm flex items-center justify-between px-4">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <h1 className="font-semibold text-lg">
          Smart Inventory Control & Billing System
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-gray-700">
            Hello,{" "}
            <span className="text-indigo-600 font-semibold">
              {user.name || user.username}
            </span>{" "}
            👋 Welcome
            <span className="ml-2 text-xs text-gray-500">
              ({user.role})
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:bg-gray-100 px-3 py-1 rounded"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
