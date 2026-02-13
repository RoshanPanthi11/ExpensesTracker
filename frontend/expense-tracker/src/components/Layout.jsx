import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Add Expense", path: "/expense/add", icon: PlusCircleIcon },
  { name: "View Expense", path: "/expense/view", icon: CurrencyDollarIcon },
  { name: "Income", path: "/income", icon: ArrowDownTrayIcon },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // ✅ Auth check on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true }); // redirect to login if no token
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/", { replace: true }); // redirect to login
  };

  const formatTitle = (pathname) => {
    return pathname
      .replace("/", "")
      .split("/")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "Dashboard";
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg ${
          open ? "w-64" : "w-20"
        } duration-300 relative flex flex-col`}
      >
        {/* Logo / Toggle */}
        <div className="flex items-center justify-between p-4">
          <h1 className={`text-xl font-bold text-indigo-600 ${!open && "hidden"}`}>
            ExpenseApp
          </h1>
          <Bars3Icon
            className="w-8 h-8 text-gray-700 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Links */}
        <nav className="mt-6 flex-1">
          {links.map((link) => (
            <Link
              to={link.path}
              key={link.name}
              className={`flex items-center gap-4 p-3 hover:bg-indigo-100 rounded-md mx-2 mb-1 ${
                location.pathname.startsWith(link.path)
                  ? "bg-indigo-200 font-semibold"
                  : "text-gray-800"
              }`}
            >
              <link.icon className="w-6 h-6" />
              {open && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 text-red-600 hover:bg-red-100 rounded-md transition"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            {open && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {formatTitle(location.pathname)}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
              U
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
