// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // Check if user logged in

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  // Logged in → show page
  return children;
}
