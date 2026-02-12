import React, { useState } from "react";
import { useExpenses } from "../../../context/ExpenseContext";
import axios from "axios";

export default function AddExpense() {
  const { expenses, setExpenses } = useExpenses();
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const categories = ["Rent", "Food", "Travel", "Bills", "Others"];

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!date || !category || !amount || !description) {
      alert("Please fill all fields!");
      return;
    }

    try {
      // Get token from localStorage (set after login)
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add an expense!");
        return;
      }

      // Send expense to backend
      const res = await axios.post(
        "http://localhost:5000/api/expense",
        { date, category, amount: parseFloat(amount), description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update frontend context with the new expense from backend
      setExpenses([res.data, ...expenses]);

      // Reset form
      setDate("");
      setCategory("");
      setAmount("");
      setDescription("");
      alert("Expense added successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Expense</h2>
      <form className="flex flex-col gap-4" onSubmit={handleAddExpense}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-gray-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-300 transition"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-gray-600 mb-1">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-gray-600 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition mt-4 w-full md:w-auto self-center"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
