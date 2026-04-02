import React, { createContext, useContext, useState, useMemo } from 'react';
import { Transaction } from '@/lib/mockData';

export type UserRole = 'viewer' | 'admin';

interface DashboardContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  filteredTransactions: Transaction[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortBy: 'date' | 'amount';
  setSortBy: (sort: 'date' | 'amount') => void;
  filterType: 'all' | 'income' | 'expense';
  setFilterType: (type: 'all' | 'income' | 'expense') => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: React.ReactNode;
  transactions: Transaction[];
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children, transactions }) => {
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.merchant?.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === 'amount') {
      filtered = [...filtered].sort((a, b) => b.amount - a.amount);
    } else {
      filtered = [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    return filtered;
  }, [transactions, filterType, selectedCategory, searchTerm, sortBy]);

  const value: DashboardContextType = {
    userRole,
    setUserRole,
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filterType,
    setFilterType
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
