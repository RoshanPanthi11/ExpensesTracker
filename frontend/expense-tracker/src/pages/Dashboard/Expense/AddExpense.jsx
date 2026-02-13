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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl">
  <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
    Add New Expense
  </h2>
  <form className="flex flex-col gap-6" onSubmit={handleAddExpense}>
    {/* Date + Category */}
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col flex-1">
        <label className="text-gray-700 font-medium mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm hover:shadow-md"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-gray-700 font-medium mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm hover:shadow-md"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Amount + Description */}
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col flex-1">
        <label className="text-gray-700 font-medium mb-2">Amount ($)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          placeholder="0.00"
          className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm hover:shadow-md"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-gray-700 font-medium mb-2">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm hover:shadow-md"
        />
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="bg-gradient-to-r from-purple-600 to-purple-400 text-white py-3 px-8 rounded-2xl hover:scale-105 transform transition-all font-semibold shadow-lg self-center mt-4"
    >
      Add Expense
    </button>
  </form>
</div>

  );
}
