import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import AddExpense from "./pages/Dashboard/Expense/AddExpense";
import ViewExpense from "./pages/Dashboard/Expense/ViewExpense";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected */}
      <Route path="/dashboard" element={<Layout><Home /></Layout>} />
      <Route path="/income" element={<Layout><Income /></Layout>} />
      <Route path="/expense/add" element={<Layout><AddExpense /></Layout>} />
      <Route path="/expense/view" element={<Layout><ViewExpense /></Layout>} />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
