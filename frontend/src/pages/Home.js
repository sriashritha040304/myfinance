import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Card';
import DarkModeToggle from '../components/DarkModeToggle';
import {
  formatCurrency,
  monthlyExpenseEstimate,
  totalBillsActual,
  totalSpendingThisMonth,
  totalDebt,
  totalSavingsProgress
} from '../utils/calculations';

const frequencies = ['weekly', 'bi-weekly', 'monthly'];

export default function Home() {
  const {
    darkMode, income, setIncome,
    bills, groceries, spending, debts, savings
  } = useFinance();

  const [editingIncome, setEditingIncome] = useState(false);
  const [tempAmount, setTempAmount] = useState(income.amount);
  const [tempFreq, setTempFreq] = useState(income.frequency);

  const estimate = monthlyExpenseEstimate(bills, groceries);
  const actualSpent = totalBillsActual(bills) + totalSpendingThisMonth(spending);
  const remaining = income.amount - estimate;
  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const stats = [
    { label: 'Est. Monthly Expenses', value: formatCurrency(estimate), color: 'text-pink-500', bg: darkMode ? 'bg-pink-950' : 'bg-pink-50' },
    { label: 'Actually Spent', value: formatCurrency(actualSpent), color: 'text-orange-500', bg: darkMode ? 'bg-orange-950' : 'bg-orange-50' },
    { label: 'Total Debt', value: formatCurrency(totalDebt(debts)), color: 'text-red-500', bg: darkMode ? 'bg-red-950' : 'bg-red-50' },
    { label: 'Total Saved', value: formatCurrency(totalSavingsProgress(savings)), color: 'text-green-500', bg: darkMode ? 'bg-green-950' : 'bg-green-50' },
  ];

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-[#120f1a]' : 'bg-[#f5f0ff]'}`}>

      {/* Header */}
      <div className={`px-5 pt-12 pb-5 ${darkMode ? 'bg-[#1e1530]' : 'bg-white'} shadow-sm`}>
        <div className="flex justify-between items-center mb-1">
          <div>
            <p className={`text-xs font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-400'}`}>
              {month}
            </p>
            <h1 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-[#1a1025]'}`}>
              💜 MyFinance
            </h1>
          </div>
          <DarkModeToggle />
        </div>

        {/* Income Section */}
        <div className={`mt-3 rounded-2xl p-4 ${darkMode ? 'bg-[#2a1f40]' : 'bg-[#ede9fe]'}`}>
          <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-purple-300' : 'text-purple-500'}`}>
            MY INCOME
          </p>
          {editingIncome ? (
            <div className="flex flex-col gap-2">
              <input
                type="number"
                value={tempAmount}
                onChange={e => setTempAmount(e.target.value)}
                placeholder="Enter amount"
                className={`rounded-xl px-3 py-2 text-sm font-bold border-none outline-none w-full ${
                  darkMode ? 'bg-[#1e1530] text-white' : 'bg-white text-purple-800'
                }`}
              />
              <div className="flex gap-2">
                {frequencies.map(f => (
                  <button
                    key={f}
                    onClick={() => setTempFreq(f)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      tempFreq === f
                        ? 'bg-purple-500 text-white'
                        : darkMode ? 'bg-[#1e1530] text-purple-300' : 'bg-white text-purple-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setIncome({ amount: parseFloat(tempAmount) || 0, frequency: tempFreq });
                  setEditingIncome(false);
                }}
                className="bg-purple-500 text-white rounded-xl py-2 text-sm font-bold"
              >
                Save Income
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-[#1a1025]'}`}>
                  {formatCurrency(income.amount)}
                </p>
                <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-400'}`}>
                  per {income.frequency}
                </p>
              </div>
              <button
                onClick={() => setEditingIncome(true)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                  darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-200 text-purple-700'
                }`}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 mt-5">
        <p className={`text-xs font-bold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          THIS MONTH AT A GLANCE
        </p>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <Card key={i} className={s.bg}>
              <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {s.label}
              </p>
              <p className={`text-lg font-extrabold ${s.color}`}>
                {s.value}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Budget Bar */}
      <div className="px-5 mt-5">
        <Card>
          <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            BUDGET HEALTH
          </p>
          <div className="flex justify-between text-xs mb-2">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Spent: {formatCurrency(actualSpent)}
            </span>
            <span className={remaining >= 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
              {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over!`}
            </span>
          </div>
          <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-[#2a1f40]' : 'bg-purple-100'}`}>
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                actualSpent / (income.amount || 1) > 1
                  ? 'bg-red-400'
                  : actualSpent / (income.amount || 1) > 0.8
                  ? 'bg-orange-400'
                  : 'bg-purple-400'
              }`}
              style={{ width: `${Math.min((actualSpent / (income.amount || 1)) * 100, 100)}%` }}
            />
          </div>
          <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {income.amount > 0
              ? `${Math.round((actualSpent / income.amount) * 100)}% of income used`
              : 'Set your income above to track budget'}
          </p>
        </Card>
      </div>

      {/* Month End Report Prompt */}
      <div className="px-5 mt-4">
        <Card className={darkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-100 to-pink-100'}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-purple-800'}`}>
                Month-End Summary
              </p>
              <p className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-500'}`}>
                Est. {formatCurrency(estimate)} → Actual {formatCurrency(actualSpent)}
              </p>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}