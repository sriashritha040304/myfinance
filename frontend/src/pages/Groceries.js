import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Card';
import { formatCurrency } from '../utils/calculations';

const CATEGORIES = ['🥦 Produce', '🥩 Meat', '🥛 Dairy', '🍞 Bakery', '🥫 Canned', '🧴 Personal Care', '🧹 Household', '🍿 Snacks', '🥤 Drinks', '❓ Other'];

export default function Groceries() {
  const { darkMode, groceries, setGroceries } = useFinance();
  const [name, setName] = useState('');
  const [qty, setQty] = useState('1');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [period, setPeriod] = useState('weekly');
  const [showForm, setShowForm] = useState(false);

  const total = groceries.reduce((s, g) => s + (parseFloat(g.estimatedCost) || 0), 0);

  const multiplier = { weekly: 1, biweekly: 2, monthly: 4.33 };

  const addItem = () => {
    if (!name || !cost) return;
    setGroceries([...groceries, {
      id: Date.now(),
      name, qty: parseInt(qty) || 1,
      estimatedCost: parseFloat(cost) || 0,
      category, bought: false
    }]);
    setName(''); setQty('1'); setCost(''); setShowForm(false);
  };

  const toggleBought = (id) => {
    setGroceries(groceries.map(g => g.id === id ? { ...g, bought: !g.bought } : g));
  };

  const removeItem = (id) => {
    setGroceries(groceries.filter(g => g.id !== id));
  };

  const t = darkMode;

  return (
    <div className={`min-h-screen pb-24 ${t ? 'bg-[#120f1a]' : 'bg-[#f5f0ff]'}`}>

      {/* Header */}
      <div className={`px-5 pt-12 pb-4 ${t ? 'bg-[#1e1530]' : 'bg-white'} shadow-sm`}>
        <h1 className={`text-2xl font-extrabold ${t ? 'text-white' : 'text-[#1a1025]'}`}>🛒 Groceries</h1>
        <p className={`text-xs mt-0.5 ${t ? 'text-purple-400' : 'text-purple-400'}`}>Track your grocery list & estimate costs</p>
      </div>

      {/* Period Selector */}
      <div className="px-5 mt-4">
        <div className={`flex rounded-2xl p-1 gap-1 ${t ? 'bg-[#1e1530]' : 'bg-white'}`}>
          {['weekly', 'biweekly', 'monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                period === p ? 'bg-purple-500 text-white' : t ? 'text-gray-400' : 'text-gray-400'
              }`}>
              {p === 'biweekly' ? 'Bi-Weekly' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Estimate Card */}
      <div className="px-5 mt-3">
        <Card className={t ? 'bg-[#2a1f40]' : 'bg-[#ede9fe]'}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-xs font-bold ${t ? 'text-purple-300' : 'text-purple-500'}`}>
                ESTIMATED {period.toUpperCase()} COST
              </p>
              <p className={`text-3xl font-extrabold mt-1 ${t ? 'text-white' : 'text-purple-800'}`}>
                {formatCurrency(total * multiplier[period])}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${t ? 'text-purple-400' : 'text-purple-400'}`}>{groceries.length} items</p>
              <p className={`text-xs ${t ? 'text-purple-400' : 'text-purple-400'}`}>
                {groceries.filter(g => g.bought).length} bought
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Item Form */}
      <div className="px-5 mt-3">
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-300 text-purple-400 font-bold text-sm transition-all hover:border-purple-500 hover:text-purple-500">
            + Add Grocery Item
          </button>
        ) : (
          <Card>
            <p className={`text-sm font-bold mb-3 ${t ? 'text-white' : 'text-purple-800'}`}>New Item</p>
            <div className="flex flex-col gap-2">
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Item name (e.g. Milk)"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <div className="flex gap-2">
                <input value={qty} onChange={e => setQty(e.target.value)}
                  type="number" placeholder="Qty"
                  className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-20 ${
                    t ? 'bg-[#120f1a] text-white border-purple-800'
                      : 'bg-purple-50 text-purple-900 border-purple-100'
                  }`} />
                <input value={cost} onChange={e => setCost(e.target.value)}
                  type="number" placeholder="Est. cost $"
                  className={`rounded-xl px-3 py-2.5 text-sm border outline-none flex-1 ${
                    t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                      : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                  }`} />
              </div>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800'
                    : 'bg-purple-50 text-purple-900 border-purple-100'
                }`}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setShowForm(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                    t ? 'bg-[#120f1a] text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>Cancel</button>
                <button onClick={addItem}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-purple-500 text-white">
                  Add Item
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Grocery List */}
      <div className="px-5 mt-4 flex flex-col gap-2">
        {groceries.length === 0 && (
          <p className={`text-center text-sm mt-8 ${t ? 'text-gray-600' : 'text-gray-300'}`}>
            No items yet — add your first grocery item!
          </p>
        )}
        {groceries.map(item => (
          <Card key={item.id}>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleBought(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  item.bought ? 'bg-green-400 border-green-400' : t ? 'border-purple-600' : 'border-purple-300'
                }`}>
                {item.bought && <span className="text-white text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${
                  item.bought
                    ? 'line-through text-gray-400'
                    : t ? 'text-white' : 'text-[#1a1025]'
                }`}>{item.name}</p>
                <p className={`text-xs ${t ? 'text-gray-500' : 'text-gray-400'}`}>
                  {item.category} · qty {item.qty}
                </p>
              </div>
              <p className={`text-sm font-bold ${t ? 'text-purple-300' : 'text-purple-600'}`}>
                {formatCurrency(item.estimatedCost)}
              </p>
              <button onClick={() => removeItem(item.id)}
                className="text-gray-300 hover:text-red-400 text-lg leading-none ml-1">×</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}