import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Card';
import { formatCurrency } from '../utils/calculations';

const DEBT_TYPES = [
  '💳 Credit Card', '🎓 Student Loan', '🚗 Car Loan',
  '🏠 Mortgage', '👤 Personal Loan', '🏥 Medical', '❓ Other'
];

export default function Debt() {
  const { darkMode, debts, setDebts } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [total, setTotal] = useState('');
  const [remaining, setRemaining] = useState('');
  const [minPayment, setMinPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [debtType, setDebtType] = useState(DEBT_TYPES[0]);
  const [payingId, setPayingId] = useState(null);
  const [payAmount, setPayAmount] = useState('');

  const t = darkMode;

  const totalDebt = debts.reduce((s, d) => s + (parseFloat(d.remaining) || 0), 0);
  const totalOriginal = debts.reduce((s, d) => s + (parseFloat(d.total) || 0), 0);
  const totalPaidOff = totalOriginal - totalDebt;

  const addDebt = () => {
    if (!name || !total) return;
    setDebts([...debts, {
      id: Date.now(),
      name,
      total: parseFloat(total),
      remaining: parseFloat(remaining) || parseFloat(total),
      minPayment: parseFloat(minPayment) || 0,
      interestRate: parseFloat(interestRate) || 0,
      debtType
    }]);
    setName(''); setTotal(''); setRemaining('');
    setMinPayment(''); setInterestRate('');
    setDebtType(DEBT_TYPES[0]);
    setShowForm(false);
  };

  const makePayment = (id) => {
    setDebts(debts.map(d => {
      if (d.id === id) {
        const newRemaining = Math.max(0, d.remaining - (parseFloat(payAmount) || 0));
        return { ...d, remaining: newRemaining };
      }
      return d;
    }));
    setPayingId(null);
    setPayAmount('');
  };

  const removeDebt = (id) => setDebts(debts.filter(d => d.id !== id));

  const activeDebts = debts.filter(d => d.remaining > 0);
  const paidDebts = debts.filter(d => d.remaining <= 0);

  return (
    <div className={`min-h-screen pb-24 ${t ? 'bg-[#120f1a]' : 'bg-[#f5f0ff]'}`}>

      {/* Header */}
      <div className={`px-5 pt-12 pb-4 ${t ? 'bg-[#1e1530]' : 'bg-white'} shadow-sm`}>
        <h1 className={`text-2xl font-extrabold ${t ? 'text-white' : 'text-[#1a1025]'}`}>💳 Debt Tracker</h1>
        <p className={`text-xs mt-0.5 ${t ? 'text-purple-400' : 'text-purple-400'}`}>
          Track & crush your debts one payment at a time
        </p>
      </div>

      {/* Overview */}
      <div className="px-5 mt-4">
        <Card className={t ? 'bg-[#2a1f40]' : 'bg-[#ede9fe]'}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className={`text-xs font-bold ${t ? 'text-purple-300' : 'text-purple-500'}`}>TOTAL REMAINING</p>
              <p className={`text-3xl font-extrabold mt-1 ${t ? 'text-white' : 'text-purple-800'}`}>
                {formatCurrency(totalDebt)}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${t ? 'text-green-400' : 'text-green-600'} font-bold`}>
                {formatCurrency(totalPaidOff)} paid off
              </p>
              <p className={`text-xs mt-0.5 ${t ? 'text-purple-400' : 'text-purple-400'}`}>
                of {formatCurrency(totalOriginal)} total
              </p>
            </div>
          </div>
          {totalOriginal > 0 && (
            <>
              <div className={`w-full rounded-full h-3 ${t ? 'bg-[#1e1530]' : 'bg-purple-200'}`}>
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-700"
                  style={{ width: `${Math.min((totalDebt / totalOriginal) * 100, 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-1.5 text-center ${t ? 'text-purple-400' : 'text-purple-400'}`}>
                {Math.round((totalPaidOff / totalOriginal) * 100)}% paid off overall
              </p>
            </>
          )}
        </Card>
      </div>

      {/* Add Debt */}
      <div className="px-5 mt-3">
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-red-300 text-red-400 font-bold text-sm transition-all hover:border-red-500">
            + Add Debt
          </button>
        ) : (
          <Card>
            <p className={`text-sm font-bold mb-3 ${t ? 'text-white' : 'text-purple-800'}`}>New Debt</p>
            <div className="flex flex-col gap-2">
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Debt name (e.g. Chase Visa)"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <select value={debtType} onChange={e => setDebtType(e.target.value)}
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800'
                    : 'bg-purple-50 text-purple-900 border-purple-100'
                }`}>
                {DEBT_TYPES.map(d => <option key={d}>{d}</option>)}
              </select>
              <div className="flex gap-2">
                <input value={total} onChange={e => setTotal(e.target.value)}
                  type="number" placeholder="Original total $"
                  className={`rounded-xl px-3 py-2.5 text-sm border outline-none flex-1 ${
                    t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                      : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                  }`} />
                <input value={remaining} onChange={e => setRemaining(e.target.value)}
                  type="number" placeholder="Remaining $"
                  className={`rounded-xl px-3 py-2.5 text-sm border outline-none flex-1 ${
                    t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                      : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                  }`} />
              </div>
              <div className="flex gap-2">
                <input value={minPayment} onChange={e => setMinPayment(e.target.value)}
                  type="number" placeholder="Min payment $"
                  className={`rounded-xl px-3 py-2.5 text-sm border outline-none flex-1 ${
                    t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                      : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                  }`} />
                <input value={interestRate} onChange={e => setInterestRate(e.target.value)}
                  type="number" placeholder="Interest % APR"
                  className={`rounded-xl px-3 py-2.5 text-sm border outline-none flex-1 ${
                    t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                      : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                  }`} />
              </div>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setShowForm(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                    t ? 'bg-[#120f1a] text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>Cancel</button>
                <button onClick={addDebt}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white">
                  Add Debt
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Active Debts */}
      {activeDebts.length > 0 && (
        <div className="px-5 mt-4">
          <p className={`text-xs font-bold mb-2 ${t ? 'text-gray-400' : 'text-gray-400'}`}>ACTIVE DEBTS</p>
          <div className="flex flex-col gap-3">
            {activeDebts.map(debt => {
              const pct = Math.min(((debt.total - debt.remaining) / debt.total) * 100, 100);
              const monthlyInterest = (debt.remaining * (debt.interestRate / 100)) / 12;

              return (
                <Card key={debt.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`text-sm font-bold ${t ? 'text-white' : 'text-[#1a1025]'}`}>{debt.name}</p>
                      <p className={`text-xs ${t ? 'text-gray-500' : 'text-gray-400'}`}>{debt.debtType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className={`text-sm font-extrabold ${t ? 'text-red-300' : 'text-red-500'}`}>
                          {formatCurrency(debt.remaining)}
                        </p>
                        <p className={`text-[10px] ${t ? 'text-gray-500' : 'text-gray-400'}`}>remaining</p>
                      </div>
                      <button onClick={() => removeDebt(debt.id)}
                        className="text-gray-400 hover:text-red-400 text-lg leading-none">×</button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className={`w-full rounded-full h-2 mb-2 ${t ? 'bg-[#2a1f40]' : 'bg-red-100'}`}>
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-green-400 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between mb-2">
                    <p className={`text-xs ${t ? 'text-gray-500' : 'text-gray-400'}`}>
                      {Math.round(pct)}% paid off
                    </p>
                    {debt.minPayment > 0 && (
                      <p className={`text-xs ${t ? 'text-gray-400' : 'text-gray-500'}`}>
                        Min: {formatCurrency(debt.minPayment)}/mo
                      </p>
                    )}
                  </div>

                  {debt.interestRate > 0 && (
                    <p className={`text-xs mb-2 ${t ? 'text-orange-400' : 'text-orange-500'}`}>
                      ⚠️ ~{formatCurrency(monthlyInterest)}/month in interest ({debt.interestRate}% APR)
                    </p>
                  )}

                  {/* Make Payment */}
                  {payingId === debt.id ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        value={payAmount}
                        onChange={e => setPayAmount(e.target.value)}
                        type="number"
                        placeholder={`Payment amount (min $${debt.minPayment})`}
                        className={`flex-1 rounded-xl px-3 py-2 text-sm border outline-none ${
                          t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                            : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                        }`}
                      />
                      <button onClick={() => makePayment(debt.id)}
                        className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-bold">
                        Pay
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setPayingId(debt.id); setPayAmount(''); }}
                      className={`w-full py-2 rounded-xl text-xs font-bold border transition-all ${
                        t ? 'border-red-800 text-red-400 hover:bg-red-950'
                          : 'border-red-200 text-red-500 hover:bg-red-50'
                      }`}>
                      Make a Payment
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Paid Off Debts */}
      {paidDebts.length > 0 && (
        <div className="px-5 mt-4">
          <p className={`text-xs font-bold mb-2 ${t ? 'text-gray-400' : 'text-gray-400'}`}>🎉 PAID OFF</p>
          <div className="flex flex-col gap-2">
            {paidDebts.map(debt => (
              <Card key={debt.id} className={t ? 'opacity-60' : 'opacity-50'}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <div>
                      <p className={`text-sm font-bold line-through ${t ? 'text-gray-400' : 'text-gray-400'}`}>
                        {debt.name}
                      </p>
                      <p className={`text-xs ${t ? 'text-gray-600' : 'text-gray-400'}`}>{debt.debtType}</p>
                    </div>
                  </div>
                  <p className="text-sm font-extrabold text-green-400">PAID OFF 🎉</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {debts.length === 0 && (
        <p className={`text-center text-sm mt-8 ${t ? 'text-gray-600' : 'text-gray-300'}`}>
          No debts added — add one to start tracking!
        </p>
      )}
    </div>
  );
}