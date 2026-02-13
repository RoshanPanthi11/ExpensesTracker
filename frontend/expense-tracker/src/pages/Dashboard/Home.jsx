import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useExpenses } from "../../context/ExpenseContext";
import { useIncome } from "../../context/IncomeContext"; // new
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
  const { income, setIncome } = useIncome(); // new

  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Fetch expenses + income
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch Expenses
        const resExpenses = await axios.get("http://localhost:5000/api/expense", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(resExpenses.data);

        // Fetch Income
        const resIncome = await axios.get("http://localhost:5000/api/income", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncome(resIncome.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [setExpenses, setIncome]);

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesMonth = filterMonth
      ? new Date(e.date).toISOString().slice(0, 7) === filterMonth
      : true;
    const matchesCategory =
      filterCategory !== "All" ? e.category === filterCategory : true;
    return matchesMonth && matchesCategory;
  });

  // Filter income
  const filteredIncome = income.filter((i) => {
    return filterMonth
      ? new Date(i.date).toISOString().slice(0, 7) === filterMonth
      : true;
  });

  // Calculations
  const totalExpense = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const monthlyExpense = filteredExpenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((acc, e) => acc + e.amount, 0);

  const totalIncome = filteredIncome.reduce((acc, i) => acc + i.amount, 0);
  const monthlyIncome = filteredIncome
    .filter((i) => new Date(i.date).getMonth() === new Date().getMonth())
    .reduce((acc, i) => acc + i.amount, 0);

  const savings = monthlyIncome - monthlyExpense;

  // Category totals for Pie chart
  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        )
      : "-";

  const handleDeleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;
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
        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-3xl shadow-lg hover:scale-105 transform transition-all">
          <h3 className="font-semibold text-lg">Monthly Income</h3>
          <p className="text-3xl mt-2 font-bold">₹{monthlyIncome}</p>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-red-500 text-white p-6 rounded-3xl shadow-lg hover:scale-105 transform transition-all">
          <h3 className="font-semibold text-lg">Monthly Expense</h3>
          <p className="text-3xl mt-2 font-bold">₹{monthlyExpense}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-3xl shadow-lg hover:scale-105 transform transition-all">
          <h3 className="font-semibold text-lg">Savings</h3>
          <p className="text-3xl mt-2 font-bold">₹{savings}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-3xl shadow-lg hover:scale-105 transform transition-all">
          <h3 className="font-semibold text-lg">Top Category</h3>
          <p className="text-3xl mt-2 font-bold">{topCategory}</p>
        </div>
      </div>

      {/* Filter + Pie Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col gap-4">
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

        <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center">
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
                    hoverOffset: 10,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#374151", boxWidth: 20, padding: 15 },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-3xl shadow-lg overflow-x-auto">
  <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
  
  {filteredExpenses.length + filteredIncome.length === 0 ? (
    <div className="text-center py-20 text-gray-400 text-xl">
      No transactions yet. Start adding some!
    </div>
  ) : (
    <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-xl overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Category / Source
          </th>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Amount
          </th>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[...filteredExpenses, ...filteredIncome]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((e) => (
            <tr key={e._id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {new Date(e.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {e.category ? "Expense" : "Income"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {e.category || e.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                ₹{e.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {e.description || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {e.category && (
                  <button
                    onClick={() => handleDeleteExpense(e._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )}
</div>

    </div>
  );
}
