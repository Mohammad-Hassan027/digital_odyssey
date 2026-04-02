import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalBalance,
  totalIncome,
  totalExpenses
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Balance Card */}
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-emerald-50 to-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Balance</h3>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              ${totalBalance.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-4">Your current account balance</p>
        </div>
        <div className="h-1 bg-gradient-to-r from-emerald-200 to-emerald-400" />
      </Card>

      {/* Income Card */}
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-green-50 to-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Income</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              ${totalIncome.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-4">Last 90 days</p>
        </div>
        <div className="h-1 bg-gradient-to-r from-green-200 to-green-400" />
      </Card>

      {/* Expenses Card */}
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-red-50 to-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Expenses</h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowDownLeft className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              ${totalExpenses.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-4">Last 90 days</p>
        </div>
        <div className="h-1 bg-gradient-to-r from-red-200 to-red-400" />
      </Card>
    </div>
  );
};
