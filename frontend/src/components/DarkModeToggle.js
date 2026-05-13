import React from 'react';
import { useFinance } from '../context/FinanceContext';

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useFinance();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
        darkMode ? 'bg-purple-500' : 'bg-purple-200'
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-all duration-300 flex items-center justify-center text-xs ${
        darkMode
          ? 'left-6 bg-[#1e1530]'
          : 'left-0.5 bg-white'
      }`}>
        {darkMode ? '🌙' : '☀️'}
      </span>
    </button>
  );
}