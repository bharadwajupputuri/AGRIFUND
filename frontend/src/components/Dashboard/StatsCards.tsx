// frontend/src/components/Dashboard/StatsCards.tsx
import React from 'react';
import { DashboardStats } from '../types'; // Fixed path
import { TrendingUp, IndianRupee, FileText, Target } from 'lucide-react';

// REST OF YOUR ORIGINAL CODE REMAINS EXACTLY THE SAME ✅
interface StatsCardsProps {
  stats: DashboardStats;
  loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Loans',
      value: stats.totalLoans,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      suffix: '',
    },
    {
      title: 'Active Loans',
      value: stats.activeLoans,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      suffix: '',
    },
    {
      title: 'Amount Funded',
      value: stats.amountFunded,
      icon: IndianRupee,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      suffix: '',
      format: 'currency',
    },
    {
      title: 'Repayment Rate',
      value: stats.repaymentRate,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      suffix: '%',
    },
  ];

  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') {
      return `₹${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(card.value, card.format)}
                  {card.suffix}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;