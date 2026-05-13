import React from 'react';
import { useFinance } from '../context/FinanceContext';

const tabs = [
  { id: 'home',      icon: '🏠', label: 'Home' },
  { id: 'groceries', icon: '🛒', label: 'Groceries' },
  { id: 'bills',     icon: '💸', label: 'Bills' },
  { id: 'savings',   icon: '🎯', label: 'Savings' },
  { id: 'spending',  icon: '📊', label: 'Spending' },
  { id: 'debt',      icon: '💳', label: 'Debt' },
];

export default function BottomNav({ active, setActive }) {
  const { darkMode } = useFinance();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-2 border-t ${
      darkMode
        ? 'bg-[#1e1530] border-[#2e2045]'
        : 'bg-white border-purple-100'
    }`}
    style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 ${
            active === tab.id
              ? 'scale-110'
              : 'opacity-50'
          }`}
        >
          <span className={`text-xl transition-all duration-200 ${
            active === tab.id ? 'scale-125' : ''
          }`}>
            {tab.icon}
          </span>
          <span className={`text-[10px] font-bold transition-all duration-200 ${
            active === tab.id
              ? darkMode ? 'text-purple-400' : 'text-purple-600'
              : darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {tab.label}
          </span>
          {active === tab.id && (
            <span className="w-1 h-1 rounded-full bg-purple-500 mt-0.5" />
          )}
        </button>
      ))}
    </nav>
  );
}