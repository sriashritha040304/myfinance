import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Groceries from './pages/Groceries';
import Bills from './pages/Bills';
import Savings from './pages/Savings';
import Spending from './pages/Spending';
import Debt from './pages/Debt';

function AppContent() {
  const [active, setActive] = useState('home');
  const { darkMode } = useFinance();

  const screens = {
    home:      <Home />,
    groceries: <Groceries />,
    bills:     <Bills />,
    savings:   <Savings />,
    spending:  <Spending />,
    debt:      <Debt />,
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="max-w-md mx-auto relative">
        {screens[active]}
        <BottomNav active={active} setActive={setActive} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}