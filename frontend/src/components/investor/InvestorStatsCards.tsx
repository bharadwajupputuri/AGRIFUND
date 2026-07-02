import React from 'react';
import { IndianRupee, TrendingUp, Users, Target, PieChart, Calendar } from 'lucide-react';
import { InvestorDashboardStats } from '../types/investor';

interface InvestorStatsCardsProps {
  stats: InvestorDashboardStats;
}

const InvestorStatsCards: React.FC<InvestorStatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Invested',
      value: stats.totalInvested,
      icon: IndianRupee,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      format: 'currency',
    },
    {
      title: 'Total Returns',
      value: stats.totalReturns,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      format: 'currency',
    },
    {
      title: 'Portfolio Value',
      value: stats.portfolioValue,
      icon: PieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: 'currency',
    },
    {
      title: 'Total Investments', // ✅ CHANGED: Shows investments made
      value: stats.totalInvestments || 0,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      format: 'number',
    },
    {
      title: 'Active Investments',
      value: stats.activeInvestments,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      format: 'number',
    },
    {
      title: 'Completed',
      value: stats.completedInvestments,
      icon: Calendar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      format: 'number',
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    return value.toLocaleString('en-IN');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(card.value, card.format)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default InvestorStatsCards;