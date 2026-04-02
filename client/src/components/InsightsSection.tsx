import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Lightbulb, BarChart3 } from 'lucide-react';

interface Insight {
  title: string;
  value: string;
  detail: string;
}

interface InsightsSectionProps {
  insights: Insight[];
}

const insightIcons = [
  <TrendingUp className="w-5 h-5" />,
  <BarChart3 className="w-5 h-5" />,
  <Lightbulb className="w-5 h-5" />
];

export const InsightsSection: React.FC<InsightsSectionProps> = ({ insights }) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className="border-0 shadow-sm p-5 bg-white hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                {insightIcons[index % insightIcons.length]}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{insight.title}</h3>
                <p className="text-lg font-bold text-gray-900">{insight.value}</p>
                <p className="text-xs text-gray-500 mt-2">{insight.detail}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
