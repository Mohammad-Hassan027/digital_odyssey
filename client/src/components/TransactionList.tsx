import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/lib/mockData';
import { useDashboard } from '@/contexts/DashboardContext';
import { ArrowUpRight, ArrowDownLeft, Search, X } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: string[];
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories
}) => {
  const {
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filterType,
    setFilterType,
    userRole
  } = useDashboard();

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setFilterType('all');
    setSortBy('date');
  };

  const hasActiveFilters = searchTerm || selectedCategory || filterType !== 'all' || sortBy !== 'date';

  return (
    <Card className="border-0 shadow-sm p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
        <p className="text-sm text-gray-500 mt-1">View and manage your financial activity</p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>

          {/* Type Filter */}
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="amount">Amount (Highest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
              {userRole === 'admin' && (
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-600">
                    {txn.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{txn.merchant || txn.description}</div>
                    {txn.merchant && (
                      <div className="text-xs text-gray-500">{txn.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {txn.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {txn.type === 'income' ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">Income</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-4 h-4 text-red-600" />
                          <span className="text-red-600 font-medium">Expense</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-semibold ${txn.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {txn.type === 'income' ? '+' : '-'}${txn.amount.toFixed(2)}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Edit
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userRole === 'admin' ? 6 : 5} className="py-8 px-4 text-center text-gray-500">
                  No transactions found. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
