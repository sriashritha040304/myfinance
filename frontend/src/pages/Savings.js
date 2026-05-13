import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Card';
import { formatCurrency } from '../utils/calculations';

const GOAL_ICONS = ['🏠', '✈️', '🚗', '💍', '🎓', '💻', '🏖️', '🏥', '👶', '💰', '🎯', '🌟'];

export default function Savings() {
  const { darkMode, savings, setSavings } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [deadline, setDeadline] = useState('');
  const [addingTo, setAddingTo] = useState(null);
  const [addAmount, setAddAmount] = useState('');

  const t = darkMode;

  const totalSaved = savings.reduce((s, g) => s + (parseFloat(g.current) || 0), 0);
  const totalTarget = savings.reduce((s, g) => s + (parseFloat(g.target) || 0), 0);

  const addGoal = () => {
    if (!name || !target) return;
    setSavings([...savings, {
      id: Date.now(),
      name, target: parseFloat(target),
      current: parseFloat(current) || 0,
      icon, deadline
    }]);
    setName(''); setTarget(''); setCurrent('');
    setIcon('🎯'); setDeadline('');
    setShowForm(false);
  };

  const addToGoal = (id) => {
    setSavings(savings.map(g =>
      g.id === id
        ? { ...g, current: Math.min(g.current + (parseFloat(addAmount) || 0), g.target) }
        : g
    ));
    setAddingTo(null);
    setAddAmount('');
  };

  const removeGoal = (id) => setSavings(savings.filter(g => g.id !== id));

  const monthsLeft = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    const months = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
    return months > 0 ? months : 0;
  };

  return (
    <div className={`min-h-screen pb-24 ${t ? 'bg-[#120f1a]' : 'bg-[#f5f0ff]'}`}>

      {/* Header */}
      <div className={`px-5 pt-12 pb-4 ${t ? 'bg-[#1e1530]' : 'bg-white'} shadow-sm`}>
        <h1 className={`text-2xl font-extrabold ${t ? 'text-white' : 'text-[#1a1025]'}`}>🎯 Savings Goals</h1>
        <p className={`text-xs mt-0.5 ${t ? 'text-purple-400' : 'text-purple-400'}`}>Track your saving goals & progress</p>
      </div>

      {/* Overall Progress */}
      <div className="px-5 mt-4">
        <Card className={t ? 'bg-[#2a1f40]' : 'bg-[#ede9fe]'}>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className={`text-xs font-bold ${t ? 'text-purple-300' : 'text-purple-500'}`}>TOTAL SAVED</p>
              <p className={`text-3xl font-extrabold ${t ? 'text-white' : 'text-purple-800'}`}>
                {formatCurrency(totalSaved)}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${t ? 'text-purple-400' : 'text-purple-400'}`}>of {formatCurrency(totalTarget)}</p>
              <p className={`text-lg font-extrabold ${t ? 'text-purple-300' : 'text-purple-600'}`}>
                {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
              </p>
            </div>
          </div>
          <div className={`w-full rounded-full h-3 ${t ? 'bg-[#1e1530]' : 'bg-purple-200'}`}>
            <div
              className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-700"
              style={{ width: totalTarget > 0 ? `${Math.min((totalSaved / totalTarget) * 100, 100)}%` : '0%' }}
            />
          </div>
        </Card>
      </div>

      {/* Add Goal Button */}
      <div className="px-5 mt-3">
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-green-300 text-green-500 font-bold text-sm transition-all hover:border-green-500">
            + Add Savings Goal
          </button>
        ) : (
          <Card>
            <p className={`text-sm font-bold mb-3 ${t ? 'text-white' : 'text-purple-800'}`}>New Savings Goal</p>

            {/* Icon Picker */}
            <div className="flex flex-wrap gap-2 mb-3">
              {GOAL_ICONS.map(ic => (
                <button key={ic} onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl text-lg transition-all ${
                    icon === ic
                      ? 'bg-purple-500 scale-110'
                      : t ? 'bg-[#120f1a]' : 'bg-purple-50'
                  }`}>
                  {ic}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Goal name (e.g. Vacation)"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <input value={target} onChange={e => setTarget(e.target.value)}
                type="number" placeholder="Target amount $"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <input value={current} onChange={e => setCurrent(e.target.value)}
                type="number" placeholder="Already saved $ (optional)"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <input value={deadline} onChange={e => setDeadline(e.target.value)}
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
                <button onClick={addGoal}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-500 text-white">
                  Add Goal
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Goals List */}
      <div className="px-5 mt-4 flex flex-col gap-3">
        {savings.length === 0 && (
          <p className={`text-center text-sm mt-8 ${t ? 'text-gray-600' : 'text-gray-300'}`}>
            No goals yet — add your first savings goal!
          </p>
        )}
        {savings.map(goal => {
          const pct = Math.min((goal.current / goal.target) * 100, 100);
          const remaining = goal.target - goal.current;
          const months = monthsLeft(goal.deadline);
          const monthlyNeeded = months > 0 ? remaining / months : null;
          const completed = pct >= 100;

          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <p className={`text-sm font-bold ${completed ? 'text-green-400' : t ? 'text-white' : 'text-[#1a1025]'}`}>
                      {goal.name} {completed && '✓'}
                    </p>
                    {months !== null && (
                      <p className={`text-xs ${t ? 'text-gray-500' : 'text-gray-400'}`}>
                        {months} months left
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => removeGoal(goal.id)}
                  className="text-gray-400 hover:text-red-400 text-lg leading-none">×</button>
              </div>

              {/* Progress Bar */}
              <div className={`w-full rounded-full h-2.5 mb-2 ${t ? 'bg-[#2a1f40]' : 'bg-green-100'}`}>
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${completed ? 'bg-green-400' : 'bg-gradient-to-r from-green-400 to-teal-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex justify-between items-center mb-2">
                <p className={`text-xs ${t ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatCurrency(goal.current)} saved
                </p>
                <p className={`text-xs font-bold ${t ? 'text-green-400' : 'text-green-600'}`}>
                  {Math.round(pct)}% of {formatCurrency(goal.target)}
                </p>
              </div>

              {monthlyNeeded && !completed && (
                <p className={`text-xs mb-2 ${t ? 'text-purple-400' : 'text-purple-500'}`}>
                  💡 Save {formatCurrency(monthlyNeeded)}/month to hit your goal
                </p>
              )}

              {/* Add Money */}
              {!completed && (
                addingTo === goal.id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      value={addAmount}
                      onChange={e => setAddAmount(e.target.value)}
                      type="number"
                      placeholder="Amount to add $"
                      className={`flex-1 rounded-xl px-3 py-2 text-sm border outline-none ${
                        t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                          : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                      }`}
                    />
                    <button onClick={() => addToGoal(goal.id)}
                      className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-bold">
                      Add
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setAddingTo(goal.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold border transition-all ${
                      t ? 'border-green-700 text-green-400 hover:bg-green-900'
                        : 'border-green-300 text-green-600 hover:bg-green-50'
                    }`}>
                    + Add Money
                  </button>
                )
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}