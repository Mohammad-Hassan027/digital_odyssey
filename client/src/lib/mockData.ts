export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  merchant?: string;
}

export interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: Transaction[];
}

// Generate mock transactions for the past 90 days
export const generateMockTransactions = (): Transaction[] => {
  const categories = {
    income: ['Salary', 'Freelance', 'Investment Returns', 'Bonus'],
    expense: ['Groceries', 'Utilities', 'Entertainment', 'Transport', 'Dining', 'Shopping', 'Healthcare', 'Subscription']
  };

  const merchants = {
    Groceries: ['Whole Foods', 'Trader Joe\'s', 'Costco', 'Safeway'],
    Utilities: ['Electric Co', 'Water Dept', 'Internet Provider'],
    Entertainment: ['Netflix', 'Spotify', 'Cinema', 'Gaming'],
    Transport: ['Uber', 'Gas Station', 'Parking', 'Metro'],
    Dining: ['Restaurant A', 'Cafe', 'Pizza Place', 'Sushi Bar'],
    Shopping: ['Amazon', 'Target', 'H&M', 'Nike'],
    Healthcare: ['Pharmacy', 'Clinic', 'Dental Office'],
    Subscription: ['Adobe', 'Microsoft', 'AWS']
  };

  const transactions: Transaction[] = [];
  const today = new Date();

  // Generate 60 transactions
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    const isIncome = Math.random() > 0.85;
    const categoryList = isIncome ? categories.income : categories.expense;
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];

    let amount: number;
    let merchant: string | undefined;

    if (isIncome) {
      amount = 2000 + Math.random() * 3000;
    } else {
      amount = 10 + Math.random() * 200;
      const merchantList = merchants[category as keyof typeof merchants] || ['Unknown'];
      merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
    }

    transactions.push({
      id: `txn-${i}`,
      date,
      amount: Math.round(amount * 100) / 100,
      category,
      type: isIncome ? 'income' : 'expense',
      description: merchant || category,
      merchant
    });
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const mockTransactions = generateMockTransactions();

export const mockDashboardData: DashboardData = {
  totalBalance: 15234.56,
  totalIncome: 8500,
  totalExpenses: 3245.32,
  transactions: mockTransactions
};

// Calculate spending by category
export const getSpendingByCategory = (transactions: Transaction[]) => {
  const spending: Record<string, number> = {};

  transactions.forEach(txn => {
    if (txn.type === 'expense') {
      spending[txn.category] = (spending[txn.category] || 0) + txn.amount;
    }
  });

  return Object.entries(spending)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Calculate monthly balance trend
export const getMonthlyTrend = (transactions: Transaction[]) => {
  const monthlyData: Record<string, { income: number; expense: number }> = {};

  transactions.forEach(txn => {
    const monthKey = txn.date.toISOString().slice(0, 7); // YYYY-MM

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (txn.type === 'income') {
      monthlyData[monthKey].income += txn.amount;
    } else {
      monthlyData[monthKey].expense += txn.amount;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      income: Math.round(data.income * 100) / 100,
      expense: Math.round(data.expense * 100) / 100,
      balance: Math.round((data.income - data.expense) * 100) / 100
    }));
};

// Get insights
export const getInsights = (transactions: Transaction[]) => {
  const spending = getSpendingByCategory(transactions);
  const trend = getMonthlyTrend(transactions);

  const highestCategory = spending[0];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthData = trend.find(t => t.month === currentMonth);
  const previousMonthData = trend[trend.length - 2];

  const insights = [];

  if (highestCategory) {
    insights.push({
      title: 'Top Spending Category',
      value: highestCategory.category,
      detail: `$${highestCategory.amount.toFixed(2)} spent`
    });
  }

  if (currentMonthData && previousMonthData) {
    const percentChange = ((currentMonthData.expense - previousMonthData.expense) / previousMonthData.expense * 100).toFixed(1);
    insights.push({
      title: 'Monthly Comparison',
      value: `${Math.abs(Number(percentChange))}% ${Number(percentChange) > 0 ? 'increase' : 'decrease'}`,
      detail: `vs. previous month`
    });
  }

  const totalTransactions = transactions.length;
  const incomeTransactions = transactions.filter(t => t.type === 'income').length;
  insights.push({
    title: 'Income Ratio',
    value: `${((incomeTransactions / totalTransactions) * 100).toFixed(1)}%`,
    detail: `of all transactions`
  });

  return insights;
};
