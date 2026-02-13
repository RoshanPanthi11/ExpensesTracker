import React, { useEffect } from "react";
import { useExpenses } from "../../../context/ExpenseContext";
import axios from "axios";

const categoryColors = {
  Rent: "bg-red-100 text-red-800",
  Food: "bg-green-100 text-green-800",
  Travel: "bg-blue-100 text-blue-800",
  Bills: "bg-yellow-100 text-yellow-800",
  Others: "bg-purple-100 text-purple-800",
};

export default function ViewExpense() {
  const { expenses, setExpenses } = useExpenses();

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((e) => e._id !== id));
      alert("Expense deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete expense");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Your Expenses
      </h2>

      {expenses.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-xl">
          No expenses yet. Start adding some!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
                  Category
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
              {expenses.map((e) => (
                <tr
                  key={e._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[e.category]}`}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                    ₹{e.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {e.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
