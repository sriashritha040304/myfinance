import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Card';
import { formatCurrency } from '../utils/calculations';

const CATEGORIES = [
  { label: '🍔 Food & Dining', id: 'food' },
  { label: '🚗 Transport', id: 'transport' },
  { label: '🛍️ Shopping', id: 'shopping' },
  { label: '📺 Subscriptions', id: 'subscriptions' },
  { label: '🏥 Health', id: 'health' },
  { label: '🎬 Entertainment', id: 'entertainment' },
  { label: '📱 Mobile', id: 'mobile' },
  { label: '🌐 WiFi', id: 'wifi' },
  { label: '🛒 Groceries', id: 'groceries' },
  { label: '❓ Other', id: 'other' },
];

export default function Spending() {
  const { darkMode, spending, setSpending } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterCat, setFilterCat] = useState('all');

  const t = darkMode;

  const now = new Date();
  const thisMonth = spending.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = thisMonth.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  // Category breakdown
  const breakdown = CATEGORIES.map(cat => ({
    ...cat,
    total: thisMonth
      .filter(s => s.category === cat.label)
      .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const addExpense = () => {
    if (!name || !amount) return;
    setSpending([...spending, {
      id: Date.now(),
      name, amount: parseFloat(amount),
      category, date
    }]);
    setName(''); setAmount('');
    setCategory(CATEGORIES[0].label);
    setDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const removeExpense = (id) => setSpending(spending.filter(s => s.id !== id));

  const filtered = filterCat === 'all'
    ? [...spending].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [...spending].filter(s => s.category === filterCat).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className={`min-h-screen pb-24 ${t ? 'bg-[#120f1a]' : 'bg-[#f5f0ff]'}`}>

      {/* Header */}
      <div className={`px-5 pt-12 pb-4 ${t ? 'bg-[#1e1530]' : 'bg-white'} shadow-sm`}>
        <h1 className={`text-2xl font-extrabold ${t ? 'text-white' : 'text-[#1a1025]'}`}>📊 Daily Spending</h1>
        <p className={`text-xs mt-0.5 ${t ? 'text-purple-400' : 'text-purple-400'}`}>Log & track every expense</p>
      </div>

      {/* This Month Total */}
      <div className="px-5 mt-4">
        <Card className={t ? 'bg-[#2a1f40]' : 'bg-[#ede9fe]'}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-xs font-bold ${t ? 'text-purple-300' : 'text-purple-500'}`}>
                SPENT THIS MONTH
              </p>
              <p className={`text-3xl font-extrabold mt-1 ${t ? 'text-white' : 'text-purple-800'}`}>
                {formatCurrency(totalThisMonth)}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${t ? 'text-purple-400' : 'text-purple-400'}`}>{thisMonth.length} transactions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      {breakdown.length > 0 && (
        <div className="px-5 mt-3">
          <Card>
            <p className={`text-xs font-bold mb-3 ${t ? 'text-gray-400' : 'text-gray-500'}`}>BREAKDOWN</p>
            <div className="flex flex-col gap-2">
              {breakdown.map(cat => (
                <div key={cat.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${t ? 'text-gray-300' : 'text-gray-600'}`}>{cat.label}</span>
                    <span className={`text-xs font-bold ${t ? 'text-purple-300' : 'text-purple-600'}`}>
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 ${t ? 'bg-[#2a1f40]' : 'bg-purple-100'}`}>
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                      style={{ width: `${Math.min((cat.total / totalThisMonth) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Add Expense */}
      <div className="px-5 mt-3">
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-blue-300 text-blue-400 font-bold text-sm transition-all hover:border-blue-500">
            + Log Expense
          </button>
        ) : (
          <Card>
            <p className={`text-sm font-bold mb-3 ${t ? 'text-white' : 'text-purple-800'}`}>New Expense</p>
            <div className="flex flex-col gap-2">
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="What did you spend on?"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <input value={amount} onChange={e => setAmount(e.target.value)}
                type="number" placeholder="Amount $"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <select value={category} onChange={e => setCategory(e.target.value)}
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800'
                    : 'bg-purple-50 text-purple-900 border-purple-100'
                }`}>
                {CATEGORIES.map(c => <option key={c.id}>{c.label}</option>)}
              </select>
              <input value={date} onChange={e => setDate(e.target.value)}
                type="date"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800'
                    : 'bg-purple-50 text-purple-900 border-purple-100'
                }`} />
              <div className="flex gap-2 mt-1">
                <button onClick={() => setShowForm(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                    t ? 'bg-[#120f1a] text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>Cancel</button>
                <button onClick={addExpense}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-blue-500 text-white">
                  Log It
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filter Pills */}
      {spending.length > 0 && (
        <div className="px-5 mt-3 overflow-x-auto">
          <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
            <button onClick={() => setFilterCat('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterCat === 'all'
                  ? 'bg-purple-500 text-white'
                  : t ? 'bg-[#1e1530] text-gray-400' : 'bg-white text-gray-400'
              }`}>All</button>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setFilterCat(c.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  filterCat === c.label
                    ? 'bg-purple-500 text-white'
                    : t ? 'bg-[#1e1530] text-gray-400' : 'bg-white text-gray-400'
                }`}>{c.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="px-5 mt-3 flex flex-col gap-2">
        {spending.length === 0 && (
          <p className={`text-center text-sm mt-8 ${t ? 'text-gray-600' : 'text-gray-300'}`}>
            No expenses yet — log your first one!
          </p>
        )}
        {filtered.map(expense => (
          <Card key={expense.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${t ? 'text-white' : 'text-[#1a1025]'}`}>
                  {expense.name}
                </p>
                <p className={`text-xs ${t ? 'text-gray-500' : 'text-gray-400'}`}>
                  {expense.category} · {expense.date}
                </p>
              </div>
              <p className={`text-sm font-extrabold ml-2 ${t ? 'text-blue-300' : 'text-blue-600'}`}>
                {formatCurrency(expense.amount)}
              </p>
              <button onClick={() => removeExpense(expense.id)}
                className="text-gray-300 hover:text-red-400 text-lg leading-none ml-2">×</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}