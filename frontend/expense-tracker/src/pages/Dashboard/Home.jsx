import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useExpenses } from "../../context/ExpenseContext";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { expenses, setExpenses } = useExpenses();

  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["Rent", "Food", "Travel", "Bills", "Others"];

  // 🟢 Fetch expenses from backend on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/expense", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchExpenses();
  }, [setExpenses]);

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesMonth = filterMonth
      ? new Date(e.date).toISOString().slice(0, 7) === filterMonth
      : true;
    const matchesCategory = filterCategory !== "All" ? e.category === filterCategory : true;
    return matchesMonth && matchesCategory;
  });

  // Calculations
  const categoryTotals = categories.map((cat) =>
    filteredExpenses
      .filter((e) => e.category === cat)
      .reduce((acc, e) => acc + e.amount, 0)
  );
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const monthlyTotal = filteredExpenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((acc, e) => acc + e.amount, 0);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(expenses.filter((e) => e._id !== id)); // remove deleted expense
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex flex-col gap-6">
      
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          <h3 className="font-semibold text-lg">Total Expenses</h3>
          <p className="text-3xl mt-2">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          <h3 className="font-semibold text-lg">Monthly Total</h3>
          <p className="text-3xl mt-2">${monthlyTotal.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          <h3 className="font-semibold text-lg">Food</h3>
          <p className="text-3xl mt-2">
            ${categoryTotals[categories.indexOf("Food")].toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters + Pie Chart Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Filters Card */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg flex flex-col gap-4">
          <h3 className="text-gray-700 font-semibold text-lg">Filter Expenses</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-gray-600 font-medium mb-1">Month</label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-300 transition"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-gray-600 font-medium mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-300 transition"
              >
                <option>All</option>
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition mt-2 md:mt-6 self-start md:self-end"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
          <h3 className="text-gray-700 font-semibold text-lg mb-4">Expenses by Category</h3>
          <div className="w-full max-w-xs">
            <Pie
              data={{
                labels: categories,
                datasets: [
                  {
                    data: categoryTotals,
                    backgroundColor: ["#7f9cf5", "#fbbf24", "#f472b6", "#34d399", "#f87171"],
                    hoverBackgroundColor: ["#a5b4fc", "#fde68a", "#f9a8d4", "#6ee7b7", "#fca5a5"],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#374151", boxWidth: 15, padding: 20 },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Expenses</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No expenses found for selected filters.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((e, i) => (
                <tr
                  key={e.id}
                  className={`border-b transition hover:bg-gray-50 ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{e.category}</td>
                  <td className="px-4 py-2">${e.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{e.description}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
