import React from 'react';
import { useFinance } from '../context/FinanceContext';

export default function Card({ children, className = '' }) {
  const { darkMode } = useFinance();

  return (
    <div className={`rounded-2xl p-4 shadow-sm transition-all duration-200 ${
      darkMode
        ? 'bg-[#1e1530] border border-[#2e2045]'
        : 'bg-white border border-purple-50'
    } ${className}`}>
      {children}
    </div>
  );
}