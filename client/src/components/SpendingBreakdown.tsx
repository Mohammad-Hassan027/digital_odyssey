import React from 'react';
import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface SpendingData {
  category: string;
  amount: number;
}

interface SpendingBreakdownProps {
  data: SpendingData[];
}

const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5'];

export const SpendingBreakdown: React.FC<SpendingBreakdownProps> = ({ data }) => {
  const totalSpending = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="border-0 shadow-sm p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Spending Breakdown</h2>
        <p className="text-sm text-gray-500 mt-1">By category</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Category List */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.category} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-700">{item.category}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  ${item.amount.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">
                  {((item.amount / totalSpending) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
