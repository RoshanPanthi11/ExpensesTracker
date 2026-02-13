
import React, { createContext, useState, useContext } from "react";


const ExpenseContext = createContext();

// Provider component
export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses, incomes, setIncomes }}>
      {children}
    </ExpenseContext.Provider>
  );
};


export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
