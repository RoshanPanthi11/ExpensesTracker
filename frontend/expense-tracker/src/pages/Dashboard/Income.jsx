import React, { useState, useEffect } from "react";
import { ArrowUpIcon, BanknotesIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useExpenses } from "../../context/ExpenseContext"; // You can make separate IncomeContext if you prefer
import axios from "axios";

export default function Income() {
  const { incomes, setIncomes } = useExpenses(); // Using same context
  const [form, setForm] = useState({ source: "", amount: "", date: "" });
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token"); // JWT token

  // Fetch all incomes from backend
  const fetchIncomes = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch incomes");
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!form.source || !form.amount || !form.date) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/income",
        {
          source: form.source,
          amount: Number(form.amount),
          date: form.date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIncomes([res.data, ...incomes]); // Add new income from backend response
      setForm({ source: "", amount: "", date: "" });
      setShowForm(false);
      alert("Income added successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add income");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this income?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/income/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(incomes.filter((income) => income._id !== id));
      alert("Income deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete income");
    }
  };

  const totalIncome = incomes.reduce((acc, income) => acc + Number(income.amount), 0);

  const formatCurrency = (num) => `₹${num.toLocaleString()}`;
  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

  return (
    <div className="flex flex-col gap-8">
      {/* 💳 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 text-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:scale-105 transform transition cursor-pointer">
          <BanknotesIcon className="w-12 h-12 p-2 bg-white text-indigo-600 rounded-full" />
          <div>
            <h3 className="text-lg font-semibold">Total Income</h3>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <div className="bg-green-500 text-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:scale-105 transform transition cursor-pointer">
          <ArrowUpIcon className="w-12 h-12 p-2 bg-white text-green-500 rounded-full" />
          <div>
            <h3 className="text-lg font-semibold">Income Sources</h3>
            <p className="text-2xl font-bold mt-1">{incomes.length}</p>
          </div>
        </div>

        <div
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-500 text-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:scale-105 transform transition cursor-pointer"
        >
          <PlusCircleIcon className="w-12 h-12 p-2 bg-white text-yellow-500 rounded-full" />
          <div>
            <h3 className="text-lg font-semibold">Add New Income</h3>
            <p className="text-sm mt-1">{showForm ? "Hide Form" : "Click to add income"}</p>
          </div>
        </div>
      </div>

      {/* ➕ Add Income Form */}
      {showForm && (
        <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Income</h3>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleAddIncome}>
            <input
              type="text"
              name="source"
              placeholder="Source (e.g., Salary)"
              value={form.source}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold"
            >
              Add
            </button>
          </form>
        </div>
      )}

      {/* 📊 Income Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-6">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Income Records</h3>

  {incomes.length === 0 ? (
    <div className="text-center py-20 text-gray-400 text-xl">
      No income yet. Start adding some!
    </div>
  ) : (
    <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-xl overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Source
          </th>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Amount
          </th>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {incomes.map((income) => (
          <tr
            key={income._id}
            className="hover:bg-gray-50 transition duration-150"
          >
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
              {income.source}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
              {formatCurrency(income.amount)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {formatDate(income.date)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => handleDelete(income._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
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
