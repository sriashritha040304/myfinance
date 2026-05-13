export function totalBillsEstimate(bills) {
  return bills.reduce((sum, b) => sum + (parseFloat(b.estimated) || 0), 0);
}

export function totalBillsActual(bills) {
  return bills.reduce((sum, b) => sum + (parseFloat(b.actual) || 0), 0);
}

export function totalGroceryEstimate(groceries) {
  return groceries.reduce((sum, g) => sum + (parseFloat(g.estimatedCost) || 0), 0);
}

export function totalSpendingThisMonth(spending) {
  const now = new Date();
  return spending
    .filter(s => {
      const d = new Date(s.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
}

export function totalDebt(debts) {
  return debts.reduce((sum, d) => sum + (parseFloat(d.remaining) || 0), 0);
}

export function totalSavingsProgress(savings) {
  return savings.reduce((sum, s) => sum + (parseFloat(s.current) || 0), 0);
}

export function monthlyExpenseEstimate(bills, groceries) {
  return totalBillsEstimate(bills) + totalGroceryEstimate(groceries);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}