import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Card';
import { formatCurrency } from '../utils/calculations';

const BILL_CATEGORIES = [
  '🏠 Rent/Mortgage', '⚡ Electricity', '💧 Water', '🌐 Internet/WiFi',
  '📱 Mobile', '🎬 Subscriptions', '🚗 Car/Transport', '🏥 Health/Insurance',
  '📚 Education', '❓ Other'
];

export default function Bills() {
  const { darkMode, bills, setBills } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [estimated, setEstimated] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(BILL_CATEGORIES[0]);
  const [editingId, setEditingId] = useState(null);
  const [actualInput, setActualInput] = useState('');

  const t = darkMode;

  const totalEst = bills.reduce((s, b) => s + (parseFloat(b.estimated) || 0), 0);
  const totalActual = bills.reduce((s, b) => s + (parseFloat(b.actual) || 0), 0);
  const totalPaid = bills.filter(b => b.paid).length;

  const addBill = () => {
    if (!name || !estimated) return;
    setBills([...bills, {
      id: Date.now(),
      name, estimated: parseFloat(estimated),
      actual: null, dueDate, category, paid: false
    }]);
    setName(''); setEstimated(''); setDueDate('');
    setCategory(BILL_CATEGORIES[0]);
    setShowForm(false);
  };

  const markPaid = (id) => {
    setBills(bills.map(b => {
      if (b.id === id) {
        return { ...b, paid: true, actual: parseFloat(actualInput) || b.estimated };
      }
      return b;
    }));
    setEditingId(null);
    setActualInput('');
  };

  const removeBill = (id) => setBills(bills.filter(b => b.id !== id));

  const unpaidBills = bills.filter(b => !b.paid);
  const paidBills = bills.filter(b => b.paid);

  return (
    <div className={`min-h-screen pb-24 ${t ? 'bg-[#120f1a]' : 'bg-[#f5f0ff]'}`}>

      {/* Header */}
      <div className={`px-5 pt-12 pb-4 ${t ? 'bg-[#1e1530]' : 'bg-white'} shadow-sm`}>
        <h1 className={`text-2xl font-extrabold ${t ? 'text-white' : 'text-[#1a1025]'}`}>💸 Bills</h1>
        <p className={`text-xs mt-0.5 ${t ? 'text-purple-400' : 'text-purple-400'}`}>
          Track bills — estimate vs what you actually paid
        </p>
      </div>

      {/* Summary Cards */}
      <div className="px-5 mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Estimated', value: formatCurrency(totalEst), color: t ? 'text-purple-300' : 'text-purple-600' },
          { label: 'Actual Paid', value: formatCurrency(totalActual), color: t ? 'text-pink-300' : 'text-pink-600' },
          { label: 'Difference', value: formatCurrency(totalActual - totalEst), color: totalActual - totalEst > 0 ? 'text-red-400' : 'text-green-400' },
        ].map((s, i) => (
          <Card key={i} className={t ? 'bg-[#2a1f40]' : 'bg-[#ede9fe]'}>
            <p className={`text-[10px] font-bold ${t ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</p>
            <p className={`text-sm font-extrabold mt-0.5 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Progress */}
      <div className="px-5 mt-3">
        <Card>
          <div className="flex justify-between items-center mb-2">
            <p className={`text-xs font-bold ${t ? 'text-gray-400' : 'text-gray-500'}`}>BILLS PAID THIS MONTH</p>
            <p className={`text-xs font-bold ${t ? 'text-purple-300' : 'text-purple-600'}`}>
              {totalPaid} / {bills.length}
            </p>
          </div>
          <div className={`w-full rounded-full h-2.5 ${t ? 'bg-[#2a1f40]' : 'bg-purple-100'}`}>
            <div
              className="h-2.5 rounded-full bg-purple-500 transition-all duration-500"
              style={{ width: bills.length > 0 ? `${(totalPaid / bills.length) * 100}%` : '0%' }}
            />
          </div>
        </Card>
      </div>

      {/* Add Bill Button */}
      <div className="px-5 mt-3">
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-pink-300 text-pink-400 font-bold text-sm transition-all hover:border-pink-500">
            + Add Bill
          </button>
        ) : (
          <Card>
            <p className={`text-sm font-bold mb-3 ${t ? 'text-white' : 'text-purple-800'}`}>New Bill</p>
            <div className="flex flex-col gap-2">
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Bill name (e.g. Netflix)"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <input value={estimated} onChange={e => setEstimated(e.target.value)}
                type="number" placeholder="Estimated amount $"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                    : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                }`} />
              <input value={dueDate} onChange={e => setDueDate(e.target.value)}
                type="date"
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800'
                    : 'bg-purple-50 text-purple-900 border-purple-100'
                }`} />
              <select value={category} onChange={e => setCategory(e.target.value)}
                className={`rounded-xl px-3 py-2.5 text-sm border outline-none w-full ${
                  t ? 'bg-[#120f1a] text-white border-purple-800'
                    : 'bg-purple-50 text-purple-900 border-purple-100'
                }`}>
                {BILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setShowForm(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                    t ? 'bg-[#120f1a] text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>Cancel</button>
                <button onClick={addBill}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-pink-500 text-white">
                  Add Bill
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Unpaid Bills */}
      {unpaidBills.length > 0 && (
        <div className="px-5 mt-4">
          <p className={`text-xs font-bold mb-2 ${t ? 'text-gray-400' : 'text-gray-400'}`}>UNPAID</p>
          <div className="flex flex-col gap-2">
            {unpaidBills.map(bill => (
              <Card key={bill.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${t ? 'text-white' : 'text-[#1a1025]'}`}>{bill.name}</p>
                    <p className={`text-xs ${t ? 'text-gray-500' : 'text-gray-400'}`}>{bill.category}</p>
                    {bill.dueDate && (
                      <p className="text-xs text-orange-400 mt-0.5">Due: {bill.dueDate}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-extrabold ${t ? 'text-purple-300' : 'text-purple-600'}`}>
                      {formatCurrency(bill.estimated)}
                    </p>
                    <p className={`text-[10px] ${t ? 'text-gray-500' : 'text-gray-400'}`}>estimated</p>
                  </div>
                  <button onClick={() => removeBill(bill.id)}
                    className="text-gray-400 hover:text-red-400 text-lg leading-none">×</button>
                </div>

                {/* Mark as Paid */}
                {editingId === bill.id ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      value={actualInput}
                      onChange={e => setActualInput(e.target.value)}
                      type="number"
                      placeholder={`Actual amount (est. $${bill.estimated})`}
                      className={`flex-1 rounded-xl px-3 py-2 text-sm border outline-none ${
                        t ? 'bg-[#120f1a] text-white border-purple-800 placeholder-gray-600'
                          : 'bg-purple-50 text-purple-900 border-purple-100 placeholder-purple-300'
                      }`}
                    />
                    <button onClick={() => markPaid(bill.id)}
                      className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-bold">
                      ✓ Paid
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setEditingId(bill.id); setActualInput(''); }}
                    className={`mt-3 w-full py-2 rounded-xl text-xs font-bold border transition-all ${
                      t ? 'border-green-700 text-green-400 hover:bg-green-900'
                        : 'border-green-300 text-green-600 hover:bg-green-50'
                    }`}>
                    Mark as Paid
                  </button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Paid Bills */}
      {paidBills.length > 0 && (
        <div className="px-5 mt-4">
          <p className={`text-xs font-bold mb-2 ${t ? 'text-gray-400' : 'text-gray-400'}`}>PAID ✓</p>
          <div className="flex flex-col gap-2">
            {paidBills.map(bill => (
              <Card key={bill.id} className={t ? 'opacity-70' : 'opacity-60'}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-white text-xs">✓</span>
                    <div>
                      <p className={`text-sm font-bold line-through ${t ? 'text-gray-400' : 'text-gray-400'}`}>{bill.name}</p>
                      <p className={`text-xs ${t ? 'text-gray-600' : 'text-gray-400'}`}>{bill.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-green-400">{formatCurrency(bill.actual)}</p>
                    {bill.actual !== bill.estimated && (
                      <p className={`text-[10px] ${bill.actual > bill.estimated ? 'text-red-400' : 'text-green-400'}`}>
                        est. {formatCurrency(bill.estimated)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {bills.length === 0 && (
        <p className={`text-center text-sm mt-8 ${t ? 'text-gray-600' : 'text-gray-300'}`}>
          No bills yet — add your first bill!
        </p>
      )}
    </div>
  );
}