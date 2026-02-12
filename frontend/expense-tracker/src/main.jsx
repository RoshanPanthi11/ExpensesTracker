import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ExpenseProvider } from "./context/ExpenseContext"; // make sure path is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ExpenseProvider> {/* 👈 Wrap your app here */}
        <App />
      </ExpenseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
