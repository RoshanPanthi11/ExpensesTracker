import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ExpenseProvider } from "./context/ExpenseContext"; 
import { IncomeProvider } from "./context/IncomeContext"; // 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <IncomeProvider>          
        <ExpenseProvider>       
          <App />
        </ExpenseProvider>
      </IncomeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
