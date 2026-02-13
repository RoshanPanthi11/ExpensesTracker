import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useExpenses } from "../../context/ExpenseContext";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryColors = {
  Rent: "#F87171",
  Food: "#34D399",
  Travel: "#60A5FA",
  Bills: "#FBBF24",
  Others: "#A78BFA",
};

export default function Dashboard() {
  const { expenses, setExpenses } = useExpenses();
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Fetch expenses from backend
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
        console.error(err);
      }
    };
    fetchExpenses();
  }, [setExpenses]);

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesMonth = filterMonth
      ? new Date(e.date).toISOString().slice(0, 7) === filterMonth
      : true;
    const matchesCategory =
      filterCategory !== "All" ? e.category === filterCategory : true;
    return matchesMonth && matchesCategory;
  });

  // Calculations
  const totalExpense = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const monthlyExpense = filteredExpenses
    .filter(
      (e) => new Date(e.date).getMonth() === new Date().getMonth()
    )
    .reduce((acc, e) => acc + e.amount, 0);

  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Top spending category
  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        )
      : "-";

  // Savings = Monthly Income - Monthly Expense (simplified)
  const totalIncome = filteredExpenses
    .filter((e) => e.source) // assuming income has source field
    .reduce((acc, e) => acc + e.amount, 0);
  const savings = totalIncome - monthlyExpense;

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          <h3 className="font-semibold text-lg">Monthly Income</h3>
          <p className="text-3xl mt-2">₹{totalIncome}</p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          <h3 className="font-semibold text-lg">Monthly Expense</h3>
          <p className="text-3xl mt-2">₹{monthlyExpense}</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          <h3 className="font-semibold text-lg">Savings</h3>
          <p className="text-3xl mt-2">₹{savings}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          <h3 className="font-semibold text-lg">Top Category</h3>
          <p className="text-3xl mt-2">{topCategory}</p>
        </div>
      </div>

      {/* Pie Chart + Filter */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Filter Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-4">
          <h3 className="text-gray-700 font-semibold text-lg">Filter Expenses</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-purple-300"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-purple-300"
            >
              <option>All</option>
              {Object.keys(categoryColors).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h3 className="text-gray-700 font-semibold text-lg mb-4">Expenses by Category</h3>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-gray-400">No expenses yet</p>
          ) : (
            <Pie
              data={{
                labels: Object.keys(categoryTotals),
                datasets: [
                  {
                    data: Object.values(categoryTotals),
                    backgroundColor: Object.keys(categoryTotals).map(
                      (c) => categoryColors[c]
                    ),
                  },
                ],
              }}
            />
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
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
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No expenses found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((e) => (
                <tr key={e._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span
                      className="px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: categoryColors[e.category] }}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td className="px-4 py-2">₹{e.amount}</td>
                  <td className="px-4 py-2">{e.description}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(e._id)}
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
