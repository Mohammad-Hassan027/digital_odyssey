import React from 'react';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

interface TrendData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface BalanceTrendChartProps {
  data: TrendData[];
}

export const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({ data }) => {
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const chartData = data.map(item => ({
    ...item,
    monthLabel: formatMonth(item.month)
  }));

  return (
    <Card className="border-0 shadow-sm p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Balance Trend</h2>
        <p className="text-sm text-gray-500 mt-1">Monthly income vs expenses</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="monthLabel"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => `$${value.toFixed(2)}`}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="#EF4444" radius={[8, 8, 0, 0]} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};
