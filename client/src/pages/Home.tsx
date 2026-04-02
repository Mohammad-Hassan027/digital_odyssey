import React, { useMemo } from 'react';
import { Header } from '@/components/Header';
import { SummaryCards } from '@/components/SummaryCards';
import { BalanceTrendChart } from '@/components/BalanceTrendChart';
import { SpendingBreakdown } from '@/components/SpendingBreakdown';
import { TransactionList } from '@/components/TransactionList';
import { InsightsSection } from '@/components/InsightsSection';
import { DashboardProvider } from '@/contexts/DashboardContext';
import {
  mockDashboardData,
  getSpendingByCategory,
  getMonthlyTrend,
  getInsights
} from '@/lib/mockData';

/**
 * Finance Dashboard Home Page
 * 
 * Design Philosophy: Modern Minimalist with Accent Dynamics
 * - Emerald green (#10B981) accent color for financial growth
 * - Asymmetric layout with floating cards
 * - Soft shadows and hover elevations
 * - Smooth transitions throughout
 */
export default function Home() {
  const { transactions, totalBalance, totalIncome, totalExpenses } = mockDashboardData;

  // Calculate derived data
  const spendingByCategory = useMemo(() => getSpendingByCategory(transactions), [transactions]);
  const monthlyTrend = useMemo(() => getMonthlyTrend(transactions), [transactions]);
  const insights = useMemo(() => getInsights(transactions), [transactions]);
  const allCategories = useMemo(
    () => Array.from(new Set(transactions.map(t => t.category))).sort(),
    [transactions]
  );

  return (
    <DashboardProvider transactions={transactions}>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <SummaryCards
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BalanceTrendChart data={monthlyTrend} />
            <SpendingBreakdown data={spendingByCategory} />
          </div>

          {/* Insights */}
          <InsightsSection insights={insights} />

          {/* Transactions */}
          <div className="mt-8">
            <TransactionList
              transactions={transactions}
              categories={allCategories}
            />
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2026 Finance Dashboard. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </DashboardProvider>
  );
}
