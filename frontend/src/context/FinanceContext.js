import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const [income, setIncome] = useState({
    amount: 0,
    frequency: 'monthly'
  });

  const [groceries, setGroceries] = useState([]);
  const [bills, setBills] = useState([]);
  const [savings, setSavings] = useState([]);
  const [spending, setSpending] = useState([]);
  const [debts, setDebts] = useState([]);

  // Load from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem('myfinance');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.income) setIncome(data.income);
      if (data.groceries) setGroceries(data.groceries);
      if (data.bills) setBills(data.bills);
      if (data.savings) setSavings(data.savings);
      if (data.spending) setSpending(data.spending);
      if (data.debts) setDebts(data.debts);
      if (data.darkMode !== undefined) setDarkMode(data.darkMode);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('myfinance', JSON.stringify({
      income, groceries, bills, savings, spending, debts, darkMode
    }));
  }, [income, groceries, bills, savings, spending, debts, darkMode]);

  return (
    <FinanceContext.Provider value={{
      darkMode, setDarkMode,
      income, setIncome,
      groceries, setGroceries,
      bills, setBills,
      savings, setSavings,
      spending, setSpending,
      debts, setDebts,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}