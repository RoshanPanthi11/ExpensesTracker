import React, { createContext, useContext, useState } from "react";

const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [income, setIncome] = useState([]);
  return (
    <IncomeContext.Provider value={{ income, setIncome }}>
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncome = () => useContext(IncomeContext);
