import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboard } from '@/contexts/DashboardContext';
import { BarChart3 } from 'lucide-react';

export const Header: React.FC = () => {
  const { userRole, setUserRole } = useDashboard();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
              <p className="text-xs text-gray-500">Track and manage your finances</p>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Role:</span>
            <Select value={userRole} onValueChange={(value: any) => setUserRole(value)}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};
